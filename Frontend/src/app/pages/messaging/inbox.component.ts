import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { MessagingService } from '../../services/messaging.service';
import { MessageListDto, MessageStatus, PaginatedMessageResult } from '../../models/messaging.models';
import { MessageService } from 'primeng/api';
import { ComposeMessageComponent } from './compose-message.component';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    TooltipModule,
    CardModule,
    ComposeMessageComponent
  ],
  template: `
    <app-compose-message 
      [(visible)]="showComposeDialog"
      (messageSent)="onMessageSent()">
    </app-compose-message>

    <div class="p-4">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-content-between align-items-center p-3">
            <h2 class="m-0">
              <i class="pi pi-inbox mr-2"></i>Inbox
            </h2>
            <p-button 
              label="Compose New Message" 
              icon="pi pi-plus" 
              (onClick)="composeMessage()"
              severity="success">
            </p-button>
          </div>
        </ng-template>

        <div class="mb-3 flex gap-2">
          <p-dropdown 
            [(ngModel)]="selectedStatus" 
            [options]="statusOptions" 
            placeholder="Filter by Status"
            [showClear]="true"
            (onChange)="loadInbox()"
            styleClass="w-15rem">
          </p-dropdown>
          
          <p-button 
            label="Refresh" 
            icon="pi pi-refresh" 
            (onClick)="loadInbox()"
            [outlined]="true">
          </p-button>
        </div>

        <p-table 
          [value]="messages" 
          [loading]="loading"
          [paginator]="true" 
          [rows]="pageSize"
          [totalRecords]="totalCount"
          [lazy]="true"
          (onLazyLoad)="onPageChange($event)"
          [rowsPerPageOptions]="[10,20,50]"
          styleClass="p-datatable-sm"
          responsiveLayout="scroll">
          
          <ng-template pTemplate="header">
            <tr>
              <th style="width: 50px"></th>
              <th pSortableColumn="subject">
                Subject
                <p-sortIcon field="subject"></p-sortIcon>
              </th>
              <th pSortableColumn="senderName">
                From
                <p-sortIcon field="senderName"></p-sortIcon>
              </th>
              <th style="width: 120px">Priority</th>
              <th style="width: 120px">Status</th>
              <th style="width: 150px" pSortableColumn="sentAt">
                Date
                <p-sortIcon field="sentAt"></p-sortIcon>
              </th>
              <th style="width: 80px">Replies</th>
              <th style="width: 150px">Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-message>
            <tr [class.font-bold]="message.status === 'Unread'">
              <td class="text-center">
                <i 
                  class="pi" 
                  [class.pi-envelope]="message.status === 'Unread'"
                  [class.pi-envelope-open]="message.status !== 'Unread'"
                  [class.text-primary]="message.status === 'Unread'">
                </i>
              </td>
              <td>
                <div class="flex align-items-center gap-2">
                  {{ message.subject }}
                  <i *ngIf="message.hasAttachments" class="pi pi-paperclip text-500"></i>
                  <i *ngIf="message.isFromUKNF" class="pi pi-shield text-orange-500" pTooltip="Official UKNF Message"></i>
                </div>
              </td>
              <td>{{ message.senderName }}</td>
              <td>
                <p-tag 
                  [value]="message.priority" 
                  [severity]="getPrioritySeverity(message.priority)">
                </p-tag>
              </td>
              <td>
                <p-tag 
                  [value]="message.status" 
                  [severity]="getStatusSeverity(message.status)">
                </p-tag>
              </td>
              <td>{{ message.sentAt | date:'short' }}</td>
              <td class="text-center">
                <p-tag *ngIf="message.replyCount > 0" [value]="message.replyCount.toString()"></p-tag>
                <span *ngIf="message.replyCount === 0">-</span>
              </td>
              <td>
                <div class="flex gap-1">
                  <p-button 
                    icon="pi pi-eye" 
                    [rounded]="true" 
                    [text]="true"
                    severity="info"
                    size="small"
                    pTooltip="View Message"
                    (onClick)="viewMessage(message)">
                  </p-button>
                  <p-button 
                    icon="pi pi-reply" 
                    [rounded]="true" 
                    [text]="true"
                    severity="success"
                    size="small"
                    pTooltip="Reply"
                    (onClick)="replyToMessage(message)">
                  </p-button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center p-4">
                <i class="pi pi-inbox text-4xl text-400 mb-3"></i>
                <p class="text-500">No messages in your inbox</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-datatable .p-datatable-tbody > tr.font-bold {
        font-weight: 600;
      }
    }
  `]
})
export class InboxComponent implements OnInit {
  messages: MessageListDto[] = [];
  loading = false;
  pageNumber = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 0;
  selectedStatus: string | null = null;

  statusOptions = [
    { label: 'Unread', value: 'Unread' },
    { label: 'Read', value: 'Read' },
    { label: 'Replied', value: 'Replied' },
    { label: 'Archived', value: 'Archived' }
  ];

  constructor(
    private messagingService: MessagingService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadInbox();
  }

  loadInbox() {
    this.loading = true;
    this.messagingService.getInbox(this.pageNumber, this.pageSize, this.selectedStatus || undefined)
      .subscribe({
        next: (result: PaginatedMessageResult) => {
          this.messages = result.messages;
          this.totalCount = result.totalCount;
          this.totalPages = result.totalPages;
          this.pageNumber = result.currentPage;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading inbox:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load inbox messages'
          });
          this.loading = false;
        }
      });
  }

  onPageChange(event: any) {
    this.pageNumber = (event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.loadInbox();
  }

  viewMessage(message: MessageListDto) {
    // Navigate to thread view to see full conversation
    this.router.navigate(['/messaging/thread', message.id]);
  }

  replyToMessage(message: MessageListDto) {
    // Navigate to compose with reply context
    this.router.navigate(['/messaging/compose'], { 
      queryParams: { replyTo: message.id } 
    });
  }

  showComposeDialog = false;

  composeMessage() {
    this.showComposeDialog = true;
  }

  onMessageSent() {
    this.loadInbox(); // Refresh inbox after sending
  }

  getPrioritySeverity(priority: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch(priority) {
      case 'Urgent': return 'danger';
      case 'High': return 'warn';
      case 'Normal': return 'info';
      case 'Low': return 'success';
      default: return 'info';
    }
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch(status) {
      case 'Unread': return 'info';
      case 'Read': return 'success';
      case 'Replied': return 'warn';
      case 'Archived': return 'secondary';
      default: return 'info';
    }
  }
}

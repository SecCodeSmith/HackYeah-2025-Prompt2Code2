import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { MessagingService } from '../../services/messaging.service';
import { MessageListDto, PaginatedMessageResult } from '../../models/messaging.models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sent-messages',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    CardModule
  ],
  template: `
    <div class="p-4">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-content-between align-items-center p-3">
            <h2 class="m-0">
              <i class="pi pi-send mr-2"></i>Sent Messages
            </h2>
            <p-button 
              label="Refresh" 
              icon="pi pi-refresh" 
              (onClick)="loadSent()"
              [outlined]="true">
            </p-button>
          </div>
        </ng-template>

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
              <th pSortableColumn="subject">
                Subject
                <p-sortIcon field="subject"></p-sortIcon>
              </th>
              <th pSortableColumn="recipientName">
                To
                <p-sortIcon field="recipientName"></p-sortIcon>
              </th>
              <th style="width: 120px">Priority</th>
              <th style="width: 120px">Status</th>
              <th style="width: 150px" pSortableColumn="sentAt">
                Date
                <p-sortIcon field="sentAt"></p-sortIcon>
              </th>
              <th style="width: 80px">Replies</th>
              <th style="width: 120px">Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-message>
            <tr>
              <td>
                <div class="flex align-items-center gap-2">
                  {{ message.subject }}
                  <i *ngIf="message.hasAttachments" class="pi pi-paperclip text-500"></i>
                  <i *ngIf="message.isFromUKNF" class="pi pi-shield text-orange-500" pTooltip="Official UKNF Message"></i>
                </div>
              </td>
              <td>{{ message.recipientName }}</td>
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
                <p-button 
                  icon="pi pi-eye" 
                  [rounded]="true" 
                  [text]="true"
                  severity="info"
                  size="small"
                  pTooltip="View Message"
                  (onClick)="viewMessage(message)">
                </p-button>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center p-4">
                <i class="pi pi-send text-4xl text-400 mb-3"></i>
                <p class="text-500">No sent messages</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `
})
export class SentMessagesComponent implements OnInit {
  messages: MessageListDto[] = [];
  loading = false;
  pageNumber = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 0;

  constructor(
    private messagingService: MessagingService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadSent();
  }

  loadSent() {
    this.loading = true;
    this.messagingService.getSent(this.pageNumber, this.pageSize)
      .subscribe({
        next: (result: PaginatedMessageResult) => {
          this.messages = result.messages;
          this.totalCount = result.totalCount;
          this.totalPages = result.totalPages;
          this.pageNumber = result.currentPage;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading sent messages:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load sent messages'
          });
          this.loading = false;
        }
      });
  }

  onPageChange(event: any) {
    this.pageNumber = (event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.loadSent();
  }

  viewMessage(message: MessageListDto) {
    this.router.navigate(['/messaging/thread', message.id]);
  }

  getPrioritySeverity(priority: string): string {
    switch(priority) {
      case 'Urgent': return 'danger';
      case 'High': return 'warning';
      case 'Normal': return 'info';
      case 'Low': return 'success';
      default: return 'info';
    }
  }

  getStatusSeverity(status: string): string {
    switch(status) {
      case 'Unread': return 'info';
      case 'Read': return 'success';
      case 'Replied': return 'warning';
      case 'Archived': return 'secondary';
      default: return 'info';
    }
  }
}

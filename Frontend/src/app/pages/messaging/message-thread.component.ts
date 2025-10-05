import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { EditorModule } from 'primeng/editor';
import { DropdownModule } from 'primeng/dropdown';
import { MessagingService } from '../../services/messaging.service';
import { MessageDto, MessageThreadDto, MessagePriority, ReplyToMessageRequest } from '../../models/messaging.models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-message-thread',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    EditorModule,
    DropdownModule
  ],
  template: `
    <div class="p-4">
      <p-card *ngIf="!loading">
        <ng-template pTemplate="header">
          <div class="flex justify-content-between align-items-center p-3">
            <div>
              <p-button 
                icon="pi pi-arrow-left" 
                [text]="true"
                (onClick)="goBack()"
                class="mr-2">
              </p-button>
              <h2 class="inline m-0">{{ thread?.subject }}</h2>
            </div>
            <p-button 
              label="Reply" 
              icon="pi pi-reply" 
              (onClick)="toggleReplyForm()"
              severity="success">
            </p-button>
          </div>
        </ng-template>

        <!-- Messages Thread -->
        <div class="messages-container">
          <div 
            *ngFor="let message of thread?.messages; let last = last" 
            class="message-card mb-3"
            [class.message-from-uknf]="message.isFromUKNF">
            
            <div class="flex justify-content-between align-items-start mb-2">
              <div>
                <strong>{{ message.senderName }}</strong>
                <i *ngIf="message.isFromUKNF" class="pi pi-shield text-orange-500 ml-2" pTooltip="Official UKNF"></i>
                <div class="text-sm text-500">To: {{ message.recipientName }}</div>
              </div>
              <div class="text-right">
                <div class="text-sm text-500">{{ message.sentAt | date:'medium' }}</div>
                <p-tag 
                  [value]="message.priority" 
                  [severity]="getPrioritySeverity(message.priority)"
                  class="mt-1">
                </p-tag>
              </div>
            </div>

            <div class="message-content" [innerHTML]="message.content"></div>

            <div *ngIf="message.readAt" class="text-xs text-500 mt-2">
              <i class="pi pi-check-circle mr-1"></i>
              Read: {{ message.readAt | date:'short' }}
            </div>
          </div>
        </div>

        <!-- Reply Form -->
        <div *ngIf="showReplyForm" class="reply-form mt-4 p-3 surface-50 border-round">
          <h3>Reply to this message</h3>
          
          <div class="field">
            <label for="priority">Priority</label>
            <p-dropdown 
              id="priority"
              [(ngModel)]="replyRequest.priority" 
              [options]="priorityOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select Priority"
              styleClass="w-full">
            </p-dropdown>
          </div>

          <div class="field">
            <label for="content">Message *</label>
            <p-editor 
              [(ngModel)]="replyRequest.content" 
              [style]="{'height':'200px'}">
            </p-editor>
          </div>

          <div class="flex gap-2">
            <p-button 
              label="Send Reply" 
              icon="pi pi-send" 
              (onClick)="sendReply()"
              [loading]="sending"
              [disabled]="!isReplyValid()">
            </p-button>
            <p-button 
              label="Cancel" 
              icon="pi pi-times" 
              (onClick)="toggleReplyForm()"
              severity="secondary"
              [outlined]="true">
            </p-button>
          </div>
        </div>
      </p-card>

      <div *ngIf="loading" class="text-center p-5">
        <i class="pi pi-spin pi-spinner text-4xl"></i>
      </div>
    </div>
  `,
  styles: [`
    .messages-container {
      max-height: 600px;
      overflow-y: auto;
    }

    .message-card {
      padding: 1rem;
      border: 1px solid var(--surface-border);
      border-radius: var(--border-radius);
      background: var(--surface-card);
    }

    .message-from-uknf {
      border-left: 4px solid var(--orange-500);
      background: var(--orange-50);
    }

    .message-content {
      margin-top: 1rem;
      line-height: 1.6;
    }

    .reply-form {
      border: 1px solid var(--surface-border);
    }
  `]
})
export class MessageThreadComponent implements OnInit {
  thread: MessageThreadDto | null = null;
  loading = false;
  sending = false;
  showReplyForm = false;
  messageId = '';

  replyRequest: ReplyToMessageRequest = {
    parentMessageId: '',
    content: '',
    priority: 'Normal'
  };

  priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Normal', value: 'Normal' },
    { label: 'High', value: 'High' },
    { label: 'Urgent', value: 'Urgent' }
  ];

  constructor(
    private messagingService: MessagingService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.messageId = this.route.snapshot.paramMap.get('id') || '';
    if (this.messageId) {
      this.loadThread();
    }
  }

  loadThread() {
    this.loading = true;
    // First get the message to find the thread ID
    this.messagingService.getMessageById(this.messageId).subscribe({
      next: (message: MessageDto) => {
        // Mark as read if unread
        if (message.status === 'Unread') {
          this.messagingService.markAsRead(message.id).subscribe();
        }
        
        // Load the full thread
        this.messagingService.getThread(message.threadId).subscribe({
          next: (thread: MessageThreadDto) => {
            this.thread = thread;
            this.replyRequest.parentMessageId = message.id;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading thread:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to load message thread'
            });
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading message:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load message'
        });
        this.loading = false;
      }
    });
  }

  toggleReplyForm() {
    this.showReplyForm = !this.showReplyForm;
    if (!this.showReplyForm) {
      this.replyRequest.content = '';
      this.replyRequest.priority = 'Normal';
    }
  }

  isReplyValid(): boolean {
    return this.replyRequest.content.trim().length > 0;
  }

  sendReply() {
    if (!this.isReplyValid()) {
      return;
    }

    this.sending = true;
    this.messagingService.replyToMessage(this.replyRequest).subscribe({
      next: (reply: MessageDto) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Reply sent successfully'
        });
        this.sending = false;
        this.showReplyForm = false;
        this.loadThread(); // Reload to show new reply
      },
      error: (error) => {
        console.error('Error sending reply:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to send reply'
        });
        this.sending = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/messaging/inbox']);
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
}

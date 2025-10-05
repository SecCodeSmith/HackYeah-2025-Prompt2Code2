import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { DropdownModule } from 'primeng/dropdown';
import { MessagingService } from '../../services/messaging.service';
import { SendMessageRequest, MessageDto, MessagePriority } from '../../models/messaging.models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-compose-message',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    EditorModule,
    DropdownModule
  ],
  template: `
    <div class="p-4">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-content-between align-items-center p-3">
            <h2 class="m-0">
              <i class="pi pi-envelope mr-2"></i>Compose Message
            </h2>
            <p-button 
              icon="pi pi-arrow-left" 
              label="Back" 
              (onClick)="goBack()"
              [text]="true">
            </p-button>
          </div>
        </ng-template>

        <form (ngSubmit)="sendMessage()" #messageForm="ngForm">
          <div class="grid">
            <div class="col-12">
              <div class="field">
                <label for="recipientUserId">Recipient User ID *</label>
                <input 
                  type="text" 
                  pInputText 
                  id="recipientUserId"
                  [(ngModel)]="request.recipientUserId"
                  name="recipientUserId"
                  placeholder="Enter recipient user ID"
                  required
                  class="w-full">
                <small class="text-500">Note: In production, this would be a user selector dropdown</small>
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="field">
                <label for="podmiotId">Podmiot ID (Optional)</label>
                <input 
                  type="text" 
                  pInputText 
                  id="podmiotId"
                  [(ngModel)]="request.podmiotId"
                  name="podmiotId"
                  placeholder="Enter podmiot ID (optional)"
                  class="w-full">
                <small class="text-500">Link message to a specific entity</small>
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="field">
                <label for="priority">Priority *</label>
                <p-dropdown 
                  id="priority"
                  [(ngModel)]="request.priority" 
                  [options]="priorityOptions"
                  optionLabel="label"
                  optionValue="value"
                  name="priority"
                  placeholder="Select Priority"
                  required
                  styleClass="w-full">
                </p-dropdown>
              </div>
            </div>

            <div class="col-12">
              <div class="field">
                <label for="subject">Subject *</label>
                <input 
                  type="text" 
                  pInputText 
                  id="subject"
                  [(ngModel)]="request.subject"
                  name="subject"
                  placeholder="Enter message subject"
                  required
                  class="w-full">
              </div>
            </div>

            <div class="col-12">
              <div class="field">
                <label for="content">Message *</label>
                <p-editor 
                  [(ngModel)]="request.content" 
                  name="content"
                  [style]="{'height':'300px'}"
                  required>
                </p-editor>
              </div>
            </div>

            <div class="col-12">
              <div class="flex gap-2">
                <p-button 
                  type="submit"
                  label="Send Message" 
                  icon="pi pi-send" 
                  [loading]="sending"
                  [disabled]="!isFormValid()">
                </p-button>
                <p-button 
                  type="button"
                  label="Cancel" 
                  icon="pi pi-times" 
                  (onClick)="goBack()"
                  severity="secondary"
                  [outlined]="true">
                </p-button>
              </div>
            </div>
          </div>
        </form>
      </p-card>
    </div>
  `
})
export class ComposeMessageComponent implements OnInit {
  request: SendMessageRequest = {
    subject: '',
    content: '',
    priority: 'Normal',
    recipientUserId: '',
    podmiotId: null
  };

  sending = false;

  priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Normal', value: 'Normal' },
    { label: 'High', value: 'High' },
    { label: 'Urgent', value: 'Urgent' }
  ];

  constructor(
    private messagingService: MessagingService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Check if replying to a message
    this.route.queryParams.subscribe(params => {
      const replyToId = params['replyTo'];
      if (replyToId) {
        // Load original message to populate fields
        this.messagingService.getMessageById(replyToId).subscribe({
          next: (message: MessageDto) => {
            this.request.subject = message.subject.startsWith('Re:') 
              ? message.subject 
              : `Re: ${message.subject}`;
            this.request.recipientUserId = message.senderUserId;
            this.request.podmiotId = message.podmiotId;
            this.request.priority = message.priority;
          },
          error: (error) => {
            console.error('Error loading original message:', error);
          }
        });
      }
    });
  }

  isFormValid(): boolean {
    return this.request.subject.trim().length > 0 &&
           this.request.content.trim().length > 0 &&
           this.request.recipientUserId.trim().length > 0 &&
           this.request.priority.length > 0;
  }

  sendMessage() {
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields'
      });
      return;
    }

    this.sending = true;
    
    // Clean up podmiotId if empty
    const messageRequest = {
      ...this.request,
      podmiotId: this.request.podmiotId && this.request.podmiotId.trim() !== '' 
        ? this.request.podmiotId 
        : null
    };

    this.messagingService.sendMessage(messageRequest).subscribe({
      next: (message: MessageDto) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Message sent successfully'
        });
        this.sending = false;
        this.router.navigate(['/messaging/sent']);
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to send message'
        });
        this.sending = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/messaging/inbox']);
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessagingService } from '../../services/messaging.service';
import { SendMessageRequest, MessageDto } from '../../models/messaging.models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-compose-message',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    EditorModule,
    DropdownModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <p-dialog 
      [(visible)]="visible"
      [modal]="true"
      [style]="{width: '70vw'}"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onDialogHide()">
      
      <ng-template pTemplate="header">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-envelope"></i>
          <span class="font-semibold text-xl">Compose Message</span>
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
                [style]="{'height':'250px'}"
                required>
              </p-editor>
            </div>
          </div>
        </div>
      </form>

      <ng-template pTemplate="footer">
        <div class="flex gap-2 justify-content-end">
          <p-button 
            label="Cancel" 
            icon="pi pi-times" 
            (onClick)="onCancel()"
            severity="secondary"
            [outlined]="true">
          </p-button>
          <p-button 
            label="Send Message" 
            icon="pi pi-send" 
            (onClick)="sendMessage()"
            [loading]="sending"
            [disabled]="!isFormValid()">
          </p-button>
        </div>
      </ng-template>
    </p-dialog>
  `
})
export class ComposeMessageComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() replyToMessage?: MessageDto;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() messageSent = new EventEmitter<void>();

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
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Pre-fill form if replying to a message
    if (this.replyToMessage) {
      this.request.subject = this.replyToMessage.subject.startsWith('Re:') 
        ? this.replyToMessage.subject 
        : `Re: ${this.replyToMessage.subject}`;
      this.request.recipientUserId = this.replyToMessage.senderUserId;
      this.request.podmiotId = this.replyToMessage.podmiotId;
      this.request.priority = this.replyToMessage.priority;
    }
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
        this.resetForm();
        this.visible = false;
        this.visibleChange.emit(false);
        this.messageSent.emit();
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

  onCancel() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  onDialogHide() {
    this.visibleChange.emit(false);
    this.resetForm();
  }

  resetForm() {
    this.request = {
      subject: '',
      content: '',
      priority: 'Normal',
      recipientUserId: '',
      podmiotId: null
    };
  }
}

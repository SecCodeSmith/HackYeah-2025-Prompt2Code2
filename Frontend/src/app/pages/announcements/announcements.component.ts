// File: Frontend/src/app/pages/announcements/announcements.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  isActive: boolean;
  creatorName: string;
  createdAt: string;
}

interface PriorityOption {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ToastModule,
    TagModule,
    ConfirmDialogModule,
    CheckboxModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="container mx-auto px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Announcements</h1>
          <p class="text-gray-600 mt-2">Important communications from UKNF</p>
        </div>
        <p-button 
          *ngIf="isAdmin()"
          label="New Announcement" 
          icon="pi pi-plus"
          (onClick)="openCreateDialog()">
        </p-button>
      </div>

      <!-- Announcements List -->
      <div class="grid grid-cols-1 gap-4" *ngIf="!loading() && announcements().length > 0">
        <p-card *ngFor="let announcement of announcements()" 
                [styleClass]="'border-l-4 ' + getPriorityBorderClass(announcement.priority)">
          <ng-template pTemplate="header">
            <div class="flex justify-between items-start p-4 pb-0">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-xl font-semibold text-gray-800">{{ announcement.title }}</h3>
                  <p-tag 
                    [value]="announcement.priority" 
                    [severity]="getPrioritySeverity(announcement.priority)">
                  </p-tag>
                  <p-tag 
                    *ngIf="!announcement.isActive"
                    value="Inactive" 
                    severity="danger">
                  </p-tag>
                </div>
                <div class="text-sm text-gray-500">
                  <i class="pi pi-user mr-1"></i>
                  {{ announcement.creatorName }} • 
                  <i class="pi pi-calendar ml-2 mr-1"></i>
                  {{ formatDate(announcement.createdAt) }}
                </div>
              </div>
              <div class="flex gap-2" *ngIf="isAdmin()">
                <p-button 
                  icon="pi pi-pencil" 
                  [rounded]="true"
                  [text]="true"
                  severity="info"
                  (onClick)="openEditDialog(announcement)"
                  pTooltip="Edit">
                </p-button>
                <p-button 
                  icon="pi pi-trash" 
                  [rounded]="true"
                  [text]="true"
                  severity="danger"
                  (onClick)="deleteAnnouncement(announcement.id)"
                  pTooltip="Delete">
                </p-button>
              </div>
            </div>
          </ng-template>
          <div class="text-gray-700 whitespace-pre-wrap">{{ announcement.content }}</div>
        </p-card>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="text-center py-12">
        <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
        <p class="mt-4 text-gray-600">Loading announcements...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading() && announcements().length === 0" class="text-center py-12">
        <i class="pi pi-megaphone text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">No Announcements</h3>
        <p class="text-gray-500">There are no active announcements at this time.</p>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <p-dialog 
      [(visible)]="displayDialog" 
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '600px' }"
      [header]="isEditMode ? 'Edit Announcement' : 'Create Announcement'">
      
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input 
            pInputText 
            [(ngModel)]="formData.title" 
            placeholder="Enter announcement title"
            class="w-full" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Content *</label>
          <textarea 
            pInputTextarea 
            [(ngModel)]="formData.content" 
            rows="6"
            placeholder="Enter announcement content"
            class="w-full">
          </textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
          <p-dropdown 
            [(ngModel)]="formData.priority" 
            [options]="priorityOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select priority"
            [style]="{ width: '100%' }">
            <ng-template pTemplate="selectedItem" let-option>
              <div class="flex items-center gap-2" *ngIf="option">
                <span class="w-3 h-3 rounded-full" [style.backgroundColor]="option.color"></span>
                <span>{{ option.label }}</span>
              </div>
            </ng-template>
            <ng-template pTemplate="item" let-option>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full" [style.backgroundColor]="option.color"></span>
                <span>{{ option.label }}</span>
              </div>
            </ng-template>
          </p-dropdown>
        </div>

        <div *ngIf="isEditMode">
          <label class="flex items-center gap-2">
            <p-checkbox [(ngModel)]="formData.isActive" [binary]="true"></p-checkbox>
            <span class="text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button 
          label="Cancel" 
          icon="pi pi-times" 
          [text]="true"
          (onClick)="displayDialog = false">
        </p-button>
        <p-button 
          [label]="isEditMode ? 'Update' : 'Create'" 
          icon="pi pi-check" 
          (onClick)="saveAnnouncement()"
          [disabled]="!isFormValid() || saving()">
        </p-button>
      </ng-template>
    </p-dialog>

    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
  `,
  styles: [`
    :host ::ng-deep {
      .p-card {
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }

      .p-card:hover {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .p-card .p-card-body {
        padding: 0;
      }

      .p-card .p-card-content {
        padding: 1rem 1.5rem 1.5rem;
      }

      .border-l-critical {
        border-left-color: #dc2626 !important;
      }

      .border-l-high {
        border-left-color: #ea580c !important;
      }

      .border-l-medium {
        border-left-color: #f59e0b !important;
      }

      .border-l-low {
        border-left-color: #3b82f6 !important;
      }
    }
  `]
})
export class AnnouncementsComponent implements OnInit {
  announcements = signal<Announcement[]>([]);
  loading = signal(false);
  saving = signal(false);
  displayDialog = false;
  isEditMode = false;
  
  formData = {
    id: '',
    title: '',
    content: '',
    priority: 1,
    isActive: true
  };

  priorityOptions: PriorityOption[] = [
    { label: 'Low', value: 0, color: '#3b82f6' },
    { label: 'Medium', value: 1, color: '#f59e0b' },
    { label: 'High', value: 2, color: '#ea580c' },
    { label: 'Critical', value: 3, color: '#dc2626' }
  ];

  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadAnnouncements();
  }

  loadAnnouncements() {
    this.loading.set(true);
    this.http.get<Announcement[]>(`${this.apiUrl}/announcements/active`)
      .subscribe({
        next: (data) => {
          this.announcements.set(data);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading announcements:', error);
          this.loading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load announcements'
          });
        }
      });
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('userRole');
    return role === 'Administrator';
  }

  openCreateDialog() {
    this.isEditMode = false;
    this.formData = {
      id: '',
      title: '',
      content: '',
      priority: 1,
      isActive: true
    };
    this.displayDialog = true;
  }

  openEditDialog(announcement: Announcement) {
    this.isEditMode = true;
    this.formData = {
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      priority: this.getPriorityValue(announcement.priority),
      isActive: announcement.isActive
    };
    this.displayDialog = true;
  }

  saveAnnouncement() {
    if (!this.isFormValid()) return;

    this.saving.set(true);
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);

    if (this.isEditMode) {
      this.http.put(
        `${this.apiUrl}/announcements/${this.formData.id}`,
        {
          title: this.formData.title,
          content: this.formData.content,
          priority: this.formData.priority,
          isActive: this.formData.isActive
        },
        { headers }
      ).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Announcement updated successfully'
          });
          this.displayDialog = false;
          this.saving.set(false);
          this.loadAnnouncements();
        },
        error: (error) => {
          console.error('Error updating announcement:', error);
          this.saving.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to update announcement'
          });
        }
      });
    } else {
      this.http.post<Announcement>(
        `${this.apiUrl}/announcements`,
        {
          title: this.formData.title,
          content: this.formData.content,
          priority: this.formData.priority
        },
        { headers }
      ).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Announcement created successfully'
          });
          this.displayDialog = false;
          this.saving.set(false);
          this.loadAnnouncements();
        },
        error: (error) => {
          console.error('Error creating announcement:', error);
          this.saving.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to create announcement'
          });
        }
      });
    }
  }

  deleteAnnouncement(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this announcement?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const token = localStorage.getItem('accessToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);

        this.http.delete(`${this.apiUrl}/announcements/${id}`, { headers })
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Announcement deleted successfully'
              });
              this.loadAnnouncements();
            },
            error: (error) => {
              console.error('Error deleting announcement:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete announcement'
              });
            }
          });
      }
    });
  }

  isFormValid(): boolean {
    return this.formData.title.trim().length > 0 && 
           this.formData.content.trim().length > 0 &&
           this.formData.priority !== null;
  }

  getPrioritySeverity(priority: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (priority.toLowerCase()) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'info';
    }
  }

  getPriorityBorderClass(priority: string): string {
    return `border-l-${priority.toLowerCase()}`;
  }

  getPriorityValue(priorityName: string): number {
    const priority = this.priorityOptions.find(p => p.label.toLowerCase() === priorityName.toLowerCase());
    return priority ? priority.value : 1;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

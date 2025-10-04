// File: Frontend/src/app/pages/reports/report-attachments.component.ts
import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';

interface Attachment {
  id: string;
  reportId: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  createdAt: string;
}

@Component({
  selector: 'app-report-attachments',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ProgressBarModule,
    TagModule
  ],
  providers: [MessageService],
  template: `
    <div class="card">
      <h3 class="text-xl font-semibold mb-4">Report Attachments</h3>
      
      <!-- File Upload Section -->
      <div class="mb-6">
        <p-fileUpload
          #fileUpload
          name="file"
          [url]="uploadUrl"
          [headers]="uploadHeaders"
          (onUpload)="onUpload($event)"
          (onError)="onError($event)"
          (onBeforeSend)="onBeforeSend($event)"
          [multiple]="false"
          [maxFileSize]="10485760"
          [accept]="acceptedFileTypes"
          [auto]="false"
          [customUpload]="true"
          (uploadHandler)="customUploadHandler($event, fileUpload)"
          chooseLabel="Select File"
          uploadLabel="Upload"
          cancelLabel="Clear"
          [showUploadButton]="true"
          [showCancelButton]="true">
          <ng-template pTemplate="content" let-files>
            <div class="p-4" *ngIf="files && files.length > 0">
              <div class="flex flex-col gap-2">
                <div *ngFor="let file of files" class="flex items-center justify-between p-2 border rounded">
                  <div class="flex items-center gap-3">
                    <i class="pi pi-file text-2xl"></i>
                    <div>
                      <p class="font-medium">{{ file.name }}</p>
                      <p class="text-sm text-gray-600">{{ formatFileSize(file.size) }}</p>
                    </div>
                  </div>
                  <p-tag [value]="getFileTypeLabel(file.name)" [severity]="getFileTypeSeverity(file.name)"></p-tag>
                </div>
              </div>
            </div>
          </ng-template>
          <ng-template pTemplate="toolbar">
            <div class="text-sm text-gray-600">
              <p>Allowed file types: PDF, Word, Excel, Images, ZIP</p>
              <p>Maximum file size: 10 MB</p>
            </div>
          </ng-template>
        </p-fileUpload>
      </div>

      <!-- Attachments List -->
      <div *ngIf="attachments().length > 0">
        <h4 class="text-lg font-semibold mb-3">Uploaded Files</h4>
        <p-table [value]="attachments()" styleClass="p-datatable-striped">
          <ng-template pTemplate="header">
            <tr>
              <th>File Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Uploaded</th>
              <th class="text-center">Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-attachment>
            <tr>
              <td>
                <div class="flex items-center gap-2">
                  <i class="pi pi-file text-blue-500"></i>
                  <span>{{ attachment.fileName }}</span>
                </div>
              </td>
              <td>
                <p-tag [value]="getFileTypeLabel(attachment.fileName)" [severity]="getFileTypeSeverity(attachment.fileName)"></p-tag>
              </td>
              <td>{{ formatFileSize(attachment.fileSize) }}</td>
              <td>{{ formatDate(attachment.createdAt) }}</td>
              <td class="text-center">
                <div class="flex justify-center gap-2">
                  <p-button
                    icon="pi pi-download"
                    [rounded]="true"
                    [text]="true"
                    severity="info"
                    (onClick)="downloadAttachment(attachment.id, attachment.fileName)"
                    pTooltip="Download"
                    tooltipPosition="top">
                  </p-button>
                  <p-button
                    icon="pi pi-trash"
                    [rounded]="true"
                    [text]="true"
                    severity="danger"
                    (onClick)="deleteAttachment(attachment.id)"
                    pTooltip="Delete"
                    tooltipPosition="top">
                  </p-button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center text-gray-500 py-4">
                No attachments found. Upload files using the form above.
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
    
    <p-toast></p-toast>
  `,
  styles: [`
    :host ::ng-deep {
      .p-fileupload-content {
        min-height: 150px;
      }
      
      .p-datatable .p-datatable-thead > tr > th {
        background-color: #f8f9fa;
        font-weight: 600;
      }
    }
  `]
})
export class ReportAttachmentsComponent implements OnInit {
  @Input() reportId!: string;
  
  attachments = signal<Attachment[]>([]);
  uploadUrl = '';
  uploadHeaders: any = {};
  acceptedFileTypes = '.pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.zip';
  
  private apiUrl = 'http://localhost:5000/api'; // Update with your API URL

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (!this.reportId) {
      console.error('reportId is required for ReportAttachmentsComponent');
      return;
    }
    
    this.uploadUrl = `${this.apiUrl}/reports/${this.reportId}/attachments`;
    this.setupHeaders();
    this.loadAttachments();
  }

  private setupHeaders() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.uploadHeaders = { 'Authorization': `Bearer ${token}` };
    }
  }

  loadAttachments() {
    this.http.get<Attachment[]>(`${this.apiUrl}/reports/${this.reportId}/attachments`)
      .subscribe({
        next: (data) => {
          this.attachments.set(data);
        },
        error: (error) => {
          console.error('Error loading attachments:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load attachments'
          });
        }
      });
  }

  customUploadHandler(event: any, fileUpload: any) {
    const file = event.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);

    this.http.post<Attachment>(`${this.apiUrl}/reports/${this.reportId}/attachments`, formData, { headers })
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File uploaded successfully'
          });
          this.loadAttachments();
          fileUpload.clear();
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Upload Failed',
            detail: error.error?.message || 'Failed to upload file'
          });
          fileUpload.clear();
        }
      });
  }

  onUpload(event: any) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'File uploaded successfully'
    });
    this.loadAttachments();
  }

  onError(event: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Upload Failed',
      detail: 'Failed to upload file'
    });
  }

  onBeforeSend(event: any) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      event.xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
  }

  downloadAttachment(attachmentId: string, fileName: string) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);

    this.http.get(`${this.apiUrl}/reports/attachments/${attachmentId}`, {
      headers,
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'File downloaded successfully'
        });
      },
      error: (error) => {
        console.error('Download error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Download Failed',
          detail: 'Failed to download file'
        });
      }
    });
  }

  deleteAttachment(attachmentId: string) {
    if (!confirm('Are you sure you want to delete this attachment?')) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);

    this.http.delete(`${this.apiUrl}/reports/attachments/${attachmentId}`, { headers })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Attachment deleted successfully'
          });
          this.loadAttachments();
        },
        error: (error) => {
          console.error('Delete error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Delete Failed',
            detail: 'Failed to delete attachment'
          });
        }
      });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getFileTypeLabel(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const typeMap: { [key: string]: string } = {
      'pdf': 'PDF',
      'doc': 'Word',
      'docx': 'Word',
      'xls': 'Excel',
      'xlsx': 'Excel',
      'txt': 'Text',
      'jpg': 'Image',
      'jpeg': 'Image',
      'png': 'Image',
      'gif': 'Image',
      'zip': 'Archive'
    };
    return typeMap[extension] || 'File';
  }

  getFileTypeSeverity(fileName: string): 'success' | 'info' | 'warning' | 'danger' {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    if (['pdf'].includes(extension)) return 'danger';
    if (['doc', 'docx', 'xls', 'xlsx'].includes(extension)) return 'info';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'success';
    if (['zip'].includes(extension)) return 'warning';
    return 'info';
  }
}

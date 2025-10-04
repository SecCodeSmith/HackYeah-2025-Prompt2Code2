import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { InputTextarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';

import { ReportService, ReportDto, SearchReportsRequest } from '../../services/report.service';
import { AuthService } from '../../services/auth.service';

interface StatusOption {
  label: string;
  value: number;
}

interface PriorityOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    Select,
    TagModule,
    TooltipModule,
    DialogModule,
    CardModule,
    InputTextarea,
    CalendarModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header with Responsive Flex Layout -->
        <div class="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900">Raporty komunikacji z UKNF</h1>
            <p class="text-gray-600 mt-1">Zarządzaj zgłoszeniami komunikacji</p>
          </div>
          <div class="flex-shrink-0">
            <p-button 
              label="Nowy raport" 
              icon="pi pi-plus" 
              (onClick)="showCreateDialog = true"
              severity="success"
              styleClass="w-full sm:w-auto">
            </p-button>
          </div>
        </div>

        <!-- Search and Filters Card -->
        <p-card class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="col-span-1 md:col-span-2">
              <span class="p-input-icon-left w-full">
                <i class="pi pi-search"></i>
                <input 
                  type="text" 
                  pInputText 
                  [(ngModel)]="searchTerm"
                  placeholder="Szukaj w tytule lub opisie..."
                  class="w-full"
                  (keyup.enter)="search()" />
              </span>
            </div>

            <!-- Status Filter -->
            <div>
              <p-select 
                [(ngModel)]="selectedStatus"
                [options]="statusOptions"
                placeholder="Wszystkie statusy"
                [showClear]="true"
                optionLabel="label"
                optionValue="value"
                class="w-full">
              </p-select>
            </div>

            <!-- Priority Filter -->
            <div>
              <p-select 
                [(ngModel)]="selectedPriority"
                [options]="priorityOptions"
                placeholder="Wszystkie priorytety"
                [showClear]="true"
                optionLabel="label"
                optionValue="value"
                class="w-full">
              </p-select>
            </div>
          </div>

          <!-- Action Buttons with Responsive Layout -->
          <div class="flex flex-col sm:flex-row gap-2 mt-4">
            <div class="flex gap-2 flex-wrap">
              <p-button 
                label="Szukaj" 
                icon="pi pi-search" 
                (onClick)="search()"
                severity="primary"
                styleClass="flex-1 sm:flex-none">
              </p-button>
              <p-button 
                label="Wyczyść" 
                icon="pi pi-times" 
                (onClick)="clearFilters()"
                severity="secondary"
                styleClass="flex-1 sm:flex-none">
              </p-button>
            </div>
            <div class="flex gap-2 flex-wrap sm:ml-auto">
              <p-button 
                label="Eksport CSV" 
                icon="pi pi-download" 
                (onClick)="exportCSV()"
                severity="help"
                [outlined]="true"
                styleClass="flex-1 sm:flex-none">
              </p-button>
              <p-button 
                label="Eksport Excel" 
                icon="pi pi-file-excel" 
                (onClick)="exportExcel()"
                severity="help"
                [outlined]="true"
                styleClass="flex-1 sm:flex-none">
              </p-button>
            </div>
          </div>
        </p-card>

        <!-- Reports Table -->
        <p-card>
          <p-table 
            [value]="reports()" 
            [loading]="isLoading()"
            [paginator]="true"
            [rows]="pageSize"
            [totalRecords]="totalRecords()"
            [lazy]="true"
            (onLazyLoad)="loadReports($event)"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Pokazuję {first} do {last} z {totalRecords} raportów"
            [rowsPerPageOptions]="[10, 25, 50]"
            styleClass="p-datatable-striped">
            
            <!-- Columns -->
            <ng-template pTemplate="header">
              <tr>
                <th pSortableColumn="title">
                  Tytuł <p-sortIcon field="title"></p-sortIcon>
                </th>
                <th pSortableColumn="status">
                  Status <p-sortIcon field="status"></p-sortIcon>
                </th>
                <th pSortableColumn="priority">
                  Priorytet <p-sortIcon field="priority"></p-sortIcon>
                </th>
                <th pSortableColumn="category">Kategoria</th>
                <th pSortableColumn="createdAt">
                  Data utworzenia <p-sortIcon field="createdAt"></p-sortIcon>
                </th>
                <th>Akcje</th>
              </tr>
            </ng-template>

            <ng-template pTemplate="body" let-report>
              <tr>
                <!-- Title -->
                <td>
                  <div class="font-semibold">{{ report.title }}</div>
                  <div class="text-sm text-gray-600 truncate max-w-md">
                    {{ report.description }}
                  </div>
                </td>

                <!-- Status -->
                <td>
                  <p-tag 
                    [value]="getStatusText(report.status)" 
                    [severity]="getStatusSeverity(report.status)">
                  </p-tag>
                </td>

                <!-- Priority -->
                <td>
                  <p-tag 
                    [value]="getPriorityText(report.priority)" 
                    [severity]="getPrioritySeverity(report.priority)">
                  </p-tag>
                </td>

                <!-- Category -->
                <td>{{ report.category || '-' }}</td>

                <!-- Created Date -->
                <td>{{ formatDate(report.createdAt) }}</td>

                <!-- Actions -->
                <td>
                  <div class="flex gap-2">
                    <p-button 
                      icon="pi pi-eye" 
                      [rounded]="true"
                      [text]="true"
                      severity="info"
                      pTooltip="Zobacz szczegóły"
                      (onClick)="viewReport(report)">
                    </p-button>
                    <p-button 
                      icon="pi pi-pencil" 
                      [rounded]="true"
                      [text]="true"
                      severity="warn"
                      pTooltip="Edytuj"
                      (onClick)="editReport(report)">
                    </p-button>
                    <p-button 
                      *ngIf="report.status === 'Draft'"
                      icon="pi pi-send" 
                      [rounded]="true"
                      [text]="true"
                      severity="success"
                      pTooltip="Przekaż do UKNF"
                      (onClick)="submitReport(report)">
                    </p-button>
                    <p-button 
                      icon="pi pi-trash" 
                      [rounded]="true"
                      [text]="true"
                      severity="danger"
                      pTooltip="Usuń"
                      (onClick)="deleteReport(report)">
                    </p-button>
                  </div>
                </td>
              </tr>
            </ng-template>

            <!-- Empty state -->
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="6" class="text-center py-8">
                  <i class="pi pi-inbox text-4xl text-gray-400 mb-3"></i>
                  <p class="text-gray-600">Brak raportów do wyświetlenia</p>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>

        <!-- View Report Dialog -->
        <p-dialog 
          [(visible)]="showViewDialog" 
          [style]="{width: '800px'}"
          header="Szczegóły raportu"
          [modal]="true">
          <div *ngIf="selectedReport()" class="space-y-4">
            <div>
              <label class="font-semibold block mb-1">Tytuł:</label>
              <p>{{ selectedReport()?.title }}</p>
            </div>
            <div>
              <label class="font-semibold block mb-1">Opis:</label>
              <p class="whitespace-pre-wrap">{{ selectedReport()?.description }}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="font-semibold block mb-1">Status:</label>
                <p-tag 
                  [value]="getStatusText(selectedReport()!.status)" 
                  [severity]="getStatusSeverity(selectedReport()!.status)">
                </p-tag>
              </div>
              <div>
                <label class="font-semibold block mb-1">Priorytet:</label>
                <p-tag 
                  [value]="getPriorityText(selectedReport()!.priority)" 
                  [severity]="getPrioritySeverity(selectedReport()!.priority)">
                </p-tag>
              </div>
            </div>
            <div>
              <label class="font-semibold block mb-1">Kategoria:</label>
              <p>{{ selectedReport()?.category || '-' }}</p>
            </div>
            <div>
              <label class="font-semibold block mb-1">Data utworzenia:</label>
              <p>{{ formatDate(selectedReport()!.createdAt) }}</p>
            </div>
            <div *ngIf="selectedReport()?.submittedAt">
              <label class="font-semibold block mb-1">Data przekazania:</label>
              <p>{{ formatDate(selectedReport()!.submittedAt!) }}</p>
            </div>
            <div *ngIf="selectedReport()?.reviewNotes">
              <label class="font-semibold block mb-1">Uwagi z walidacji:</label>
              <p class="whitespace-pre-wrap">{{ selectedReport()?.reviewNotes }}</p>
            </div>
          </div>
        </p-dialog>

        <!-- Create/Edit Report Dialog with Improved Grid Layout -->
        <p-dialog 
          [(visible)]="showCreateDialog" 
          [style]="{width: '95vw', maxWidth: '650px'}"
          [header]="editMode ? 'Edytuj raport' : 'Nowy raport'"
          [modal]="true"
          [draggable]="false"
          [resizable]="false">
          <div class="grid grid-cols-1 gap-6">
            <!-- Title Field - Full Width -->
            <div class="col-span-1">
              <label for="title" class="block text-sm font-semibold text-gray-700 mb-2">
                Tytuł <span class="text-red-500">*</span>
              </label>
              <input 
                id="title"
                type="text" 
                pInputText 
                [(ngModel)]="reportForm.title"
                class="w-full"
                placeholder="Wprowadź tytuł raportu" />
            </div>

            <!-- Description Field - Full Width -->
            <div class="col-span-1">
              <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">
                Opis <span class="text-red-500">*</span>
              </label>
              <textarea 
                id="description"
                pTextarea 
                [(ngModel)]="reportForm.description"
                rows="5"
                class="w-full"
                placeholder="Wprowadź szczegółowy opis raportu">
              </textarea>
            </div>

            <!-- Two Column Layout for Category and Priority -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Category Field -->
              <div>
                <label for="category" class="block text-sm font-semibold text-gray-700 mb-2">
                  Kategoria
                </label>
                <input 
                  id="category"
                  type="text" 
                  pInputText 
                  [(ngModel)]="reportForm.category"
                  class="w-full"
                  placeholder="np. Zmiana danych" />
              </div>

              <!-- Priority Field -->
              <div>
                <label for="priority" class="block text-sm font-semibold text-gray-700 mb-2">
                  Priorytet <span class="text-red-500">*</span>
                </label>
                <p-select 
                  [(ngModel)]="reportForm.priority"
                  [options]="priorityOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full"
                  placeholder="Wybierz priorytet">
                </p-select>
              </div>
            </div>
          </div>

          <!-- Dialog Footer with Action Buttons -->
          <ng-template pTemplate="footer">
            <div class="flex justify-end gap-3">
              <p-button 
                label="Anuluj" 
                icon="pi pi-times"
                severity="secondary"
                [outlined]="true"
                (onClick)="closeCreateDialog()">
              </p-button>
              <p-button 
                [label]="editMode ? 'Zapisz zmiany' : 'Utwórz raport'" 
                [icon]="editMode ? 'pi pi-check' : 'pi pi-plus'"
                severity="success"
                (onClick)="saveReport()">
              </p-button>
            </div>
          </ng-template>
        </p-dialog>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      /* Table Styling */
      .p-datatable .p-datatable-tbody > tr > td {
        padding: 1rem;
        vertical-align: middle;
      }

      /* Tag Styling */
      .p-tag {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
      }

      /* Button Styling */
      .p-button.p-button-rounded.p-button-text {
        width: 2rem;
        height: 2rem;
      }

      /* Dialog Styling for Better Form Layout */
      .p-dialog .p-dialog-content {
        padding: 1.5rem;
        overflow-y: auto;
      }

      .p-dialog .p-dialog-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid #e5e7eb;
      }

      /* Select Full Width */
      .p-select {
        width: 100%;
      }

      /* Input and Textarea Styling */
      .p-inputtext,
      .p-textarea {
        width: 100%;
        font-size: 0.875rem;
      }

      /* Card Styling */
      .p-card .p-card-body {
        padding: 1.5rem;
      }

      .p-card .p-card-content {
        padding: 0;
      }
    }
  `]
})
export class ReportsComponent implements OnInit {
  // Services
  constructor(
    private reportService: ReportService,
    private authService: AuthService,
    private router: Router
  ) {}

  // Signals for reactive state
  reports = signal<ReportDto[]>([]);
  totalRecords = signal<number>(0);
  isLoading = signal<boolean>(false);
  selectedReport = signal<ReportDto | null>(null);

  // Pagination
  pageSize = 10;
  currentPage = 1;

  // Filters
  searchTerm = '';
  selectedStatus: number | null = null;
  selectedPriority: number | null = null;

  // Dialogs
  showViewDialog = false;
  showCreateDialog = false;
  editMode = false;

  // Form
  reportForm = {
    title: '',
    description: '',
    category: '',
    priority: 1
  };

  // Options
  statusOptions: StatusOption[] = [
    { label: 'Robocze', value: 0 },
    { label: 'Przekazane', value: 1 },
    { label: 'W trakcie walidacji', value: 2 },
    { label: 'Proces zakończony sukcesem', value: 3 },
    { label: 'Błędy z reguł walidacji', value: 4 },
    { label: 'Zakwestionowane przez UKNF', value: 5 }
  ];

  priorityOptions: PriorityOption[] = [
    { label: 'Niski', value: 0 },
    { label: 'Normalny', value: 1 },
    { label: 'Wysoki', value: 2 },
    { label: 'Krytyczny', value: 3 }
  ];

  ngOnInit(): void {
    this.loadInitialReports();
  }

  loadInitialReports(): void {
    this.reportService.getMyReports(this.currentPage, this.pageSize).subscribe({
      next: (result: any) => {
        this.reports.set(result.items);
        this.totalRecords.set(result.totalCount);
      },
      error: (error: any) => {
        console.error('Error loading reports:', error);
      }
    });
  }

  loadReports(event: any): void {
    this.currentPage = (event.first / event.rows) + 1;
    this.pageSize = event.rows;

    if (this.hasActiveFilters()) {
      this.search();
    } else {
      this.loadInitialReports();
    }
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedStatus !== null || this.selectedPriority !== null);
  }

  search(): void {
    const searchRequest: SearchReportsRequest = {
      searchTerm: this.searchTerm || undefined,
      status: this.selectedStatus ?? undefined,
      priority: this.selectedPriority ?? undefined,
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };

    this.reportService.searchReports(searchRequest).subscribe({
      next: (result: any) => {
        this.reports.set(result.items);
        this.totalRecords.set(result.totalCount);
      },
      error: (error: any) => {
        console.error('Error searching reports:', error);
      }
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = null;
    this.selectedPriority = null;
    this.loadInitialReports();
  }

  viewReport(report: ReportDto): void {
    this.selectedReport.set(report);
    this.showViewDialog = true;
  }

  editReport(report: ReportDto): void {
    this.selectedReport.set(report);
    this.reportForm = {
      title: report.title,
      description: report.description,
      category: report.category || '',
      priority: this.getPriorityValue(report.priority)
    };
    this.editMode = true;
    this.showCreateDialog = true;
  }

  deleteReport(report: ReportDto): void {
    if (confirm(`Czy na pewno chcesz usunąć raport "${report.title}"?`)) {
      this.reportService.deleteReport(report.id).subscribe({
        next: () => {
          this.loadInitialReports();
        },
        error: (error: any) => {
          console.error('Error deleting report:', error);
        }
      });
    }
  }

  submitReport(report: ReportDto): void {
    if (confirm(`Czy na pewno chcesz przekazać raport "${report.title}" do UKNF?`)) {
      this.reportService.submitReport(report.id).subscribe({
        next: () => {
          this.loadInitialReports();
        },
        error: (error: any) => {
          console.error('Error submitting report:', error);
        }
      });
    }
  }

  saveReport(): void {
    if (!this.reportForm.title || !this.reportForm.description) {
      alert('Tytuł i opis są wymagane!');
      return;
    }

    if (this.editMode && this.selectedReport()) {
      const updateRequest = {
        ...this.reportForm,
        status: this.getStatusValue(this.selectedReport()!.status)
      };
      
      this.reportService.updateReport(this.selectedReport()!.id, updateRequest).subscribe({
        next: () => {
          this.closeCreateDialog();
          this.loadInitialReports();
        },
        error: (error: any) => {
          console.error('Error updating report:', error);
        }
      });
    } else {
      this.reportService.createReport(this.reportForm).subscribe({
        next: () => {
          this.closeCreateDialog();
          this.loadInitialReports();
        },
        error: (error: any) => {
          console.error('Error creating report:', error);
        }
      });
    }
  }

  closeCreateDialog(): void {
    this.showCreateDialog = false;
    this.editMode = false;
    this.reportForm = {
      title: '',
      description: '',
      category: '',
      priority: 1
    };
    this.selectedReport.set(null);
  }

  exportCSV(): void {
    this.reportService.exportToCSV(this.reports());
  }

  exportExcel(): void {
    this.reportService.exportToExcel(this.reports());
  }

  // Helper methods
  getStatusText(status: string): string {
    return this.reportService.getStatusText(status);
  }

  getPriorityText(priority: string): string {
    return this.reportService.getPriorityText(priority);
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'secondary' | 'contrast' | 'danger' {
    const severityMap: { [key: string]: 'success' | 'info' | 'warn' | 'secondary' | 'contrast' | 'danger' } = {
      'Draft': 'secondary',
      'Submitted': 'info',
      'UnderReview': 'warn',
      'Approved': 'success',
      'Rejected': 'danger',
      'Archived': 'contrast'
    };
    return severityMap[status] || 'secondary';
  }

  getPrioritySeverity(priority: string): 'success' | 'info' | 'warn' | 'secondary' | 'contrast' | 'danger' {
    const severityMap: { [key: string]: 'success' | 'info' | 'warn' | 'secondary' | 'contrast' | 'danger' } = {
      'Low': 'secondary',
      'Normal': 'info',
      'High': 'warn',
      'Critical': 'danger'
    };
    return severityMap[priority] || 'info';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusValue(status: string): number {
    const statusMap: { [key: string]: number } = {
      'Draft': 0,
      'Submitted': 1,
      'UnderReview': 2,
      'Approved': 3,
      'Rejected': 4,
      'Archived': 5
    };
    return statusMap[status] || 0;
  }

  getPriorityValue(priority: string): number {
    const priorityMap: { [key: string]: number } = {
      'Low': 0,
      'Normal': 1,
      'High': 2,
      'Critical': 3
    };
    return priorityMap[priority] || 1;
  }
}

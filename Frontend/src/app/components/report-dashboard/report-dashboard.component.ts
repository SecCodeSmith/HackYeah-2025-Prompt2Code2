import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';

/**
 * Interface representing a Report entity
 */
interface Report {
  id: number;
  name: string;
  submissionPeriod: string;
  submissionDate: Date;
  status: ReportStatus;
}

/**
 * Enum for Report Status values
 */
enum ReportStatus {
  DRAFT = 'Robocze',
  SUBMITTED = 'Przekazane',
  VALIDATING = 'W trakcie walidacji',
  SUCCESS = 'Proces zakończony sukcesem',
  VALIDATION_ERROR = 'Błędy z reguł walidacji',
  QUESTIONED = 'Zakwestionowane przez UKNF'
}

/**
 * Status styling configuration
 */
interface StatusConfig {
  severity: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';
  icon: string;
}

@Component({
  selector: 'app-report-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    MenuModule,
    TooltipModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-800 mb-2">
                <i class="pi pi-chart-bar mr-2 text-indigo-600"></i>
                Panel Raportów
              </h1>
              <p class="text-gray-600">Przeglądaj i zarządzaj swoimi raportami</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">Łącznie raportów:</span>
              <span class="text-2xl font-bold text-indigo-600">{{ reports.length }}</span>
            </div>
          </div>
        </div>

        <!-- Toolbar -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <!-- Search -->
            <div class="flex-1 w-full lg:max-w-md">
              <span class="p-input-icon-left w-full">
                <i class="pi pi-search"></i>
                <input 
                  pInputText 
                  type="text" 
                  [(ngModel)]="globalFilterValue"
                  (input)="onGlobalFilter($event)"
                  placeholder="Szukaj raportów..." 
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </span>
            </div>

            <!-- Status Filter -->
            <div class="w-full lg:w-64">
              <p-dropdown
                [options]="statusOptions"
                [(ngModel)]="selectedStatus"
                (onChange)="onStatusFilter()"
                placeholder="Filtruj po statusie"
                [showClear]="true"
                optionLabel="label"
                optionValue="value"
                class="w-full"
                styleClass="w-full"
              >
                <ng-template pTemplate="selectedItem" let-option>
                  <div class="flex items-center gap-2" *ngIf="option">
                    <i [class]="'pi ' + getStatusConfig(option.value).icon"></i>
                    <span>{{ option.label }}</span>
                  </div>
                </ng-template>
                <ng-template pTemplate="item" let-option>
                  <div class="flex items-center gap-2">
                    <i [class]="'pi ' + getStatusConfig(option.value).icon"></i>
                    <span>{{ option.label }}</span>
                  </div>
                </ng-template>
              </p-dropdown>
            </div>

            <!-- Export Buttons -->
            <div class="flex gap-2">
              <button 
                pButton 
                type="button" 
                label="CSV"
                icon="pi pi-file"
                (click)="exportToCSV()"
                class="p-button-outlined p-button-success"
                pTooltip="Eksportuj do CSV"
                tooltipPosition="bottom"
              ></button>
              <button 
                pButton 
                type="button" 
                label="XLSX"
                icon="pi pi-file-excel"
                (click)="exportToXLSX()"
                class="p-button-outlined p-button-success"
                pTooltip="Eksportuj do Excel"
                tooltipPosition="bottom"
              ></button>
            </div>
          </div>
        </div>

        <!-- Table Card -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <p-table 
            #dt
            [value]="filteredReports()"
            [rows]="10"
            [paginator]="true"
            [rowsPerPageOptions]="[5, 10, 25, 50]"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Pokazuje {first} do {last} z {totalRecords} raportów"
            [globalFilterFields]="['name', 'submissionPeriod', 'status']"
            responsiveLayout="scroll"
            styleClass="p-datatable-striped"
            [loading]="loading()"
            [tableStyle]="{'min-width': '60rem'}"
          >
            <!-- Loading Template -->
            <ng-template pTemplate="loadingbody">
              <tr>
                <td colspan="5" class="text-center py-8">
                  <i class="pi pi-spin pi-spinner text-4xl text-indigo-600"></i>
                  <p class="mt-4 text-gray-600">Ładowanie danych...</p>
                </td>
              </tr>
            </ng-template>

            <!-- Header -->
            <ng-template pTemplate="header">
              <tr class="bg-gradient-to-r from-indigo-600 to-blue-600 text-white sticky top-0 z-10">
                <th pSortableColumn="name" class="py-4 px-6">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold">Nazwa Raportu</span>
                    <p-sortIcon field="name"></p-sortIcon>
                  </div>
                </th>
                <th pSortableColumn="submissionPeriod" class="py-4 px-6">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold">Okres Sprawozdawczy</span>
                    <p-sortIcon field="submissionPeriod"></p-sortIcon>
                  </div>
                </th>
                <th pSortableColumn="submissionDate" class="py-4 px-6">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold">Data Przekazania</span>
                    <p-sortIcon field="submissionDate"></p-sortIcon>
                  </div>
                </th>
                <th pSortableColumn="status" class="py-4 px-6">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold">Status</span>
                    <p-sortIcon field="status"></p-sortIcon>
                  </div>
                </th>
                <th class="py-4 px-6 text-center">
                  <span class="font-semibold">Akcje</span>
                </th>
              </tr>
            </ng-template>

            <!-- Body -->
            <ng-template pTemplate="body" let-report>
              <tr class="hover:bg-gray-50 transition-colors duration-150">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <i class="pi pi-file-pdf text-2xl text-red-500"></i>
                    <span class="font-medium text-gray-800">{{ report.name }}</span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <span class="text-gray-700">{{ report.submissionPeriod }}</span>
                </td>
                <td class="py-4 px-6">
                  <span class="text-gray-700">{{ report.submissionDate | date:'dd.MM.yyyy HH:mm' }}</span>
                </td>
                <td class="py-4 px-6">
                  <p-tag 
                    [severity]="getStatusConfig(report.status).severity"
                    [value]="report.status"
                    [icon]="'pi ' + getStatusConfig(report.status).icon"
                    styleClass="px-3 py-1.5"
                  ></p-tag>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center justify-center gap-2">
                    <button 
                      pButton 
                      type="button" 
                      icon="pi pi-eye"
                      class="p-button-rounded p-button-text p-button-info"
                      (click)="viewDetails(report)"
                      pTooltip="Pokaż szczegóły"
                      tooltipPosition="top"
                    ></button>
                    <button 
                      pButton 
                      type="button" 
                      icon="pi pi-download"
                      class="p-button-rounded p-button-text p-button-success"
                      (click)="downloadReport(report)"
                      pTooltip="Pobierz raport"
                      tooltipPosition="top"
                    ></button>
                    <button 
                      pButton 
                      type="button" 
                      icon="pi pi-pencil"
                      class="p-button-rounded p-button-text p-button-warning"
                      (click)="submitCorrection(report)"
                      pTooltip="Wyślij korektę"
                      tooltipPosition="top"
                      [disabled]="report.status === 'Proces zakończony sukcesem'"
                    ></button>
                  </div>
                </td>
              </tr>
            </ng-template>

            <!-- Empty Message -->
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="5" class="text-center py-12">
                  <div class="flex flex-col items-center gap-4">
                    <i class="pi pi-inbox text-6xl text-gray-300"></i>
                    <div>
                      <p class="text-xl font-medium text-gray-600">Nie znaleziono raportów</p>
                      <p class="text-gray-500 mt-2">Spróbuj zmienić kryteria wyszukiwania</p>
                    </div>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <!-- Footer Info -->
        <div class="mt-6 text-center text-gray-600">
          <p class="text-sm">
            Ostatnia aktualizacja: {{ lastUpdate | date:'dd.MM.yyyy HH:mm:ss' }}
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      /* Custom PrimeNG Table Overrides */
      .p-datatable .p-datatable-thead > tr > th {
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .p-datatable .p-sortable-column:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .p-datatable .p-sortable-column.p-highlight {
        background-color: rgba(255, 255, 255, 0.2);
      }

      .p-tag {
        font-weight: 600;
        letter-spacing: 0.025em;
      }

      /* Dropdown styling */
      .p-dropdown {
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
      }

      .p-dropdown:not(.p-disabled):hover {
        border-color: #6366f1;
      }

      .p-dropdown:not(.p-disabled).p-focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }

      /* Button styling */
      .p-button {
        transition: all 0.2s ease;
      }

      .p-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      /* Paginator styling */
      .p-paginator {
        padding: 1rem;
        border-top: 1px solid #e5e7eb;
      }

      /* Loading overlay */
      .p-datatable-loading-overlay {
        background-color: rgba(255, 255, 255, 0.9);
      }

      /* Responsive table */
      @media screen and (max-width: 768px) {
        .p-datatable .p-datatable-thead > tr > th,
        .p-datatable .p-datatable-tbody > tr > td {
          padding: 0.75rem 0.5rem;
          font-size: 0.875rem;
        }
      }
    }
  `]
})
export class ReportDashboardComponent implements OnInit {
  // Signals for reactive state management
  loading = signal<boolean>(false);
  filteredReports = signal<Report[]>([]);

  // Component state
  reports: Report[] = [];
  globalFilterValue: string = '';
  selectedStatus: string | null = null;
  lastUpdate: Date = new Date();

  // Status dropdown options
  statusOptions = [
    { label: 'Robocze', value: ReportStatus.DRAFT },
    { label: 'Przekazane', value: ReportStatus.SUBMITTED },
    { label: 'W trakcie walidacji', value: ReportStatus.VALIDATING },
    { label: 'Proces zakończony sukcesem', value: ReportStatus.SUCCESS },
    { label: 'Błędy z reguł walidacji', value: ReportStatus.VALIDATION_ERROR },
    { label: 'Zakwestionowane przez UKNF', value: ReportStatus.QUESTIONED }
  ];

  /**
   * Lifecycle hook - Initialize component with mock data
   */
  ngOnInit(): void {
    this.loadMockData();
  }

  /**
   * Load mock data for demonstration
   * Ensures all statuses are represented
   */
  private loadMockData(): void {
    this.loading.set(true);
    
    // Simulate async data loading
    setTimeout(() => {
      this.reports = [
        {
          id: 1,
          name: 'Raport Finansowy Q1 2024',
          submissionPeriod: 'Q1 2024',
          submissionDate: new Date('2024-04-15T10:30:00'),
          status: ReportStatus.SUCCESS
        },
        {
          id: 2,
          name: 'Raport Ryzyka Operacyjnego - Marzec 2024',
          submissionPeriod: 'Marzec 2024',
          submissionDate: new Date('2024-04-08T14:20:00'),
          status: ReportStatus.VALIDATING
        },
        {
          id: 3,
          name: 'Sprawozdanie Kapitałowe Q4 2023',
          submissionPeriod: 'Q4 2023',
          submissionDate: new Date('2024-01-31T16:45:00'),
          status: ReportStatus.QUESTIONED
        },
        {
          id: 4,
          name: 'Raport Płynności - Luty 2024',
          submissionPeriod: 'Luty 2024',
          submissionDate: new Date('2024-03-10T09:15:00'),
          status: ReportStatus.SUBMITTED
        },
        {
          id: 5,
          name: 'Analiza Portfela Kredytowego 2024',
          submissionPeriod: 'Styczeń 2024',
          submissionDate: new Date('2024-02-20T11:00:00'),
          status: ReportStatus.DRAFT
        },
        {
          id: 6,
          name: 'Raport Compliance Q1 2024',
          submissionPeriod: 'Q1 2024',
          submissionDate: new Date('2024-04-18T13:30:00'),
          status: ReportStatus.VALIDATION_ERROR
        },
        {
          id: 7,
          name: 'Deklaracja Funduszy Własnych',
          submissionPeriod: 'Q4 2023',
          submissionDate: new Date('2024-01-25T10:00:00'),
          status: ReportStatus.SUCCESS
        },
        {
          id: 8,
          name: 'Raport AML/KYC - Kwiecień 2024',
          submissionPeriod: 'Kwiecień 2024',
          submissionDate: new Date('2024-05-05T15:20:00'),
          status: ReportStatus.DRAFT
        },
        {
          id: 9,
          name: 'Wymogi Kapitałowe BION',
          submissionPeriod: 'Q1 2024',
          submissionDate: new Date('2024-04-20T12:10:00'),
          status: ReportStatus.VALIDATING
        },
        {
          id: 10,
          name: 'Raport Adekwatności Kapitałowej',
          submissionPeriod: 'Q4 2023',
          submissionDate: new Date('2024-02-01T09:45:00'),
          status: ReportStatus.SUCCESS
        },
        {
          id: 11,
          name: 'Struktura Organizacyjna 2024',
          submissionPeriod: 'Styczeń 2024',
          submissionDate: new Date('2024-02-15T14:00:00'),
          status: ReportStatus.SUBMITTED
        },
        {
          id: 12,
          name: 'Raport ESG Q1 2024',
          submissionPeriod: 'Q1 2024',
          submissionDate: new Date('2024-04-22T16:30:00'),
          status: ReportStatus.VALIDATION_ERROR
        },
        {
          id: 13,
          name: 'Dane o Ekspozycjach Kredytowych',
          submissionPeriod: 'Marzec 2024',
          submissionDate: new Date('2024-04-12T11:25:00'),
          status: ReportStatus.QUESTIONED
        },
        {
          id: 14,
          name: 'Raport Dużych Ekspozycji',
          submissionPeriod: 'Q1 2024',
          submissionDate: new Date('2024-04-25T10:15:00'),
          status: ReportStatus.DRAFT
        },
        {
          id: 15,
          name: 'Informacje o Zarządzaniu Ryzykiem',
          submissionPeriod: 'Q4 2023',
          submissionDate: new Date('2024-01-28T13:50:00'),
          status: ReportStatus.SUCCESS
        },
        {
          id: 16,
          name: 'Raport COREP - Część A',
          submissionPeriod: 'Q1 2024',
          submissionDate: new Date('2024-04-16T08:30:00'),
          status: ReportStatus.VALIDATING
        },
        {
          id: 17,
          name: 'Raport FINREP - Bilans',
          submissionPeriod: 'Q1 2024',
          submissionDate: new Date('2024-04-17T09:20:00'),
          status: ReportStatus.SUBMITTED
        },
        {
          id: 18,
          name: 'Informacje Dodatkowe do Sprawozdań',
          submissionPeriod: 'Luty 2024',
          submissionDate: new Date('2024-03-15T15:40:00'),
          status: ReportStatus.VALIDATION_ERROR
        }
      ];

      this.filteredReports.set([...this.reports]);
      this.loading.set(false);
    }, 800);
  }

  /**
   * Get status configuration for styling
   */
  getStatusConfig(status: ReportStatus): StatusConfig {
    const configs: Record<ReportStatus, StatusConfig> = {
      [ReportStatus.DRAFT]: {
        severity: 'secondary',
        icon: 'pi-file-edit'
      },
      [ReportStatus.SUBMITTED]: {
        severity: 'info',
        icon: 'pi-send'
      },
      [ReportStatus.VALIDATING]: {
        severity: 'warn',
        icon: 'pi-clock'
      },
      [ReportStatus.SUCCESS]: {
        severity: 'success',
        icon: 'pi-check-circle'
      },
      [ReportStatus.VALIDATION_ERROR]: {
        severity: 'danger',
        icon: 'pi-exclamation-triangle'
      },
      [ReportStatus.QUESTIONED]: {
        severity: 'danger',
        icon: 'pi-question-circle'
      }
    };

    return configs[status] || { severity: 'secondary', icon: 'pi-file' };
  }

  /**
   * Handle global filter input
   */
  onGlobalFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value.toLowerCase();
    this.applyFilters(value, this.selectedStatus);
  }

  /**
   * Handle status filter change
   */
  onStatusFilter(): void {
    this.applyFilters(this.globalFilterValue, this.selectedStatus);
  }

  /**
   * Apply all active filters
   */
  private applyFilters(searchText: string, status: string | null): void {
    let filtered = [...this.reports];

    // Apply text search
    if (searchText) {
      filtered = filtered.filter(report => 
        report.name.toLowerCase().includes(searchText) ||
        report.submissionPeriod.toLowerCase().includes(searchText) ||
        report.status.toLowerCase().includes(searchText)
      );
    }

    // Apply status filter
    if (status) {
      filtered = filtered.filter(report => report.status === status);
    }

    this.filteredReports.set(filtered);
  }

  /**
   * View report details (placeholder)
   */
  viewDetails(report: Report): void {
    console.log('📄 Viewing details for report:', {
      id: report.id,
      name: report.name,
      status: report.status,
      timestamp: new Date().toISOString()
    });
    alert(`Szczegóły raportu:\n\nNazwa: ${report.name}\nOkres: ${report.submissionPeriod}\nStatus: ${report.status}\n\nID: ${report.id}`);
  }

  /**
   * Download report (placeholder)
   */
  downloadReport(report: Report): void {
    console.log('⬇️ Downloading report:', {
      id: report.id,
      name: report.name,
      format: 'PDF',
      timestamp: new Date().toISOString()
    });
    alert(`Pobieranie raportu:\n\n${report.name}\n\nFormat: PDF\nRozmiar: ~2.5 MB\n\nPobieranie rozpoczęte...`);
  }

  /**
   * Submit correction (placeholder)
   */
  submitCorrection(report: Report): void {
    if (report.status === ReportStatus.SUCCESS) {
      alert('Raport został już pomyślnie zatwierdzony i nie może być korygowany.');
      return;
    }

    console.log('✏️ Submitting correction for report:', {
      id: report.id,
      name: report.name,
      currentStatus: report.status,
      timestamp: new Date().toISOString()
    });
    alert(`Wysyłanie korekty dla raportu:\n\n${report.name}\n\nOtworzy się formularz korekty...`);
  }

  /**
   * Export to CSV (placeholder)
   */
  exportToCSV(): void {
    console.log('📊 Exporting to CSV:', {
      recordCount: this.filteredReports().length,
      timestamp: new Date().toISOString()
    });

    // Generate CSV content
    const headers = ['ID', 'Nazwa Raportu', 'Okres Sprawozdawczy', 'Data Przekazania', 'Status'];
    const csvContent = [
      headers.join(','),
      ...this.filteredReports().map(report => 
        [
          report.id,
          `"${report.name}"`,
          `"${report.submissionPeriod}"`,
          report.submissionDate.toLocaleDateString('pl-PL'),
          `"${report.status}"`
        ].join(',')
      )
    ].join('\n');

    console.log('CSV Content Preview:', csvContent.substring(0, 200) + '...');
    alert(`Eksport do CSV\n\nLiczba rekordów: ${this.filteredReports().length}\nFormat: UTF-8\n\nPlik zostanie pobrany jako "raporty_${new Date().getTime()}.csv"`);
  }

  /**
   * Export to XLSX (placeholder)
   */
  exportToXLSX(): void {
    console.log('📈 Exporting to XLSX:', {
      recordCount: this.filteredReports().length,
      timestamp: new Date().toISOString()
    });

    alert(`Eksport do Excel (XLSX)\n\nLiczba rekordów: ${this.filteredReports().length}\nFormat: Excel 2007+\nArkusze: Raporty, Podsumowanie\n\nPlik zostanie pobrany jako "raporty_${new Date().getTime()}.xlsx"\n\nUwaga: Wymagana biblioteka ExcelJS lub SheetJS`);
  }
}

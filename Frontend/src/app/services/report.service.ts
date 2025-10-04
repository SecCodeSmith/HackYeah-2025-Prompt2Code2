import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// DTOs matching backend models
export interface ReportDto {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category?: string;
  userId: string;
  userName: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt?: string;
  attachments: ReportAttachmentDto[];
}

export interface ReportAttachmentDto {
  id: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CreateReportRequest {
  title: string;
  description: string;
  category?: string;
  priority: number;
}

export interface UpdateReportRequest {
  title: string;
  description: string;
  category?: string;
  priority: number;
  status: number;
}

export interface SearchReportsRequest {
  searchTerm?: string;
  status?: number;
  priority?: number;
  category?: string;
  createdFrom?: string;
  createdTo?: string;
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly API_URL = 'http://localhost:5000/api/reports';

  // Signals for state management
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Get all reports with pagination
   */
  getAllReports(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<ReportDto>> {
    this.isLoading.set(true);
    this.error.set(null);

    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<ReportDto>>(this.API_URL, { params }).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get current user's reports
   */
  getMyReports(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<ReportDto>> {
    this.isLoading.set(true);
    this.error.set(null);

    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<ReportDto>>(`${this.API_URL}/my-reports`, { params }).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get report by ID
   */
  getReportById(id: string): Observable<ReportDto> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<ReportDto>(`${this.API_URL}/${id}`).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get reports by status
   */
  getReportsByStatus(status: number, pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<ReportDto>> {
    this.isLoading.set(true);
    this.error.set(null);

    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<ReportDto>>(`${this.API_URL}/by-status/${status}`, { params }).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Search reports with advanced filters
   */
  searchReports(searchRequest: SearchReportsRequest): Observable<PagedResult<ReportDto>> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post<PagedResult<ReportDto>>(`${this.API_URL}/search`, searchRequest).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Create new report
   */
  createReport(report: CreateReportRequest): Observable<any> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post(`${this.API_URL}`, report).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Update existing report
   */
  updateReport(id: string, report: UpdateReportRequest): Observable<any> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.put(`${this.API_URL}/${id}`, report).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Delete report
   */
  deleteReport(id: string): Observable<void> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Submit report for review
   */
  submitReport(id: string): Observable<any> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post(`${this.API_URL}/${id}/submit`, {}).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Review report (admin only)
   */
  reviewReport(id: string, status: number, reviewNotes?: string): Observable<any> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post(`${this.API_URL}/${id}/review`, { status, reviewNotes }).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Export reports to CSV
   */
  exportToCSV(reports: ReportDto[]): void {
    const csvContent = this.convertToCSV(reports);
    this.downloadFile(csvContent, 'reports.csv', 'text/csv');
  }

  /**
   * Export reports to Excel (server-side) with filters
   */
  exportToExcel(filters: SearchReportsRequest = {}): Observable<Blob> {
    this.isLoading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    
    if (filters.searchTerm) {
      params = params.set('searchTerm', filters.searchTerm);
    }
    if (filters.status !== undefined && filters.status !== null) {
      params = params.set('status', filters.status.toString());
    }
    if (filters.priority !== undefined && filters.priority !== null) {
      params = params.set('priority', filters.priority.toString());
    }
    if (filters.category) {
      params = params.set('category', filters.category);
    }
    if (filters.createdFrom) {
      params = params.set('createdFrom', filters.createdFrom);
    }
    if (filters.createdTo) {
      params = params.set('createdTo', filters.createdTo);
    }

    return this.http.get(`${this.API_URL}/export/excel`, { 
      params, 
      responseType: 'blob' 
    }).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Download blob as file
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Convert reports to CSV format
   */
  private convertToCSV(reports: ReportDto[]): string {
    if (reports.length === 0) {
      return '';
    }

    const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Category', 'User', 'Submitted At', 'Created At'];
    const rows = reports.map(report => [
      report.id,
      this.escapeCSV(report.title),
      this.escapeCSV(report.description),
      report.status,
      report.priority,
      report.category || '',
      report.userName,
      report.submittedAt || '',
      report.createdAt
    ]);

    const csvRows = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ];

    return csvRows.join('\n');
  }

  /**
   * Escape special characters for CSV
   */
  private escapeCSV(value: string): string {
    if (!value) return '';
    const stringValue = value.toString();
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  /**
   * Download file to browser
   */
  private downloadFile(content: string, fileName: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Server returned code ${error.status}`;
    }

    this.error.set(errorMessage);
    this.isLoading.set(false);
    console.error('Report service error:', errorMessage);

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Map status enum to display text
   */
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Draft': 'Robocze',
      'Submitted': 'Przekazane',
      'UnderReview': 'W trakcie walidacji',
      'Approved': 'Proces zakończony sukcesem',
      'Rejected': 'Błędy z reguł walidacji',
      'Archived': 'Zakwestionowane przez UKNF'
    };
    return statusMap[status] || status;
  }

  /**
   * Map priority enum to display text
   */
  getPriorityText(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'Low': 'Niski',
      'Normal': 'Normalny',
      'High': 'Wysoki',
      'Critical': 'Krytyczny'
    };
    return priorityMap[priority] || priority;
  }

  /**
   * Get status color for badges
   */
  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'Draft': 'gray',
      'Submitted': 'blue',
      'UnderReview': 'yellow',
      'Approved': 'green',
      'Rejected': 'red',
      'Archived': 'orange'
    };
    return colorMap[status] || 'gray';
  }
}

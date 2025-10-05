import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';

import { PodmiotyService } from '../../services/podmioty.service';
import {
  PodmiotListDto,
  TypPodmiotu,
  StatusPodmiotu,
  TypPodmiotuLabels,
  StatusPodmiotuLabels,
  StatusPodmiotuColors
} from '../../models/podmiot.model';
import { PodmiotDialogComponent } from './podmiot-dialog.component';

@Component({
  selector: 'app-podmioty-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    PodmiotDialogComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './podmioty-list.component.html',
  styleUrls: ['./podmioty-list.component.css']
})
export class PodmiotyListComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  podmioty: PodmiotListDto[] = [];
  loading = false;
  totalRecords = 0;

  // Pagination
  first = 0;
  rows = 10;
  pageNumber = 1;

  // Filters
  searchTerm = '';
  selectedTyp: number | null = null;
  selectedStatus: number | null = null;

  // Dialog
  showDialog = false;
  selectedPodmiotId: string | null = null;

  // Dropdown options
  typyPodmiotow = Object.keys(TypPodmiotu)
    .filter(key => !isNaN(Number(key)))
    .map(key => ({
      label: TypPodmiotuLabels[Number(key)],
      value: Number(key)
    }));

  statusy = Object.keys(StatusPodmiotu)
    .filter(key => !isNaN(Number(key)))
    .map(key => ({
      label: StatusPodmiotuLabels[Number(key)],
      value: Number(key)
    }));

  constructor(
    private podmiotyService: PodmiotyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPodmioty();
  }

  loadPodmioty(): void {
    this.loading = true;
    
    this.podmiotyService.getPodmioty(
      this.pageNumber,
      this.rows,
      this.selectedTyp ?? undefined,
      this.selectedStatus ?? undefined,
      this.searchTerm || undefined
    ).subscribe({
      next: (result) => {
        this.podmioty = result.items;
        this.totalRecords = result.totalCount;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading podmioty:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się załadować listy podmiotów'
        });
        this.loading = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.pageNumber = Math.floor(event.first / event.rows) + 1;
    this.loadPodmioty();
  }

  onSearch(): void {
    this.pageNumber = 1;
    this.first = 0;
    this.loadPodmioty();
  }

  onFilterChange(): void {
    this.pageNumber = 1;
    this.first = 0;
    this.loadPodmioty();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedTyp = null;
    this.selectedStatus = null;
    this.pageNumber = 1;
    this.first = 0;
    if (this.table) {
      this.table.clear();
    }
    this.loadPodmioty();
  }

  openCreateDialog(): void {
    this.selectedPodmiotId = null;
    this.showDialog = true;
  }

  openEditDialog(id: string): void {
    this.selectedPodmiotId = id;
    this.showDialog = true;
  }

  onDialogClose(saved: boolean): void {
    this.showDialog = false;
    this.selectedPodmiotId = null;
    
    if (saved) {
      this.loadPodmioty();
      this.messageService.add({
        severity: 'success',
        summary: 'Sukces',
        detail: 'Podmiot został zapisany'
      });
    }
  }

  confirmDelete(podmiot: PodmiotListDto): void {
    this.confirmationService.confirm({
      message: `Czy na pewno chcesz usunąć podmiot "${podmiot.nazwa}"?`,
      header: 'Potwierdzenie usunięcia',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      accept: () => {
        this.deletePodmiot(podmiot.id);
      }
    });
  }

  private deletePodmiot(id: string): void {
    this.podmiotyService.deletePodmiot(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sukces',
          detail: 'Podmiot został usunięty'
        });
        this.loadPodmioty();
      },
      error: (error) => {
        console.error('Error deleting podmiot:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się usunąć podmiotu'
        });
      }
    });
  }

  getTypLabel(value: string): string {
    const numValue = parseInt(value, 10);
    return TypPodmiotuLabels[numValue] || value;
  }

  getStatusLabel(value: string): string {
    const numValue = parseInt(value, 10);
    return StatusPodmiotuLabels[numValue] || value;
  }

  getStatusSeverity(value: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    const numValue = parseInt(value, 10);
    const color = StatusPodmiotuColors[numValue];
    
    switch (color) {
      case 'success': return 'success';
      case 'warning': return 'warn';
      case 'danger': return 'danger';
      case 'info': return 'info';
      default: return 'secondary';
    }
  }

  formatDate(date: Date | string): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('pl-PL');
  }
}

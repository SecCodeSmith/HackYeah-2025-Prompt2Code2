import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextarea } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';

import { PodmiotyService } from '../../services/podmioty.service';
import {
  TypPodmiotu,
  StatusPodmiotu,
  TypPodmiotuLabels,
  StatusPodmiotuLabels,
  CreatePodmiotRequest,
  UpdatePodmiotRequest
} from '../../models/podmiot.model';

@Component({
  selector: 'app-podmiot-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputTextarea
  ],
  templateUrl: './podmiot-dialog.component.html',
  styleUrls: ['./podmiot-dialog.component.css']
})
export class PodmiotDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() podmiotId: string | null = null;
  @Output() onClose = new EventEmitter<boolean>();

  podmiotForm!: FormGroup;
  loading = false;
  saving = false;
  isEditMode = false;

  typPodmiotuOptions = Object.keys(TypPodmiotu)
    .filter(key => !isNaN(Number(key)))
    .map(key => ({
      label: TypPodmiotuLabels[Number(key)],
      value: Number(key)
    }));

  statusOptions = Object.keys(StatusPodmiotu)
    .filter(key => !isNaN(Number(key)))
    .map(key => ({
      label: StatusPodmiotuLabels[Number(key)],
      value: Number(key)
    }));

  constructor(
    private fb: FormBuilder,
    private podmiotyService: PodmiotyService,
    private messageService: MessageService
  ) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.isEditMode = !!this.podmiotId;
      
      if (this.isEditMode && this.podmiotId) {
        this.loadPodmiot(this.podmiotId);
      } else {
        this.resetForm();
      }
    }
  }

  private initForm(): void {
    this.podmiotForm = this.fb.group({
      kodUKNF: ['', [Validators.required, Validators.maxLength(50)]],
      nazwa: ['', [Validators.required, Validators.maxLength(500)]],
      typPodmiotu: [null, Validators.required],
      nip: ['', Validators.maxLength(20)],
      regon: ['', Validators.maxLength(20)],
      krs: ['', Validators.maxLength(20)],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      telefon: ['', Validators.maxLength(20)],
      adres: ['', Validators.maxLength(500)],
      miasto: [''],
      kodPocztowy: [''],
      status: [StatusPodmiotu.Aktywny, Validators.required],
      dataRejestracjiUKNF: [new Date(), Validators.required],
      dataZawieszenia: [null],
      uwagi: ['']
    });
  }

  private loadPodmiot(id: string): void {
    this.loading = true;
    
    this.podmiotyService.getPodmiotById(id).subscribe({
      next: (podmiot) => {
        this.podmiotForm.patchValue({
          kodUKNF: podmiot.kodUKNF,
          nazwa: podmiot.nazwa,
          typPodmiotu: parseInt(podmiot.typPodmiotu, 10),
          nip: podmiot.nip,
          regon: podmiot.regon,
          krs: podmiot.krs,
          email: podmiot.email,
          telefon: podmiot.telefon,
          adres: podmiot.adres,
          miasto: podmiot.miasto,
          kodPocztowy: podmiot.kodPocztowy,
          status: parseInt(podmiot.status, 10),
          dataRejestracjiUKNF: new Date(podmiot.dataRejestracjiUKNF),
          dataZawieszenia: podmiot.dataZawieszenia ? new Date(podmiot.dataZawieszenia) : null,
          uwagi: podmiot.uwagi
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading podmiot:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się załadować danych podmiotu'
        });
        this.loading = false;
        this.close(false);
      }
    });
  }

  private resetForm(): void {
    this.podmiotForm.reset({
      kodUKNF: '',
      nazwa: '',
      typPodmiotu: null,
      nip: '',
      regon: '',
      krs: '',
      email: '',
      telefon: '',
      adres: '',
      miasto: '',
      kodPocztowy: '',
      status: StatusPodmiotu.Aktywny,
      dataRejestracjiUKNF: new Date(),
      dataZawieszenia: null,
      uwagi: ''
    });
  }

  save(): void {
    if (this.podmiotForm.invalid) {
      this.podmiotForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Uwaga',
        detail: 'Proszę poprawić błędy w formularzu'
      });
      return;
    }

    this.saving = true;
    const formValue = this.podmiotForm.value;

    const request: CreatePodmiotRequest | UpdatePodmiotRequest = {
      kodUKNF: formValue.kodUKNF,
      nazwa: formValue.nazwa,
      typPodmiotu: formValue.typPodmiotu,
      nip: formValue.nip || undefined,
      regon: formValue.regon || undefined,
      krs: formValue.krs || undefined,
      email: formValue.email || undefined,
      telefon: formValue.telefon || undefined,
      adres: formValue.adres || undefined,
      miasto: formValue.miasto || undefined,
      kodPocztowy: formValue.kodPocztowy || undefined,
      status: formValue.status,
      dataRejestracjiUKNF: formValue.dataRejestracjiUKNF,
      dataZawieszenia: formValue.dataZawieszenia || undefined,
      uwagi: formValue.uwagi || undefined
    };

    const operation = this.isEditMode && this.podmiotId
      ? this.podmiotyService.updatePodmiot(this.podmiotId, request as UpdatePodmiotRequest)
      : this.podmiotyService.createPodmiot(request);

    operation.subscribe({
      next: () => {
        this.saving = false;
        this.close(true);
      },
      error: (error) => {
        console.error('Error saving podmiot:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: error.error?.message || 'Nie udało się zapisać podmiotu'
        });
        this.saving = false;
      }
    });
  }

  onCancel(): void {
    this.close(false);
  }

  close(saved: boolean): void {
    this.onClose.emit(saved);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.podmiotForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.podmiotForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'To pole jest wymagane';
    if (field.errors['maxlength']) return `Maksymalna długość to ${field.errors['maxlength'].requiredLength} znaków`;
    if (field.errors['email']) return 'Nieprawidłowy format email';

    return 'Nieprawidłowa wartość';
  }
}

// File: Frontend/src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  success(message: string, title: string = 'Sukces'): void {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: 5000
    });
  }

  error(message: string, title: string = 'Błąd'): void {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: 7000
    });
  }

  warning(message: string, title: string = 'Ostrzeżenie'): void {
    this.messageService.add({
      severity: 'warn',
      summary: title,
      detail: message,
      life: 6000
    });
  }

  info(message: string, title: string = 'Informacja'): void {
    this.messageService.add({
      severity: 'info',
      summary: title,
      detail: message,
      life: 5000
    });
  }

  clear(): void {
    this.messageService.clear();
  }
}

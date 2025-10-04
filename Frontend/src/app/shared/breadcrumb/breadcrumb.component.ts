// File: Frontend/src/app/shared/breadcrumb/breadcrumb.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav aria-label="Breadcrumb" class="breadcrumb-container" *ngIf="breadcrumbService.breadcrumbs().length > 0">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item">
          <a routerLink="/" class="breadcrumb-link">
            <i class="pi pi-home" aria-hidden="true"></i>
            <span class="sr-only">Strona główna</span>
          </a>
        </li>
        <li *ngFor="let breadcrumb of breadcrumbService.breadcrumbs(); let last = last" class="breadcrumb-item">
          <span class="breadcrumb-separator" aria-hidden="true">/</span>
          <a *ngIf="breadcrumb.url && !last" 
             [routerLink]="breadcrumb.url" 
             class="breadcrumb-link">
            <i *ngIf="breadcrumb.icon" [class]="'pi ' + breadcrumb.icon" aria-hidden="true"></i>
            {{ breadcrumb.label }}
          </a>
          <span *ngIf="!breadcrumb.url || last" class="breadcrumb-current" aria-current="page">
            <i *ngIf="breadcrumb.icon" [class]="'pi ' + breadcrumb.icon" aria-hidden="true"></i>
            {{ breadcrumb.label }}
          </span>
        </li>
      </ol>
    </nav>
  `,
  styles: [`
    .breadcrumb-container {
      background: #f8f9fa;
      padding: 0.75rem 1.5rem;
      border-bottom: 1px solid #dee2e6;
    }

    .breadcrumb-list {
      list-style: none;
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .breadcrumb-separator {
      color: #6c757d;
      margin: 0 0.25rem;
    }

    .breadcrumb-link {
      color: #1976d2;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .breadcrumb-link:hover {
      background: rgba(25, 118, 210, 0.1);
      color: #1565c0;
    }

    .breadcrumb-link:focus-visible {
      outline: 2px solid #1976d2;
      outline-offset: 2px;
    }

    .breadcrumb-current {
      color: #495057;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }

    @media (max-width: 768px) {
      .breadcrumb-container {
        padding: 0.5rem 1rem;
      }
      
      .breadcrumb-item {
        font-size: 0.8125rem;
      }
    }
  `]
})
export class BreadcrumbComponent {
  breadcrumbService = inject(BreadcrumbService);
}

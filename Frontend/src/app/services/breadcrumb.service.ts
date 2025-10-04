// File: Frontend/src/app/services/breadcrumb.service.ts
import { Injectable, signal } from '@angular/core';

export interface Breadcrumb {
  label: string;
  url?: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSignal = signal<Breadcrumb[]>([]);
  public breadcrumbs = this.breadcrumbsSignal.asReadonly();

  setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this.breadcrumbsSignal.set(breadcrumbs);
  }

  addBreadcrumb(breadcrumb: Breadcrumb): void {
    this.breadcrumbsSignal.update(crumbs => [...crumbs, breadcrumb]);
  }

  clear(): void {
    this.breadcrumbsSignal.set([]);
  }
}

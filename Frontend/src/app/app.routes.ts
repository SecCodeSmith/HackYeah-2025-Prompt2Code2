import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./components/report-dashboard/report-dashboard.component').then(m => m.ReportDashboardComponent)
  }
];

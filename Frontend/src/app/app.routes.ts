import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'messaging/inbox',
    loadComponent: () => import('./pages/messaging/inbox.component').then(m => m.InboxComponent),
    canActivate: [authGuard]
  },
  {
    path: 'messaging/sent',
    loadComponent: () => import('./pages/messaging/sent-messages.component').then(m => m.SentMessagesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'messaging/compose',
    loadComponent: () => import('./pages/messaging/compose-message.component').then(m => m.ComposeMessageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'messaging/thread/:id',
    loadComponent: () => import('./pages/messaging/message-thread.component').then(m => m.MessageThreadComponent),
    canActivate: [authGuard]
  },
  {
    path: 'messaging',
    redirectTo: 'messaging/inbox',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

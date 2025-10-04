// File: Frontend/src/app/shared/header/header.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    BadgeModule,
    MenuModule,
    AvatarModule,
    OverlayPanelModule
  ],
  template: `
    <header class="app-header" role="banner">
      <div class="header-container">
        <!-- Logo and Title -->
        <div class="header-logo">
          <a routerLink="/" class="logo-link" aria-label="Powrót do strony głównej">
            <i class="pi pi-shield" aria-hidden="true"></i>
            <span class="logo-text">UKNF Portal</span>
          </a>
        </div>

        <!-- Main Navigation -->
        <nav class="header-nav" role="navigation" aria-label="Główna nawigacja" *ngIf="isAuthenticated()">
          <a routerLink="/dashboard" 
             routerLinkActive="active" 
             class="nav-link"
             aria-label="Pulpit">
            <i class="pi pi-home" aria-hidden="true"></i>
            <span>Pulpit</span>
          </a>
          <a routerLink="/reports" 
             routerLinkActive="active" 
             class="nav-link"
             aria-label="Raporty">
            <i class="pi pi-file-edit" aria-hidden="true"></i>
            <span>Raporty</span>
          </a>
          <a routerLink="/announcements" 
             routerLinkActive="active" 
             class="nav-link"
             aria-label="Ogłoszenia">
            <i class="pi pi-megaphone" aria-hidden="true"></i>
            <span>Ogłoszenia</span>
          </a>
          <a *ngIf="isAdmin() || isSupervisor()" 
             routerLink="/admin" 
             routerLinkActive="active" 
             class="nav-link"
             aria-label="Panel administratora">
            <i class="pi pi-users" aria-hidden="true"></i>
            <span>Administracja</span>
          </a>
        </nav>

        <!-- Right Side Actions -->
        <div class="header-actions" *ngIf="isAuthenticated()">
          <!-- Notification Bell -->
          <button 
            type="button"
            class="icon-button"
            aria-label="Powiadomienia ({{ unreadCount() }} nieprzeczytanych)"
            (click)="notificationPanel.toggle($event)"
            [pBadge]="unreadCount().toString()"
            [badgeDisabled]="unreadCount() === 0"
            severity="danger">
            <i class="pi pi-bell text-xl" aria-hidden="true"></i>
          </button>

          <!-- User Menu -->
          <button 
            type="button"
            class="user-button"
            aria-label="Menu użytkownika"
            (click)="userMenu.toggle($event)">
            <p-avatar 
              [label]="getUserInitials()" 
              styleClass="mr-2" 
              size="normal"
              shape="circle"
              [style]="{'background-color': '#1976d2', 'color': '#ffffff'}"
              aria-hidden="true">
            </p-avatar>
            <span class="user-name">{{ getUserName() }}</span>
            <i class="pi pi-angle-down ml-2" aria-hidden="true"></i>
          </button>

          <!-- User Menu Overlay -->
          <p-overlayPanel #userMenu>
            <div class="user-menu-panel">
              <div class="user-info">
                <p-avatar 
                  [label]="getUserInitials()" 
                  size="large"
                  shape="circle"
                  [style]="{'background-color': '#1976d2', 'color': '#ffffff'}">
                </p-avatar>
                <div class="user-details">
                  <div class="user-name-large">{{ getUserName() }}</div>
                  <div class="user-role">{{ getUserRole() }}</div>
                </div>
              </div>
              <div class="menu-divider"></div>
              <ul class="menu-items">
                <li>
                  <button class="menu-item-button" (click)="navigateToProfile(); userMenu.hide()">
                    <i class="pi pi-user"></i>
                    <span>Mój profil</span>
                  </button>
                </li>
                <li>
                  <button class="menu-item-button" (click)="logout(); userMenu.hide()">
                    <i class="pi pi-sign-out"></i>
                    <span>Wyloguj</span>
                  </button>
                </li>
              </ul>
            </div>
          </p-overlayPanel>

          <!-- Notifications Overlay -->
          <p-overlayPanel #notificationPanel [style]="{'width': '400px'}">
            <div class="notifications-panel">
              <div class="panel-header">
                <h3>Powiadomienia</h3>
                <button class="text-button" (click)="markAllAsRead()">Oznacz wszystkie jako przeczytane</button>
              </div>
              <div class="notifications-list" *ngIf="notifications().length > 0">
                <div *ngFor="let notification of notifications()" 
                     class="notification-item"
                     [class.unread]="!notification.read"
                     (click)="markAsRead(notification)">
                  <div class="notification-icon" [class]="'severity-' + notification.severity">
                    <i [class]="'pi ' + notification.icon"></i>
                  </div>
                  <div class="notification-content">
                    <div class="notification-title">{{ notification.title }}</div>
                    <div class="notification-message">{{ notification.message }}</div>
                    <div class="notification-time">{{ notification.time }}</div>
                  </div>
                </div>
              </div>
              <div *ngIf="notifications().length === 0" class="no-notifications">
                <i class="pi pi-bell-slash"></i>
                <p>Brak powiadomień</p>
              </div>
            </div>
          </p-overlayPanel>
        </div>

        <!-- Login Button for Unauthenticated Users -->
        <div class="header-actions" *ngIf="!isAuthenticated()">
          <p-button 
            label="Zaloguj się" 
            icon="pi pi-sign-in"
            [routerLink]="['/auth/login']"
            aria-label="Przejdź do strony logowania">
          </p-button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .header-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      gap: 2rem;
      min-height: 64px;
    }

    .header-logo {
      flex-shrink: 0;
    }

    .logo-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: white;
      text-decoration: none;
      font-size: 1.25rem;
      font-weight: 600;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .logo-link:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .logo-link:focus-visible {
      outline: 2px solid white;
      outline-offset: 2px;
    }

    .logo-link i {
      font-size: 1.75rem;
    }

    .logo-text {
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .header-nav {
      flex: 1;
      display: flex;
      gap: 0.5rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.2s;
      position: relative;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.15);
      color: white;
    }

    .nav-link:focus-visible {
      outline: 2px solid white;
      outline-offset: 2px;
    }

    .nav-link.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 1rem;
      right: 1rem;
      height: 2px;
      background: white;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .icon-button {
      position: relative;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .icon-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }

    .icon-button:focus-visible {
      outline: 2px solid white;
      outline-offset: 2px;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
      padding: 0.375rem 1rem 0.375rem 0.375rem;
      border-radius: 24px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .user-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .user-button:focus-visible {
      outline: 2px solid white;
      outline-offset: 2px;
    }

    .user-name {
      font-size: 0.9375rem;
    }

    .user-menu-panel {
      padding: 1rem;
      min-width: 280px;
    }

    .user-info {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
    }

    .user-details {
      flex: 1;
    }

    .user-name-large {
      font-weight: 600;
      font-size: 1.0625rem;
      color: #212529;
      margin-bottom: 0.25rem;
    }

    .user-role {
      font-size: 0.875rem;
      color: #6c757d;
    }

    .menu-divider {
      height: 1px;
      background: #dee2e6;
      margin: 1rem -1rem;
    }

    .menu-items {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .menu-item-button {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9375rem;
      color: #495057;
      transition: all 0.2s;
      text-align: left;
    }

    .menu-item-button:hover {
      background: #f8f9fa;
      color: #1976d2;
    }

    .menu-item-button:focus-visible {
      outline: 2px solid #1976d2;
      outline-offset: -2px;
    }

    .menu-item-button i {
      font-size: 1.125rem;
    }

    .notifications-panel {
      width: 100%;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .panel-header h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #212529;
    }

    .text-button {
      background: none;
      border: none;
      color: #1976d2;
      font-size: 0.8125rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .text-button:hover {
      background: rgba(25, 118, 210, 0.1);
    }

    .notifications-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .notification-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      border-left: 3px solid transparent;
    }

    .notification-item:hover {
      background: #f8f9fa;
    }

    .notification-item.unread {
      background: #e3f2fd;
      border-left-color: #1976d2;
    }

    .notification-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .notification-icon.severity-high {
      background: #ffebee;
      color: #c62828;
    }

    .notification-icon.severity-medium {
      background: #fff3e0;
      color: #ef6c00;
    }

    .notification-icon.severity-low {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .notification-content {
      flex: 1;
    }

    .notification-title {
      font-weight: 600;
      color: #212529;
      margin-bottom: 0.25rem;
    }

    .notification-message {
      font-size: 0.875rem;
      color: #6c757d;
      margin-bottom: 0.5rem;
    }

    .notification-time {
      font-size: 0.75rem;
      color: #adb5bd;
    }

    .no-notifications {
      text-align: center;
      padding: 3rem 1rem;
      color: #6c757d;
    }

    .no-notifications i {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .no-notifications p {
      margin: 0;
      font-size: 0.9375rem;
    }

    @media (max-width: 1024px) {
      .header-nav {
        gap: 0.25rem;
      }

      .nav-link {
        padding: 0.5rem 0.75rem;
      }

      .nav-link span {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .header-container {
        padding: 0 1rem;
        gap: 1rem;
      }

      .logo-text {
        display: none;
      }

      .user-name {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated = signal(false);
  unreadCount = signal(3); // This would come from a notifications service
  notifications = signal([
    {
      id: 1,
      title: 'Nowe ogłoszenie',
      message: 'Dostępne jest nowe ogłoszenie wymagające uwagi',
      time: '5 minut temu',
      read: false,
      severity: 'high',
      icon: 'pi-megaphone'
    },
    {
      id: 2,
      title: 'Raport zatwierdzony',
      message: 'Twój raport #2024-003 został zatwierdzony',
      time: '2 godziny temu',
      read: false,
      severity: 'medium',
      icon: 'pi-check-circle'
    },
    {
      id: 3,
      title: 'Przypomnienie',
      message: 'Zbliża się termin przesłania raportu miesięcznego',
      time: '1 dzień temu',
      read: false,
      severity: 'low',
      icon: 'pi-clock'
    }
  ]);

  ngOnInit(): void {
    // Check authentication status
    this.isAuthenticated.set(this.authService.isAuthenticated());
  }

  getUserName(): string {
    return this.authService.getUserFullName() || 'Użytkownik';
  }

  getUserInitials(): string {
    return this.authService.getUserInitials();
  }

  getUserRole(): string {
    const user = this.authService.getCurrentUserSync();
    if (!user) return '';
    
    const roleMap: { [key: string]: string } = {
      'Administrator': 'Administrator',
      'Supervisor': 'Supervisor',
      'User': 'Użytkownik'
    };
    
    return roleMap[user.role] || user.role;
  }

  isAdmin(): boolean {
    return this.authService.hasRole('Administrator');
  }

  isSupervisor(): boolean {
    return this.authService.hasRole('Supervisor');
  }

  markAsRead(notification: any): void {
    notification.read = true;
    this.unreadCount.update(count => Math.max(0, count - 1));
  }

  markAllAsRead(): void {
    this.notifications.update(notifs => 
      notifs.map(n => ({ ...n, read: true }))
    );
    this.unreadCount.set(0);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

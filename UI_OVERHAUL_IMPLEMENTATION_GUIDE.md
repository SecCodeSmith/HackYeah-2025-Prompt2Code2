# UI Overhaul Implementation Guide
## UKNF Communication Platform - Complete Frontend Polish

This document contains all the code changes needed to complete the UI overhaul. Implement these in order.

---

## ✅ COMPLETED TASKS

### Task 1.1-1.3: Global Services Created
- ✅ LoadingService (`services/loading.service.ts`)
- ✅ NotificationService (`services/notification.service.ts`)
- ✅ LoadingInterceptor (`interceptors/loading.interceptor.ts`)

### Task 1.4: App Component Updated
- ✅ Added global loading spinner
- ✅ Added global toast notifications
- ✅ Updated app.component.ts, .html, .css

### Task 1.5: App Config Updated
- ✅ Added animations provider
- ✅ Registered loading interceptor

### Task 2.1-2.2: Breadcrumb System
- ✅ BreadcrumbService (`services/breadcrumb.service.ts`)
- ✅ BreadcrumbComponent (`shared/breadcrumb/breadcrumb.component.ts`)

### Task 2.3: Header Component Started
- ✅ Created comprehensive header with navigation (`shared/header/header.component.ts`)
- ⚠️ **NEEDS FIX**: Auth service integration (see below)

---

## 🔧 CRITICAL FIXES NEEDED

### Fix 1: Update AuthService with Helper Methods

**File**: `Frontend/src/app/services/auth.service.ts`

Add these methods to the AuthService class:

```typescript
/**
 * Get current user synchronously from signal
 */
getCurrentUserSync(): UserDto | null {
  return this.currentUser();
}

/**
 * Check if user has specific role
 */
hasRole(role: string): boolean {
  const user = this.currentUser();
  return user ? user.role === role : false;
}

/**
 * Check if user has any of the specified roles
 */
hasAnyRole(roles: string[]): boolean {
  const user = this.currentUser();
  return user ? roles.includes(user.role) : false;
}

/**
 * Get user's full name
 */
getUserFullName(): string {
  const user = this.currentUser();
  return user ? `${user.firstName} ${user.lastName}` : '';
}

/**
 * Get user's initials
 */
getUserInitials(): string {
  const user = this.currentUser();
  if (user && user.firstName && user.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
  return 'U';
}
```

### Fix 2: Update Header Component to Use Signals

**File**: `Frontend/src/app/shared/header/header.component.ts`

Replace the user-related methods with:

```typescript
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
```

---

## 📋 REMAINING TASKS TO IMPLEMENT

### Task 3.1: Complete Announcements UI

**File**: `Frontend/src/app/pages/announcements/announcements.component.ts`

```typescript
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { NotificationService } from '../../services/notification.service';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  publishedAt: Date;
  author: string;
}

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    ButtonModule,
    SkeletonModule
  ],
  template: `
    <div class="announcements-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="pi pi-megaphone" aria-hidden="true"></i>
            Ogłoszenia
          </h1>
          <p class="page-subtitle">Ważne komunikaty i informacje od UKNF</p>
        </div>
      </div>

      <div class="announcements-grid" *ngIf="!loading(); else loadingSkeleton">
        <div *ngFor="let announcement of announcements()" class="announcement-card-wrapper">
          <p-card>
            <ng-template pTemplate="header">
              <div class="card-header">
                <div class="priority-indicator" [class]="'priority-' + announcement.priority">
                  <i [class]="getPriorityIcon(announcement.priority)" aria-hidden="true"></i>
                </div>
                <p-tag 
                  [value]="getPriorityLabel(announcement.priority)"
                  [severity]="getPrioritySeverity(announcement.priority)">
                </p-tag>
              </div>
            </ng-template>
            
            <h2 class="announcement-title">{{ announcement.title }}</h2>
            
            <div class="announcement-meta">
              <span class="meta-item">
                <i class="pi pi-calendar" aria-hidden="true"></i>
                {{ formatDate(announcement.publishedAt) }}
              </span>
              <span class="meta-item">
                <i class="pi pi-user" aria-hidden="true"></i>
                {{ announcement.author }}
              </span>
            </div>

            <p class="announcement-content">
              {{ getContentSnippet(announcement.content) }}
            </p>

            <ng-template pTemplate="footer">
              <div class="card-actions">
                <p-button 
                  label="Czytaj więcej"
                  icon="pi pi-arrow-right"
                  [text]="true"
                  (onClick)="viewAnnouncement(announcement)"
                  aria-label="Czytaj więcej o: {{ announcement.title }}">
                </p-button>
              </div>
            </ng-template>
          </p-card>
        </div>
      </div>

      <ng-template #loadingSkeleton>
        <div class="announcements-grid">
          <div *ngFor="let item of [1,2,3,4]" class="announcement-card-wrapper">
            <p-card>
              <div class="skeleton-content">
                <p-skeleton width="100%" height="2rem" styleClass="mb-3"></p-skeleton>
                <p-skeleton width="100%" height="6rem" styleClass="mb-2"></p-skeleton>
                <p-skeleton width="60%"></p-skeleton>
              </div>
            </p-card>
          </div>
        </div>
      </ng-template>

      <div *ngIf="!loading() && announcements().length === 0" class="empty-state">
        <i class="pi pi-inbox"></i>
        <h3>Brak ogłoszeń</h3>
        <p>Aktualnie nie ma żadnych aktywnych ogłoszeń.</p>
      </div>
    </div>
  `,
  styles: [`
    .announcements-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: #212529;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .page-title i {
      color: #1976d2;
    }

    .page-subtitle {
      font-size: 1rem;
      color: #6c757d;
      margin: 0;
    }

    .announcements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .announcement-card-wrapper {
      height: 100%;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #dee2e6;
    }

    .priority-indicator {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .priority-indicator.priority-high {
      background: #ffebee;
      color: #c62828;
    }

    .priority-indicator.priority-medium {
      background: #fff3e0;
      color: #ef6c00;
    }

    .priority-indicator.priority-low {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .announcement-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #212529;
      margin: 0 0 1rem 0;
      line-height: 1.4;
    }

    .announcement-meta {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #6c757d;
    }

    .announcement-content {
      color: #495057;
      line-height: 1.6;
      margin: 0;
    }

    .card-actions {
      display: flex;
      justify-content: flex-end;
    }

    .skeleton-content {
      padding: 1rem 0;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6c757d;
    }

    .empty-state i {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      margin: 0;
    }

    @media (max-width: 768px) {
      .announcements-container {
        padding: 1rem;
      }

      .announcements-grid {
        grid-template-columns: 1fr;
      }

      .page-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class AnnouncementsComponent implements OnInit {
  private breadcrumbService = inject(BreadcrumbService);
  private notificationService = inject(NotificationService);

  loading = signal(true);
  announcements = signal<Announcement[]>([
    {
      id: '1',
      title: 'Nowe wymogi raportowania dla instytucji finansowych',
      content: 'Informujemy o wprowadzeniu nowych wymogów dotyczących raportowania danych finansowych. Wszystkie instytucje zobowiązane są do dostosowania swoich systemów do nowych standardów do końca bieżącego kwartału. Szczegółowe wytyczne dostępne są w sekcji dokumentacji.',
      priority: 'high',
      publishedAt: new Date('2025-10-01'),
      author: 'Urząd Komisji Nadzoru Finansowego'
    },
    {
      id: '2',
      title: 'Harmonogram prac konserwacyjnych systemu',
      content: 'Planowane prace konserwacyjne systemu odbędą się w najbliższą sobotę w godzinach 02:00-06:00. W tym czasie system może być niedostępny. Prosimy o planowanie działań z uwzględnieniem tego okresu.',
      priority: 'medium',
      publishedAt: new Date('2025-09-28'),
      author: 'Zespół Techniczny UKNF'
    },
    {
      id: '3',
      title: 'Przypomnienie o terminie składania raportów kwartalnych',
      content: 'Przypominamy, że termin składania raportów kwartalnych za III kwartał 2025 upływa 15 października. Raporty złożone po terminie będą podlegały procedurze sankcyjnej zgodnie z obowiązującymi przepisami.',
      priority: 'high',
      publishedAt: new Date('2025-09-25'),
      author: 'Departament Nadzoru'
    },
    {
      id: '4',
      title: 'Aktualizacja dokumentacji technicznej',
      content: 'Zaktualizowaliśmy dokumentację techniczną API. Nowa wersja zawiera opis dodatkowych punktów końcowych oraz ulepszone przykłady integracji. Zachęcamy do zapoznania się z nową dokumentacją.',
      priority: 'low',
      publishedAt: new Date('2025-09-20'),
      author: 'Zespół Rozwoju'
    }
  ]);

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Ogłoszenia', icon: 'pi-megaphone' }
    ]);

    // Simulate loading
    setTimeout(() => {
      this.loading.set(false);
    }, 1000);
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      'high': 'Wysoki priorytet',
      'medium': 'Średni priorytet',
      'low': 'Niski priorytet'
    };
    return labels[priority] || priority;
  }

  getPrioritySeverity(priority: string): 'success' | 'info' | 'warn' | 'danger' {
    const severities: { [key: string]: 'success' | 'info' | 'warn' | 'danger' } = {
      'high': 'danger',
      'medium': 'warn',
      'low': 'info'
    };
    return severities[priority] || 'info';
  }

  getPriorityIcon(priority: string): string {
    const icons: { [key: string]: string } = {
      'high': 'pi pi-exclamation-triangle',
      'medium': 'pi pi-info-circle',
      'low': 'pi pi-check-circle'
    };
    return icons[priority] || 'pi pi-info-circle';
  }

  getContentSnippet(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  viewAnnouncement(announcement: Announcement): void {
    this.notificationService.info(
      `Otwieranie ogłoszenia: ${announcement.title}`,
      'Ogłoszenie'
    );
    // Navigate to detail view or open dialog
  }
}
```

### Task 3.2: Update Home Component with Dashboard

**File**: `Frontend/src/app/pages/home/home.component.ts`

```typescript
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { BreadcrumbService } from '../../services/breadcrumb.service';

interface DashboardTile {
  title: string;
  value: number;
  icon: string;
  color: string;
  route: string;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ChartModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="welcome-section">
        <h1 class="welcome-title">Witaj w Portalu UKNF</h1>
        <p class="welcome-subtitle">Zarządzaj raportami i monitoruj komunikację z Urzędem</p>
      </div>

      <!-- Statistics Tiles -->
      <div class="tiles-grid">
        <div *ngFor="let tile of tiles()" 
             class="stat-tile"
             [style.border-left-color]="tile.color"
             (click)="navigateTo(tile.route)"
             role="button"
             tabindex="0"
             [attr.aria-label]="tile.title + ': ' + tile.value">
          <div class="tile-content">
            <div class="tile-header">
              <div class="tile-icon" [style.background-color]="tile.color + '20'" [style.color]="tile.color">
                <i [class]="'pi ' + tile.icon" aria-hidden="true"></i>
              </div>
              <div class="tile-change" *ngIf="tile.change">
                <i [class]="tile.change.trend === 'up' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
                   [style.color]="tile.change.trend === 'up' ? '#2e7d32' : '#c62828'"></i>
                <span>{{ tile.change.value }}%</span>
              </div>
            </div>
            <div class="tile-value">{{ tile.value }}</div>
            <div class="tile-title">{{ tile.title }}</div>
          </div>
          <div class="tile-action">
            <i class="pi pi-arrow-right"></i>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <h2 class="section-title">Szybkie akcje</h2>
        <div class="actions-grid">
          <p-card *ngFor="let action of quickActions" 
                  class="action-card"
                  (click)="performAction(action)">
            <div class="action-content">
              <div class="action-icon" [style.background-color]="action.color + '20'">
                <i [class]="'pi ' + action.icon" [style.color]="action.color" aria-hidden="true"></i>
              </div>
              <h3 class="action-title">{{ action.title }}</h3>
              <p class="action-description">{{ action.description }}</p>
            </div>
          </p-card>
        </div>
      </div>

      <!-- Recent Activity (placeholder) -->
      <div class="activity-section">
        <h2 class="section-title">Ostatnia aktywność</h2>
        <p-card>
          <div class="activity-list">
            <div *ngFor="let activity of recentActivity" class="activity-item">
              <div class="activity-icon" [class]="'type-' + activity.type">
                <i [class]="'pi ' + activity.icon"></i>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .welcome-section {
      margin-bottom: 2rem;
    }

    .welcome-title {
      font-size: 2.25rem;
      font-weight: 700;
      color: #212529;
      margin: 0 0 0.5rem 0;
    }

    .welcome-subtitle {
      font-size: 1.125rem;
      color: #6c757d;
      margin: 0;
    }

    .tiles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-tile {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      border-left: 4px solid;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-tile:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .stat-tile:focus-visible {
      outline: 2px solid #1976d2;
      outline-offset: 2px;
    }

    .tile-content {
      flex: 1;
    }

    .tile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .tile-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .tile-change {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .tile-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #212529;
      line-height: 1;
      margin-bottom: 0.5rem;
    }

    .tile-title {
      font-size: 0.9375rem;
      color: #6c757d;
      font-weight: 500;
    }

    .tile-action {
      color: #adb5bd;
      font-size: 1.25rem;
      margin-left: 1rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #212529;
      margin: 0 0 1.5rem 0;
    }

    .quick-actions-section {
      margin-bottom: 3rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    .action-card {
      cursor: pointer;
      transition: all 0.3s;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .action-content {
      text-align: center;
    }

    .action-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin: 0 auto 1rem;
    }

    .action-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #212529;
      margin: 0 0 0.5rem 0;
    }

    .action-description {
      font-size: 0.875rem;
      color: #6c757d;
      margin: 0;
    }

    .activity-section {
      margin-bottom: 2rem;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      padding: 0.75rem;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .activity-item:hover {
      background: #f8f9fa;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .activity-icon.type-report {
      background: #e3f2fd;
      color: #1976d2;
    }

    .activity-icon.type-announcement {
      background: #fff3e0;
      color: #ef6c00;
    }

    .activity-icon.type-approval {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .activity-content {
      flex: 1;
    }

    .activity-title {
      font-weight: 500;
      color: #212529;
      margin-bottom: 0.25rem;
    }

    .activity-time {
      font-size: 0.875rem;
      color: #6c757d;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .welcome-title {
        font-size: 1.75rem;
      }

      .tiles-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private breadcrumbService = inject(BreadcrumbService);
  private router = inject(Router);

  tiles = signal<DashboardTile[]>([
    {
      title: 'Nowe wiadomości',
      value: 5,
      icon: 'pi-envelope',
      color: '#1976d2',
      route: '/reports',
      change: { value: 12, trend: 'up' }
    },
    {
      title: 'Raporty oczekujące',
      value: 8,
      icon: 'pi-file-edit',
      color: '#ef6c00',
      route: '/reports',
      change: { value: 5, trend: 'down' }
    },
    {
      title: 'Zatwierdzone raporty',
      value: 24,
      icon: 'pi-check-circle',
      color: '#2e7d32',
      route: '/reports'
    },
    {
      title: 'Ogłoszenia',
      value: 3,
      icon: 'pi-megaphone',
      color: '#9c27b0',
      route: '/announcements',
      change: { value: 1, trend: 'up' }
    }
  ]);

  quickActions = [
    {
      title: 'Nowy raport',
      description: 'Utwórz nowy raport komunikacji',
      icon: 'pi-plus-circle',
      color: '#1976d2',
      action: 'create-report'
    },
    {
      title: 'Moje raporty',
      description: 'Przeglądaj swoje raporty',
      icon: 'pi-folder',
      color: '#ef6c00',
      action: 'view-reports'
    },
    {
      title: 'Ogłoszenia',
      description: 'Zobacz aktywne ogłoszenia',
      icon: 'pi-megaphone',
      color: '#9c27b0',
      action: 'view-announcements'
    }
  ];

  recentActivity = [
    {
      type: 'report',
      title: 'Raport #2024-005 został przesłany',
      time: '2 godziny temu',
      icon: 'pi-file-edit'
    },
    {
      type: 'announcement',
      title: 'Nowe ogłoszenie: Wymogi raportowania',
      time: '5 godzin temu',
      icon: 'pi-megaphone'
    },
    {
      type: 'approval',
      title: 'Raport #2024-004 został zatwierdzony',
      time: '1 dzień temu',
      icon: 'pi-check-circle'
    }
  ];

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Pulpit', icon: 'pi-home' }
    ]);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  performAction(action: any): void {
    switch (action.action) {
      case 'create-report':
        this.router.navigate(['/reports']);
        break;
      case 'view-reports':
        this.router.navigate(['/reports']);
        break;
      case 'view-announcements':
        this.router.navigate(['/announcements']);
        break;
    }
  }
}
```

---

## 🎨 FINAL STYLING TASKS

### Task 4.1: Global Styles with High-Contrast Mode

**File**: `Frontend/src/styles.css`

Add at the end of the file:

```css
/* ========================================
   GLOBAL TYPOGRAPHY & SPACING
   ======================================== */

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Consistent heading styles */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.2;
  margin-top: 0;
}

h1 { font-size: 2.25rem; }
h2 { font-size: 1.875rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; }
h5 { font-size: 1.125rem; }
h6 { font-size: 1rem; }

/* ========================================
   ACCESSIBILITY IMPROVEMENTS
   ======================================== */

/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #1976d2;
  color: white;
  padding: 0.5rem 1rem;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

/* Screen reader only content */
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

/* Focus indicators for all interactive elements */
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
  border-radius: 4px;
}

/* ========================================
   PRIMENG THEME CUSTOMIZATION
   ======================================== */

/* Consistent button styling */
.p-button {
  font-weight: 500;
  transition: all 0.2s ease;
}

.p-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Card styling */
.p-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.p-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* Table styling */
.p-datatable .p-datatable-thead > tr > th {
  background: #f8f9fa;
  font-weight: 600;
  color: #212529;
  border-bottom: 2px solid #dee2e6;
}

.p-datatable .p-datatable-tbody > tr:hover {
  background: #f8f9fa;
}

/* Toast positioning */
.p-toast {
  z-index: 99999;
}

/* ========================================
   HIGH CONTRAST MODE
   ======================================== */

body.high-contrast {
  --primary-color: #0066CC;
  --text-color: #000000;
  --surface-0: #FFFFFF;
  --surface-50: #FAFAFA;
  --surface-100: #F5F5F5;
  --surface-200: #EEEEEE;
  --surface-border: #000000;
}

body.high-contrast * {
  border-color: #000000 !important;
}

body.high-contrast a {
  color: #0066CC;
  text-decoration: underline;
  font-weight: 600;
}

body.high-contrast button,
body.high-contrast .p-button {
  border: 2px solid #000000 !important;
  font-weight: 600;
}

body.high-contrast .p-card {
  border: 2px solid #000000;
}

body.high-contrast input,
body.high-contrast select,
body.high-contrast textarea {
  border: 2px solid #000000 !important;
}

/* ========================================
   RESPONSIVE UTILITIES
   ======================================== */

@media (max-width: 768px) {
  h1 { font-size: 1.75rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.25rem; }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    background: white;
  }
}
```

### Task 4.2: High-Contrast Toggle Component

**File**: `Frontend/src/app/shared/high-contrast-toggle/high-contrast-toggle.component.ts`

```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-high-contrast-toggle',
  standalone: true,
  imports: [CommonModule, InputSwitchModule, FormsModule],
  template: `
    <div class="contrast-toggle">
      <label for="high-contrast-switch" class="toggle-label">
        <i class="pi pi-eye" aria-hidden="true"></i>
        <span>Wysoki kontrast</span>
      </label>
      <p-inputSwitch 
        inputId="high-contrast-switch"
        [(ngModel)]="highContrast"
        (onChange)="toggleHighContrast()"
        ariaLabel="Przełącz tryb wysokiego kontrastu">
      </p-inputSwitch>
    </div>
  `,
  styles: [`
    .contrast-toggle {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
    }

    .toggle-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: white;
      cursor: pointer;
    }

    .toggle-label:hover {
      color: rgba(255, 255, 255, 0.9);
    }
  `]
})
export class HighContrastToggleComponent {
  highContrast = signal(false);

  constructor() {
    // Check if high contrast was previously enabled
    const saved = localStorage.getItem('high-contrast');
    if (saved === 'true') {
      this.highContrast.set(true);
      document.body.classList.add('high-contrast');
    }
  }

  toggleHighContrast(): void {
    if (this.highContrast()) {
      document.body.classList.add('high-contrast');
      localStorage.setItem('high-contrast', 'true');
    } else {
      document.body.classList.remove('high-contrast');
      localStorage.setItem('high-contrast', 'false');
    }
  }
}
```

---

## 📦 INTEGRATION CHECKLIST

After implementing all the above code:

1. **Update Header Component** in main layout
2. **Add Breadcrumb Component** below header
3. **Wire up Announcements route** in app.routes.ts
4. **Add High-Contrast Toggle** to header component
5. **Test all accessibility features**:
   - Tab navigation
   - Screen reader compatibility
   - High contrast mode
   - Focus indicators
6. **Test responsive layouts** on mobile/tablet
7. **Verify loading states** work correctly
8. **Test notification toasts** for all scenarios

---

## 🚀 DEPLOYMENT NOTES

Before production:
- Replace mock data with real API calls
- Test with actual user accounts
- Verify all ARIA labels are correct
- Run accessibility audit (Lighthouse, axe DevTools)
- Test keyboard-only navigation
- Verify color contrast ratios (WCAG 2.2 AA)

---

**Document Version**: 1.0  
**Last Updated**: October 4, 2025  
**Status**: Implementation Guide Ready

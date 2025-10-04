import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { AuthService } from '../../services/auth.service';

interface DashboardTile {
  title: string;
  value: number;
  icon: string;
  color: string;
  description: string;
  route?: string;
}

interface RecentActivity {
  id: number;
  title: string;
  description: string;
  timestamp: Date;
  type: 'report' | 'announcement' | 'update';
  icon: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ChartModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  authService = inject(AuthService);
  
  currentUser = this.authService.currentUser;
  
  // Dashboard statistics
  dashboardTiles = signal<DashboardTile[]>([
    {
      title: 'Nowe zgłoszenia',
      value: 12,
      icon: 'pi pi-file-edit',
      color: '#3B82F6',
      description: 'Oczekujące na rozpatrzenie',
      route: '/reports'
    },
    {
      title: 'W trakcie realizacji',
      value: 8,
      icon: 'pi pi-clock',
      color: '#F59E0B',
      description: 'Sprawy w toku',
      route: '/reports'
    },
    {
      title: 'Zakończone',
      value: 45,
      icon: 'pi pi-check-circle',
      color: '#10B981',
      description: 'W tym miesiącu',
      route: '/reports'
    },
    {
      title: 'Powiadomienia',
      value: 3,
      icon: 'pi pi-bell',
      color: '#EF4444',
      description: 'Wymagają uwagi',
      route: '/notifications'
    }
  ]);
  
  // Recent activity feed
  recentActivities = signal<RecentActivity[]>([
    {
      id: 1,
      title: 'Nowe zgłoszenie #1234',
      description: 'Zgłoszenie naruszenia przepisów bankowych',
      timestamp: new Date(Date.now() - 3600000),
      type: 'report',
      icon: 'pi pi-file-edit'
    },
    {
      id: 2,
      title: 'Aktualizacja systemu',
      description: 'Zaplanowana przerwa techniczna w weekend',
      timestamp: new Date(Date.now() - 7200000),
      type: 'announcement',
      icon: 'pi pi-info-circle'
    },
    {
      id: 3,
      title: 'Zgłoszenie #1230 zaktualizowane',
      description: 'Status zmieniony na "W trakcie realizacji"',
      timestamp: new Date(Date.now() - 10800000),
      type: 'update',
      icon: 'pi pi-refresh'
    }
  ]);
  
  // Chart data
  reportChartData: any;
  reportChartOptions: any;

  ngOnInit(): void {
    this.initializeChartData();
  }
  
  /**
   * Initialize chart data for dashboard visualization
   */
  initializeChartData(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dfe7ef';
    
    this.reportChartData = {
      labels: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec'],
      datasets: [
        {
          label: 'Zgłoszenia',
          data: [65, 59, 80, 81, 56, 55],
          fill: false,
          borderColor: '#3B82F6',
          tension: 0.4
        },
        {
          label: 'Rozpatrzone',
          data: [28, 48, 40, 19, 86, 27],
          fill: false,
          borderColor: '#10B981',
          tension: 0.4
        }
      ]
    };
    
    this.reportChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };
  }
  
  /**
   * Navigate to specific tile route
   */
  navigateToTile(tile: DashboardTile): void {
    if (tile.route) {
      this.router.navigate([tile.route]);
    }
  }
  
  /**
   * Format timestamp for display
   */
  formatTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} min temu`;
    } else if (hours < 24) {
      return `${hours} godz. temu`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} dni temu`;
    }
  }
  
  /**
   * Get greeting based on time of day
   */
  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Dzień dobry';
    if (hour < 18) return 'Dzień dobry';
    return 'Dobry wieczór';
  }
}

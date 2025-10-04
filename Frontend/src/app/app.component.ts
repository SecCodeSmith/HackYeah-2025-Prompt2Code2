import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoadingService } from './services/loading.service';
import { AuthService } from './services/auth.service';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    CommonModule,
    ProgressSpinnerModule,
    ToastModule,
    ButtonModule,
    AvatarModule,
    MenuModule
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HackYeah 2025';
  loadingService = inject(LoadingService);
  authService = inject(AuthService);
  
  // Computed signals for reactive UI
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;
  userInitials = computed(() => this.authService.getUserInitials());
  userFullName = computed(() => this.authService.getUserFullName());
  
  // User menu items
  userMenuItems: MenuItem[] = [
    {
      label: 'Profil',
      icon: 'pi pi-user',
      command: () => this.goToProfile()
    },
    {
      label: 'Ustawienia',
      icon: 'pi pi-cog',
      command: () => this.goToSettings()
    },
    {
      separator: true
    },
    {
      label: 'Wyloguj się',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];
  
  /**
   * Logout user
   */
  logout(): void {
    this.authService.logout();
  }
  
  /**
   * Navigate to profile
   */
  goToProfile(): void {
    // TODO: Implement profile navigation
    console.log('Navigate to profile');
  }
  
  /**
   * Navigate to settings
   */
  goToSettings(): void {
    // TODO: Implement settings navigation
    console.log('Navigate to settings');
  }
}

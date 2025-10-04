// File: Frontend/src/app/pages/profile/profile.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="container mx-auto px-4 py-6 max-w-2xl">
      <p-card>
        <ng-template pTemplate="header">
          <div class="p-4">
            <h2 class="text-2xl font-bold text-gray-800">User Profile</h2>
            <p class="text-gray-600 mt-1">Manage your account settings</p>
          </div>
        </ng-template>

        <!-- User Information -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div class="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                {{ userEmail() }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <div class="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                {{ userRole() }}
              </div>
            </div>
          </div>
        </div>

        <!-- Change Password Section -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
          
          <form (ngSubmit)="changePassword()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Current Password *
              </label>
              <p-password 
                [(ngModel)]="passwordForm.currentPassword"
                name="currentPassword"
                placeholder="Enter current password"
                [feedback]="false"
                [toggleMask]="true"
                styleClass="w-full"
                [inputStyle]="{ width: '100%' }">
              </p-password>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                New Password *
              </label>
              <p-password 
                [(ngModel)]="passwordForm.newPassword"
                name="newPassword"
                placeholder="Enter new password"
                [feedback]="true"
                [toggleMask]="true"
                styleClass="w-full"
                [inputStyle]="{ width: '100%' }">
                <ng-template pTemplate="header">
                  <h6>Choose a password</h6>
                </ng-template>
                <ng-template pTemplate="footer">
                  <div class="text-xs text-gray-600">
                    <p>Minimum 6 characters</p>
                  </div>
                </ng-template>
              </p-password>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password *
              </label>
              <p-password 
                [(ngModel)]="passwordForm.confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                [feedback]="false"
                [toggleMask]="true"
                styleClass="w-full"
                [inputStyle]="{ width: '100%' }">
              </p-password>
              
              <div *ngIf="passwordForm.confirmPassword && !passwordsMatch()" 
                   class="mt-2 text-sm text-red-600">
                Passwords do not match
              </div>
            </div>

            <div class="flex gap-3 pt-4">
              <p-button 
                type="submit"
                label="Change Password" 
                icon="pi pi-check"
                [disabled]="!isFormValid() || saving()"
                [loading]="saving()">
              </p-button>
              <p-button 
                type="button"
                label="Clear" 
                icon="pi pi-times"
                severity="secondary"
                [outlined]="true"
                (onClick)="clearForm()"
                [disabled]="saving()">
              </p-button>
            </div>
          </form>
        </div>
      </p-card>
    </div>

    <p-toast></p-toast>
  `,
  styles: [`
    :host ::ng-deep {
      .p-password {
        width: 100%;
      }

      .p-password input {
        width: 100%;
      }

      .p-card .p-card-body {
        padding: 1.5rem;
      }

      .p-card .p-card-header {
        padding: 0;
      }
    }
  `]
})
export class ProfileComponent {
  userEmail = signal('');
  userRole = signal('');
  saving = signal(false);

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.loadUserInfo();
  }

  loadUserInfo() {
    // Load from localStorage
    const email = localStorage.getItem('userEmail') || 'Not available';
    const role = localStorage.getItem('userRole') || 'User';
    
    this.userEmail.set(email);
    this.userRole.set(role);
  }

  passwordsMatch(): boolean {
    return this.passwordForm.newPassword === this.passwordForm.confirmPassword;
  }

  isFormValid(): boolean {
    return this.passwordForm.currentPassword.length > 0 &&
           this.passwordForm.newPassword.length >= 6 &&
           this.passwordForm.confirmPassword.length >= 6 &&
           this.passwordsMatch();
  }

  clearForm() {
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  changePassword() {
    if (!this.isFormValid()) return;

    this.saving.set(true);
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);

    const request = {
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword
    };

    this.http.post(`${this.apiUrl}/auth/change-password`, request, { headers })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Password changed successfully'
          });
          this.clearForm();
          this.saving.set(false);
        },
        error: (error) => {
          console.error('Error changing password:', error);
          this.saving.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to change password'
          });
        }
      });
  }
}

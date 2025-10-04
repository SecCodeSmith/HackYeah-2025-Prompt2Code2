// File: Frontend/src/app/pages/admin/user-management.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

interface RoleOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    TagModule,
    InputTextModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="card">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">User Management</h2>
          <p class="text-gray-600 mt-1">Manage user accounts and roles</p>
        </div>
        <div class="flex gap-2">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input 
              pInputText 
              type="text" 
              [(ngModel)]="searchText"
              (input)="onSearch()"
              placeholder="Search users..." 
              class="w-64" />
          </span>
          <p-button 
            icon="pi pi-refresh" 
            [rounded]="true"
            [text]="true"
            (onClick)="loadUsers()"
            pTooltip="Refresh"
            tooltipPosition="top">
          </p-button>
        </div>
      </div>

      <p-table 
        [value]="filteredUsers()" 
        [paginator]="true" 
        [rows]="10"
        [rowsPerPageOptions]="[10, 25, 50]"
        [loading]="loading()"
        styleClass="p-datatable-striped"
        [globalFilterFields]="['firstName', 'lastName', 'email', 'role']">
        
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="firstName">
              Name
              <p-sortIcon field="firstName"></p-sortIcon>
            </th>
            <th pSortableColumn="email">
              Email
              <p-sortIcon field="email"></p-sortIcon>
            </th>
            <th>Phone</th>
            <th pSortableColumn="role">
              Role
              <p-sortIcon field="role"></p-sortIcon>
            </th>
            <th>Status</th>
            <th pSortableColumn="createdAt">
              Created
              <p-sortIcon field="createdAt"></p-sortIcon>
            </th>
            <th class="text-center">Actions</th>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="body" let-user>
          <tr>
            <td>
              <div class="flex items-center gap-2">
                <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {{ getInitials(user.firstName, user.lastName) }}
                </div>
                <div>
                  <div class="font-medium">{{ user.firstName }} {{ user.lastName }}</div>
                  <div class="text-sm text-gray-500" *ngIf="user.isEmailVerified">
                    <i class="pi pi-check-circle text-green-500"></i> Verified
                  </div>
                </div>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.phoneNumber || '-' }}</td>
            <td>
              <p-tag 
                [value]="user.role" 
                [severity]="getRoleSeverity(user.role)">
              </p-tag>
            </td>
            <td>
              <p-tag 
                [value]="user.isActive ? 'Active' : 'Inactive'" 
                [severity]="user.isActive ? 'success' : 'danger'">
              </p-tag>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td class="text-center">
              <p-button 
                icon="pi pi-user-edit" 
                [rounded]="true"
                [text]="true"
                severity="info"
                (onClick)="openEditRoleDialog(user)"
                pTooltip="Edit Role"
                tooltipPosition="top">
              </p-button>
            </td>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="7" class="text-center text-gray-500 py-8">
              <i class="pi pi-users text-4xl mb-3 block"></i>
              <p class="text-lg">No users found</p>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <!-- Edit Role Dialog -->
    <p-dialog 
      [(visible)]="displayRoleDialog" 
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '450px' }"
      header="Edit User Role">
      
      <div class="flex flex-col gap-4" *ngIf="selectedUser">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">User</label>
          <div class="p-3 bg-gray-50 rounded border">
            <div class="font-medium">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</div>
            <div class="text-sm text-gray-600">{{ selectedUser.email }}</div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Current Role</label>
          <p-tag 
            [value]="selectedUser.role" 
            [severity]="getRoleSeverity(selectedUser.role)"
            styleClass="text-base px-3 py-2">
          </p-tag>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">New Role *</label>
          <p-dropdown 
            [(ngModel)]="newRole" 
            [options]="roleOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a role"
            [style]="{ width: '100%' }"
            [showClear]="false">
          </p-dropdown>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800" *ngIf="newRole === 0">
          <i class="pi pi-info-circle mr-2"></i>
          Administrators have full access to all system features.
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button 
          label="Cancel" 
          icon="pi pi-times" 
          [text]="true"
          (onClick)="displayRoleDialog = false">
        </p-button>
        <p-button 
          label="Update Role" 
          icon="pi pi-check" 
          (onClick)="updateUserRole()"
          [disabled]="newRole === null || savingRole()">
        </p-button>
      </ng-template>
    </p-dialog>

    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
  `,
  styles: [`
    :host ::ng-deep {
      .p-datatable .p-datatable-thead > tr > th {
        background-color: #f8f9fa;
        font-weight: 600;
        padding: 1rem;
      }

      .p-datatable .p-datatable-tbody > tr > td {
        padding: 1rem;
      }

      .p-dialog .p-dialog-header {
        padding: 1.5rem;
      }

      .p-dialog .p-dialog-content {
        padding: 0 1.5rem 1.5rem;
      }
    }
  `]
})
export class UserManagementComponent implements OnInit {
  users = signal<User[]>([]);
  filteredUsers = signal<User[]>([]);
  loading = signal(false);
  savingRole = signal(false);
  displayRoleDialog = false;
  selectedUser: User | null = null;
  newRole: number | null = null;
  searchText = '';

  roleOptions: RoleOption[] = [
    { label: 'Administrator', value: 0 },
    { label: 'Supervisor', value: 1 },
    { label: 'User', value: 2 }
  ];

  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);

    this.http.get<User[]>(`${this.apiUrl}/users`, { headers })
      .subscribe({
        next: (data) => {
          this.users.set(data);
          this.filteredUsers.set(data);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.loading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to load users'
          });
        }
      });
  }

  onSearch() {
    const searchLower = this.searchText.toLowerCase();
    if (!searchLower) {
      this.filteredUsers.set(this.users());
      return;
    }

    const filtered = this.users().filter(user =>
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
    this.filteredUsers.set(filtered);
  }

  openEditRoleDialog(user: User) {
    this.selectedUser = user;
    this.newRole = this.getRoleValue(user.role);
    this.displayRoleDialog = true;
  }

  updateUserRole() {
    if (!this.selectedUser || this.newRole === null) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to change ${this.selectedUser.firstName}'s role to ${this.getRoleLabel(this.newRole)}?`,
      header: 'Confirm Role Change',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.performRoleUpdate();
      }
    });
  }

  private performRoleUpdate() {
    if (!this.selectedUser || this.newRole === null) return;

    this.savingRole.set(true);
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);

    this.http.put(
      `${this.apiUrl}/users/${this.selectedUser.id}/role`,
      { role: this.newRole },
      { headers }
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User role updated successfully'
        });
        this.displayRoleDialog = false;
        this.selectedUser = null;
        this.newRole = null;
        this.savingRole.set(false);
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating role:', error);
        this.savingRole.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to update user role'
        });
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  getRoleSeverity(role: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (role.toLowerCase()) {
      case 'administrator':
        return 'danger';
      case 'supervisor':
        return 'warning';
      case 'user':
        return 'info';
      default:
        return 'info';
    }
  }

  getRoleValue(roleName: string): number {
    const role = this.roleOptions.find(r => r.label.toLowerCase() === roleName.toLowerCase());
    return role ? role.value : 2;
  }

  getRoleLabel(roleValue: number): string {
    const role = this.roleOptions.find(r => r.value === roleValue);
    return role ? role.label : 'User';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}

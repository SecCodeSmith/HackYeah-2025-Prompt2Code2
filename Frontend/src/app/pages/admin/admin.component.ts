// File: Frontend/src/app/pages/admin/admin.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { UserManagementComponent } from './user-management.component';
import { PodmiotyListComponent } from './podmioty-list.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TabViewModule,
    UserManagementComponent,
    PodmiotyListComponent
  ],
  template: `
    <div class="container mx-auto px-4 py-6">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Administration</h1>
        <p class="text-gray-600 mt-2">Manage users, roles, and system settings</p>
      </div>

      <p-tabView>
        <p-tabPanel header="User Management" leftIcon="pi pi-users">
          <app-user-management></app-user-management>
        </p-tabPanel>
        
        <p-tabPanel header="Entity Management" leftIcon="pi pi-building">
          <app-podmioty-list></app-podmioty-list>
        </p-tabPanel>
        
        <p-tabPanel header="System Settings" leftIcon="pi pi-cog">
          <div class="card p-6">
            <p class="text-gray-600">System settings coming soon...</p>
          </div>
        </p-tabPanel>
        
        <p-tabPanel header="Reports Overview" leftIcon="pi pi-chart-bar">
          <div class="card p-6">
            <p class="text-gray-600">Reports analytics coming soon...</p>
          </div>
        </p-tabPanel>
      </p-tabView>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-tabview .p-tabview-nav li .p-tabview-nav-link {
        padding: 1rem 1.5rem;
      }
      
      .p-tabview .p-tabview-panels {
        background: transparent;
        padding: 1.5rem 0;
      }
    }
  `]
})
export class AdminComponent {}

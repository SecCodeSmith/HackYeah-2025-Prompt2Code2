// File: Frontend/src/app/shared/components/loading-spinner/loading-spinner.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div 
      *ngIf="loadingService.isLoading()" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div class="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center">
        <p-progressSpinner 
          styleClass="w-16 h-16"
          strokeWidth="4"
          animationDuration="1s">
        </p-progressSpinner>
        <p class="mt-4 text-gray-700 font-medium">Loading...</p>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-progress-spinner-circle {
        stroke: #3b82f6;
      }
    }
  `]
})
export class LoadingSpinnerComponent {
  constructor(public loadingService: LoadingService) {}
}

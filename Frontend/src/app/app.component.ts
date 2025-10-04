import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    CommonModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HackYeah 2025';
  loadingService = inject(LoadingService);
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMessage();
  }

  loadMessage(): void {
    this.loading = true;
    this.http.get<any>('http://localhost:5000/api/test')
      .subscribe({
        next: (data) => {
          this.message = data.message || 'Connected to backend!';
          this.loading = false;
        },
        error: (error) => {
          console.error('Error connecting to backend:', error);
          this.message = 'Unable to connect to backend. Make sure the API is running.';
          this.loading = false;
        }
      });
  }
}

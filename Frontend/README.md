# Frontend - Angular 18 Application

Modern Angular 18 application with standalone components for HackYeah 2025.

## 🚀 Quick Start

```powershell
# Install dependencies (first time only)
npm install

# Start development server
npm start

# The app will be available at http://localhost:4200
```

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   └── home/         # Home page component
│   │   ├── app.component.*   # Root component
│   │   ├── app.config.ts     # Application configuration
│   │   └── app.routes.ts     # Route definitions
│   ├── assets/               # Static assets
│   ├── index.html            # Main HTML file
│   ├── main.ts               # Application entry point
│   └── styles.css            # Global styles
├── angular.json              # Angular CLI configuration
├── package.json              # npm dependencies
├── tsconfig.json             # TypeScript configuration
└── proxy.conf.json           # Proxy configuration for API
```

## 🔧 Technologies

- **Angular 18** - Framework
- **TypeScript 5.4** - Language
- **RxJS 7.8** - Reactive programming
- **Standalone Components** - Modern Angular architecture
- **Angular Router** - Navigation
- **HttpClient** - HTTP communication

## 📦 Available Scripts

```powershell
# Development server
npm start
# or
ng serve

# Build for production
npm run build
# or
ng build

# Run with watch mode
npm run watch

# Run unit tests
npm test

# Run end-to-end tests
ng e2e
```

## 🌐 Proxy Configuration

The Angular development server is configured to proxy API requests to the backend.

**proxy.conf.json:**
```json
{
  "/api": {
    "target": "http://localhost:5000",
    "secure": false,
    "changeOrigin": true
  }
}
```

This means:
- Frontend: `http://localhost:4200/api/test` 
- → Proxies to: `http://localhost:5000/api/test`

## 🎨 Creating Components

### Using Angular CLI

```powershell
# Create a new component
ng generate component components/my-component

# Create a new standalone component (recommended)
ng generate component components/my-component --standalone

# Create a new page
ng generate component pages/my-page --standalone

# Create a service
ng generate service services/my-service
```

### Manual Component Creation

Create a standalone component:

```typescript
// src/app/components/example/example.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  title = 'Example Component';
}
```

## 🛣️ Routing

Routes are defined in `app.routes.ts`:

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  }
];
```

## 🔌 HTTP Services

### Creating a Service

```powershell
ng generate service services/api
```

```typescript
// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api'; // Will be proxied to http://localhost:5000/api

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/test`);
  }

  postData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/test`, data);
  }
}
```

### Using the Service

```typescript
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-my-component',
  standalone: true,
  template: `<div>{{ data | json }}</div>`
})
export class MyComponent implements OnInit {
  data: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getData().subscribe({
      next: (response) => {
        this.data = response;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
}
```

## 🎨 Styling

### Global Styles

Edit `src/styles.css` for global styles that apply to the entire application.

### Component Styles

Each component has its own CSS file:
- Component-specific styles are scoped to that component only
- Use CSS, SCSS, or SASS (configure in `angular.json`)

### Adding CSS Framework

To add Bootstrap, Tailwind, or other CSS frameworks:

```powershell
# Bootstrap
npm install bootstrap
# Add to angular.json styles array:
# "styles": ["node_modules/bootstrap/dist/css/bootstrap.min.css", "src/styles.css"]

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

## 🔧 Environment Configuration

Create environment files for different configurations:

**src/environments/environment.ts** (Development):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

**src/environments/environment.prod.ts** (Production):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api'
};
```

## 📱 Responsive Design

The app includes basic responsive design. Enhance it with:

```css
/* Mobile first approach */
.container {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## 🧪 Testing

### Unit Tests

```powershell
# Run tests
npm test

# Run tests with coverage
ng test --code-coverage
```

### E2E Tests

```powershell
# Install Protractor or Cypress
npm install cypress --save-dev

# Run E2E tests
ng e2e
```

## 🏗️ Building for Production

```powershell
# Build the application
npm run build

# Build with specific configuration
ng build --configuration production

# The build artifacts will be in the dist/ directory
```

## 🚀 Deployment

### Deploy to Static Hosting

After building, deploy the `dist/frontend` directory to:
- **Azure Static Web Apps**
- **Netlify**
- **Vercel**
- **GitHub Pages**
- **Firebase Hosting**

### Example: Deploy to Azure Static Web Apps

```powershell
# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Build the app
npm run build

# Deploy
swa deploy ./dist/frontend
```

## 🐛 Common Issues

### Module not found errors

```powershell
# Clean install
rm -r node_modules
rm package-lock.json
npm install
```

### Port 4200 already in use

```powershell
# Run on a different port
ng serve --port 4201
```

### CORS errors

- Ensure the backend is running on port 5000
- Check proxy configuration in `proxy.conf.json`
- Verify CORS is configured in the backend

## 📦 Popular Packages to Add

```powershell
# Angular Material (UI components)
ng add @angular/material

# HTTP Interceptors for auth
# (Create manually or use a library)

# State management (if needed)
npm install @ngrx/store @ngrx/effects

# Form validation
npm install ngx-validators

# Date handling
npm install date-fns
```

## 📖 Useful Commands

```powershell
# Update Angular
ng update @angular/core @angular/cli

# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/frontend/stats.json

# Lint code
ng lint

# Format code (if prettier is installed)
npx prettier --write "src/**/*.{ts,html,css}"
```

## 🎓 Learning Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular CLI Documentation](https://angular.io/cli)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**Need help?** Check the main [README.md](../README.md) for more information.

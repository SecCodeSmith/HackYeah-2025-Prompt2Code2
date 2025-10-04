# Angular Authentication Component - Quick Setup

## Installation Commands

Run these commands in the `Frontend` directory:

```bash
# Navigate to Frontend directory
cd Frontend

# Install PrimeNG and PrimeIcons
npm install primeng@latest primeicons@latest

# Install Tailwind CSS (if not already installed)
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

# Initialize Tailwind (if not already initialized)
npx tailwindcss init
```

## Configuration

### 1. Update tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 2. Update src/styles.css

```css
/* Tailwind Base Styles */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* PrimeNG Theme */
@import "primeng/resources/themes/lara-light-blue/theme.css";
@import "primeng/resources/primeng.css";
@import "primeicons/primeicons.css";
```

### 3. Add to app.routes.ts

```typescript
import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
];
```

## Run the Application

```bash
# Start development server
npm start

# Or with custom port
ng serve --port 4200
```

## Access the Component

Open browser to: http://localhost:4200/auth

## Quick Test

### Registration Test Data:
- **First Name**: Jan
- **Last Name**: Kowalski
- **PESEL**: 44051401458 (valid)
- **Phone**: 123-456-789
- **Email**: jan.kowalski@example.com
- **Password**: Test123!@#
- **Confirm Password**: Test123!@#

### Login Test Data:
- **Email**: user@example.com
- **Password**: Password123!

## Features Verification Checklist

- [ ] Forms render correctly with PrimeNG styling
- [ ] Tailwind CSS classes apply properly
- [ ] Tab navigation works between login/register
- [ ] All validation errors display correctly
- [ ] PESEL validation works (accepts 44051401458)
- [ ] Password strength indicator shows
- [ ] Passwords must match for registration
- [ ] Submit buttons disable when form invalid
- [ ] Loading spinner shows on submit
- [ ] Success message appears after submission
- [ ] Console logs form data on submit
- [ ] Mobile responsive design works

## Troubleshooting

### Common Issues:

**Issue**: Styles not loading
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: TypeScript errors
```bash
# Ensure you're using Angular 16+ and TypeScript 5+
ng version
```

**Issue**: PrimeNG modules not found
```bash
# Reinstall PrimeNG
npm uninstall primeng primeicons
npm install primeng primeicons
```

## Next Steps

1. Connect to backend API (see AUTH_COMPONENT_README.md)
2. Add JWT token storage
3. Implement routing after login
4. Add error handling from API responses
5. Add unit tests for validators
6. Add E2E tests for user flows

## Dependencies Required

```json
{
  "dependencies": {
    "@angular/animations": "^20.0.0",
    "@angular/common": "^20.0.0",
    "@angular/core": "^20.0.0",
    "@angular/forms": "^20.0.0",
    "primeng": "^18.0.0",
    "primeicons": "^7.0.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

## File Structure After Setup

```
Frontend/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   └── auth.component.ts  ✓ Created
│   │   ├── app.routes.ts          ← Update this
│   │   └── app.component.ts
│   ├── styles.css                 ← Update this
│   └── index.html
├── tailwind.config.js             ← Create/Update this
├── package.json
└── AUTH_COMPONENT_README.md       ✓ Created
```

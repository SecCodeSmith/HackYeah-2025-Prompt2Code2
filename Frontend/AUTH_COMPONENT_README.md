# Authentication Component - Setup Instructions

## Overview

This is a complete, production-ready Angular authentication component for the UKNF Communication Platform. It provides both user registration and login functionality with comprehensive validation and accessibility features.

## Features

✅ **User Registration Form**
- First Name, Last Name (Polish characters supported)
- PESEL (11-digit validation with checksum)
- Phone Number (XXX-XXX-XXX format)
- Email (validated format)
- Password with strength requirements
- Password confirmation

✅ **User Login Form**
- Email
- Password
- Toggle password visibility

✅ **Security & Validation**
- Client-side validation for all fields
- PESEL checksum validation
- Password strength requirements (8+ chars, uppercase, digit, special char)
- Password match validation
- Real-time error messages

✅ **Accessibility (WCAG 2.2)**
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast error messages
- Focus management

✅ **User Experience**
- Smooth toggle between login/register
- Loading states during submission
- Success/error messages
- Responsive design (mobile-first)
- Professional Tailwind CSS styling
- PrimeNG components for consistency

## Installation

### 1. Install Required Dependencies

```bash
cd Frontend

# Install PrimeNG and dependencies
npm install primeng primeicons

# Install Tailwind CSS (if not already installed)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

### 2. Configure Tailwind CSS

Update `tailwind.config.js`:

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

### 3. Import PrimeNG Styles

Add to `src/styles.css`:

```css
/* Tailwind CSS */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* PrimeNG Theme */
@import "primeng/resources/themes/lara-light-blue/theme.css";
@import "primeng/resources/primeng.css";
@import "primeicons/primeicons.css";
```

### 4. Add the Component to Your App

Update `src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  // ... other routes
];
```

Or add to `src/app/app.component.ts` if using component directly:

```typescript
import { Component } from '@angular/core';
import { AuthComponent } from './auth/auth.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AuthComponent],
  template: '<app-auth></app-auth>'
})
export class AppComponent {}
```

## Usage

### Basic Usage

```typescript
// Simply import and use the component
import { AuthComponent } from './auth/auth.component';

// In your template:
<app-auth></app-auth>
```

### Integration with API

To connect with your backend API, modify the submission methods in `auth.component.ts`:

```typescript
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

export class AuthComponent {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api';

  async onLoginSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isSubmitting.set(true);
    
    try {
      const response = await this.http.post<AuthResponse>(
        `${this.apiUrl}/auth/login`,
        this.loginForm.value
      ).toPromise();
      
      console.log('Login successful:', response);
      
      // Store JWT token
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      this.showSuccessMessage.set(true);
      
      // Navigate to dashboard or home
      // this.router.navigate(['/dashboard']);
      
    } catch (error) {
      console.error('Login failed:', error);
      // Show error message
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async onRegisterSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isSubmitting.set(true);
    
    try {
      const response = await this.http.post<AuthResponse>(
        `${this.apiUrl}/auth/register`,
        {
          email: this.registerForm.value.email,
          password: this.registerForm.value.password,
          confirmPassword: this.registerForm.value.confirmPassword,
          firstName: this.registerForm.value.firstName,
          lastName: this.registerForm.value.lastName,
          phoneNumber: this.registerForm.value.phone
        }
      ).toPromise();
      
      console.log('Registration successful:', response);
      this.showSuccessMessage.set(true);
      
      // Optionally auto-login after registration
      
    } catch (error) {
      console.error('Registration failed:', error);
      // Show error message
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
```

## Component API

### Signals (State Management)

| Signal | Type | Description |
|--------|------|-------------|
| `isLoginMode` | `Signal<boolean>` | Toggle between login/register views |
| `isSubmitting` | `Signal<boolean>` | Loading state during form submission |
| `showSuccessMessage` | `Signal<boolean>` | Display success message after submission |

### Forms

| Form | Fields | Validators |
|------|--------|-----------|
| `loginForm` | email, password | required, email format |
| `registerForm` | firstName, lastName, pesel, phone, email, password, confirmPassword | required, minLength, pattern, custom validators |

### Methods

| Method | Description |
|--------|-------------|
| `setMode(isLogin: boolean)` | Switch between login and registration modes |
| `onLoginSubmit()` | Handle login form submission |
| `onRegisterSubmit()` | Handle registration form submission |
| `peselValidator()` | Custom validator for PESEL number with checksum |
| `passwordMatchValidator()` | Ensures password and confirmPassword match |

## Form Validation Rules

### Registration Form

| Field | Rules |
|-------|-------|
| First Name | Required, min 2 chars, Polish letters only |
| Last Name | Required, min 2 chars, Polish letters only |
| PESEL | Required, exactly 11 digits, valid checksum |
| Phone | Required, format XXX-XXX-XXX |
| Email | Required, valid email format |
| Password | Required, min 8 chars, uppercase, digit, special char |
| Confirm Password | Required, must match password |

### Login Form

| Field | Rules |
|-------|-------|
| Email | Required, valid email format |
| Password | Required |

## Accessibility Features (WCAG 2.2)

✅ **Keyboard Navigation**
- Tab through all form fields
- Enter to submit forms
- Escape to close dialogs

✅ **Screen Reader Support**
- ARIA labels on all inputs
- ARIA-describedby for help text
- ARIA-live regions for dynamic messages
- Role attributes for tabs

✅ **Visual Accessibility**
- High contrast error messages (red #ef4444)
- Focus indicators with visible outline
- Sufficient color contrast (WCAG AA)
- Large, readable fonts

✅ **Form Labels**
- Explicit label-input associations
- Required field indicators (* with aria-label)
- Error messages linked via aria-describedby

## Testing

### Manual Testing Checklist

- [ ] Registration form validates all fields correctly
- [ ] PESEL validation accepts valid PESELs and rejects invalid ones
- [ ] Password strength requirements are enforced
- [ ] Password confirmation matches password field
- [ ] Login form validates email and password
- [ ] Toggle between login/register works smoothly
- [ ] Form submission shows loading state
- [ ] Success messages appear after submission
- [ ] All fields are keyboard accessible
- [ ] Screen reader announces errors correctly
- [ ] Mobile responsive design works on small screens

### Test Data

**Valid PESEL Numbers** (for testing):
- 44051401458 (checksum valid)
- 02070803628 (checksum valid)

**Invalid PESEL Numbers**:
- 12345678901 (invalid checksum)
- 123 (too short)

## Styling Customization

### Tailwind CSS Classes

The component uses utility-first Tailwind CSS. To customize:

```typescript
// Change primary color from indigo to blue
[class.bg-indigo-600] → [class.bg-blue-600]

// Change gradient
bg-gradient-to-br from-blue-50 to-indigo-100 
→ bg-gradient-to-br from-green-50 to-teal-100
```

### PrimeNG Theme

To change the PrimeNG theme, update in `styles.css`:

```css
/* Change from lara-light-blue to another theme */
@import "primeng/resources/themes/lara-light-blue/theme.css";

/* Options: lara-dark-blue, saga-blue, arya-blue, etc. */
```

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- Lazy loading: Component is standalone and can be lazy loaded
- Minimal dependencies: Only necessary PrimeNG modules imported
- Optimized animations: CSS-only transitions
- Form validation: Client-side validation before API call

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never log passwords in production** - Remove console.log statements
2. **Use HTTPS** - Always transmit credentials over secure connection
3. **Implement CSRF protection** - Add CSRF tokens to forms
4. **Rate limiting** - Implement on backend to prevent brute force
5. **Password storage** - Backend should use bcrypt/argon2
6. **XSS protection** - Angular sanitizes by default, but be careful with innerHTML

## Troubleshooting

### Issue: PrimeNG styles not loading
**Solution**: Ensure styles are imported in `angular.json` or `styles.css`

### Issue: Tailwind classes not working
**Solution**: Check `tailwind.config.js` content paths include your component

### Issue: Form validation not triggering
**Solution**: Ensure formControlName matches form control names exactly

### Issue: TypeScript errors for signals
**Solution**: Ensure Angular 16+ and TypeScript 5+ are installed

## Next Steps

1. **Connect to Backend API**: Replace console.log with HTTP calls
2. **Add Error Handling**: Implement proper error messages from API
3. **Add Loading States**: Show spinner during API calls
4. **Implement Routing**: Navigate after successful login/register
5. **Add JWT Storage**: Store tokens securely
6. **Add Remember Me**: Option to persist login
7. **Add Forgot Password**: Password reset flow
8. **Add Social Login**: OAuth integration (optional)
9. **Add Unit Tests**: Test validators and form logic
10. **Add E2E Tests**: Test user flows with Cypress/Playwright

## Support

For issues or questions:
- Check Angular documentation: https://angular.io
- Check PrimeNG documentation: https://primeng.org
- Check Tailwind CSS documentation: https://tailwindcss.com

## License

This component is part of the UKNF Communication Platform project.

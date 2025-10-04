import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    InputMaskModule,
    DividerModule,
    MessageModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <p-card>
          <ng-template pTemplate="header">
            <div class="p-6 pb-0">
              <h1 class="text-3xl font-bold text-center text-gray-800 mb-2">
                UKNF Communication Platform
              </h1>
              <p class="text-center text-gray-600">
                {{ isLoginMode() ? 'Zaloguj się do systemu' : 'Zarejestruj nowe konto' }}
              </p>
            </div>
          </ng-template>

          <!-- Toggle Buttons -->
          <div class="flex gap-2 mb-6" role="tablist" aria-label="Tryb uwierzytelniania">
            <button
              type="button"
              class="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200"
              [class.bg-indigo-600]="isLoginMode()"
              [class.text-white]="isLoginMode()"
              [class.bg-gray-200]="!isLoginMode()"
              [class.text-gray-700]="!isLoginMode()"
              (click)="setMode(true)"
              role="tab"
              [attr.aria-selected]="isLoginMode()"
              [attr.aria-controls]="'login-panel'"
            >
              Logowanie
            </button>
            <button
              type="button"
              class="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200"
              [class.bg-indigo-600]="!isLoginMode()"
              [class.text-white]="!isLoginMode()"
              [class.bg-gray-200]="isLoginMode()"
              [class.text-gray-700]="isLoginMode()"
              (click)="setMode(false)"
              role="tab"
              [attr.aria-selected]="!isLoginMode()"
              [attr.aria-controls]="'register-panel'"
            >
              Rejestracja
            </button>
          </div>

          <!-- Login Form -->
          <div 
            *ngIf="isLoginMode()"
            id="login-panel"
            role="tabpanel"
            aria-labelledby="login-tab"
            class="animate-fadeIn"
          >
            <form [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()" novalidate>
              <!-- Email -->
              <div class="mb-4">
                <label 
                  for="login-email" 
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Adres email <span class="text-red-500" aria-label="wymagane">*</span>
                </label>
                <input
                  id="login-email"
                  type="email"
                  pInputText
                  formControlName="email"
                  placeholder="jan.kowalski@example.com"
                  class="w-full"
                  [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                  aria-required="true"
                  aria-describedby="login-email-error"
                />
                <small 
                  *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                  id="login-email-error"
                  class="block mt-1 text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  <span *ngIf="loginForm.get('email')?.errors?.['required']">Email jest wymagany</span>
                  <span *ngIf="loginForm.get('email')?.errors?.['email']">Nieprawidłowy format email</span>
                </small>
              </div>

              <!-- Password -->
              <div class="mb-6">
                <label 
                  for="login-password" 
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Hasło <span class="text-red-500" aria-label="wymagane">*</span>
                </label>
                <p-password
                  id="login-password"
                  formControlName="password"
                  [toggleMask]="true"
                  placeholder="Wprowadź hasło"
                  styleClass="w-full"
                  inputStyleClass="w-full"
                  [feedback]="false"
                  [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                  aria-required="true"
                  aria-describedby="login-password-error"
                ></p-password>
                <small 
                  *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                  id="login-password-error"
                  class="block mt-1 text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  Hasło jest wymagane
                </small>
              </div>

              <!-- Submit Button -->
              <p-button
                type="submit"
                label="Zaloguj się"
                icon="pi pi-sign-in"
                [disabled]="loginForm.invalid || isSubmitting()"
                [loading]="isSubmitting()"
                styleClass="w-full justify-center"
                aria-label="Zaloguj się do systemu"
              ></p-button>

              <!-- Success Message -->
              <div 
                *ngIf="showSuccessMessage()" 
                class="mt-4"
                role="status"
                aria-live="polite"
              >
                <p-message 
                  severity="success" 
                  text="Logowanie zakończone pomyślnie!"
                  styleClass="w-full"
                ></p-message>
              </div>
            </form>
          </div>

          <!-- Registration Form -->
          <div 
            *ngIf="!isLoginMode()"
            id="register-panel"
            role="tabpanel"
            aria-labelledby="register-tab"
            class="animate-fadeIn"
          >
            <form [formGroup]="registerForm" (ngSubmit)="onRegisterSubmit()" novalidate>
              <!-- First Name -->
              <div class="mb-4">
                <label 
                  for="register-firstName" 
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Imię <span class="text-red-500" aria-label="wymagane">*</span>
                </label>
                <input
                  id="register-firstName"
                  type="text"
                  pInputText
                  formControlName="firstName"
                  placeholder="Jan"
                  class="w-full"
                  [class.border-red-500]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                  aria-required="true"
                  aria-describedby="register-firstName-error"
                />
                <small 
                  *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                  id="register-firstName-error"
                  class="block mt-1 text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  <span *ngIf="registerForm.get('firstName')?.errors?.['required']">Imię jest wymagane</span>
                  <span *ngIf="registerForm.get('firstName')?.errors?.['minlength']">Imię musi mieć co najmniej 2 znaki</span>
                  <span *ngIf="registerForm.get('firstName')?.errors?.['pattern']">Imię może zawierać tylko litery</span>
                </small>
              </div>

              <!-- Last Name -->
              <div class="mb-4">
                <label 
                  for="register-lastName" 
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nazwisko <span class="text-red-500" aria-label="wymagane">*</span>
                </label>
                <input
                  id="register-lastName"
                  type="text"
                  pInputText
                  formControlName="lastName"
                  placeholder="Kowalski"
                  class="w-full"
                  [class.border-red-500]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                  aria-required="true"
                  aria-describedby="register-lastName-error"
                />
                <small 
                  *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                  id="register-lastName-error"
                  class="block mt-1 text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  <span *ngIf="registerForm.get('lastName')?.errors?.['required']">Nazwisko jest wymagane</span>
                  <span *ngIf="registerForm.get('lastName')?.errors?.['minlength']">Nazwisko musi mieć co najmniej 2 znaki</span>
                  <span *ngIf="registerForm.get('lastName')?.errors?.['pattern']">Nazwisko może zawierać tylko litery</span>
                </small>
              </div>

              <!-- PESEL -->
              <div class="mb-4">
                <label 
                  for="register-pesel" 
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  PESEL <span class="text-red-500" aria-label="wymagane">*</span>
                </label>
                <p-inputMask
                  id="register-pesel"
                  formControlName="pesel"
                  mask="99999999999"
                  placeholder="12345678901"
                  styleClass="w-full"
                  [class.border-red-500]="registerForm.get('pesel')?.invalid && registerForm.get('pesel')?.touched"
                  aria-required="true"
                  aria-describedby="register-pesel-error register-pesel-help"
                ></p-inputMask>
                <small id="register-pesel-help" class="block mt-1 text-gray-500">
                  11-cyfrowy numer PESEL (maskowany: ******* + 4 ostatnie cyfry)
                </small>
                <small 
                  *ngIf="registerForm.get('pesel')?.invalid && registerForm.get('pesel')?.touched"
                  id="register-pesel-error"
                  class="block mt-1 text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  <span *ngIf="registerForm.get('pesel')?.errors?.['required']">PESEL jest wymagany</span>
                  <span *ngIf="registerForm.get('pesel')?.errors?.['invalidPesel']">Nieprawidłowy numer PESEL</span>
                </small>
              </div>

              <!-- Phone -->
              <div class="mb-4">
                <label 
                  for="register-phone" 
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Numer telefonu <span class="text-red-500" aria-label="wymagane">*</span>
                </label>
                <p-inputMask
                  id="register-phone"
                  formControlName="phone"
                  mask="999-999-999"
                  placeholder="123-456-789"
                  styleClass="w-full"
                  [class.border-red-500]="registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched"
                  aria-required="true"
                  aria-describedby="register-phone-error register-phone-help"
                ></p-inputMask>
                <small id="register-phone-help" class="block mt-1 text-gray-500">
                  Format: XXX-XXX-XXX (9 cyfr)
                </small>
                <small 
                  *ngIf="registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched"
                  id="register-phone-error"
                  class="block mt-1 text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  <span *ngIf="registerForm.get('phone')?.errors?.['required']">Numer telefonu jest wymagany</span>
                  <span *ngIf="registerForm.get('phone')?.errors?.['pattern']">Nieprawidłowy format numeru telefonu</span>
                </small>
              </div>

              <!-- Email -->
              <div class="mb-4">
                <label 
                  for="register-email" 
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Adres email <span class="text-red-500" aria-label="wymagane">*</span>
                </label>
                <input
                  id="register-email"
                  type="email"
                  pInputText
                  formControlName="email"
                  placeholder="jan.kowalski@example.com"
                  class="w-full"
                  [class.border-red-500]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                  aria-required="true"
                  aria-describedby="register-email-error"
                />
                <small 
                  *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                  id="register-email-error"
                  class="block mt-1 text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  <span *ngIf="registerForm.get('email')?.errors?.['required']">Email jest wymagany</span>
                  <span *ngIf="registerForm.get('email')?.errors?.['email']">Nieprawidłowy format email</span>
                </small>
              </div>

              <!-- Password -->
              <div class="mb-4">
                <label 
                  for="register-password" 
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Hasło <span class="text-red-500" aria-label="wymagane">*</span>
                </label>
                <p-password
                  id="register-password"
                  formControlName="password"
                  [toggleMask]="true"
                  placeholder="Wprowadź hasło"
                  styleClass="w-full"
                  inputStyleClass="w-full"
                  [strongRegex]="'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'"
                  [class.border-red-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                  aria-required="true"
                  aria-describedby="register-password-error register-password-help"
                ></p-password>
                <small id="register-password-help" class="block mt-1 text-gray-500">
                  Minimum 8 znaków, wielka litera, cyfra i znak specjalny
                </small>
                <small 
                  *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                  id="register-password-error"
                  class="block mt-1 text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  <span *ngIf="registerForm.get('password')?.errors?.['required']">Hasło jest wymagane</span>
                  <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Hasło musi mieć co najmniej 8 znaków</span>
                  <span *ngIf="registerForm.get('password')?.errors?.['pattern']">Hasło musi zawierać wielką literę, cyfrę i znak specjalny</span>
                </small>
              </div>

              <!-- Confirm Password -->
              <div class="mb-6">
                <label 
                  for="register-confirmPassword" 
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Potwierdź hasło <span class="text-red-500" aria-label="wymagane">*</span>
                </label>
                <p-password
                  id="register-confirmPassword"
                  formControlName="confirmPassword"
                  [toggleMask]="true"
                  [feedback]="false"
                  placeholder="Potwierdź hasło"
                  styleClass="w-full"
                  inputStyleClass="w-full"
                  [class.border-red-500]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                  aria-required="true"
                  aria-describedby="register-confirmPassword-error"
                ></p-password>
                <small 
                  *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                  id="register-confirmPassword-error"
                  class="block mt-1 text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Potwierdzenie hasła jest wymagane</span>
                  <span *ngIf="registerForm.get('confirmPassword')?.errors?.['passwordMismatch']">Hasła nie są identyczne</span>
                </small>
              </div>

              <!-- Submit Button -->
              <p-button
                type="submit"
                label="Zarejestruj się"
                icon="pi pi-user-plus"
                [disabled]="registerForm.invalid || isSubmitting()"
                [loading]="isSubmitting()"
                styleClass="w-full justify-center"
                aria-label="Zarejestruj nowe konto"
              ></p-button>

              <!-- Success Message -->
              <div 
                *ngIf="showSuccessMessage()" 
                class="mt-4"
                role="status"
                aria-live="polite"
              >
                <p-message 
                  severity="success" 
                  text="Rejestracja zakończona pomyślnie! Link aktywacyjny został wysłany na podany adres email."
                  styleClass="w-full"
                ></p-message>
              </div>
            </form>
          </div>

          <ng-template pTemplate="footer">
            <div class="text-center text-sm text-gray-500">
              <p>© 2025 UKNF Communication Platform</p>
              <p class="mt-1">Wszelkie prawa zastrzeżone</p>
            </div>
          </ng-template>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-card {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border-radius: 12px;
      }

      .p-card-header {
        border-bottom: 1px solid #e5e7eb;
      }

      .p-card-body {
        padding: 2rem;
      }

      .p-card-footer {
        border-top: 1px solid #e5e7eb;
        padding: 1.5rem 2rem;
        background-color: #f9fafb;
      }

      .p-inputtext,
      .p-password input,
      .p-inputmask input {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        transition: all 0.2s;
        font-size: 1rem;
      }

      .p-inputtext:focus,
      .p-password input:focus,
      .p-inputmask input:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        outline: none;
      }

      .border-red-500 .p-inputtext,
      .border-red-500 input {
        border-color: #ef4444 !important;
      }

      .p-button {
        padding: 0.75rem 1.5rem;
        font-weight: 600;
        border-radius: 8px;
        transition: all 0.2s;
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        border: none;
      }

      .p-button:hover:not(:disabled) {
        background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
      }

      .p-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .p-password-panel {
        padding: 1rem;
        margin-top: 0.5rem;
      }

      .p-message {
        margin: 0;
      }

      .p-message-success {
        background-color: #d1fae5;
        border: 1px solid #6ee7b7;
        color: #065f46;
      }
    }

    .animate-fadeIn {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 640px) {
      :host ::ng-deep .p-card-body {
        padding: 1.5rem;
      }
    }
  `]
})
export class AuthComponent {
  private fb = new FormBuilder();
  
  // Signals for state management
  isLoginMode = signal(true);
  isSubmitting = signal(false);
  showSuccessMessage = signal(false);

  // Login Form
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  // Registration Form
  registerForm: FormGroup = this.fb.group({
    firstName: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/)
    ]],
    lastName: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/)
    ]],
    pesel: ['', [Validators.required, this.peselValidator]],
    phone: ['', [
      Validators.required,
      Validators.pattern(/^\d{3}-\d{3}-\d{3}$/)
    ]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    ]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  /**
   * Toggle between login and registration modes
   */
  setMode(isLogin: boolean): void {
    this.isLoginMode.set(isLogin);
    this.showSuccessMessage.set(false);
    
    // Reset forms when switching modes
    if (isLogin) {
      this.loginForm.reset();
    } else {
      this.registerForm.reset();
    }
  }

  /**
   * Handle login form submission
   */
  async onLoginSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isSubmitting.set(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const loginData = this.loginForm.value;
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', loginData.email);
    console.log('Password:', '***masked***');
    console.log('Timestamp:', new Date().toISOString());
    console.log('==================');

    // Simulate successful login
    this.showSuccessMessage.set(true);
    this.isSubmitting.set(false);

    // Hide success message after 5 seconds
    setTimeout(() => {
      this.showSuccessMessage.set(false);
    }, 5000);
  }

  /**
   * Handle registration form submission
   */
  async onRegisterSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isSubmitting.set(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const registerData = this.registerForm.value;
    const maskedPesel = this.maskPesel(registerData.pesel);
    
    console.log('=== REGISTRATION ATTEMPT ===');
    console.log('First Name:', registerData.firstName);
    console.log('Last Name:', registerData.lastName);
    console.log('PESEL (masked):', maskedPesel);
    console.log('Phone:', registerData.phone);
    console.log('Email:', registerData.email);
    console.log('Password:', '***masked***');
    console.log('Timestamp:', new Date().toISOString());
    console.log('');
    console.log('📧 ACTIVATION LINK SENT TO:', registerData.email);
    console.log('Activation Link:', `https://uknf.gov.pl/activate?token=${this.generateMockToken()}`);
    console.log('========================');

    // Simulate successful registration
    this.showSuccessMessage.set(true);
    this.isSubmitting.set(false);

    // Reset form after successful registration
    setTimeout(() => {
      this.registerForm.reset();
      this.showSuccessMessage.set(false);
    }, 8000);
  }

  /**
   * Custom validator for PESEL number
   * Validates that PESEL is exactly 11 digits and passes checksum validation
   */
  private peselValidator(control: AbstractControl): ValidationErrors | null {
    const pesel = control.value?.replace(/-/g, '');
    
    if (!pesel) {
      return null; // Let required validator handle empty values
    }

    // Check if PESEL has exactly 11 digits
    if (!/^\d{11}$/.test(pesel)) {
      return { invalidPesel: true };
    }

    // PESEL checksum validation
    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    const digits = pesel.split('').map(Number);
    const sum = weights.reduce((acc, weight, i) => acc + weight * digits[i], 0);
    const checksum = (10 - (sum % 10)) % 10;

    if (checksum !== digits[10]) {
      return { invalidPesel: true };
    }

    return null;
  }

  /**
   * Custom validator to check if passwords match
   */
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    if (password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Clear the error if passwords match
    const confirmPasswordControl = group.get('confirmPassword');
    if (confirmPasswordControl?.hasError('passwordMismatch')) {
      confirmPasswordControl.setErrors(null);
    }

    return null;
  }

  /**
   * Mark all fields in a form group as touched to trigger validation messages
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Mask PESEL to show only last 4 digits
   */
  private maskPesel(pesel: string): string {
    const cleaned = pesel.replace(/-/g, '');
    if (cleaned.length !== 11) {
      return pesel;
    }
    return '*******' + cleaned.slice(-4);
  }

  /**
   * Generate a mock activation token for demonstration
   */
  private generateMockToken(): string {
    return Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }
}

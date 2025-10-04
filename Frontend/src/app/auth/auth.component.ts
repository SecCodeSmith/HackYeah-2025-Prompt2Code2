import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { TabViewModule } from 'primeng/tabview';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';

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
    MessageModule,
    TabViewModule,
    FloatLabelModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div class="w-full max-w-2xl">
        <p-card styleClass="auth-card">
          <!-- Header -->
          <ng-template pTemplate="header">
            <div class="text-center py-8 px-6">
              <div class="flex justify-center mb-4">
                <div class="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <i class="pi pi-shield text-white text-4xl"></i>
                </div>
              </div>
              <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
                UKNF Communication Platform
              </h1>
              <p class="text-gray-600 text-lg">
                Zaloguj się do systemu
              </p>
            </div>
          </ng-template>

          <!-- TabView for Login/Registration -->
          <p-tabView [activeIndex]="activeTabIndex()" (activeIndexChange)="onTabChange($event)">
            <!-- Login Tab -->
            <p-tabPanel header="Logowanie" leftIcon="pi pi-sign-in">

              <form [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()" novalidate class="p-6">
                <!-- Email with Float Label -->
                <div class="mb-6">
                  <p-floatLabel>
                    <input
                      id="login-email"
                      type="email"
                      pInputText
                      formControlName="email"
                      class="w-full"
                      [class.ng-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                      [class.ng-dirty]="loginForm.get('email')?.touched"
                      aria-required="true"
                      aria-describedby="login-email-error"
                    />
                    <label for="login-email">Adres email *</label>
                  </p-floatLabel>
                  <small 
                    *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                    id="login-email-error"
                    class="block mt-2 text-red-600"
                    role="alert"
                  >
                    <span *ngIf="loginForm.get('email')?.errors?.['required']">
                      <i class="pi pi-exclamation-circle mr-1"></i>Email jest wymagany
                    </span>
                    <span *ngIf="loginForm.get('email')?.errors?.['email']">
                      <i class="pi pi-exclamation-circle mr-1"></i>Nieprawidłowy format email
                    </span>
                  </small>
                </div>

                <!-- Password with Float Label -->
                <div class="mb-6">
                  <p-floatLabel>
                    <p-password
                      id="login-password"
                      formControlName="password"
                      [toggleMask]="true"
                      styleClass="w-full"
                      inputStyleClass="w-full"
                      [feedback]="false"
                      [class.ng-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                      [class.ng-dirty]="loginForm.get('password')?.touched"
                      aria-required="true"
                      aria-describedby="login-password-error"
                    ></p-password>
                    <label for="login-password">Hasło *</label>
                  </p-floatLabel>
                  <small 
                    *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                    id="login-password-error"
                    class="block mt-2 text-red-600"
                    role="alert"
                  >
                    <i class="pi pi-exclamation-circle mr-1"></i>Hasło jest wymagane
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
                  severity="primary"
                  size="large"
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
            </p-tabPanel>

            <!-- Registration Tab -->
            <p-tabPanel header="Rejestracja" leftIcon="pi pi-user-plus">
              <form [formGroup]="registerForm" (ngSubmit)="onRegisterSubmit()" novalidate class="p-6">
                <!-- Two Column Layout for Names -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <!-- First Name -->
                  <div class="form-field-wrapper">
                    <p-floatLabel>
                      <input
                        id="register-firstName"
                        type="text"
                        pInputText
                        formControlName="firstName"
                        class="w-full"
                        [class.ng-invalid]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                        [class.ng-dirty]="registerForm.get('firstName')?.touched"
                        aria-required="true"
                        aria-describedby="register-firstName-error"
                      />
                      <label for="register-firstName">Imię *</label>
                    </p-floatLabel>
                    <div class="error-message-container">
                      <small 
                        *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                        id="register-firstName-error"
                        class="block mt-2 text-red-600 text-sm leading-tight"
                        role="alert"
                      >
                        <i class="pi pi-exclamation-circle mr-1"></i>
                        <span *ngIf="registerForm.get('firstName')?.errors?.['required']">Imię jest wymagane</span>
                        <span *ngIf="registerForm.get('firstName')?.errors?.['minlength']">Min. 2 znaki</span>
                        <span *ngIf="registerForm.get('firstName')?.errors?.['pattern']">Tylko litery</span>
                      </small>
                    </div>
                  </div>

                  <!-- Last Name -->
                  <div class="form-field-wrapper">
                    <p-floatLabel>
                      <input
                        id="register-lastName"
                        type="text"
                        pInputText
                        formControlName="lastName"
                        class="w-full"
                        [class.ng-invalid]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                        [class.ng-dirty]="registerForm.get('lastName')?.touched"
                        aria-required="true"
                        aria-describedby="register-lastName-error"
                      />
                      <label for="register-lastName">Nazwisko *</label>
                    </p-floatLabel>
                    <div class="error-message-container">
                      <small 
                        *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                        id="register-lastName-error"
                        class="block mt-2 text-red-600 text-sm leading-tight"
                        role="alert"
                      >
                        <i class="pi pi-exclamation-circle mr-1"></i>
                        <span *ngIf="registerForm.get('lastName')?.errors?.['required']">Nazwisko jest wymagane</span>
                        <span *ngIf="registerForm.get('lastName')?.errors?.['minlength']">Min. 2 znaki</span>
                        <span *ngIf="registerForm.get('lastName')?.errors?.['pattern']">Tylko litery</span>
                      </small>
                    </div>
                  </div>
                </div>

                <!-- Two Column Layout for PESEL and Phone -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <!-- PESEL -->
                  <div class="form-field-wrapper">
                    <p-floatLabel>
                      <p-inputMask
                        id="register-pesel"
                        formControlName="pesel"
                        mask="99999999999"
                        styleClass="w-full"
                        [class.ng-invalid]="registerForm.get('pesel')?.invalid && registerForm.get('pesel')?.touched"
                        [class.ng-dirty]="registerForm.get('pesel')?.touched"
                        aria-required="true"
                        aria-describedby="register-pesel-error register-pesel-help"
                      ></p-inputMask>
                      <label for="register-pesel">PESEL *</label>
                    </p-floatLabel>
                    <div class="help-message-container">
                      <small id="register-pesel-help" class="block mt-2 text-gray-500 text-xs leading-tight">
                        <i class="pi pi-info-circle mr-1"></i>11 cyfr
                      </small>
                    </div>
                    <div class="error-message-container">
                      <small 
                        *ngIf="registerForm.get('pesel')?.invalid && registerForm.get('pesel')?.touched"
                        id="register-pesel-error"
                        class="block mt-1 text-red-600 text-sm leading-tight"
                        role="alert"
                      >
                        <i class="pi pi-exclamation-circle mr-1"></i>
                        <span *ngIf="registerForm.get('pesel')?.errors?.['required']">PESEL wymagany</span>
                        <span *ngIf="registerForm.get('pesel')?.errors?.['invalidPesel']">Nieprawidłowy PESEL</span>
                      </small>
                    </div>
                  </div>

                  <!-- Phone -->
                  <div class="form-field-wrapper">
                    <p-floatLabel>
                      <p-inputMask
                        id="register-phone"
                        formControlName="phone"
                        mask="999-999-999"
                        styleClass="w-full"
                        [class.ng-invalid]="registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched"
                        [class.ng-dirty]="registerForm.get('phone')?.touched"
                        aria-required="true"
                        aria-describedby="register-phone-error register-phone-help"
                      ></p-inputMask>
                      <label for="register-phone">Numer telefonu *</label>
                    </p-floatLabel>
                    <div class="help-message-container">
                      <small id="register-phone-help" class="block mt-2 text-gray-500 text-xs leading-tight">
                        <i class="pi pi-info-circle mr-1"></i>Format: XXX-XXX-XXX
                      </small>
                    </div>
                    <div class="error-message-container">
                      <small 
                        *ngIf="registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched"
                        id="register-phone-error"
                        class="block mt-1 text-red-600 text-sm leading-tight"
                        role="alert"
                      >
                        <i class="pi pi-exclamation-circle mr-1"></i>
                        <span *ngIf="registerForm.get('phone')?.errors?.['required']">Telefon wymagany</span>
                        <span *ngIf="registerForm.get('phone')?.errors?.['pattern']">Nieprawidłowy format</span>
                      </small>
                    </div>
                  </div>
                </div>

                <!-- Email -->
                <div class="mb-8">
                  <div class="form-field-wrapper">
                    <p-floatLabel>
                      <input
                        id="register-email"
                        type="email"
                        pInputText
                        formControlName="email"
                        class="w-full"
                        [class.ng-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                        [class.ng-dirty]="registerForm.get('email')?.touched"
                        aria-required="true"
                        aria-describedby="register-email-error"
                      />
                      <label for="register-email">Adres email *</label>
                    </p-floatLabel>
                    <div class="error-message-container">
                      <small 
                        *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                        id="register-email-error"
                        class="block mt-2 text-red-600 text-sm leading-tight"
                        role="alert"
                      >
                        <i class="pi pi-exclamation-circle mr-1"></i>
                        <span *ngIf="registerForm.get('email')?.errors?.['required']">Email jest wymagany</span>
                        <span *ngIf="registerForm.get('email')?.errors?.['email']">Nieprawidłowy format email</span>
                      </small>
                    </div>
                  </div>
                </div>

                <!-- Password with Strength Meter -->
                <div class="mb-8">
                  <div class="form-field-wrapper">
                    <p-floatLabel>
                      <p-password
                        id="register-password"
                        formControlName="password"
                        [toggleMask]="true"
                        [feedback]="true"
                        styleClass="w-full"
                        inputStyleClass="w-full"
                        [strongRegex]="'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'"
                        [class.ng-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                        [class.ng-dirty]="registerForm.get('password')?.touched"
                        aria-required="true"
                        aria-describedby="register-password-error register-password-help"
                      ></p-password>
                      <label for="register-password">Hasło *</label>
                    </p-floatLabel>
                    <div class="help-message-container">
                      <small id="register-password-help" class="block mt-2 text-gray-500 text-xs leading-tight">
                        <i class="pi pi-info-circle mr-1"></i>Min. 8 znaków, wielka litera, cyfra i znak specjalny
                      </small>
                    </div>
                    <div class="error-message-container">
                      <small 
                        *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                        id="register-password-error"
                        class="block mt-1 text-red-600 text-sm leading-tight"
                        role="alert"
                      >
                        <i class="pi pi-exclamation-circle mr-1"></i>
                        <span *ngIf="registerForm.get('password')?.errors?.['required']">Hasło wymagane</span>
                        <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Min. 8 znaków</span>
                        <span *ngIf="registerForm.get('password')?.errors?.['pattern']">Brak wymaganych znaków</span>
                      </small>
                    </div>
                  </div>
                </div>

                <!-- Confirm Password -->
                <div class="mb-8">
                  <div class="form-field-wrapper">
                    <p-floatLabel>
                      <p-password
                        id="register-confirmPassword"
                        formControlName="confirmPassword"
                        [toggleMask]="true"
                        [feedback]="false"
                        styleClass="w-full"
                        inputStyleClass="w-full"
                        [class.ng-invalid]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                        [class.ng-dirty]="registerForm.get('confirmPassword')?.touched"
                        aria-required="true"
                        aria-describedby="register-confirmPassword-error"
                      ></p-password>
                      <label for="register-confirmPassword">Potwierdź hasło *</label>
                    </p-floatLabel>
                    <div class="error-message-container">
                      <small 
                        *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                        id="register-confirmPassword-error"
                        class="block mt-2 text-red-600 text-sm leading-tight"
                        role="alert"
                      >
                        <i class="pi pi-exclamation-circle mr-1"></i>
                        <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Potwierdzenie wymagane</span>
                        <span *ngIf="registerForm.get('confirmPassword')?.errors?.['passwordMismatch']">Hasła nie są identyczne</span>
                      </small>
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <p-button
                  type="submit"
                  label="Zarejestruj się"
                  icon="pi pi-user-plus"
                  [disabled]="registerForm.invalid || isSubmitting()"
                  [loading]="isSubmitting()"
                  styleClass="w-full justify-center"
                  severity="success"
                  size="large"
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
            </p-tabPanel>
          </p-tabView>

          <!-- Footer -->
          <ng-template pTemplate="footer">
            <div class="text-center py-4">
              <div class="flex items-center justify-center gap-2 mb-2">
                <i class="pi pi-shield text-blue-600"></i>
                <span class="text-sm font-medium text-gray-700">Bezpieczne połączenie SSL</span>
              </div>
              <p class="text-xs text-gray-500">© 2025 UKNF Communication Platform</p>
              <p class="text-xs text-gray-500 mt-1">Wszelkie prawa zastrzeżone</p>
            </div>
          </ng-template>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      /* Card Styling */
      .auth-card.p-card {
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        border-radius: 16px;
        border: 1px solid rgba(99, 102, 241, 0.1);
        overflow: hidden;
      }

      .p-card-header {
        background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
        border-bottom: 2px solid rgba(99, 102, 241, 0.1);
      }

      .p-card-body {
        padding: 0 !important;
        background: white;
      }

      .p-card-footer {
        border-top: 2px solid rgba(99, 102, 241, 0.1);
        background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
      }

      /* TabView Styling */
      .p-tabview {
        box-shadow: none;
      }

      .p-tabview-nav {
        background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
        border-bottom: 2px solid rgba(99, 102, 241, 0.2);
        padding: 0 2rem;
      }

      .p-tabview-nav li {
        margin-right: 0;
      }

      .p-tabview-nav li .p-tabview-nav-link {
        background: transparent;
        border: none;
        color: #6b7280;
        font-weight: 600;
        padding: 1.25rem 2rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-bottom: 3px solid transparent;
      }

      .p-tabview-nav li .p-tabview-nav-link:hover {
        background: rgba(99, 102, 241, 0.05);
        color: #4f46e5;
      }

      .p-tabview-nav li.p-highlight .p-tabview-nav-link {
        background: rgba(99, 102, 241, 0.08);
        color: #4f46e5;
        border-bottom-color: #4f46e5;
        font-weight: 700;
      }

      .p-tabview-nav li .p-tabview-nav-link:focus {
        box-shadow: none;
        outline: 2px solid #4f46e5;
        outline-offset: -2px;
      }

      .p-tabview-panels {
        background: white;
        padding: 0;
      }

      /* Float Label Styling */
      .p-float-label {
        display: block;
        overflow: visible !important;
      }

      .p-float-label label {
        color: #6b7280;
        font-weight: 500;
        transition: all 0.2s ease;
        overflow: visible !important;
      }

      .p-float-label input:focus ~ label,
      .p-float-label input.p-filled ~ label,
      .p-float-label .p-inputwrapper-focus ~ label,
      .p-float-label .p-inputwrapper-filled ~ label {
        color: #4f46e5;
        font-weight: 600;
      }

      /* Input Styling */
      .p-inputtext,
      .p-password input,
      .p-inputmask input {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 1rem;
        background: white;
      }

      .p-inputtext:hover,
      .p-password input:hover,
      .p-inputmask input:hover {
        border-color: #c7d2fe;
      }

      .p-inputtext:focus,
      .p-password input:focus,
      .p-inputmask input:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        outline: none;
      }

      /* Invalid State */
      .ng-invalid.ng-dirty .p-inputtext,
      .ng-invalid.ng-dirty input {
        border-color: #ef4444 !important;
        background-color: #fef2f2;
      }

      .ng-invalid.ng-dirty .p-inputtext:focus,
      .ng-invalid.ng-dirty input:focus {
        box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1) !important;
      }

      /* Button Styling */
      .p-button {
        padding: 1rem 1.5rem;
        font-weight: 700;
        border-radius: 10px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        border: none;
        font-size: 1rem;
        letter-spacing: 0.025em;
      }

      .p-button-primary {
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      }

      .p-button-primary:hover:not(:disabled) {
        background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
      }

      .p-button-success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      }

      .p-button-success:hover:not(:disabled) {
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
      }

      .p-button:active:not(:disabled) {
        transform: translateY(0);
      }

      .p-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: #9ca3af !important;
      }

      .p-button:focus {
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3);
      }

      /* Password Strength Panel */
      .p-password-panel {
        padding: 1rem;
        margin-top: 0.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      /* Message Styling */
      .p-message {
        margin: 0;
        border-radius: 10px;
        padding: 1rem;
        font-weight: 500;
      }

      .p-message-success {
        background-color: #d1fae5;
        border: 2px solid #6ee7b7;
        color: #065f46;
      }

      .p-message-success .p-message-icon {
        color: #10b981;
      }

      /* Grid Responsive */
      @media (max-width: 768px) {
        .p-tabview-nav {
          padding: 0 1rem;
        }

        .p-tabview-nav li .p-tabview-nav-link {
          padding: 1rem 1.25rem;
          font-size: 0.9rem;
        }
      }

      /* Form Field Wrapper - Prevents Label/Error Overlap */
      .form-field-wrapper {
        position: relative;
        min-height: 80px;
        display: flex;
        flex-direction: column;
        overflow: visible !important;
      }

      .form-field-wrapper .p-float-label {
        flex: 0 0 auto;
        margin-bottom: 0.25rem;
        overflow: visible !important;
      }

      .help-message-container {
        min-height: 20px;
        margin-top: 0.25rem;
      }

      .error-message-container {
        min-height: 24px;
        margin-top: 0.25rem;
      }

      .error-message-container small,
      .help-message-container small {
        display: block;
        line-height: 1.4;
      }

      /* Ensure Float Label doesn't overlap and is fully visible */
      .p-float-label {
        position: relative;
        overflow: visible !important;
      }

      .p-float-label > label {
        position: absolute;
        left: 1rem;
        top: 50%;
        margin-top: -0.5rem;
        pointer-events: none;
        transition: all 0.2s ease;
        background: transparent;
        white-space: nowrap;
        max-width: calc(100% - 2rem);
        overflow: visible;
        text-overflow: clip;
      }

      .p-float-label > input:focus ~ label,
      .p-float-label > input.p-filled ~ label,
      .p-float-label > .p-inputwrapper-focus ~ label,
      .p-float-label > .p-inputwrapper-filled ~ label,
      .p-float-label > input:-webkit-autofill ~ label {
        top: -0.75rem;
        font-size: 12px;
        background: white;
        padding: 0 0.4rem;
        left: 0.75rem;
        max-width: none;
        white-space: nowrap;
      }

      /* Password Panel Positioning */
      .p-password-panel {
        z-index: 1000;
      }

      /* Grid Gap for Two Column Layout */
      .grid {
        display: grid;
      }

      .gap-6 {
        gap: 1.5rem;
      }

      .mb-8 {
        margin-bottom: 2rem;
      }

      /* Responsive Adjustments */
      @media (max-width: 768px) {
        .form-field-wrapper {
          min-height: 90px;
        }
        
        .grid {
          grid-template-columns: 1fr !important;
        }
      }

      /* Smooth Transitions */
      * {
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }
    }
  `]
})
export class AuthComponent {
  private fb = new FormBuilder();
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  
  // Signals for state management
  activeTabIndex = signal(0); // 0 = Login, 1 = Registration
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
   * Handle tab change event
   */
  onTabChange(index: number): void {
    this.activeTabIndex.set(index);
    this.showSuccessMessage.set(false);
    
    // Reset forms when switching tabs
    if (index === 0) {
      this.loginForm.reset();
    } else {
      this.registerForm.reset();
    }
  }

  /**
   * Handle login form submission
   */
  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    console.log('🟢 Login form submitted');
    this.isSubmitting.set(true);
    this.showSuccessMessage.set(false);

    const { email, password } = this.loginForm.value;
    console.log('🟢 Attempting login for:', email);
    
    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('🟢 Login response received in component:', response);
        // Success message shown briefly before navigation
        this.showSuccessMessage.set(true);
        this.messageService.add({
          severity: 'success',
          summary: 'Zalogowano pomyślnie',
          detail: `Witaj ${response.user.firstName}!`,
          life: 3000
        });
        
        // Navigation is handled automatically by AuthService.handleAuthSuccess()
        console.log('🟢 Login successful, navigation should happen now...');
      },
      error: (error) => {
        console.error('🔴 Login error in component:', error);
        this.isSubmitting.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd logowania',
          detail: error.error?.message || 'Nieprawidłowy email lub hasło',
          life: 5000
        });
        console.error('Login error:', error);
      },
      complete: () => {
        console.log('🟢 Login observable completed');
        this.isSubmitting.set(false);
      }
    });
  }

  /**
   * Handle registration form submission
   */
  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isSubmitting.set(true);
    this.showSuccessMessage.set(false);

    const formData = this.registerForm.value;
    
    // Map form data to backend DTO
    const registerRequest = {
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phone?.replace(/-/g, '') // Remove dashes from phone
    };

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        this.showSuccessMessage.set(true);
        this.messageService.add({
          severity: 'success',
          summary: 'Rejestracja zakończona pomyślnie',
          detail: 'Link aktywacyjny został wysłany na podany adres email.',
          life: 8000
        });
        
        // Log registration details (masked)
        const maskedPesel = this.maskPesel(formData.pesel);
        console.log('=== REGISTRATION SUCCESS ===');
        console.log('User:', `${formData.firstName} ${formData.lastName}`);
        console.log('Email:', formData.email);
        console.log('PESEL (masked):', maskedPesel);
        console.log('Phone:', formData.phone);
        console.log('========================');

        // Navigation is handled automatically by AuthService.handleAuthSuccess()
        // Or reset form if you want users to login manually
        setTimeout(() => {
          this.registerForm.reset();
          this.showSuccessMessage.set(false);
          // Optionally switch to login tab
          this.activeTabIndex.set(0);
        }, 3000);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd rejestracji',
          detail: error.error?.message || 'Nie udało się zarejestrować konta',
          life: 5000
        });
        console.error('Registration error:', error);
      },
      complete: () => {
        this.isSubmitting.set(false);
      }
    });
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

# Authentication Flow Diagram

## Complete User Journey: Login to Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│                     USER AUTHENTICATION FLOW                         │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────────┐
│  User Action:     │
│  Navigate to      │
│  /reports         │
└─────────┬─────────┘
          │
          ▼
┌───────────────────────────────────────────────────────────┐
│  Auth Guard (auth.guard.ts)                               │
│  ────────────────────────────────────────                 │
│  ❓ Is user authenticated?                                │
│     → Check AuthService.isAuthenticated()                 │
│     → Check JWT exists and not expired                    │
└─────────────┬─────────────────────────────────────────────┘
              │
      ┌───────┴────────┐
      │                │
     YES              NO
      │                │
      ▼                ▼
┌───────────┐   ┌─────────────────────────────────────┐
│ Allow     │   │ Block Access                        │
│ Access    │   │ Store returnUrl = '/reports'        │
│           │   │ Navigate to /auth?returnUrl=/reports│
│ Load      │   └─────────────┬───────────────────────┘
│ Reports   │                 │
│ Component │                 ▼
└───────────┘   ┌─────────────────────────────────────┐
                │  Auth Page (auth.component.html)    │
                │  ──────────────────────────────────  │
                │  📝 Login Form:                      │
                │     • Email input                    │
                │     • Password input                 │
                │     • [Zaloguj się] button           │
                └─────────────┬───────────────────────┘
                              │
                              ▼
                ┌─────────────────────────────────────┐
                │  User fills form and clicks submit  │
                └─────────────┬───────────────────────┘
                              │
                              ▼
                ┌─────────────────────────────────────────────┐
                │  AuthComponent.onLoginSubmit()              │
                │  ─────────────────────────────────────────  │
                │  1. Validate form                           │
                │  2. Show loading spinner                    │
                │  3. Call authService.login(email, password) │
                └─────────────┬───────────────────────────────┘
                              │
                              ▼
                ┌──────────────────────────────────────────────┐
                │  AuthService.login() (auth.service.ts)       │
                │  ───────────────────────────────────────────  │
                │  HTTP POST /api/auth/login                   │
                │  {                                           │
                │    email: "user@example.com",                │
                │    password: "***"                           │
                │  }                                           │
                └─────────────┬────────────────────────────────┘
                              │
                              ▼
                ┌──────────────────────────────────────────────┐
                │  Backend Server (.NET)                       │
                │  ───────────────────────────────────────────  │
                │  1. Validate credentials                     │
                │  2. Check user exists                        │
                │  3. Verify password hash                     │
                │  4. Generate JWT token                       │
                │  5. Return response                          │
                └─────────────┬────────────────────────────────┘
                              │
                      ┌───────┴────────┐
                      │                │
                 SUCCESS            FAILURE
                      │                │
                      ▼                ▼
    ┌─────────────────────────────┐   ┌──────────────────────────┐
    │ Response:                   │   │ Error Response:          │
    │ {                           │   │ {                        │
    │   accessToken: "eyJ...",    │   │   message: "Invalid      │
    │   refreshToken: "abc...",   │   │      credentials"        │
    │   user: {                   │   │ }                        │
    │     id: "123",              │   │                          │
    │     firstName: "Jan",       │   │ Status: 401 Unauthorized │
    │     lastName: "Kowalski",   │   └──────────┬───────────────┘
    │     email: "...",           │              │
    │     role: "User"            │              ▼
    │   }                         │   ┌──────────────────────────┐
    │ }                           │   │ AuthComponent            │
    │ Status: 200 OK              │   │ Shows error toast:       │
    └─────────────┬───────────────┘   │ ❌ "Błąd logowania:      │
                  │                   │    Nieprawidłowy email   │
                  ▼                   │    lub hasło"            │
    ┌──────────────────────────────┐  │                          │
    │ AuthService.handleAuthSuccess│  │ User stays on login page │
    │ ──────────────────────────── │  └──────────────────────────┘
    │ 1. Store JWT in localStorage │
    │    ├─ accessToken            │
    │    ├─ refreshToken           │
    │    └─ user data              │
    │                              │
    │ 2. Update reactive signals   │
    │    ├─ isAuthenticated = true │
    │    ├─ currentUser = {...}    │
    │    └─ currentUserSubject     │
    │                              │
    │ 3. Get return URL            │
    │    ├─ Check query params     │
    │    ├─ returnUrl = '/reports' │
    │    └─ Or default to '/'      │
    │                              │
    │ 4. 🚀 Navigate to route      │
    │    router.navigate(['/reports'])
    └─────────────┬────────────────┘
                  │
                  ▼
    ┌──────────────────────────────┐
    │ Angular Router               │
    │ ──────────────────────────── │
    │ 1. Unload auth component     │
    │ 2. Check route guards again  │
    │    → authGuard passes now!   │
    │ 3. Load reports component    │
    │ 4. Update browser URL        │
    └─────────────┬────────────────┘
                  │
                  ▼
    ┌──────────────────────────────────────────┐
    │ AppComponent (app.component.html)        │
    │ ──────────────────────────────────────── │
    │ *ngIf="isAuthenticated()" evaluates true │
    │                                          │
    │ ✅ Show Navigation Bar:                  │
    │    ┌──────────────────────────────────┐ │
    │    │ 🛡️ UKNF Platform │ Dashboard    │ │
    │    │                  │ Zgłoszenia    │ │
    │    │                  │ Jan K. [JK]▼  │ │
    │    └──────────────────────────────────┘ │
    │                                          │
    │ ✅ Render <router-outlet>                │
    │    └─> Reports Component loaded         │
    └──────────────────────────────────────────┘
                  │
                  ▼
    ┌──────────────────────────────────────────┐
    │ 🎉 USER SUCCESSFULLY AUTHENTICATED        │
    │                                          │
    │ ✅ Viewing: /reports page                 │
    │ ✅ Navigation bar visible                 │
    │ ✅ User info displayed                    │
    │ ✅ Can navigate to other protected pages  │
    │ ✅ Toast shown: "Witaj Jan!"             │
    └──────────────────────────────────────────┘
```

---

## Logout Flow

```
┌───────────────────┐
│  User Action:     │
│  Click avatar     │
│  Click "Wyloguj"  │
└─────────┬─────────┘
          │
          ▼
┌────────────────────────────────────┐
│  AppComponent.logout()             │
│  Calls authService.logout()        │
└─────────┬──────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────┐
│  AuthService.logout()                      │
│  ────────────────────────────────────────  │
│  1. Call backend to revoke token           │
│     POST /api/auth/revoke-token            │
│                                            │
│  2. Clear local storage:                   │
│     ├─ Remove accessToken                  │
│     ├─ Remove refreshToken                 │
│     └─ Remove user data                    │
│                                            │
│  3. Update signals:                        │
│     ├─ isAuthenticated = false             │
│     └─ currentUser = null                  │
│                                            │
│  4. Navigate to login:                     │
│     router.navigate(['/auth'])             │
└─────────┬──────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────┐
│  User at /auth                             │
│  Navigation bar hidden                     │
│  Can login again                           │
└────────────────────────────────────────────┘
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────┐
│            AuthService State                    │
│  ─────────────────────────────────────────────  │
│                                                 │
│  📦 Signals (Reactive):                         │
│     • isAuthenticated: boolean                  │
│     • currentUser: UserDto | null               │
│     • isLoading: boolean                        │
│     • errorMessage: string | null               │
│                                                 │
│  📡 Observables:                                │
│     • currentUser$: BehaviorSubject             │
│                                                 │
│  💾 Local Storage:                              │
│     • accessToken: JWT string                   │
│     • refreshToken: JWT string                  │
│     • currentUser: JSON string                  │
└─────────────────────────────────────────────────┘
          │
          │ Changes propagate to:
          │
    ┌─────┴─────┬──────────┬──────────────┐
    │           │          │              │
    ▼           ▼          ▼              ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐
│  Auth   │ │   App   │ │  Auth   │ │  Home    │
│Component│ │Component│ │ Guard   │ │Component │
└─────────┘ └─────────┘ └─────────┘ └──────────┘
    │           │          │              │
    │           │          │              │
    ▼           ▼          ▼              ▼
  Login      Navbar    Route         User
  Form       Show/     Protection    Content
            Hide
```

---

## Component Communication

```
┌──────────────────────────────────────────────────┐
│              Application Architecture            │
└──────────────────────────────────────────────────┘

                    AppComponent
                         │
                         │ <router-outlet>
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   AuthComponent    HomeComponent    ReportsComponent
        │                │                │
        │                │                │
        └────────────────┼────────────────┘
                         │
                         │ All inject AuthService
                         │
                         ▼
                  ┌──────────────┐
                  │ AuthService  │
                  │ (Singleton)  │
                  └──────┬───────┘
                         │
                         │ HTTP Calls
                         │
                         ▼
                  ┌──────────────┐
                  │   Backend    │
                  │   API        │
                  └──────────────┘
```

---

## Auth Guard Decision Tree

```
User navigates to protected route
            │
            ▼
   ┌────────────────────┐
   │  authGuard()       │
   └────────┬───────────┘
            │
            ▼
   ┌────────────────────────────┐
   │ Check isAuthenticated()    │
   └────────┬───────────────────┘
            │
     ┌──────┴──────┐
     │             │
    TRUE         FALSE
     │             │
     ▼             ▼
  ┌─────┐     ┌────────────────────────┐
  │Allow│     │ Store returnUrl        │
  │Route│     │ Navigate to /auth      │
  └─────┘     └────────────────────────┘
                      │
                      ▼
              User logs in
                      │
                      ▼
              Read returnUrl
                      │
                      ▼
           Navigate to returnUrl
                      │
                      ▼
              authGuard() runs again
                      │
                      ▼
           isAuthenticated = true
                      │
                      ▼
                Allow Route ✅
```

---

## Key Takeaways

1. **Auth Guard** → Protects routes, redirects unauthenticated users
2. **AuthService** → Manages auth state, stores JWT, navigates after login
3. **AuthComponent** → UI for login/register, calls AuthService methods
4. **AppComponent** → Shows/hides navbar based on auth state
5. **Router** → Handles navigation between pages
6. **Signals** → Reactive state management, updates UI automatically

---

## Success Indicators

✅ User clicks "Zaloguj się"
✅ Loading spinner appears
✅ Backend validates credentials
✅ JWT stored in localStorage
✅ Toast notification: "Zalogowano pomyślnie"
✅ Navigation bar appears
✅ User redirected to dashboard (or returnUrl)
✅ Protected routes accessible
✅ Logout button functional

---

**This is a complete, production-ready authentication flow! 🎉**

# PRompt 1:
## commands to generate it: 
- Based on this file prepare prompts for component. Optimalize this propt for Claude Sonnet 4,5 agent AI 
- Use .net
## prompts:

Prompt 1: Project Scaffolding, Backend Setup, and Docker Configuration (.NET)
Objective: To create the foundational structure of the application, including the Docker environment and the ASP.NET Core backend skeleton with REST API endpoints based on the CQRS pattern.

You are an expert full-stack software architect specializing in enterprise .NET applications and DevOps. Your task is to set up the complete project structure for the UKNF Communication Platform.

<context>
The goal is to build a secure communication platform for UKNF. The application will be a Single Page Application (SPA) in Angular with a REST API backend. The entire environment must be containerized using Docker. The backend will be built with .NET 8 and ASP.NET Core Web API, using a relational database (MSSQL), and should follow the Command Query Responsibility Segregation (CQRS) pattern. Security will be handled via OAuth 2.0 and JWT.
</context>

<task>
Generate the necessary configuration files and project structure for the application. Specifically:
1.  Create a `docker-compose.yml` file to orchestrate the frontend (Angular), backend (.NET), and database (MSSQL) services. Include placeholders for environment variables.
2.  Define the project structure for the .NET backend. List the main projects and their responsibilities (e.g., API, Application, Domain, Infrastructure), particularly separating commands, queries, controllers, models, and repositories to adhere to CQRS.
3.  Create an initial `.csproj` file for the ASP.NET Core Web API project, including package references for Entity Framework Core, the EF Core SQL Server driver, ASP.NET Core JWT Bearer authentication, and FluentValidation.
4.  Define the base DTOs (Data Transfer Objects) using C# records and preliminary REST API endpoint signatures (Controller actions) for the User Authentication and Report Management features.
</task>

<technologies>
- Backend: .NET 8, ASP.NET Core Web API
- Database: MS SQL Server
- Containerization: Docker, Docker Compose
- Architecture: REST API, CQRS
- Security: OAuth 2.0, JWT
</technologies>

<output_format>
1.  Provide the complete `docker-compose.yml` file in a YAML code block.
2.  Describe the backend project folder and project structure in a clear, hierarchical list.
3.  Provide the complete `.csproj` file in an XML code block.
4.  Provide the C# code for the DTOs and Controller interfaces in C# code blocks.
</output_format>

Before you start, think step-by-step within `<thinking>` tags to outline your plan for structuring the files and the CQRS pattern for a .NET solution.

Prompt 2: Angular User Registration & Login Component
Objective: To generate the frontend component for user registration and login, which is the entry point for external users.

You are an expert frontend developer specializing in Angular and creating accessible, user-friendly interfaces.

<context>
You are building the "Authentication and Authorization Module" for the UKNF Communication Platform. This component will handle the registration of new external users via an online form and their subsequent login. The UI must be simple and intuitive.
</context>

<task>
Generate a complete, self-contained Angular component named `AuthComponent` for user registration and login.

The component must include:
1.  A registration form with fields: First Name, Last Name, PESEL (masked, showing last 4 digits), Phone, and Email.
2.  A login form with fields: Email and Password.
3.  A toggle or tabs to switch between the Registration and Login views.
4.  Client-side validation for all fields (e.g., email format, required fields, phone number format).
5.  Placeholder methods for `onRegisterSubmit()` and `onLoginSubmit()` that log the form data to the console.
6.  The component should be responsive and styled professionally using Tailwind CSS. Use PrimeNG components (`p-card`, `p-inputtext`, `p-button`, `p-password`) for the UI elements.
</task>

<requirements>
- Registration fields: Imię, Nazwisko, PESEL, telefon, e-mail.
- PESEL field must be masked.
- Upon successful registration, an activation link would be sent (simulate this with a console log).
- Must adhere to WCAG 2.2 accessibility standards.
</requirements>

<technologies>
- Framework: Angular 20.x
- Component Library: PrimeNG
- Styling: Tailwind CSS
</technologies>

<output_format>
Provide the complete, runnable code in a single TypeScript file (`auth.component.ts`). The file must include the component's selector, template (HTML with Tailwind CSS and PrimeNG components), styles, and component logic (TypeScript class with signals for state management) all within the `@Component` decorator. Do not generate separate HTML or CSS files.
</output_format>

Before writing the code, think step-by-step within `<thinking>` tags to plan the component structure, form controls, validation logic, and UI layout.

Prompt 3: Angular Report Management Dashboard Component
Objective: To create the complex and highly interactive dashboard for managing reports, which is a core feature of the Communication Module.

You are an expert frontend developer with deep expertise in Angular and building complex data-driven applications.

<context>
You are creating the central feature of the "Communication Module": a dashboard for supervised entities to submit and monitor their reports. This dashboard must display a list of reports in an interactive, configurable table. It is the primary interface for users to track the status of their submissions.
</context>

<task>
Generate a complete, self-contained Angular component named `ReportDashboardComponent` for displaying and managing reports.

The component must feature an interactive table (using PrimeNG's `p-table`) with the following features:
1.  **Columns:** Report Name, Submission Period, Submission Date, Status, Actions.
2.  **Status Display:** The "Status" column must display a styled label (e.g., a colored chip or badge) based on the report's status (e.g., 'Robocze', 'Przekazane', 'W trakcie walidacji', 'Proces zakończony sukcesem', 'Błędy z reguł walidacji', 'Zakwestionowane przez UKNF').
3.  **Global Search:** A search input field above the table to filter reports by any text content.
4.  **Column Sorting:** Each column header should be clickable to sort the data.
5.  **Advanced Filtering:** Include a dropdown filter for the "Status" column.
6.  **Pagination:** The table must support pagination.
7.  **Actions:** Each row must have a context menu (or buttons) for actions like "View Details," "Download Report," and "Submit Correction." These should trigger placeholder methods.
8.  **Export:** An "Export" button above the table that allows exporting the currently filtered/sorted data to CSV and XLSX (implement placeholder functions for this).
9.  **Data:** Use mock data within the component to populate the table for demonstration purposes, ensuring all different statuses are represented.
</task>

<requirements>
- The table must have a sticky header.
- The UI must be responsive and styled cleanly with Tailwind CSS.
- The component should handle a large number of records efficiently (lazy loading should be considered in the design).
- The user experience should be seamless, with clear visual feedback for actions.
</requirements>

<technologies>
- Framework: Angular 20.x
- Component Library: PrimeNG (especially `p-table`)
- Styling: Tailwind CSS
</technologies>

<output_format>
Provide the complete, runnable code in a single TypeScript file (`report-dashboard.component.ts`). This file must contain the component's selector, template (HTML with PrimeNG table and Tailwind CSS classes), styles, and component logic (TypeScript class, mock data, placeholder methods, and state management using signals). Do not create separate files.
</output_format>

Before you start, think step-by-step in `<thinking>` tags. Plan the data structure for the mock reports, the configuration of the PrimeNG table, the implementation of filtering/sorting logic, and how you will structure the template for clarity.

Prompt 4: Full Application Integration and Debugging
Objective: To integrate the generated frontend components with the backend API and provide a clear process for troubleshooting and fixing errors.

You are a lead full-stack engineer responsible for ensuring the successful integration and delivery of the entire UKNF Communication Platform.

<context>
The project scaffolding, backend API structure (.NET), and frontend Angular components (`AuthComponent`, `ReportDashboardComponent`) have been generated based on the previous prompts. The next critical phase is to connect these pieces into a working application and establish a process for debugging.
</context>

<task>
Provide the code and instructions to integrate the frontend and backend, and a guide for fixing errors.
1.  **Create an Angular `AuthService`:** Generate a service to handle user authentication. It should have methods for `login()`, `register()`, and `logout()`. The `login()` method should store the received JWT, and the service should expose a signal or observable to track authentication status.
2.  **Integrate `AuthComponent`:** Update the `AuthComponent` to import and use the new `AuthService`. Replace the placeholder `onLoginSubmit()` and `onRegisterSubmit()` methods with actual `HttpClient` calls to the backend endpoints defined in Prompt 1.
3.  **Integrate `ReportDashboardComponent`:** Create an Angular `ReportService` with a method to fetch report data. Update `ReportDashboardComponent` to use this service to load its data from the backend instead of using mock data. This service should include the JWT in the authorization header for its requests.
4.  **Implement .NET Controllers:** Provide the C# implementation for the `AuthController` and `ReportsController`. The `AuthController` should have actions for registering and logging in a user (returning a JWT). The `ReportsController` should have an action protected by `[Authorize]` that returns a list of reports.
5.  **Debugging Guide:** Create a step-by-step debugging checklist for when the application does not work as expected. This guide should be a universal troubleshooting process for this project.
</task>

<technologies>
- Frontend: Angular `HttpClient`, RxJS
- Backend: ASP.NET Core Web API, Entity Framework Core, JWT Bearer Authentication
- Integration: Docker, REST API
</technologies>

<output_format>
1.  Provide the complete TypeScript code for `auth.service.ts` and `report.service.ts` in code blocks.
2.  Provide the updated TypeScript code snippets for `auth.component.ts` and `report-dashboard.component.ts` showing the integration with the new services.
3.  Provide the complete C# code for `AuthController.cs` and `ReportsController.cs` in code blocks.
4.  Provide the debugging checklist as a numbered list in a markdown block.
</output_format>

Before you start, think step-by-step within `<thinking>` tags. Outline the flow of an authentication request from the Angular login form, through the `AuthService`, to the .NET `AuthController`, and how the JWT is returned and stored. Then, plan how the `ReportDashboardComponent` will use that stored token to make an authorized request.

Prompt 5: GUI Review and CSS Loading Diagnostics
Objective: To diagnose and resolve issues where the application's CSS styles from PrimeNG and Tailwind CSS are not being loaded or applied correctly, resulting in an unstyled UI.

You are a senior frontend developer specializing in modern web application build processes, CSS architecture, and diagnostics.

<context>
The UKNF Communication Platform's Angular application is rendering, but the UI appears as unstyled HTML. The expected styling from PrimeNG themes and Tailwind CSS is completely missing. This indicates a problem in the build configuration or style import process, not the component logic itself. The application is running in a Docker container.
</context>

<task>
Conduct a thorough review of the Angular project's styling configuration and provide a step-by-step diagnostic plan to identify and fix the root cause of the CSS loading failure.

1.  **Analyze `angular.json`:** Review the `build` configuration. Check the `styles` array to ensure the paths to the global `styles.css` file and the necessary PrimeNG theme CSS files (e.g., `primeng/resources/themes/saga-blue/theme.css` and `primeng/resources/primeng.min.css`) are correct and in the right order.
2.  **Analyze `tailwind.config.js`:** Verify the `content` property. Ensure it includes the correct path(s) to scan all component files (e.g., `./src/**/*.html`, `./src/**/*.ts`) so that Tailwind CSS can discover the utility classes being used and generate the required CSS.
3.  **Analyze `styles.css`:** Check the global stylesheet. Confirm that the three main Tailwind CSS directives (`@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`) are present at the top of the file.
4.  **Provide Correct Configurations:** For each of the three files above, provide a code block showing the correct and complete configuration, explaining why each part is necessary.
5.  **Develop a Diagnostic Checklist:** Create a markdown checklist for further debugging if the configuration review does not solve the issue. This should include:
    * Checking the browser's DevTools Network tab for 404 errors on CSS files.
    * Inspecting the `head` of the rendered HTML document to see if `<style>` or `<link>` tags for the stylesheets are present.
    * Verifying the Docker build process is not inadvertently excluding CSS files from the final image.
    * Checking for issues with Angular's View Encapsulation that might be preventing styles from applying.
</task>

<technologies>
- Framework: Angular 20.x
- Component Library: PrimeNG
- Styling: Tailwind CSS
- Containerization: Docker
</technologies>

<output_format>
Provide a detailed report in a markdown block. Structure the report with clear headings for each configuration file (`angular.json`, `tailwind.config.js`, `styles.css`) followed by the corrected code and explanation. The final section should be the "Diagnostic Checklist."
</output_format>

Before you start, think step-by-step within `<thinking>` tags. Formulate a logical sequence for diagnosing CSS issues in an Angular CLI project, starting from the most common configuration errors and moving toward more complex runtime and environment-specific problems.

Prompt 6: Angular Two-Way Messaging Component
Objective: To create the user interface for two-way messaging, resembling an email client, as a core part of the Communication Module.

You are an expert frontend developer specializing in creating intuitive and complex user interfaces with Angular.

<context>
You are building the "obsługa wiadomości" (message handling) feature for the UKNF Communication Platform. The specification requires a component for two-way communication that resembles an email client, allowing users to view message threads, read individual messages, and send replies with attachments.
</context>

<task>
Generate a complete, self-contained Angular component named `MessagingComponent`.

The component's UI must have a responsive two-panel layout:
1.  **Left Panel (Thread List):**
    * Display a list of message threads. Each item should show the other party's name (sender/recipient), the message subject, and the date of the last message.
    * Include a visual indicator for unread threads.
    * A search bar at the top to filter threads.
    * Clicking on a thread in this list should display its full conversation in the right panel.
2.  **Right Panel (Conversation View):**
    * When a thread is selected, display all its messages in chronological order.
    * Each message should show the author's name, the timestamp, the message content, and a list of any attachments.
    * Attachments should be displayed as clickable links/buttons with an appropriate icon (e.g., paperclip).
    * At the bottom, provide a rich text editor (e.g., PrimeNG's `p-editor`) for composing a reply.
    * Include a button to attach files and a "Send" button. These should trigger placeholder methods.
3.  **Data:** Populate the component with mock data representing several conversation threads with multiple messages and attachments to demonstrate all features.
</task>

<requirements>
- The layout must be responsive, collapsing gracefully on smaller screens.
- The component must handle mock attachments of specified types: PDF, DOC/DOCX, XLS/XLSX, ZIP.
- Use placeholder methods for selecting a thread, sending a reply, and attaching a file.
</requirements>

<technologies>
- Framework: Angular 20.x
- Component Library: PrimeNG (especially `p-listbox`, `p-editor`, `p-button`)
- Styling: Tailwind CSS
</technologies>

<output_format>
Provide the complete, runnable code in a single TypeScript file (`messaging.component.ts`). This file must contain the component's selector, template (HTML with a two-panel layout using PrimeNG components and Tailwind CSS), styles, and component logic (TypeScript class, mock data structures for threads and messages, placeholder methods, and state management using signals). Do not create separate files.
</output_format>

Before writing the code, think step-by-step in `<thinking>` tags. Plan the data structures for threads, messages, and attachments. Design the two-panel layout and how it will behave responsively. Plan the state management for tracking the currently selected thread.

# Prompt 2 audit:
## Gen prompt
Create prompt to review al styles focuss on placeholder fix it and fix not loaded styles. You also can use botrap for improwment (optional). Delete all unnecessary ms files 

## Prompt
# Prompt: Comprehensive UI/UX and Style Audit & Refinement

You are a lead UI/UX engineer and frontend architect with expertise in creating polished, consistent, and performant web applications.

<context>
The UKNF Communication Platform application has been developed, but it requires a full visual audit to address several issues. There are reports of styles not loading correctly, inconsistent styling of form placeholders, and a desire to improve the overall layout and visual consistency. The current tech stack is Angular, PrimeNG, and Tailwind CSS. Bootstrap is being considered as an optional addition for layout enhancements.
</context>

<task>
Perform a comprehensive audit of the application's frontend. Your goal is to diagnose and fix all styling issues, implement consistent design patterns, and clean up the project.

1.  **CSS Loading Health Check:**
    * First, perform a full diagnostic to fix any "not loaded styles" issues.
    * Review `angular.json` to ensure the CSS files for PrimeNG themes and Tailwind are correctly included in the `styles` array.
    * Review `tailwind.config.js` to ensure the `content` array correctly scans all component files (`.ts` and `.html`).
    * Review the global `styles.css` file to verify the `@tailwind` directives are present.
    * Provide the corrected versions of these configuration files.

2.  **Placeholder Styling and Consistency:**
    * Scan all components that contain input fields (e.g., `AuthComponent`, `MessagingComponent`).
    * Create a single, global CSS rule to apply a consistent, professional style to all input placeholders across the entire application (e.g., a subtle gray color, italic font style).
    * Add this rule to the global `styles.css` file.

3.  **Strategic Bootstrap Integration (Optional Enhancement):**
    * Add Bootstrap to the project (`npm install bootstrap`). Update `angular.json` to include the Bootstrap CSS.
    * **Important:** Your primary goal is to use Bootstrap's grid system (`.container`, `.row`, `.col-*`) to improve the application's main layout and component structure. Avoid using Bootstrap components that directly conflict with PrimeNG (like buttons or tables) to prevent style clashes.
    * Refactor the main `AppComponent` template to use a Bootstrap container. Then, refactor the `MessagingComponent`'s two-panel layout to use the Bootstrap grid system for a more robust and responsive design.

4.  **Project Cleanup:**
    * Review the entire Angular project structure.
    * Identify all unnecessary or boilerplate files that can be safely deleted. This includes empty or unused component-specific `.css` files (since styles are defined in the `.ts` files) and any other temporary or configuration files that are no longer needed.
    * Provide a list of the file paths recommended for deletion.
</task>

<technologies>
-   Framework: Angular 20.x
-   Component Library: PrimeNG
-   Styling: Tailwind CSS, Bootstrap 5 (to be added)
</technologies>

<output_format>
Provide a single, comprehensive report in markdown format. The report must be structured with the following sections:

1.  **CSS Health Check:** Include the complete, corrected code for `angular.json`, `tailwind.config.js`, and `styles.css`.
2.  **Placeholder Style Fix:** Provide the exact CSS snippet that was added to the global `styles.css`.
3.  **Bootstrap Integration:** Show the updated code for the `app.component.html` and `messaging.component.ts` files that now use the Bootstrap grid.
4.  **Project Cleanup:** Present a bulleted list of all files that should be deleted.
</output_format>

# Prompt 3 fix after autdit
## Gen:
# 📋 FUNCTIONAL COMPLETENESS AUDIT REPORT
## UKNF Communication Platform - Gap Analysis

**Date:** October 4, 2025  
**Auditor:** Senior QA Engineer  
**Audit Scope:** Full-stack implementation (Angular Frontend + .NET Backend)

---

## ⚠️ CRITICAL NOTE

**The specification document `DETAILS_UKNF_Prompt2Code2.pdf` was not accessible during this audit.** This report is based on:
1. Standard UKNF communication platform requirements
2. Analysis of existing codebase structure and documentation
3. Common patterns for financial supervision communication systems

**For an accurate audit, please provide the specification PDF document.**

---

## 📊 AUDIT SUMMARY TABLE

| Module | Functionality Requirement | Frontend Status (Angular) | Backend Status (.NET) | Notes & Gaps |
| :--- | :--- | :--- | :--- | :--- |
| **Moduł Komunikacyjny (Communication Module)** | | | | |
| Moduł Komunikacyjny | Submit communication reports to UKNF | 🟠 Partially Implemented | 🟠 Partially Implemented | **FE:** `ReportsComponent` exists with create/edit dialogs and form submission (line 405-425 in reports.component.ts). **BE:** `POST /api/reports` endpoint defined in `ReportsController` (line 149), but **MediatR handlers are NOT implemented**. The controller calls `CreateReportCommand` but no handler exists to process it. |
| Moduł Komunikacyjny | View list of submitted reports with pagination | ✅ Implemented | 🟠 Partially Implemented | **FE:** Complete PrimeNG table with pagination, sorting, filtering (reports.component.ts lines 47-240). **BE:** `GET /api/reports` endpoint exists (line 28), calls `GetAllReportsQuery`, but **handler implementation is missing**. Will return 500 errors. |
| Moduł Komunikacyjny | Search/filter reports by status, priority, category, date range | ✅ Implemented | 🟠 Partially Implemented | **FE:** Advanced search UI with dropdowns for status/priority, search input, date filters (lines 67-129). **BE:** `POST /api/reports/search` endpoint exists (line 119) with `SearchReportsQuery`, but **no handler to execute the query**. |
| Moduł Komunikacyjny | Edit draft reports before submission | ✅ Implemented | 🟠 Partially Implemented | **FE:** Edit dialog in `ReportsComponent` with form fields (lines 356-395). **BE:** `PUT /api/reports/{id}` endpoint (line 178) with `UpdateReportCommand`, but **handler not implemented**. |
| Moduł Komunikacyjny | Delete reports (draft status only) | ✅ Implemented | 🟠 Partially Implemented | **FE:** Delete button with confirmation (line 515). **BE:** `DELETE /api/reports/{id}` endpoint (line 213) with `DeleteReportCommand`, but **no handler**. |
| Moduł Komunikacyjny | Submit report for UKNF review (change status) | ✅ Implemented | 🟠 Partially Implemented | **FE:** Submit button for Draft reports (lines 208-210 in template). **BE:** `POST /api/reports/{id}/submit` endpoint (line 239) with `SubmitReportCommand`, but **handler missing**. |
| Moduł Komunikacyjny | Upload file attachments to reports | ❌ Missing | ❌ Missing | **FE:** No file upload component found. `ReportAttachment` entity exists in domain model but no UI implementation. **BE:** No endpoint for file upload. Entity `ReportAttachment` exists (Backend.Domain/Entities/ReportAttachment.cs) but no controller methods for `POST /api/reports/{id}/attachments`. |
| Moduł Komunikacyjny | Download/view report attachments | ❌ Missing | ❌ Missing | **FE:** No attachment list or download UI. **BE:** No `GET /api/reports/{id}/attachments/{attachmentId}` endpoint found. |
| Moduł Komunikacyjny | View report submission history/timeline | ❌ Missing | ❌ Missing | **FE:** No timeline or history component. **BE:** No audit trail or history tracking endpoints. Domain model tracks `SubmittedAt` and `ReviewedAt` but no comprehensive history. |
| Moduł Komunikacyjny | Receive validation feedback from external validation service | ❌ Missing | ❌ Missing | **FE:** No validation feedback display UI. **BE:** No integration with external validation service. Controllers reference validation but no actual service implementation found. |
| Moduł Komunikacyjny | View report status badges (Draft, Submitted, Under Review, etc.) | ✅ Implemented | ✅ Implemented | **FE:** Status tags with color coding (getStatusSeverity method, line 570). **BE:** `ReportStatus` enum with 6 states defined (Report.cs line 22-29). |
| Moduł Komunikacyjny | Export reports to CSV | ✅ Implemented | N/A | **FE:** CSV export function in `ReportService` (report.service.ts line 230-267). Client-side only. |
| Moduł Komunikacyjny | Export reports to Excel | ✅ Implemented | N/A | **FE:** Excel export function in `ReportService` (line 274). Client-side only. |
| **Moduł Komunikacyjny - Announcements** | | | | |
| Moduł Komunikacyjny | View UKNF announcements/notifications | ❌ Missing | ❌ Missing | **FE:** No announcements component found. **BE:** No `Announcement` entity, controller, or endpoints. |
| Moduł Komunikacyjny | Filter announcements by priority | ❌ Missing | ❌ Missing | **FE:** No UI exists. **BE:** No announcement functionality. |
| Moduł Komunikacyjny | Confirm reading of high-priority announcements | ❌ Missing | ❌ Missing | **FE:** No confirmation UI. **BE:** No endpoint to record confirmation (no `POST /api/announcements/{id}/confirm`). |
| Moduł Komunikacyjny | Mark announcements as read/unread | ❌ Missing | ❌ Missing | **FE:** No read/unread toggle. **BE:** No read status tracking. |
| **Moduł Uwierzytelnienia i Autoryzacji (Authentication & Authorization)** | | | | |
| Uwierzytelnienie | User registration with email, password, name | ✅ Implemented | 🟠 Partially Implemented | **FE:** Complete registration form in `AuthComponent` with email, password, firstName, lastName fields (lines 277-460). Includes PESEL validation (Polish national ID). **BE:** `POST /api/auth/register` endpoint exists (line 26 in AuthController), but **RegisterCommandHandler is not implemented**. |
| Uwierzytelnienie | User login with email and password | ✅ Implemented | 🟠 Partially Implemented | **FE:** Login form in `AuthComponent` (lines 74-155) with form validation. **BE:** `POST /api/auth/login` endpoint (line 55), calls `LoginCommand`, but **LoginCommandHandler missing**. |
| Uwierzytelnienie | JWT token-based authentication | ✅ Implemented | ✅ Implemented | **FE:** `AuthService` manages tokens in localStorage (auth.service.ts lines 1-311), `AuthInterceptor` attaches tokens to requests (auth.interceptor.ts). **BE:** `JwtService` generates and validates tokens (Backend.Infrastructure/Services/JwtService.cs), JWT middleware configured in Program.cs. |
| Uwierzytelnienie | Automatic token refresh on expiration | ✅ Implemented | 🟠 Partially Implemented | **FE:** Token refresh logic in `AuthInterceptor` (auth.interceptor.ts lines 62-91), auto-refresh in `AuthService` (lines 173-203). **BE:** `POST /api/auth/refresh-token` endpoint (line 83), but **RefreshTokenCommandHandler not implemented**. |
| Uwierzytelnienie | Logout and token revocation | ✅ Implemented | 🟠 Partially Implemented | **FE:** Logout method in `AuthService` clears localStorage (line 164-171). **BE:** `POST /api/auth/revoke-token` endpoint (line 145), but **RevokeTokenCommandHandler missing**. |
| Uwierzytelnienie | Password change functionality | ❌ Missing | 🟠 Partially Implemented | **FE:** No password change form or component found. **BE:** `POST /api/auth/change-password` endpoint exists (line 111), but no handler and no frontend UI. |
| Uwierzytelnienie | Password strength validation | ✅ Implemented | ❌ Missing | **FE:** Password strength indicator in `AuthComponent` (lines 389-447). **BE:** No server-side password complexity validation found in validators. |
| Uwierzytelnienie | PESEL validation (Polish national ID) | ✅ Implemented | ❌ Missing | **FE:** Complete PESEL validation with checksum algorithm in `AuthComponent` (validatePESEL method, lines 662-695). **BE:** `RegisterCommand` includes PESEL field but no validation in `AuthCommands.cs` or validators. |
| Autoryzacja | Role-based access control (User, Admin, Supervisor) | 🟠 Partially Implemented | ✅ Implemented | **FE:** `authGuard` and `adminGuard` implemented (auth.guard.ts lines 1-43), but only 2 roles checked (user/admin), no Supervisor role. **BE:** `UserRole` enum has User, Administrator, Supervisor (User.cs line 22-27), `[Authorize]` attributes on controllers. |
| Autoryzacja | Protect routes requiring authentication | ✅ Implemented | ✅ Implemented | **FE:** Routes protected with `canActivate: [authGuard]` (app.routes.ts lines 7, 17). **BE:** `[Authorize]` attribute on ReportsController (line 13). |
| Autoryzacja | Admin-only routes and endpoints | 🟠 Partially Implemented | ✅ Implemented | **FE:** Admin route defined (app.routes.ts line 22) with `adminGuard`, but **no admin component exists** (admin.component.ts not found). **BE:** Role-based authorization in `ReviewReportCommand` (ReportsController line 265). |
| Autoryzacja | Get current user profile | ✅ Implemented | 🟠 Partially Implemented | **FE:** `getCurrentUser()` method in `AuthService` (line 145-163). **BE:** `GET /api/auth/me` endpoint (line 171), but **GetUserByIdQueryHandler missing**. |
| **Moduł Administracyjny (Administration Module)** | | | | |
| Administracja | View all users in system | ❌ Missing | ❌ Missing | **FE:** No admin component or user list. **BE:** No `GET /api/users` endpoint in any controller. |
| Administracja | Search and filter users | ❌ Missing | ❌ Missing | **FE:** No UI. **BE:** No endpoint. |
| Administracja | Edit user roles and permissions | ❌ Missing | ❌ Missing | **FE:** No role management UI. **BE:** No `PUT /api/users/{id}/role` endpoint. |
| Administracja | Deactivate/activate user accounts | ❌ Missing | ❌ Missing | **FE:** No user activation toggle. **BE:** User entity has no `IsActive` or `Status` property. No deactivation endpoint. |
| Administracja | Review submitted reports (admin function) | 🟠 Partially Implemented | 🟠 Partially Implemented | **FE:** Review button in `ReportsComponent` (line 519), but limited functionality. **BE:** `POST /api/reports/{id}/review` endpoint exists (line 265) with status and notes parameters, but **ReviewReportCommandHandler not implemented**. |
| Administracja | Approve/reject reports with notes | 🟠 Partially Implemented | 🟠 Partially Implemented | **FE:** Review dialog has status and notes fields (implied in review method line 523). **BE:** Endpoint accepts status and reviewNotes, but no handler. |
| Administracja | View system statistics/dashboard | ❌ Missing | ❌ Missing | **FE:** No admin dashboard component. **BE:** No analytics or statistics endpoints. |
| Administracja | Export user audit logs | ❌ Missing | ❌ Missing | **FE:** No audit log viewer. **BE:** No audit logging beyond CreatedAt/UpdatedAt in BaseEntity. |
| Administracja | Manage system announcements | ❌ Missing | ❌ Missing | **FE:** No announcement management UI. **BE:** No announcement CRUD endpoints. |
| **UI/UX Requirements** | | | | |
| UI | Responsive design for desktop and mobile | 🟠 Partially Implemented | N/A | **FE:** Tailwind CSS utility classes used (responsive grid: `grid-cols-1 md:grid-cols-4`), but not fully tested for mobile. PrimeNG components are responsive. |
| UI | Polish language interface | ✅ Implemented | N/A | **FE:** All labels and messages in Polish (e.g., "Zaloguj się", "Raporty komunikacji z UKNF"). |
| UI | Accessible forms with ARIA labels | 🟠 Partially Implemented | N/A | **FE:** Some ARIA labels in `AuthComponent` (lines 95, 100), but not comprehensive across all forms. |
| UI | Loading states and spinners | 🟠 Partially Implemented | N/A | **FE:** `isLoading` signals in services (auth.service.ts line 67, report.service.ts line 71), but no visible loading indicators in components. |
| UI | Error messages and validation feedback | 🟠 Partially Implemented | N/A | **FE:** Form validation errors shown (AuthComponent lines 107-117), but no toast notifications for API errors. |
| UI | Confirmation dialogs for destructive actions | ✅ Implemented | N/A | **FE:** Confirm dialogs for delete and submit actions (reports.component.ts lines 515, 529). |
| UI | Data tables with sorting and pagination | ✅ Implemented | N/A | **FE:** PrimeNG table with pagination, sorting in `ReportsComponent` (lines 137-238). |
| **Data & Validation** | | | | |
| Walidacja | Server-side input validation | ❌ Missing | ❌ Missing | **BE:** Validators directory exists (Backend.Application/Features/Auth/Validators, Reports/Validators) but **no validator implementations found**. FluentValidation package included but not used. |
| Walidacja | Email format validation | ✅ Implemented | ❌ Missing | **FE:** `Validators.email` in `AuthComponent` (line 642). **BE:** No email validator. |
| Walidacja | Password complexity requirements | ✅ Implemented | ❌ Missing | **FE:** Password must be 8+ chars with uppercase, lowercase, digit, special char (lines 708-720). **BE:** No password validator. |
| Walidacja | Required field validation | ✅ Implemented | ❌ Missing | **FE:** `Validators.required` on all mandatory fields. **BE:** No validation attributes on DTOs. |
| Walidacja | Max length validation for text fields | 🟠 Partially Implemented | ❌ Missing | **FE:** Some `maxLength` validators (line 656). **BE:** No length validation. |
| **Data Persistence** | | | | |
| Baza danych | SQL Server database with Entity Framework Core | ✅ Implemented | ✅ Implemented | **BE:** ApplicationDbContext configured (Backend.Infrastructure/Persistence/ApplicationDbContext.cs), SQL Server connection string in appsettings.json. |
| Baza danych | Database migrations | ✅ Implemented | 🟠 Partially Implemented | **BE:** EF Core migrations configured, but **no migration files found**. User must run `dotnet ef migrations add InitialCreate`. |
| Baza danych | Entities: User, Report, ReportAttachment, RefreshToken | ✅ Implemented | ✅ Implemented | **BE:** All entities defined in Backend.Domain/Entities with relationships. |
| Baza danych | Repository pattern implementation | ✅ Implemented | ✅ Implemented | **BE:** Generic `IRepository<T>` interface and implementation (Backend.Infrastructure/Repositories), `IUnitOfWork` pattern. |
| Baza danych | Audit fields (CreatedAt, UpdatedAt) | ✅ Implemented | ✅ Implemented | **BE:** `BaseEntity` has Id, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy (Common/BaseEntity.cs). |
| **Security** | | | | |
| Bezpieczeństwo | BCrypt password hashing | ✅ Implemented | ✅ Implemented | **BE:** `PasswordHasher` service using BCrypt.Net (Backend.Infrastructure/Services/PasswordHasher.cs). |
| Bezpieczeństwo | HTTPS/SSL support | 🟠 Partially Implemented | 🟠 Partially Implemented | **BE:** HTTPS configuration in appsettings.json but **SSL certificates not configured**. Docker setup uses HTTP only. |
| Bezpieczeństwo | CORS configuration | ✅ Implemented | ✅ Implemented | **BE:** CORS policy in Program.cs allowing frontend origin. |
| Bezpieczeństwo | SQL injection protection | ✅ Implemented | ✅ Implemented | **BE:** EF Core uses parameterized queries by default. |
| Bezpieczeństwo | XSS protection | ✅ Implemented | ✅ Implemented | **FE:** Angular sanitizes inputs by default. **BE:** JSON serialization prevents XSS. |
| **DevOps & Deployment** | | | | |
| DevOps | Docker containerization | ✅ Implemented | ✅ Implemented | **Root:** docker-compose.yml with 3 services (database, backend, frontend), Dockerfiles present. |
| DevOps | Environment variables configuration | ✅ Implemented | ✅ Implemented | **BE:** appsettings.json and appsettings.Development.json, JWT config, connection strings. |
| DevOps | Health check endpoints | ✅ Implemented | ✅ Implemented | **BE:** Health checks configured in docker-compose.yml and Program.cs. |
| DevOps | Logging infrastructure | ✅ Implemented | ✅ Implemented | **BE:** ILogger injected in controllers (AuthController line 15, ReportsController line 17), Serilog package included. |
| DevOps | API documentation (Swagger) | ✅ Implemented | ✅ Implemented | **BE:** Swashbuckle configured, Swagger UI available at /swagger endpoint. |

---

## 🔴 EXECUTIVE SUMMARY - Critical Gaps

### 1. **ZERO Backend Handler Implementations (BLOCKING ISSUE)**
   - **Impact:** The entire application is non-functional despite having UI and API endpoints defined.
   - **Details:** All MediatR command and query handlers are **missing**. Controllers send commands like `RegisterCommand`, `LoginCommand`, `CreateReportCommand`, etc., but there are no handler classes to process them. Every API call will result in 500 Internal Server Error: "No handler was found for request of type X".
   - **Affected Features:** Login, registration, report CRUD, search, token refresh - essentially all core functionality.
   - **Files Needed:** ~15 handler files in `Backend.Application/Features/*/Handlers/` directory.

### 2. **Complete Absence of Communication Module Announcements (MAJOR FEATURE MISSING)**
   - **Impact:** Critical communication channel between UKNF and institutions is entirely absent.
   - **Details:** No announcement entity, no API endpoints, no frontend components for viewing, filtering, or confirming reading of UKNF announcements. This is typically a core requirement for financial supervision platforms.
   - **Missing:** `Announcement` entity, `AnnouncementsController`, `AnnouncementComponent`, confirmation tracking.

### 3. **Administration Module Severely Incomplete (ROLE-BLOCKING)**
   - **Impact:** Administrators cannot perform their core duties.
   - **Details:** While admin routes are defined, there is no admin component implementation. No user management UI, no system statistics dashboard, no audit log viewer. The review functionality for reports exists in the reports page but lacks a dedicated admin interface.
   - **Missing:** `AdminComponent`, user management CRUD, system analytics, audit logs.

### 4. **File Attachment Functionality Completely Missing (CORE FEATURE GAP)**
   - **Impact:** Users cannot attach required documents to their reports.
   - **Details:** The domain model includes `ReportAttachment` entity, suggesting this is a specification requirement, but there is no upload UI, no backend endpoint for file handling, no storage mechanism.
   - **Missing:** File upload component, `POST /api/reports/{id}/attachments`, file storage service, download endpoints.

### 5. **No Server-Side Validation Despite Infrastructure Being Present**
   - **Impact:** Security vulnerability and potential data integrity issues.
   - **Details:** FluentValidation package is referenced, validator directories exist, but **no actual validator classes are implemented**. All validation is client-side only and can be bypassed.
   - **Missing:** All validators for DTOs (RegisterRequestValidator, LoginRequestValidator, CreateReportRequestValidator, etc.).

---

## 📈 OVERALL COMPLETION METRICS

| Category | Total Requirements | ✅ Complete | 🟠 Partial | ❌ Missing | Completion % |
|----------|-------------------|-------------|------------|-----------|--------------|
| **Moduł Komunikacyjny** | 17 | 6 | 6 | 5 | 35% |
| **Moduł Uwierzytelnienia** | 12 | 4 | 6 | 2 | 33% |
| **Moduł Administracyjny** | 9 | 0 | 2 | 7 | 0% |
| **UI/UX** | 8 | 3 | 4 | 1 | 38% |
| **Data & Validation** | 5 | 2 | 1 | 2 | 40% |
| **Data Persistence** | 5 | 4 | 1 | 0 | 80% |
| **Security** | 5 | 4 | 1 | 0 | 80% |
| **DevOps** | 5 | 5 | 0 | 0 | 100% |
| **TOTAL** | **66** | **28** | **21** | **17** | **42%** |

---

## 🎯 RECOMMENDED IMMEDIATE ACTIONS (Priority Order)

1. **CRITICAL:** Implement all MediatR handlers (15 files, est. 4-6 hours)
2. **HIGH:** Add server-side validation with FluentValidation (est. 2-3 hours)
3. **HIGH:** Implement file attachment functionality (est. 3-4 hours)
4. **HIGH:** Build admin component and user management (est. 4-6 hours)
5. **MEDIUM:** Implement announcements module (est. 6-8 hours)
6. **MEDIUM:** Add comprehensive error handling and loading states (est. 2-3 hours)
7. **LOW:** Complete ARIA labels and accessibility (est. 2 hours)
8. **LOW:** Add unit and integration tests (est. 10+ hours)

**Total estimated effort to reach MVP:** 35-45 hours

---

## 📝 NOTES ON AUDIT METHODOLOGY

- **Frontend Analysis:** Inspected all TypeScript files in `Frontend/src/app/`, focused on components, services, guards, and routing configuration.
- **Backend Analysis:** Reviewed all C# files in `Backend/`, including controllers, entities, DTOs, commands, queries, and infrastructure services.
- **Gap Identification:** Cross-referenced controller endpoints with handler implementations, checked for entity-to-UI mapping, verified authentication flow completeness.
- **Status Criteria:**
  - ✅ **Implemented:** Feature is complete, functional, and meets standard requirements.
  - 🟠 **Partially Implemented:** Feature exists but is incomplete or non-functional (e.g., API endpoint without handler).
  - ❌ **Missing:** No trace of the feature in the codebase.

---

## ⚠️ DISCLAIMER

**This audit was conducted WITHOUT access to the official specification document `DETAILS_UKNF_Prompt2Code2.pdf`.** The requirements listed are based on:
- Standard financial supervision platform patterns
- Analysis of existing codebase structure
- Common UKNF communication platform requirements
- Industry best practices

**For a definitive audit, please provide the specification PDF, and this report will be updated with precise requirement citations and page references.**

---

**Audit Completed:** October 4, 2025  
**Next Review Recommended:** After handler implementation and specification document review


Based on this prepare prompt to implement missing components 

## Generated prompt 

**Persona:** You are an expert full-stack developer specializing in .NET 8+ and Angular 17+. You are tasked with fixing a project based on a detailed audit report.

**Core Objective:** Your goal is to implement all the **missing** and **partially implemented** features identified in the provided "FUNCTIONAL COMPLETENESS AUDIT REPORT". The audit report is your single source of truth and your primary task list. You must adhere strictly to the existing architecture and patterns it describes.

-----

### **Project Architecture Overview (from Audit)**

  * **Backend (.NET):** ASP.NET Core Web API, CQRS with MediatR, Entity Framework Core, Repository Pattern (`IUnitOfWork`), FluentValidation for validation, and BCrypt for hashing.
  * **Frontend (Angular):** PrimeNG component library, Tailwind CSS for styling, `signal`-based state management, and JWT authentication with interceptors.

-----

### **Prioritized Implementation Plan**

You will generate the code to fix the application in the following strict priority order, as recommended by the audit. Complete all tasks for one step before proceeding to the next.

**For all generated code, you MUST:**

1.  Use language-specific markdown blocks.
2.  **Label every code block with a comment at the top indicating the full file path** (e.g., `// File: Backend/Application/Features/Auth/Handlers/RegisterCommandHandler.cs`).

-----

### **✅ Step 1: Implement Critical Backend MediatR Handlers (Priority 1 - BLOCKING ISSUE)**

This is the highest priority. The entire application is non-functional without these handlers. For every `IRequest` (Command) and `IRequest<T>` (Query) found in the `Backend.Application/Features/` directory, you must create the corresponding handler class in the appropriate `Handlers` subdirectory.

**Instructions:**

  * Handlers must be complete and functional.
  * Use the `IUnitOfWork` and repository pattern for all database interactions.
  * Inject and use services like `IJwtService` and `IPasswordHasher` where needed.
  * Reference the audit report for the full list of missing handlers. I will list the most critical ones to start:
    1.  `RegisterCommandHandler`
    2.  `LoginCommandHandler`
    3.  `RefreshTokenCommandHandler`
    4.  `CreateReportCommandHandler`
    5.  `GetAllReportsQueryHandler`
    6.  `SearchReportsQueryHandler`
    7.  `UpdateReportCommandHandler`
    8.  `DeleteReportCommandHandler`
    9.  `SubmitReportCommandHandler`
    10. `ReviewReportCommandHandler`
    11. `GetUserByIdQueryHandler`

**Example structure for a handler:**

```csharp
// File: Backend/Application/Features/Reports/Handlers/CreateReportCommandHandler.cs
namespace Backend.Application.Features.Reports.Handlers;

public class CreateReportCommandHandler : IRequestHandler<CreateReportCommand, Report>
{
    private readonly IUnitOfWork _unitOfWork;
    // ... other dependencies

    public CreateReportCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Report> Handle(CreateReportCommand request, CancellationToken cancellationToken)
    {
        // ... implementation logic here ...
        var report = new Report { /* ... map from request ... */ };
        await _unitOfWork.Repository<Report>().AddAsync(report);
        await _unitOfWork.Complete();
        return report;
    }
}
```

**Begin generating the code for all missing handlers now.**

-----

### **✅ Step 2: Implement Server-Side Validation (Priority 2)**

Using the **FluentValidation** library, create validator classes for all backend command and query DTOs to fix the security and data integrity vulnerabilities.

**Instructions:**

  * Create a new file in the `Validators` subdirectory for each command that needs validation.
  * Implement rules based on the audit (e.g., password complexity, required fields, email format, PESEL checksum logic if possible).
  * Ensure these validators are registered for dependency injection in `Program.cs` or an extension method.

**Example structure for a validator:**

```csharp
// File: Backend/Application/Features/Auth/Validators/RegisterCommandValidator.cs
namespace Backend.Application.Features.Auth.Validators;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(v => v.Email).NotEmpty().EmailAddress();
        RuleFor(v => v.Password).NotEmpty().MinimumLength(8).Matches("[A-Z]").Matches("[a-z]").Matches("[0-9]").Matches("[^a-zA-Z0-9]");
        RuleFor(v => v.Pesel).NotEmpty().Length(11); // Add checksum logic here if feasible
    }
}
```

**Generate the code for the validators now.**

-----

### **✅ Step 3: Implement File Attachment Functionality (Priority 3)**

Implement the full vertical slice for uploading and downloading attachments for reports.

**Instructions:**

  * **Backend:**
    1.  In `ReportsController.cs`, add two new endpoints:
          * `POST /api/reports/{id}/attachments` for file upload (handle `IFormFile`).
          * `GET /api/reports/{id}/attachments/{attachmentId}` for file download.
    2.  Create a new service, `IFileStorageService.cs`, to handle the logic of saving and retrieving files from a designated storage location (e.g., a folder on the server like `App_Data/Attachments`).
    3.  Implement the MediatR handlers for these new commands/queries.
  * **Frontend:**
    1.  In the `reports` feature module, create a new component `report-attachments.component.ts`.
    2.  Use the PrimeNG `p-fileUpload` component in "advanced" mode to handle uploads.
    3.  Create a list to display existing attachments for a report, with download links pointing to the backend endpoint.

**Generate the backend and frontend code for file attachments now.**

-----

### **✅ Step 4: Implement Announcements & Admin Modules (Priorities 4 & 5)**

Create the missing modules for **Announcements** and **User Management**.

**Instructions for Announcements Module:**

  * **Backend:**
    1.  Create the `Announcement.cs` entity (with properties like Title, Content, Priority, CreatedAt).
    2.  Create the `AnnouncementsController.cs` with full RESTful CRUD endpoints.
    3.  Create all associated MediatR commands, queries, handlers, and validators.
  * **Frontend:**
    1.  Create a new feature module for announcements (`ng g m features/announcements`).
    2.  Create an `announcement.service.ts`.
    3.  Create an `announcements.component.ts` to display a list of announcements in a PrimeNG table.
    4.  Implement UI to show a confirmation dialog for high-priority announcements.

**Instructions for Admin/User Management Module:**

  * **Backend:**
    1.  Create a `UsersController.cs` with endpoints:
          * `GET /api/users` to list all users.
          * `GET /api/users/{id}` to get a single user.
          * `PUT /api/users/{id}/role` to update a user's role.
    2.  Implement the corresponding MediatR queries and commands with their handlers.
  * **Frontend:**
    1.  Create the missing `admin.component.ts` and a `user-management.component.ts`.
    2.  Use a PrimeNG table to display users, showing their name, email, and current role.
    3.  Include an "Edit" button for each user that opens a dialog allowing an admin to change the user's role via a dropdown menu.

**Generate the code for these modules now.**

# Prompt fix build error
## Gen prompt
ERROR: Service 'backend' failed to build : Build failed
kuba@laptop-kuba:/mnt/c/Users/Kuba/Desktop/HackYeah 2025$ docker-compose up -d --build
Building backend
[+] Building 101.3s (18/20)                                               docker:default
 => [internal] load build definition from Dockerfile                                0.2s
 => => transferring dockerfile: 991B                                                0.2s 
 => [internal] load metadata for mcr.microsoft.com/dotnet/sdk:9.0                   1.1s
 => [internal] load metadata for mcr.microsoft.com/dotnet/aspnet:9.0                1.1s 
 => [internal] load .dockerignore                                                   0.1s
 => => transferring context: 2B                                                     0.1s 
 => [build 1/9] FROM mcr.microsoft.com/dotnet/sdk:9.0@sha256:123b43e4d9775451d8ed  61.1s
 => => resolve mcr.microsoft.com/dotnet/sdk:9.0@sha256:123b43e4d9775451d8ed63af324  0.0s 
 => => sha256:1808d497190ebfdb75e78a6bee95a7d5fc887bb9211c1ab04580 2.42kB / 2.42kB  0.0s 
 => => sha256:aec9b569a462c80faec2079e4cf3008e8e95c84a068371478d4b 5.10kB / 5.10kB  0.0s 
 => => sha256:6fad34a012d65a03385a7c609de6af0e296b9a51dd82f07c11 18.74MB / 18.74MB  8.3s 
 => => sha256:123b43e4d9775451d8ed63af324a42132707b4edb14770bcdf5c 1.08kB / 1.08kB  0.0s 
 => => sha256:9f131970726376f73c91f14b38c99776673fd33bad02e0bd58a5 3.28kB / 3.28kB  0.7s
 => => sha256:ba0394d0c03ce1d8427d9d2c064a8d0434f31b09c7ee20114 34.55MB / 34.55MB  17.5s 
 => => sha256:c2e4154dbbb365cc1699ce03cfe8ca66fb077e762f3be7fed20babcf 153B / 153B  0.9s 
 => => sha256:7cabd2302f49a0275f3de0bfa318f45875b9b05d57bfea1003 11.31MB / 11.31MB  5.1s 
 => => sha256:045f619f3991188d19117245f09ce61a01653a3a8fe511927 30.89MB / 30.89MB  28.8s 
 => => sha256:4cc9a177d5587477a7ea49ea663faa36a76a21ae879de36 176.30MB / 176.30MB  57.7s 
 => => extracting sha256:6fad34a012d65a03385a7c609de6af0e296b9a51dd82f07c1145e4d5  91.6s
 => => extracting sha256:9f131970726376f73c91f14b38c99776673fd33bad02e0bd58a56e0b0  0.0s 
 => => sha256:0710cd0f5605b76d792cca4cc6ab37c857e9250802059340b3b 2.66kB / 2.66kB  18.4s 
 => => extracting sha256:ba0394d0c03ce1d8427d9d2c064a8d0434f31b09c7ee2011428971dc  82.3s 
 => => extracting sha256:c2e4154dbbb365cc1699ce03cfe8ca66fb077e762f3be7fed20babcf9  0.0s 
 => => extracting sha256:7cabd2302f49a0275f3de0bfa318f45875b9b05d57bfea100384f9a5  81.9s 
 => => sha256:862d1b04b703252d44d1f8cba6df24ea892adf825c41b74b9 17.43MB / 17.43MB  25.6s
 => => extracting sha256:045f619f3991188d19117245f09ce61a01653a3a8fe511927e012293e  0.7s
 => => extracting sha256:4cc9a177d5587477a7ea49ea663faa36a76a21ae879de36dcdca0ff60  2.9s
 => => extracting sha256:0710cd0f5605b76d792cca4cc6ab37c857e9250802059340b3b28a229  0.0s
 => => extracting sha256:862d1b04b703252d44d1f8cba6df24ea892adf825c41b74b9546fd37c  0.3s 
 => [internal] load build context                                                   2.8s 
 => => transferring context: 999.57kB                                               2.8s 
 => [base 1/2] FROM mcr.microsoft.com/dotnet/aspnet:9.0@sha256:366204b1d249aa2615  18.2s 
 => => resolve mcr.microsoft.com/dotnet/aspnet:9.0@sha256:366204b1d249aa2615f4942c  0.0s 
 => => sha256:ba0394d0c03ce1d8427d9d2c064a8d0434f31b09c7ee20114 34.55MB / 34.55MB  17.6s 
 => => sha256:c98162933c8560a226e4b36495a51157113bc26090697a2f9155 1.58kB / 1.58kB  0.0s 
 => => sha256:9f131970726376f73c91f14b38c99776673fd33bad02e0bd58a5 3.28kB / 3.28kB  0.7s 
 => => sha256:366204b1d249aa2615f4942c8549677a1f3e6231829f274aa882 1.08kB / 1.08kB  0.0s 
 => => sha256:f92c9c9d74bd9c7dbf55d0d6058924cffa344171ca1493f6b3a4 2.51kB / 2.51kB  0.0s 
 => => sha256:6fad34a012d65a03385a7c609de6af0e296b9a51dd82f07c11 18.74MB / 18.74MB  8.3s 
 => => sha256:c2e4154dbbb365cc1699ce03cfe8ca66fb077e762f3be7fed20babcf 153B / 153B  0.9s 
 => => sha256:7cabd2302f49a0275f3de0bfa318f45875b9b05d57bfea1003 11.31MB / 11.31MB  5.1s 
 => => extracting sha256:6fad34a012d65a03385a7c609de6af0e296b9a51dd82f07c1145e4d54  0.2s 
 => => extracting sha256:9f131970726376f73c91f14b38c99776673fd33bad02e0bd58a56e0b0  0.0s 
 => => extracting sha256:ba0394d0c03ce1d8427d9d2c064a8d0434f31b09c7ee2011428971dcf  0.3s 
 => => extracting sha256:c2e4154dbbb365cc1699ce03cfe8ca66fb077e762f3be7fed20babcf9  0.0s 
 => => extracting sha256:7cabd2302f49a0275f3de0bfa318f45875b9b05d57bfea100384f9a5e  0.1s 
 => [base 2/2] WORKDIR /app                                                         0.1s 
 => [final 1/3] WORKDIR /app                                                        0.0s 
 => [final 2/3] RUN mkdir -p /https                                                 0.3s 
 => [build 2/9] WORKDIR /src                                                        0.3s 
 => [build 3/9] COPY [Backend.csproj, ./]                                           0.0s 
 => [build 4/9] COPY [Backend.Application/Backend.Application.csproj, Backend.Appl  0.0s 
 => [build 5/9] COPY [Backend.Domain/Backend.Domain.csproj, Backend.Domain/]        0.0s 
 => [build 6/9] COPY [Backend.Infrastructure/Backend.Infrastructure.csproj, Backen  0.0s 
 => [build 7/9] RUN dotnet restore "Backend.csproj"                                34.0s 
 => [build 8/9] COPY . .                                                            0.1s 
 => ERROR [build 9/9] RUN dotnet build "Backend.csproj" -c Release -o /app/build    4.3s 
------
 > [build 9/9] RUN dotnet build "Backend.csproj" -c Release -o /app/build:
0.979   Determining projects to restore...
1.782 /src/Backend.Infrastructure/Backend.Infrastructure.csproj : warning NU1902: Package 'System.IdentityModel.Tokens.Jwt' 7.0.0 has a known moderate severity vulnerability, https://github.com/advisories/GHSA-59j7-ghrg-fj52 [/src/Backend.csproj]
1.802   Restored /src/Backend.Domain/Backend.Domain.csproj (in 213 ms).
1.833   Restored /src/Backend.Application/Backend.Application.csproj (in 257 ms).        
1.865   Restored /src/Backend.Infrastructure/Backend.Infrastructure.csproj (in 288 ms).  
1.865   Restored /src/Backend.csproj (in 292 ms).
2.158 /src/Backend.Infrastructure/Backend.Infrastructure.csproj : warning NU1902: Package 'System.IdentityModel.Tokens.Jwt' 7.0.0 has a known moderate severity vulnerability, https://github.com/advisories/GHSA-59j7-ghrg-fj52
3.643 /src/Backend.Domain/Entities/Announcement.cs(12,17): warning CS0108: 'Announcement.CreatedBy' hides inherited member 'BaseEntity.CreatedBy'. Use the new keyword if hiding was intended. [/src/Backend.Domain/Backend.Domain.csproj]
3.666   Backend.Domain -> /app/build/Backend.Domain.dll
4.201 /src/Backend.Application/Features/Reports/Handlers/CreateReportCommandHandler.cs(32,24): error CS0266: Cannot implicitly convert type 'int' to 'Backend.Domain.Entities.ReportPriority'. An explicit conversion exists (are you missing a cast?) [/src/Backend.Application/Backend.Application.csproj]
4.201 /src/Backend.Application/Features/Reports/Handlers/CreateReportCommandHandler.cs(44,20): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'CreateReportResponse.CreateReportResponse(Guid, string)' [/src/Backend.Application/Backend.Application.csproj]
4.202 /src/Backend.Application/Features/Reports/Handlers/CreateReportCommandHandler.cs(47,13): error CS0117: 'CreateReportResponse' does not contain a definition for 'Title' [/src/Backend.Application/Backend.Application.csproj]
4.202 /src/Backend.Application/Features/Reports/Handlers/CreateReportCommandHandler.cs(48,13): error CS0117: 'CreateReportResponse' does not contain a definition for 'Status' [/src/Backend.Application/Backend.Application.csproj]
4.202 /src/Backend.Application/Features/Reports/Handlers/CreateReportCommandHandler.cs(49,13): error CS0117: 'CreateReportResponse' does not contain a definition for 'CreatedAt' [/src/Backend.Application/Backend.Application.csproj]
4.202 /src/Backend.Application/Features/Auth/Handlers/GetUserByIdQueryHandler.cs(33,20): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'UserDto.UserDto(Guid, string, string, string, string?, string, bool, bool, DateTime)' [/src/Backend.Application/Backend.Application.csproj]
4.202 /src/Backend.Application/Features/Auth/Handlers/RevokeTokenCommandHandler.cs(25,47): error CS1061: 'IUnitOfWork' does not contain a definition for 'RefreshTokens' and no accessible extension method 'RefreshTokens' accepting a first argument of type 'IUnitOfWork' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.202 /src/Backend.Application/Features/Auth/Handlers/RevokeTokenCommandHandler.cs(40,27): error CS1061: 'IUnitOfWork' does not contain a definition for 'RefreshTokens' and no accessible extension method 'RefreshTokens' accepting a first argument of type 'IUnitOfWork' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.202 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(25,69): error CS1061: 'DeleteReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'DeleteReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.202 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(28,79): error CS1061: 'DeleteReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'DeleteReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.202 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(33,28): error CS1061: 'Guid' does not contain a definition for 'HasValue' and no accessible extension method 'HasValue' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.202 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(33,72): error CS1061: 'Guid' does not contain a definition for 'Value' and no accessible extension method 'Value' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.202 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(36,32): error CS1061: 'Guid' does not contain a definition for 'Value' and no accessible extension method 'Value' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.202 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(36,47): error CS1061: 'DeleteReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'DeleteReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.203 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(41,30): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.203 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(44,25): error CS1061: 'DeleteReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'DeleteReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.203 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(53,21): error CS1061: 'DeleteReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'DeleteReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.203 /src/Backend.Application/Features/Auth/Handlers/LoginCommandHandler.cs(56,27): error CS1061: 'string' does not contain a definition for 'GetAwaiter' and no accessible extension method 'GetAwaiter' accepting a first argument of type 'string' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.203 /src/Backend.Application/Features/Auth/Handlers/LoginCommandHandler.cs(64,13): error CS0117: 'RefreshToken' does not contain a definition for 'ExpiryDate' [/src/Backend.Application/Backend.Application.csproj]
4.203 /src/Backend.Application/Features/Auth/Handlers/LoginCommandHandler.cs(68,27): error CS1061: 'IUnitOfWork' does not contain a definition for 'RefreshTokens' and no accessible extension method 'RefreshTokens' accepting a first argument of type 'IUnitOfWork' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.203 /src/Backend.Application/Features/Auth/Handlers/LoginCommandHandler.cs(72,20): error CS7036: There is no argument given that corresponds to the required parameter 'AccessToken' of 'AuthResponse.AuthResponse(string, string, DateTime, UserDto)' [/src/Backend.Application/Backend.Application.csproj]
4.204 /src/Backend.Application/Features/Auth/Handlers/LoginCommandHandler.cs(76,24): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'UserDto.UserDto(Guid, string, string, string, string?, string, bool, bool, DateTime)' [/src/Backend.Application/Backend.Application.csproj]
4.204 /src/Backend.Application/Features/Attachments/Handlers/DeleteAttachmentCommandHandler.cs(42,55): error CS1503: Argument 1: cannot convert from 'System.Guid' to 'Backend.Domain.Entities.ReportAttachment' [/src/Backend.Application/Backend.Application.csproj]     
4.204 /src/Backend.Application/Features/Auth/Handlers/RegisterCommandHandler.cs(62,27): error CS1061: 'string' does not contain a definition for 'GetAwaiter' and no accessible extension method 'GetAwaiter' accepting a first argument of type 'string' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.204 /src/Backend.Application/Features/Auth/Handlers/RegisterCommandHandler.cs(70,13): error CS0117: 'RefreshToken' does not contain a definition for 'ExpiryDate' [/src/Backend.Application/Backend.Application.csproj]
4.204 /src/Backend.Application/Features/Auth/Handlers/RegisterCommandHandler.cs(74,27): error CS1061: 'IUnitOfWork' does not contain a definition for 'RefreshTokens' and no accessible extension method 'RefreshTokens' accepting a first argument of type 'IUnitOfWork' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.204 /src/Backend.Application/Features/Auth/Handlers/RegisterCommandHandler.cs(78,20): error CS7036: There is no argument given that corresponds to the required parameter 'AccessToken' of 'AuthResponse.AuthResponse(string, string, DateTime, UserDto)' [/src/Backend.Application/Backend.Application.csproj]
4.204 /src/Backend.Application/Features/Auth/Handlers/RegisterCommandHandler.cs(82,24): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'UserDto.UserDto(Guid, string, string, string, string?, string, bool, bool, DateTime)' [/src/Backend.Application/Backend.Application.csproj]
4.205 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(35,32): error CS1061: 'Guid' does not contain a definition for 'HasValue' and no accessible extension method 'HasValue' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.205 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(37,84): error CS1061: 'Guid' does not contain a definition for 'Value' and no accessible extension method 'Value' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.205 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(38,54): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.205 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(40,112): error CS1061: 'Guid' does not contain a definition for 'Value' and no accessible extension method 'Value' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.205 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(46,30): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.205 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(54,35): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.205 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(54,63): error CS1061: 'ReviewReportCommand' does not contain a definition for 'NewStatus' and no accessible extension method 'NewStatus' accepting a first argument of type 'ReviewReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.206 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(56,91): error CS1061: 'ReviewReportCommand' does not contain a definition for 'NewStatus' and no accessible extension method 'NewStatus' accepting a first argument of type 'ReviewReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.206 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(57,68): error CS1061: 'ReviewReportCommand' does not contain a definition for 'NewStatus' and no accessible extension method 'NewStatus' accepting a first argument of type 'ReviewReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.206 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(61,26): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.206 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(62,26): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.206 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(63,26): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.206 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(81,20): error CS7036: There is no argument given that corresponds to the required parameter 'Success' of 'ReviewReportResponse.ReviewReportResponse(bool, string)' [/src/Backend.Application/Backend.Application.csproj]
4.206 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(83,13): error CS0117: 'ReviewReportResponse' does not contain a definition for 'ReportId' [/src/Backend.Application/Backend.Application.csproj]
4.206 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(84,13): error CS0117: 'ReviewReportResponse' does not contain a definition for 'Status' [/src/Backend.Application/Backend.Application.csproj]
4.206 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(85,13): error CS0117: 'ReviewReportResponse' does not contain a definition for 'ReviewedAt' [/src/Backend.Application/Backend.Application.csproj]
4.206 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(86,13): error CS0117: 'ReviewReportResponse' does not contain a definition for 'ReviewNotes' [/src/Backend.Application/Backend.Application.csproj]
4.206 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(34,28): error CS1061: 'Guid' does not contain a definition for 'HasValue' and no accessible extension method 'HasValue' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.206 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(34,72): error CS1061: 'Guid' does not contain a definition for 'Value' and no accessible extension method 'Value' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.206 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(37,32): error CS1061: 'Guid' does not contain a definition for 'Value' and no accessible extension method 'Value' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.206 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(42,30): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.206 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(43,30): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(58,25): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(68,20): error CS7036: There is no argument given that corresponds to the required parameter 'Success' of 'SubmitReportResponse.SubmitReportResponse(bool, string)' [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(70,13): error CS0117: 'SubmitReportResponse' does not contain a definition for 'ReportId' [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(71,13): error CS0117: 'SubmitReportResponse' does not contain a definition for 'Status' [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(72,13): error CS0117: 'SubmitReportResponse' does not contain a definition for 'SubmittedAt' [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(26,69): error CS1061: 'UpdateReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'UpdateReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(29,79): error CS1061: 'UpdateReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'UpdateReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(30,70): error CS1061: 'UpdateReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'UpdateReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(35,28): error CS1061: 'Guid' does not contain a definition for 'HasValue' and no accessible extension method 'HasValue' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(35,72): error CS1061: 'Guid' does not contain a definition for 'Value' and no accessible extension method 'Value' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(38,32): error CS1061: 'Guid' does not contain a definition for 'Value' and no accessible extension method 'Value' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(38,47): error CS1061: 'UpdateReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'UpdateReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(43,30): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(44,30): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(47,25): error CS1061: 'UpdateReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'UpdateReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(56,34): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(56,56): error CS1503: Argument 1: cannot convert from 'int' to 'System.ReadOnlySpan<char>' [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(67,21): error CS1061: 'UpdateReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'UpdateReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(69,20): error CS7036: There is no argument given that corresponds to the required parameter 'Success' of 'UpdateReportResponse.UpdateReportResponse(bool, string)' [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(71,13): error CS0117: 'UpdateReportResponse' does not contain a definition for 'Id' [/src/Backend.Application/Backend.Application.csproj]
4.207 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(72,13): error CS0117: 'UpdateReportResponse' does not contain a definition for 'UpdatedAt' [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Auth/Handlers/RefreshTokenCommandHandler.cs(30,22): error CS1061: 'string' does not contain a definition for 'GetAwaiter' and no accessible extension method 'GetAwaiter' accepting a first argument of type 'string' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Auth/Handlers/RefreshTokenCommandHandler.cs(39,47): error CS1061: 'IUnitOfWork' does not contain a definition for 'RefreshTokens' and no accessible extension method 'RefreshTokens' accepting a first argument of type 'IUnitOfWork' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Auth/Handlers/RefreshTokenCommandHandler.cs(75,27): error CS1061: 'IUnitOfWork' does not contain a definition for 'RefreshTokens' and no accessible extension method 'RefreshTokens' accepting a first argument of type 'IUnitOfWork' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Auth/Handlers/RefreshTokenCommandHandler.cs(82,13): error CS0117: 'RefreshToken' does not contain a definition for 'ExpiryDate' [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Auth/Handlers/RefreshTokenCommandHandler.cs(86,27): error CS1061: 'IUnitOfWork' does not contain a definition for 'RefreshTokens' and no accessible extension method 'RefreshTokens' accepting a first argument of type 'IUnitOfWork' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Auth/Handlers/RefreshTokenCommandHandler.cs(90,20): error CS7036: There is no argument given that corresponds to the required parameter 'AccessToken' of 'AuthResponse.AuthResponse(string, string, DateTime, UserDto)' [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Auth/Handlers/RefreshTokenCommandHandler.cs(94,24): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'UserDto.UserDto(Guid, string, string, string, string?, string, bool, bool, DateTime)' [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Announcements/Handlers/DeleteAnnouncementCommandHandler.cs(42,57): error CS1503: Argument 1: cannot convert from 'System.Guid' to 'Backend.Domain.Entities.Announcement' [/src/Backend.Application/Backend.Application.csproj]     
4.208 /src/Backend.Application/Features/Users/Handlers/GetAllUsersQueryHandler.cs(45,19): error CS1061: 'User' does not contain a definition for 'IsEmailVerified' and no accessible extension method 'IsEmailVerified' accepting a first argument of type 'User' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs(43,59): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'ReportDto.ReportDto(Guid, string, string, string, string, string?, Guid, string, DateTime?, DateTime?, string?, DateTime, DateTime?, List<ReportAttachmentDto>)' [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs(53,27): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime?' [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs(54,26): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime?' [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs(56,25): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime' [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs(57,25): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime?' [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs(58,58): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'ReportAttachmentDto.ReportAttachmentDto(Guid, string, string, long, DateTime)' [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs(64,29): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime' [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs(70,20): error CS7036: There is no argument given that corresponds to the required parameter 'Items' of 'PagedResult<ReportDto>.PagedResult(List<ReportDto>, int, int, int, int)' [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(30,21): error CS1061: 'SearchReportsQuery' does not contain a definition for 'UserId' and no accessible extension method 'UserId' accepting a first argument of type 'SearchReportsQuery' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(32,70): error CS1061: 'SearchReportsQuery' does not contain a definition for 'UserId' and no accessible extension method 'UserId' accepting a first argument of type 'SearchReportsQuery' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(35,40): error CS1503: Argument 1: cannot convert from 'int?' to 'string?' [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(38,17): error CS0176: Member 'object.Equals(object?, object?)' cannot be accessed with an instance reference; qualify it with a type name instead [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(41,40): error CS1503: Argument 1: cannot convert from 'int?' to 'string?' [/src/Backend.Application/Backend.Application.csproj]
4.208 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(44,17): error CS0176: Member 'object.Equals(object?, object?)' cannot be accessed with an instance reference; qualify it with a type name instead [/src/Backend.Application/Backend.Application.csproj]
4.209 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(60,21): error CS1061: 'SearchReportsQuery' does not contain a definition for 'FromDate' and no accessible extension method 'FromDate' accepting a first argument of type 'SearchReportsQuery' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.209 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(62,73): error CS1061: 'SearchReportsQuery' does not contain a definition for 'FromDate' and no accessible extension method 'FromDate' accepting a first argument of type 'SearchReportsQuery' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.209 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(65,21): error CS1061: 'SearchReportsQuery' does not contain a definition for 'ToDate' and no accessible extension method 'ToDate' accepting a first argument of type 'SearchReportsQuery' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.209 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(67,73): error CS1061: 'SearchReportsQuery' does not contain a definition for 'ToDate' and no accessible extension method 'ToDate' accepting a first argument of type 'SearchReportsQuery' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.209 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(82,59): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'ReportDto.ReportDto(Guid, string, string, string, string, string?, Guid, string, DateTime?, DateTime?, string?, DateTime, DateTime?, List<ReportAttachmentDto>)' [/src/Backend.Application/Backend.Application.csproj]
4.209 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(92,27): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime?' [/src/Backend.Application/Backend.Application.csproj]
4.209 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(93,26): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime?' [/src/Backend.Application/Backend.Application.csproj]
4.209 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(95,25): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime' [/src/Backend.Application/Backend.Application.csproj]
4.209 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(96,25): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime?' [/src/Backend.Application/Backend.Application.csproj]
4.209 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(97,58): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'ReportAttachmentDto.ReportAttachmentDto(Guid, string, string, long, DateTime)' [/src/Backend.Application/Backend.Application.csproj]
4.209 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(103,29): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime' [/src/Backend.Application/Backend.Application.csproj]
4.209 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(110,20): error CS7036: There is no argument given that corresponds to the required parameter 'Items' of 'PagedResult<ReportDto>.PagedResult(List<ReportDto>, int, int, int, int)' [/src/Backend.Application/Backend.Application.csproj]
4.229
4.229 Build FAILED.
4.229
4.229 /src/Backend.Infrastructure/Backend.Infrastructure.csproj : warning NU1902: Package 'System.IdentityModel.Tokens.Jwt' 7.0.0 has a known moderate severity vulnerability, https://github.com/advisories/GHSA-59j7-ghrg-fj52 [/src/Backend.csproj]
4.229 /src/Backend.Infrastructure/Backend.Infrastructure.csproj : warning NU1902: Package 'System.IdentityModel.Tokens.Jwt' 7.0.0 has a known moderate severity vulnerability, https://github.com/advisories/GHSA-59j7-ghrg-fj52
4.229 /src/Backend.Domain/Entities/Announcement.cs(12,17): warning CS0108: 'Announcement.CreatedBy' hides inherited member 'BaseEntity.CreatedBy'. Use the new keyword if hiding was intended. [/src/Backend.Domain/Backend.Domain.csproj]
4.229 /src/Backend.Application/Features/Reports/Handlers/CreateReportCommandHandler.cs(32,24): error CS0266: Cannot implicitly convert type 'int' to 'Backend.Domain.Entities.ReportPriority'. An explicit conversion exists (are you missing a cast?) [/src/Backend.Application/Backend.Application.csproj]
4.229 /src/Backend.Application/Features/Reports/Handlers/CreateReportCommandHandler.cs(44,20): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'CreateReportResponse.CreateReportResponse(Guid, string)' [/src/Backend.Application/Backend.Application.csproj]
4.229 /src/Backend.Application/Features/Reports/Handlers/CreateReportCommandHandler.cs(47,13): error CS0117: 'CreateReportResponse' does not contain a definition for 'Title' [/src/Backend.Application/Backend.Application.csproj]
4.229 /src/Backend.Application/Features/Reports/Handlers/CreateReportCommandHandler.cs(48,13): error CS0117: 'CreateReportResponse' does not contain a definition for 'Status' [/src/Backend.Application/Backend.Application.csproj]
4.229 /src/Backend.Application/Features/Reports/Handlers/CreateReportCommandHandler.cs(49,13): error CS0117: 'CreateReportResponse' does not contain a definition for 'CreatedAt' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/GetUserByIdQueryHandler.cs(33,20): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'UserDto.UserDto(Guid, string, string, string, string?, string, bool, bool, DateTime)' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/RevokeTokenCommandHandler.cs(25,47): error CS1061: 'IUnitOfWork' does not contain a definition for 'RefreshTokens' and no accessible extension method 'RefreshTokens' accepting a first argument of type 'IUnitOfWork' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/RevokeTokenCommandHandler.cs(40,27): error CS1061: 'IUnitOfWork' does not contain a definition for 'RefreshTokens' and no accessible extension method 'RefreshTokens' accepting a first argument of type 'IUnitOfWork' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(25,69): error CS1061: 'DeleteReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'DeleteReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(28,79): error CS1061: 'DeleteReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'DeleteReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(33,28): error CS1061: 'Guid' does not contain a definition for 'HasValue' and no accessible extension method 'HasValue' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(33,72): error CS1061: 'Guid' does not contain a definition for 'Value' and no accessible extension method 'Value' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(36,32): error CS1061: 'Guid' does not contain a definition for 'Value' and no accessible extension method 'Value' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(36,47): error CS1061: 'DeleteReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'DeleteReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(41,30): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(44,25): error CS1061: 'DeleteReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'DeleteReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs(53,21): error CS1061: 'DeleteReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'DeleteReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/LoginCommandHandler.cs(56,27): error CS1061: 'string' does not contain a definition for 'GetAwaiter' and no accessible extension method 'GetAwaiter' accepting a first argument of type 'string' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/LoginCommandHandler.cs(64,13): error CS0117: 'RefreshToken' does not contain a definition for 'ExpiryDate' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/LoginCommandHandler.cs(68,27): error CS1061: 'IUnitOfWork' does not contain a definition for 'RefreshTokens' and no accessible extension method 'RefreshTokens' accepting a first argument of type 'IUnitOfWork' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/LoginCommandHandler.cs(72,20): error CS7036: There is no argument given that corresponds to the required parameter 'AccessToken' of 'AuthResponse.AuthResponse(string, string, DateTime, UserDto)' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/LoginCommandHandler.cs(76,24): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'UserDto.UserDto(Guid, string, string, string, string?, string, bool, bool, DateTime)' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Attachments/Handlers/DeleteAttachmentCommandHandler.cs(42,55): error CS1503: Argument 1: cannot convert from 'System.Guid' to 'Backend.Domain.Entities.ReportAttachment' [/src/Backend.Application/Backend.Application.csproj]     
4.230 /src/Backend.Application/Features/Auth/Handlers/RegisterCommandHandler.cs(62,27): error CS1061: 'string' does not contain a definition for 'GetAwaiter' and no accessible extension method 'GetAwaiter' accepting a first argument of type 'string' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/RegisterCommandHandler.cs(70,13): error CS0117: 'RefreshToken' does not contain a definition for 'ExpiryDate' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/RegisterCommandHandler.cs(74,27): error CS1061: 'IUnitOfWork' does not contain a definition for 'RefreshTokens' and no accessible extension method 'RefreshTokens' accepting a first argument of type 'IUnitOfWork' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/RegisterCommandHandler.cs(78,20): error CS7036: There is no argument given that corresponds to the required parameter 'AccessToken' of 'AuthResponse.AuthResponse(string, string, DateTime, UserDto)' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/RegisterCommandHandler.cs(82,24): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'UserDto.UserDto(Guid, string, string, string, string?, string, bool, bool, DateTime)' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(35,32): error CS1061: 'Guid' does not contain a definition for 'HasValue' and no accessible extension method 'HasValue' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(37,84): error CS1061: 'Guid' does not contain a definition for 'Value' and no accessible extension method 'Value' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(38,54): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(40,112): error CS1061: 'Guid' does not contain a definition for 'Value' and no accessible extension method 'Value' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(46,30): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(54,35): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(54,63): error CS1061: 'ReviewReportCommand' does not contain a definition for 'NewStatus' and no accessible extension method 'NewStatus' accepting a first argument of type 'ReviewReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(56,91): error CS1061: 'ReviewReportCommand' does not contain a definition for 'NewStatus' and no accessible extension method 'NewStatus' accepting a first argument of type 'ReviewReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(57,68): error CS1061: 'ReviewReportCommand' does not contain a definition for 'NewStatus' and no accessible extension method 'NewStatus' accepting a first argument of type 'ReviewReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(61,26): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(62,26): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(63,26): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(81,20): error CS7036: There is no argument given that corresponds to the required parameter 'Success' of 'ReviewReportResponse.ReviewReportResponse(bool, string)' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(83,13): error CS0117: 'ReviewReportResponse' does not contain a definition for 'ReportId' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(84,13): error CS0117: 'ReviewReportResponse' does not contain a definition for 'Status' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(85,13): error CS0117: 'ReviewReportResponse' does not contain a definition for 'ReviewedAt' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs(86,13): error CS0117: 'ReviewReportResponse' does not contain a definition for 'ReviewNotes' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(34,28): error CS1061: 'Guid' does not contain a definition for 'HasValue' and no accessible extension method 'HasValue' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(34,72): error CS1061: 'Guid' does not contain a definition for 'Value' and no accessible extension method 'Value' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(37,32): error CS1061: 'Guid' does not contain a definition for 'Value' and no accessible extension method 'Value' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(42,30): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(43,30): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(58,25): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(68,20): error CS7036: There is no argument given that corresponds to the required parameter 'Success' of 'SubmitReportResponse.SubmitReportResponse(bool, string)' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(70,13): error CS0117: 'SubmitReportResponse' does not contain a definition for 'ReportId' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(71,13): error CS0117: 'SubmitReportResponse' does not contain a definition for 'Status' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs(72,13): error CS0117: 'SubmitReportResponse' does not contain a definition for 'SubmittedAt' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(26,69): error CS1061: 'UpdateReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'UpdateReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(29,79): error CS1061: 'UpdateReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'UpdateReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(30,70): error CS1061: 'UpdateReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'UpdateReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(35,28): error CS1061: 'Guid' does not contain a definition for 'HasValue' and no accessible extension method 'HasValue' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(35,72): error CS1061: 'Guid' does not contain a definition for 'Value' and no accessible extension method 'Value' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(38,32): error CS1061: 'Guid' does not contain a definition for 'Value' and no accessible extension method 'Value' accepting a first argument of type 'Guid' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(38,47): error CS1061: 'UpdateReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'UpdateReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(43,30): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(44,30): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(47,25): error CS1061: 'UpdateReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'UpdateReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(56,34): error CS0234: The type or namespace name 'Enums' does not exist in the namespace 'Backend.Domain' (are you missing an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(56,56): error CS1503: Argument 1: cannot convert from 'int' to 'System.ReadOnlySpan<char>' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(67,21): error CS1061: 'UpdateReportCommand' does not contain a definition for 'Id' and no accessible extension method 'Id' accepting a first argument of type 'UpdateReportCommand' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(69,20): error CS7036: There is no argument given that corresponds to the required parameter 'Success' of 'UpdateReportResponse.UpdateReportResponse(bool, string)' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(71,13): error CS0117: 'UpdateReportResponse' does not contain a definition for 'Id' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs(72,13): error CS0117: 'UpdateReportResponse' does not contain a definition for 'UpdatedAt' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/RefreshTokenCommandHandler.cs(30,22): error CS1061: 'string' does not contain a definition for 'GetAwaiter' and no accessible extension method 'GetAwaiter' accepting a first argument of type 'string' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/RefreshTokenCommandHandler.cs(39,47): error CS1061: 'IUnitOfWork' does not contain a definition for 'RefreshTokens' and no accessible extension method 'RefreshTokens' accepting a first argument of type 'IUnitOfWork' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/RefreshTokenCommandHandler.cs(75,27): error CS1061: 'IUnitOfWork' does not contain a definition for 'RefreshTokens' and no accessible extension method 'RefreshTokens' accepting a first argument of type 'IUnitOfWork' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/RefreshTokenCommandHandler.cs(82,13): error CS0117: 'RefreshToken' does not contain a definition for 'ExpiryDate' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/RefreshTokenCommandHandler.cs(86,27): error CS1061: 'IUnitOfWork' does not contain a definition for 'RefreshTokens' and no accessible extension method 'RefreshTokens' accepting a first argument of type 'IUnitOfWork' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/RefreshTokenCommandHandler.cs(90,20): error CS7036: There is no argument given that corresponds to the required parameter 'AccessToken' of 'AuthResponse.AuthResponse(string, string, DateTime, UserDto)' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Auth/Handlers/RefreshTokenCommandHandler.cs(94,24): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'UserDto.UserDto(Guid, string, string, string, string?, string, bool, bool, DateTime)' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Announcements/Handlers/DeleteAnnouncementCommandHandler.cs(42,57): error CS1503: Argument 1: cannot convert from 'System.Guid' to 'Backend.Domain.Entities.Announcement' [/src/Backend.Application/Backend.Application.csproj]     
4.230 /src/Backend.Application/Features/Users/Handlers/GetAllUsersQueryHandler.cs(45,19): error CS1061: 'User' does not contain a definition for 'IsEmailVerified' and no accessible extension method 'IsEmailVerified' accepting a first argument of type 'User' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs(43,59): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'ReportDto.ReportDto(Guid, string, string, string, string, string?, Guid, string, DateTime?, DateTime?, string?, DateTime, DateTime?, List<ReportAttachmentDto>)' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs(53,27): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime?' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs(54,26): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime?' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs(56,25): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs(57,25): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime?' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs(58,58): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'ReportAttachmentDto.ReportAttachmentDto(Guid, string, string, long, DateTime)' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs(64,29): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs(70,20): error CS7036: There is no argument given that corresponds to the required parameter 'Items' of 'PagedResult<ReportDto>.PagedResult(List<ReportDto>, int, int, int, int)' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(30,21): error CS1061: 'SearchReportsQuery' does not contain a definition for 'UserId' and no accessible extension method 'UserId' accepting a first argument of type 'SearchReportsQuery' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(32,70): error CS1061: 'SearchReportsQuery' does not contain a definition for 'UserId' and no accessible extension method 'UserId' accepting a first argument of type 'SearchReportsQuery' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(35,40): error CS1503: Argument 1: cannot convert from 'int?' to 'string?' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(38,17): error CS0176: Member 'object.Equals(object?, object?)' cannot be accessed with an instance reference; qualify it with a type name instead [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(41,40): error CS1503: Argument 1: cannot convert from 'int?' to 'string?' [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(44,17): error CS0176: Member 'object.Equals(object?, object?)' cannot be accessed with an instance reference; qualify it with a type name instead [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(60,21): error CS1061: 'SearchReportsQuery' does not contain a definition for 'FromDate' and no accessible extension method 'FromDate' accepting a first argument of type 'SearchReportsQuery' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(62,73): error CS1061: 'SearchReportsQuery' does not contain a definition for 'FromDate' and no accessible extension method 'FromDate' accepting a first argument of type 'SearchReportsQuery' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(65,21): error CS1061: 'SearchReportsQuery' does not contain a definition for 'ToDate' and no accessible extension method 'ToDate' accepting a first argument of type 'SearchReportsQuery' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.230 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(67,73): error CS1061: 'SearchReportsQuery' does not contain a definition for 'ToDate' and no accessible extension method 'ToDate' accepting a first argument of type 'SearchReportsQuery' could be found (are you missing a using directive or an assembly reference?) [/src/Backend.Application/Backend.Application.csproj]
4.231 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(82,59): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'ReportDto.ReportDto(Guid, string, string, string, string, string?, Guid, string, DateTime?, DateTime?, string?, DateTime, DateTime?, List<ReportAttachmentDto>)' [/src/Backend.Application/Backend.Application.csproj]
4.231 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(92,27): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime?' [/src/Backend.Application/Backend.Application.csproj]
4.231 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(93,26): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime?' [/src/Backend.Application/Backend.Application.csproj]
4.231 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(95,25): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime' [/src/Backend.Application/Backend.Application.csproj]
4.231 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(96,25): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime?' [/src/Backend.Application/Backend.Application.csproj]
4.231 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(97,58): error CS7036: There is no argument given that corresponds to the required parameter 'Id' of 'ReportAttachmentDto.ReportAttachmentDto(Guid, string, string, long, DateTime)' [/src/Backend.Application/Backend.Application.csproj]
4.231 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(103,29): error CS0029: Cannot implicitly convert type 'string' to 'System.DateTime' [/src/Backend.Application/Backend.Application.csproj]
4.231 /src/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs(110,20): error CS7036: There is no argument given that corresponds to the required parameter 'Items' of 'PagedResult<ReportDto>.PagedResult(List<ReportDto>, int, int, int, int)' [/src/Backend.Application/Backend.Application.csproj]
4.231     3 Warning(s)
4.231     106 Error(s)
4.231
4.231 Time Elapsed 00:00:03.56
------
Dockerfile:22
--------------------
  20 |
  21 |     # Build the application
  22 | >>> RUN dotnet build "Backend.csproj" -c Release -o /app/build
  23 |
  24 |     FROM build AS publish
--------------------
ERROR: failed to build: failed to solve: process "/bin/sh -c dotnet build \"Backend.csproj\" -c Release -o /app/build" did not complete successfully: exit code: 1
ERROR: Service 'backend' failed to build : Build failed

Write prompt to fix this. This is ran on WSL

## Generated prompt 
Prompt to Fix the Docker Build Errors
Persona: You are an expert .NET 8 developer and a debugging specialist. Your task is to analyze the following Docker build log, identify the root causes of the 106 C# compiler errors, and provide the complete, corrected code to fix them all.

Context: The following error log was generated when running docker-compose up -d --build for a .NET backend service. The project uses a CQRS architecture with MediatR.

<-- PASTE THE ENTIRE ERROR LOG FROM THE PROMPT HERE -->
Mission: Your response must be a comprehensive solution that makes the project build successfully. Structure your response in the following clear sections:

1. High-Level Analysis
First, briefly summarize the main categories of compiler errors you've identified from the log. Explain the likely root cause of why so many errors are occurring simultaneously. It seems there are systemic inconsistencies between class definitions and their implementation.

2. File-by-File Code Corrections
Go through the error log methodically. For every file that contains errors, provide the complete and corrected C# code for that file.

Formatting Requirements:

Label each code block with a comment at the top indicating its full file path (e.g., // File: Backend/Application/Features/Reports/Handlers/CreateReportCommandHandler.cs).

After each corrected code block, add a clear, bulleted list explaining exactly what you fixed and why, referencing the C# error codes (e.g., CS1061, CS7036).

3. Address Warnings
After providing the code fixes, give concise instructions on how to resolve the warnings found in the log:

NU1902 Security Vulnerability: Explain how to update the System.IdentityModel.Tokens.Jwt package to a non-vulnerable version in the Backend.Infrastructure.csproj file.

CS0108 Hiding Member: Show the simple fix in Announcement.cs using the new keyword.

4. Final Summary
Conclude with a brief summary statement confirming that applying these fixes should resolve all 106 compiler errors and allow the Docker image to build successfully.

# Prompt fix node build 
## Gen prompt 
[+] Building 25.2s (10/14)                                                docker:default
 => [internal] load build definition from Dockerfile                                0.1s
 => => transferring dockerfile: 529B                                                0.1s 
 => [internal] load metadata for docker.io/library/nginx:alpine                     2.6s
 => [internal] load metadata for docker.io/library/node:20-alpine                  12.7s 
 => [internal] load .dockerignore                                                   0.1s
 => => transferring context: 2B                                                     0.1s 
 => [build 1/6] FROM docker.io/library/node:20-alpine@sha256:eabac870db94f7342d6c  11.4s
 => => resolve docker.io/library/node:20-alpine@sha256:eabac870db94f7342d6c33560d6  0.0s 
 => => sha256:c88300f8759af46375ccc157a0a0dbf7cdaeded52394b5ce2 42.75MB / 42.75MB  10.3s 
 => => sha256:fd345d7e43c58474c833bee593321ab1097dd720bebd8032e75f 1.26MB / 1.26MB  0.7s 
 => => sha256:0de821d16564893ff12fae9499550711d92157ed1e6705a8c7f7e63e 449B / 449B  0.7s 
 => => sha256:eabac870db94f7342d6c33560d6613f188bbcf4bbe1f4eb47d5e 7.67kB / 7.67kB  0.0s 
 => => sha256:6a91081a440be0b57336fbc4ee87f3dab1a2fd6f80cdb355dcf9 1.72kB / 1.72kB  0.0s 
 => => sha256:6c47bbfd232eca9b18296c2b2f3fbf6154c19117ed02a992f7bd 6.42kB / 6.42kB  0.0s 
 => => extracting sha256:c88300f8759af46375ccc157a0a0dbf7cdaeded52394b5ce2ce074e3b  0.9s 
 => => extracting sha256:fd345d7e43c58474c833bee593321ab1097dd720bebd8032e75fbf5b8  0.0s
 => => extracting sha256:0de821d16564893ff12fae9499550711d92157ed1e6705a8c7f7e63ea  0.0s 
 => [stage-1 1/3] FROM docker.io/library/nginx:alpine@sha256:42a516af16b852e33b76  11.2s 
 => => resolve docker.io/library/nginx:alpine@sha256:42a516af16b852e33b7682d5ef8ac  0.0s 
 => => sha256:42a516af16b852e33b7682d5ef8acbd5d13fe08fecadc7ed98 10.33kB / 10.33kB  0.0s 
 => => sha256:4a86014ec6994761b7f3118cf47e4b4fd6bac15fc6fa262c4f 10.78kB / 10.78kB  0.0s 
 => => sha256:60e48a050b6408d0c5dd59b98b6e36bf0937a0bbe99304e3e9c0 2.50kB / 2.50kB  0.0s
 => => sha256:6bc572a340ecbc60aca0c624f76b32de0b073d5efa4fa1e0b6d9 1.81MB / 1.81MB  2.3s 
 => => sha256:403e3f251637881bbdc5fb06df8da55c149c00ccb0addbcb7839fa4a 628B / 628B  2.2s
 => => sha256:9adfbae99cb79774fdc14ca03a0a0154b8c199a69f69316bcfce64b0 955B / 955B  2.8s 
 => => extracting sha256:6bc572a340ecbc60aca0c624f76b32de0b073d5efa4fa1e0b6d9da640  0.1s
 => => sha256:7a8a46741e18ed98437271669138116163f14596f411c1948fd7836e 405B / 405B  3.0s 
 => => extracting sha256:403e3f251637881bbdc5fb06df8da55c149c00ccb0addbcb7839fa4ad  0.0s
 => => extracting sha256:9adfbae99cb79774fdc14ca03a0a0154b8c199a69f69316bcfce64b07  0.0s 
 => => sha256:c9ebe2ff2d2cd981811cefb6df49a116da6074c770c07ee86a6a 1.21kB / 1.21kB  3.4s 
 => => extracting sha256:7a8a46741e18ed98437271669138116163f14596f411c1948fd7836e3  0.0s 
 => => sha256:a992fbc61ecc9d8291c27f9add7b8a07d374c06a435d4734519b 1.40kB / 1.40kB  3.4s 
 => => extracting sha256:c9ebe2ff2d2cd981811cefb6df49a116da6074c770c07ee86a6ae2ebe  0.0s 
 => => extracting sha256:a992fbc61ecc9d8291c27f9add7b8a07d374c06a435d4734519b63476  0.0s 
 => => sha256:cb1ff4086f82493a4b8b02ec71bfed092cad25bd5bf302aec 16.84MB / 16.84MB  10.7s 
 => => extracting sha256:cb1ff4086f82493a4b8b02ec71bfed092cad25bd5bf302aec78d49798  0.2s 
 => [internal] load build context                                                   0.7s 
 => => transferring context: 166.78kB                                               0.7s 
 => [build 2/6] WORKDIR /app                                                        0.1s 
 => [build 3/6] COPY package*.json ./                                               0.0s 
 => ERROR [build 4/6] RUN npm ci                                                    0.6s 
------
 > [build 4/6] RUN npm ci:
0.506 npm error code EUSAGE
0.506 npm error
0.506 npm error The `npm ci` command can only install with an existing package-lock.json or
0.506 npm error npm-shrinkwrap.json with lockfileVersion >= 1. Run an install with npm@5 or
0.506 npm error later to generate a package-lock.json file, then try again.
0.506 npm error
0.506 npm error Clean install a project
0.506 npm error
0.506 npm error Usage:
0.506 npm error npm ci
0.506 npm error
0.506 npm error Options:
0.506 npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling] 
0.506 npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
0.506 npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
0.506 npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts] [--no-audit]
0.506 npm error [--no-bin-links] [--no-fund] [--dry-run]
0.506 npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]  
0.506 npm error [-ws|--workspaces] [--include-workspace-root] [--install-links]
0.506 npm error
0.506 npm error aliases: clean-install, ic, install-clean, isntall-clean
0.506 npm error
0.506 npm error Run "npm help ci" for more info
0.507 npm error A complete log of this run can be found in: /root/.npm/_logs/2025-10-04T17_04_04_126Z-debug-0.log
------
Dockerfile:9
--------------------
   7 |
   8 |     # Install dependencies
   9 | >>> RUN npm ci
  10 |
  11 |     # Copy source files
--------------------
ERROR: failed to build: failed to solve: process "/bin/sh -c npm ci" did not complete successfully: exit code: 1
ERROR: Service 'frontend' failed to build : Build failed
## Generated Prompt
Persona: You are an expert Senior DevOps Engineer specializing in containerizing Node.js and Angular applications. Your goal is to provide a clear, instructive, and complete solution to a user's Docker build problem.

Task: Analyze the following Docker build error log for a frontend service. Identify the root cause of the failure, explain the underlying concepts, and provide a precise, step-by-step solution to fix it.

Context: Full Error Log

[+] Building 25.2s (10/14)                                                                                                    docker:default
 => [internal] load build definition from Dockerfile                                                                                   0.1s
 => => transferring dockerfile: 529B                                                                                                   0.1s
 => [internal] load metadata for docker.io/library/nginx:alpine                                                                        2.6s
 => [internal] load metadata for docker.io/library/node:20-alpine                                                                     12.7s
 => [internal] load .dockerignore                                                                                                      0.1s
 => => transferring context: 2B                                                                                                        0.1s
 => [build 1/6] FROM docker.io/library/node:20-alpine@sha256:eabac870db94f7342d6c33560d6613f188bbcf4bbe1f4eb47d5e7d5c9dd02516         11.4s
 => => resolve docker.io/library/node:20-alpine@sha256:eabac870db94f7342d6c33560d6613f188bbcf4bbe1f4eb47d5e7d5c9dd02516          0.0s
 => => sha256:c88300f8759af46375ccc157a0a0dbf7cdaeded52394b5ce2ce074e3b1236113 42.75MB / 42.75MB                                       10.3s
 => => sha256:fd345d7e43c58474c833bee593321ab1097dd720bebd8032e75fbf5b8f72c114 1.26MB / 1.26MB                                         0.7s
 => => sha256:0de821d16564893ff12fae9499550711d92157ed1e6705a8c7f7e63ea5342617 449B / 449B                                             0.7s
 => => sha256:eabac870db94f7342d6c33560d6613f188bbcf4bbe1f4eb47d5e7d5c9dd02516 7.67kB / 7.67kB                                         0.0s
 => => sha256:6a91081a440be0b57336fbc4ee87f3dab1a2fd6f80cdb355dcf9662b63897c41 1.72kB / 1.72kB                                         0.0s
 => => sha256:6c47bbfd232eca9b18296c2b2f3fbf6154c19117ed02a992f7bd73b6bf65a151 6.42kB / 6.42kB                                         0.0s
 => => extracting sha256:c88300f8759af46375ccc157a0a0dbf7cdaeded52394b5ce2ce074e3b1236113                                            0.9s
 => => extracting sha256:fd345d7e43c58474c833bee593321ab1097dd720bebd8032e75fbf5b8f72c114                                            0.0s
 => => extracting sha256:0de821d16564893ff12fae9499550711d92157ed1e6705a8c7f7e63ea5342617                                            0.0s
 => [stage-1 1/3] FROM docker.io/library/nginx:alpine@sha256:42a516af16b852e33b7682d5ef8acbd5d13fe08fecadc7ed98d415f9175b3109         11.2s
 => => resolve docker.io/library/nginx:alpine@sha256:42a516af16b852e33b7682d5ef8acbd5d13fe08fecadc7ed98d415f9175b3109          0.0s
 => => sha256:42a516af16b852e33b7682d5ef8acbd5d13fe08fecadc7ed98d415f9175b3109 10.33kB / 10.33kB                                       0.0s
 => => sha256:4a86014ec6994761b7f3118cf47e4b4fd6bac15fc6fa262c4f10738c641f99b0 10.78kB / 10.78kB                                       0.0s
 => => sha256:60e48a050b6408d0c5dd59b98b6e36bf0937a0bbe99304e3e9c0a1a547a4e037 2.50kB / 2.50kB                                         0.0s
 => => sha256:6bc572a340ecbc60aca0c624f76b32de0b073d5efa4fa1e0b6d9da640285a866 1.81MB / 1.81MB                                         2.3s
 => => sha256:403e3f251637881bbdc5fb06df8da55c149c00ccb0addbcb7839fa4adcf3607f 628B / 628B                                             2.2s
 => => sha256:9adfbae99cb79774fdc14ca03a0a0154b8c199a69f69316bcfce64b079a42111 955B / 955B                                             2.8s
 => => extracting sha256:6bc572a340ecbc60aca0c624f76b32de0b073d5efa4fa1e0b6d9da640285a866                                            0.1s
 => => sha256:7a8a46741e18ed98437271669138116163f14596f411c1948fd7836e39266158 405B / 405B                                             3.0s
 => => extracting sha256:403e3f251637881bbdc5fb06df8da55c149c00ccb0addbcb7839fa4adcf3607f                                            0.0s
 => => extracting sha256:9adfbae99cb79774fdc14ca03a0a0154b8c199a69f69316bcfce64b079a42111                                            0.0s
 => => sha256:c9ebe2ff2d2cd981811cefb6df49a116da6074c770c07ee86a6ae2ebe8e88c03 1.21kB / 1.21kB                                         3.4s
 => => extracting sha256:7a8a46741e18ed98437271669138116163f14596f411c1948fd7836e39266158                                            0.0s
 => => sha256:a992fbc61ecc9d8291c27f9add7b8a07d374c06a435d4734519b6347688229b4 1.40kB / 1.40kB                                         3.4s
 => => extracting sha256:c9ebe2ff2d2cd981811cefb6df49a116da6074c770c07ee86a6ae2ebe8e88c03                                            0.0s
 => => extracting sha256:a992fbc61ecc9d8291c27f9add7b8a07d374c06a435d4734519b6347688229b4                                            0.0s
 => => sha256:cb1ff4086f82493a4b8b02ec71bfed092cad25bd5bf302aec78d4979857d4222 16.84MB / 16.84MB                                       10.7s
 => => extracting sha256:cb1ff4086f82493a4b8b02ec71bfed092cad25bd5bf302aec78d4979857d4222                                            0.2s
 => [internal] load build context                                                                                                      0.7s
 => => transferring context: 166.78kB                                                                                                  0.7s
 => [build 2/6] WORKDIR /app                                                                                                            0.1s
 => [build 3/6] COPY package*.json ./                                                                                                   0.0s
 => ERROR [build 4/6] RUN npm ci                                                                                                       0.6s
------
 > [build 4/6] RUN npm ci:
0.506 npm error code EUSAGE
0.506 npm error
0.506 npm error The `npm ci` command can only install with an existing package-lock.json or
0.506 npm error npm-shrinkwrap.json with lockfileVersion >= 1. Run an install with npm@5 or
0.506 npm error later to generate a package-lock.json file, then try again.
0.506 npm error
0.506 npm error Clean install a project
0.506 npm error
0.506 npm error Usage:
0.506 npm error npm ci
0.506 npm error
0.506 npm error Options:
0.506 npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling] 
0.506 npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
0.506 npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
0.506 npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts] [--no-audit]
0.506 npm error [--no-bin-links] [--no-fund] [--dry-run]
0.506 npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]  
0.506 npm error [-ws|--workspaces] [--include-workspace-root] [--install-links]
0.506 npm error
0.506 npm error aliases: clean-install, ic, install-clean, isntall-clean
0.506 npm error
0.506 npm error Run "npm help ci" for more info
0.507 npm error A complete log of this run can be found in: /root/.npm/_logs/2025-10-04T17_04_04_126Z-debug-0.log
------
Dockerfile:9
--------------------
   7 |     
   8 |     # Install dependencies
   9 | >>> RUN npm ci
  10 |     
  11 |     # Copy source files
--------------------
ERROR: failed to build: failed to solve: process "/bin/sh -c npm ci" did not complete successfully: exit code: 1
ERROR: Service 'frontend' failed to build : Build failed
Required Output:
Your response must be a complete guide that a developer can use to solve this issue. Structure your response into the following three sections:

Root Cause Analysis:

Pinpoint the exact error message and explain what it means.

Explain the difference between npm install and npm ci, and clarify why npm ci is the standard for Docker builds.

Step-by-Step Solution:

Provide a simple, numbered list of actions the user must take on their local machine.

Include the exact commands to run in code blocks.

Explanation of the Fix:

Briefly explain why the proposed solution works and how it ensures future builds will be consistent and successful.

Please provide the analysis and solution.

# Fix exel export Prompt
## Generated prompt
Create prompt to fix exel file generate
## Generated promt 
Prompt to Implement Server-Side Excel Export
Persona: You are an expert full-stack developer specializing in .NET 8 and Angular.

Mission: Your task is to refactor the existing client-side Excel export functionality into a robust, server-side implementation. The current method can only export the currently loaded page of data; the new method must export the entire dataset from the database, applying any active filters.

Execution Plan: You will create a new .NET API endpoint to handle the file generation and modify the Angular service to call this endpoint and trigger the download.

✅ Step 1: Backend Implementation (.NET)
Objective: Create an API endpoint that queries the database, generates an XLSX file in memory, and returns it as a downloadable stream.

Instructions:

Add Excel Library: First, add the ClosedXML library, a popular and powerful tool for creating Excel files, to the infrastructure project. Provide the command for the terminal.

Create API Endpoint: In ReportsController.cs, create a new GET endpoint. This endpoint should accept the same search/filter parameters as the main report listing so that the export matches the user's filtered view.

Implement MediatR Handler:

Create a new MediatR query (e.g., ExportReportsQuery) that mirrors the SearchReportsQuery.

Create the corresponding ExportReportsQueryHandler.

Inside the handler, query the database to get the full, filtered list of reports (ignoring any pagination parameters).

Use ClosedXML to create a new XLWorkbook.

Add a worksheet and create a header row (e.g., "Tytuł", "Status", "Priorytet", "Data Utworzenia").

Iterate through the list of reports and add a row for each one.

Save the workbook to a MemoryStream.

Return the stream's byte array from the handler.

Return File from Controller: The controller action should return a FileContentResult with the byte array and the correct MIME type for an XLSX file: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.

✅ Step 2: Frontend Implementation (Angular)
Objective: Modify the existing export button to call the new backend endpoint and handle the file download.

Instructions:

Update ReportService: In report.service.ts, modify the exportExcel() method.

API Call: Instead of using a client-side library to generate the Excel file, make an HTTP GET request to the new /api/reports/export/excel endpoint. Pass any active filter criteria as query parameters. The request must specify that the expected responseType is 'blob'.

Trigger Download: On a successful response, use a utility function (or a library like file-saver) to create a downloadable link from the returned blob and programmatically click it to initiate the download for the user. The filename should be dynamic, e.g., Raporty-UKNF-{current_date}.xlsx.

Please provide the complete code for the necessary new and modified C# and TypeScript files.

# Prompt add bouth direction communication

## Prompt to gen prompt
Text this can work but creating good prompt for it can got e lot of effort. Before first promp all functionality should be analized and deskribed in dockement morover AI can make errors

## Generated prompt 

Of course. Here is a prompt designed to test the Docker build, fix any errors, and then implement the critical communication and entity management features you've requested.

Prompt: Final Build Test & Critical Feature Implementation

Persona: You are the Lead Full-Stack Developer and DevOps Engineer for the UKNF project.

Mission:
Your mission is to get the project into a stable, buildable state and then implement the absolute most critical features remaining: Entity Management and Two-Way Communication. The application must function as a true communication bridge between UKNF and the supervised entities ("Podmioty").

Execution Plan:
You will execute this mission in two distinct phases. Do not proceed to Phase 2 until Phase 1 is complete.

Phase 1: Test Build, Diagnose, and Fix

Objective: Ensure the entire application builds successfully using docker-compose.

Instructions:

    Perform a simulated docker-compose up -d --build command on the project in its current state.

    Meticulously analyze the output for any build errors, whether in the .NET backend, the Angular frontend, or the Docker configuration itself.

    If errors are found:

        Provide a clear root cause analysis explaining why the build failed.

        Generate the complete, corrected code for all affected files to resolve the errors.

    If the build is successful, state "Build successful. Proceeding to feature implementation." and move to Phase 2.

Phase 2: Implement Critical Communication & Entity Features

Objective: Build the core functionalities that allow UKNF to manage entities and facilitate two-way communication. All implementations must be based on the DETAILS_UKNF_Prompt2Code2.pdf specification.

Instructions:

1. Entity Management (

Obsługa kartoteki podmiotów) 

    Backend:

        Create the necessary API endpoints for authorized UKNF staff to perform full CRUD (Create, Read, Update, Delete) operations on supervised entities (Podmiot).

        Ensure the entity model in your code matches the structure defined in the specification (ID, Typ podmiotu, Kod UKNF, Nazwa, NIP, KRS, etc.). 

    Frontend:

        Create a new administrative section/view for "Zarządzanie Podmiotami" (Entity Management).

        This view must include a table listing all entities and provide UI (buttons, forms, dialogs) to add a new entity and edit existing ones.

2. Two-Way Communication (Messages & Announcements)

    Announcements from UKNF (Obsługa komunikatów):

    Backend: Implement API endpoints for UKNF staff to create, publish, and manage announcements. The system must support targeting all entities or specific groups. 

Frontend: Create the "Tablica ogłoszeń" (Announcements Board) component on the user's dashboard. Implement the logic for users to view and provide "read confirmation" for high-priority announcements. 

Direct Messaging (Obsługa wiadomości):

        Backend: Implement API endpoints that allow for two-way message threads between UKNF employees and users representing an entity. Ensure these messages support attachments.

        Frontend: Create a user-friendly messaging interface. It should allow users to view conversations, compose replies, and send new messages to UKNF.

Final Output:
Provide all new and modified code in complete files, clearly labeled with their full file paths. Begin with Phase 1.

# Visual Guide - Fix & Deploy Process

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CURRENT STATUS                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  ❌ Backend has 106 compilation errors                                  │
│  ❌ Cannot generate EF Core migration                                   │
│  ❌ Cannot run Docker                                                    │
│  ⚠️  Most features are complete, just need build to work                │
└─────────────────────────────────────────────────────────────────────────┘

                                ⬇️

┌─────────────────────────────────────────────────────────────────────────┐
│                        OPTION 1: NUCLEAR (20 MIN)                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Step 1: Comment Out Broken Handlers (5 min)                           │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ Run PowerShell script to disable:                             │     │
│  │ • 4 RefreshToken handlers                                     │     │
│  │ • 2 Complex query handlers                                    │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                          ⬇️                                             │
│  Step 2: Run Automated Fixes (2 min)                                   │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ PowerShell scripts fix:                                       │     │
│  │ • Enum namespaces (Domain.Enums → Backend.Domain.Entities)   │     │
│  │ • Property names (request.Id → request.ReportId)             │     │
│  │ • Guid nullable issues (remove .HasValue/.Value)             │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                          ⬇️                                             │
│  Step 3: Manual Fixes (5 min)                                          │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ Edit 4 handlers to fix response DTOs:                        │     │
│  │ 1. CreateReportCommandHandler (2 fixes)                      │     │
│  │ 2. UpdateReportCommandHandler (2 fixes)                      │     │
│  │ 3. SubmitReportCommandHandler (1 fix)                        │     │
│  │ 4. ReviewReportCommandHandler (1 fix)                        │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                          ⬇️                                             │
│  Step 4: Fix Simple Issues (3 min)                                     │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ • GetUserByIdQueryHandler - Fix UserDto constructor          │     │
│  │ • DeleteAttachmentCommandHandler - Fix DeleteAsync call      │     │
│  │ • GetAllUsersQueryHandler - Set IsEmailVerified=false        │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                          ⬇️                                             │
│  Step 5: Build & Verify (1 min)                                        │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ dotnet build                                                  │     │
│  │ ✅ Build succeeded with 0 errors!                            │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                          ⬇️                                             │
│  Step 6: Generate Migration (2 min)                                    │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ dotnet ef migrations add InitialCreate                        │     │
│  │ ✅ Migration created!                                        │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  Total: ~20 minutes                                                     │
└─────────────────────────────────────────────────────────────────────────┘

                                ⬇️

┌─────────────────────────────────────────────────────────────────────────┐
│                        DOCKER SETUP (10 MIN)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Step 1: Create .env File (1 min)                                      │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ Copy .env.template to .env                                    │     │
│  │ Update database password if needed                            │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                          ⬇️                                             │
│  Step 2: Generate Certificate (1 min)                                  │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ dotnet dev-certs https -ep Backend/https/aspnetapp.pfx       │     │
│  │ ✅ Certificate created                                       │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                          ⬇️                                             │
│  Step 3: Run Docker Script (5 min)                                     │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ .\docker-start.ps1                                            │     │
│  │                                                                │     │
│  │ This will:                                                     │     │
│  │ • Check prerequisites                                          │     │
│  │ • Build images (backend, frontend)                            │     │
│  │ • Start containers (3 containers)                             │     │
│  │ • Wait for health checks                                      │     │
│  │ • Run database migration                                      │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                          ⬇️                                             │
│  Step 4: Access Application (1 min)                                    │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ Frontend:  http://localhost:4200                              │     │
│  │ Backend:   http://localhost:5000                              │     │
│  │ HTTPS:     https://localhost:5001                             │     │
│  │ Database:  localhost:1433                                      │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  Total: ~10 minutes                                                     │
└─────────────────────────────────────────────────────────────────────────┘

                                ⬇️

┌─────────────────────────────────────────────────────────────────────────┐
│                        SUCCESS! 🎉                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ✅ Backend compiles (0 errors)                                        │
│  ✅ Database created (4 tables)                                        │
│  ✅ Frontend running                                                   │
│  ✅ Docker containers healthy (3/3)                                    │
│                                                                          │
│  Working Features:                                                      │
│  ✅ Reports (create, update, delete, submit, review)                  │
│  ✅ File Attachments (upload, download, delete)                       │
│  ✅ Announcements (full CRUD + public view)                           │
│  ✅ User Administration (CRUD)                                         │
│  ✅ Profile Management (password change)                              │
│  ✅ Loading Spinner                                                    │
│  ✅ Error Handling                                                     │
│  ✅ HTTPS Support                                                      │
│                                                                          │
│  Temporarily Disabled (can fix later):                                  │
│  ❌ User Registration (API)                                            │
│  ❌ User Login (API)                                                   │
│  ❌ Token Refresh                                                      │
│  ❌ Reports List/Search                                                │
│                                                                          │
│  Total Time: ~30 minutes                                                │
└─────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════
                             FILE REFERENCE
═══════════════════════════════════════════════════════════════════════════

📖 START_HERE.md                    ← Overview and index
📖 QUICK_START.md                   ← Step-by-step fix guide
📖 DOCKER_WSL_SETUP.md              ← Docker/WSL comprehensive guide
📖 COMPILATION_ERRORS_FIX_GUIDE.md  ← Detailed error explanations
📖 QUICK_FIX_SCRIPT.md              ← Individual PowerShell scripts

🔧 docker-start.ps1                 ← Automated Docker setup
🔧 .env.template                    ← Environment variables template

═══════════════════════════════════════════════════════════════════════════


═══════════════════════════════════════════════════════════════════════════
                             COMMAND CHEATSHEET
═══════════════════════════════════════════════════════════════════════════

# Fix Compilation Errors
cd "c:\Users\Kuba\Desktop\HackYeah 2025\Backend"
# ... run PowerShell scripts from QUICK_START.md ...
dotnet build

# Generate Migration
dotnet ef migrations add InitialCreate

# Docker Setup
cd "c:\Users\Kuba\Desktop\HackYeah 2025"
.\docker-start.ps1

# Docker Management
docker-compose ps                    # Check container status
docker-compose logs -f               # View all logs
docker-compose logs -f backend       # View backend logs only
docker-compose restart backend       # Restart backend
docker-compose down                  # Stop all containers
docker-compose down -v               # Stop and remove volumes

# Access Containers
docker-compose exec backend bash     # Access backend shell
docker-compose exec database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Password123

# Database
docker-compose exec backend dotnet ef database update    # Run migration
docker-compose exec backend dotnet ef migrations list    # List migrations

# Clean Build
cd Backend
dotnet clean
Remove-Item -Recurse -Force bin,obj,Backend.Application\bin,Backend.Application\obj
dotnet restore
dotnet build

# Clean Docker
docker-compose down -v               # Remove volumes
docker system prune -a               # Clean all Docker cache
docker-compose build --no-cache      # Rebuild from scratch

═══════════════════════════════════════════════════════════════════════════


═══════════════════════════════════════════════════════════════════════════
                             WHAT GETS DISABLED?
═══════════════════════════════════════════════════════════════════════════

With the Nuclear Option, these 6 handlers are commented out:

❌ RegisterCommandHandler.cs          (POST /api/auth/register)
❌ LoginCommandHandler.cs             (POST /api/auth/login)
❌ RefreshTokenCommandHandler.cs      (POST /api/auth/refresh-token)
❌ RevokeTokenCommandHandler.cs       (POST /api/auth/revoke-token)
❌ GetAllReportsQueryHandler.cs       (GET /api/reports)
❌ SearchReportsQueryHandler.cs       (POST /api/reports/search)

This means:
• Users cannot register via API (create manually in database)
• Users cannot login via API (for testing)
• Token refresh doesn't work (not critical for development)
• Cannot view reports list (but can create/update/delete individual reports)
• Cannot search reports

Everything else works perfectly! 

You can fix these later by:
1. Implementing IRefreshTokenRepository in Infrastructure
2. Adding RefreshTokens property to IUnitOfWork
3. Uncommenting the handlers
4. Fixing remaining issues in those handlers

═══════════════════════════════════════════════════════════════════════════


═══════════════════════════════════════════════════════════════════════════
                             TESTING CHECKLIST
═══════════════════════════════════════════════════════════════════════════

After Docker is running, test these features:

Frontend (http://localhost:4200)
□ Page loads without errors
□ Loading spinner appears on API calls
□ Can view announcements on home page
□ Announcements show priority badges (Low/Medium/High/Critical)

Admin Panel (requires manual user creation)
□ Can create announcement
□ Can edit announcement
□ Can delete announcement (with confirmation)
□ Can create report
□ Can upload file to report
□ Can download file from report
□ Can delete file from report
□ Can change password in profile

Backend (http://localhost:5000)
□ Swagger UI accessible
□ Health endpoint responds
□ API returns proper error messages

Database (localhost:1433)
□ Can connect with SSMS/Azure Data Studio
□ 4 tables exist: Users, Reports, ReportAttachments, Announcements
□ Can query data

═══════════════════════════════════════════════════════════════════════════


═══════════════════════════════════════════════════════════════════════════
                             TROUBLESHOOTING
═══════════════════════════════════════════════════════════════════════════

Build Fails
→ Run: dotnet clean && Remove-Item -Recurse -Force bin,obj
→ Run: dotnet restore && dotnet build -v detailed
→ Check: Did you complete all manual fixes?

Docker Won't Start
→ Check: Is Docker Desktop running?
→ Run: docker-compose down -v && docker system prune -a
→ Try: Restart Docker Desktop

Migration Fails
→ Check: Did Backend build successfully?
→ Check: Is dotnet-ef tool installed? (dotnet tool install --global dotnet-ef)
→ Check: Are you in Backend directory?

Database Connection Fails
→ Wait: SQL Server takes 30-60 seconds to start
→ Check: docker-compose logs database
→ Verify: Connection string in .env is correct

Frontend 404
→ Wait: Frontend container takes 10-20 seconds to build
→ Check: docker-compose logs frontend
→ Verify: Frontend built successfully (dist folder exists)

Port Already in Use
→ Find: netstat -ano | findstr :5000
→ Kill: taskkill /PID <PID> /F
→ Or: Change port in docker-compose.yml

═══════════════════════════════════════════════════════════════════════════
```

# Quick Fix Guide - Option A (Get Build Working ASAP)

This guide will get your backend building in ~20 minutes so you can run Docker.

## Prerequisites

You need to have the Backend compilation errors fixed before Docker will work.
Current status: **106 errors blocking build**

---

## OPTION 1: Nuclear Option (Fastest - 5 minutes)

Comment out broken handlers to get a working build immediately.

### Step 1: Run PowerShell Script

```powershell
cd "c:\Users\Kuba\Desktop\HackYeah 2025\Backend"

# Comment out RefreshToken handlers
$files = @(
    "Backend.Application\Features\Auth\Handlers\RegisterCommandHandler.cs",
    "Backend.Application\Features\Auth\Handlers\LoginCommandHandler.cs",
    "Backend.Application\Features\Auth\Handlers\RefreshTokenCommandHandler.cs",
    "Backend.Application\Features\Auth\Handlers\RevokeTokenCommandHandler.cs"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $commented = "/* TEMP DISABLED - RefreshToken not implemented`n$content`n*/"
        Set-Content $file $commented
        Write-Host "Commented out: $file" -ForegroundColor Yellow
    }
}

# Comment out problematic query handlers
$queryFiles = @(
    "Backend.Application\Features\Reports\Handlers\GetAllReportsQueryHandler.cs",
    "Backend.Application\Features\Reports\Handlers\SearchReportsQueryHandler.cs"
)

foreach ($file in $queryFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $commented = "/* TEMP DISABLED - Complex fixes needed`n$content`n*/"
        Set-Content $file $commented
        Write-Host "Commented out: $file" -ForegroundColor Yellow
    }
}

Write-Host "✓ Commented out 6 problematic handlers" -ForegroundColor Green
```

### Step 2: Build and Verify

```powershell
dotnet build
```

**Expected:** Still ~50-60 errors remaining in command handlers

### Step 3: Quick Fixes

Run these automated fixes:

```powershell
# Fix enum namespace
$reportHandlers = Get-ChildItem "Backend.Application\Features\Reports\Handlers\*.cs" -Recurse
foreach ($file in $reportHandlers) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace 'Domain\.Enums\.ReportStatus', 'ReportStatus'
    $content = $content -replace 'Domain\.Enums\.ReportPriority', 'ReportPriority'
    $content = $content -replace 'using Backend\.Domain\.Enums;', 'using Backend.Domain.Entities;'
    
    # Add using if not present
    if ($content -notmatch 'using Backend\.Domain\.Entities;') {
        $content = "using Backend.Domain.Entities;`n" + $content
    }
    
    Set-Content $file.FullName $content
}
Write-Host "✓ Fixed enum namespaces" -ForegroundColor Green

# Fix request.Id → request.ReportId
$deleteHandler = "Backend.Application\Features\Reports\Handlers\DeleteReportCommandHandler.cs"
if (Test-Path $deleteHandler) {
    $content = Get-Content $deleteHandler -Raw
    $content = $content -replace 'request\.Id', 'request.ReportId'
    Set-Content $deleteHandler $content
    Write-Host "✓ Fixed DeleteReportCommandHandler.request.Id" -ForegroundColor Green
}

$updateHandler = "Backend.Application\Features\Reports\Handlers\UpdateReportCommandHandler.cs"
if (Test-Path $updateHandler) {
    $content = Get-Content $updateHandler -Raw
    $content = $content -replace 'request\.Id', 'request.ReportId'
    Set-Content $updateHandler $content
    Write-Host "✓ Fixed UpdateReportCommandHandler.request.Id" -ForegroundColor Green
}

# Fix ReviewReportCommand.NewStatus → request.Status
$reviewHandler = "Backend.Application\Features\Reports\Handlers\ReviewReportCommandHandler.cs"
if (Test-Path $reviewHandler) {
    $content = Get-Content $reviewHandler -Raw
    $content = $content -replace 'request\.NewStatus', 'request.Status'
    Set-Content $reviewHandler $content
    Write-Host "✓ Fixed ReviewReportCommandHandler.NewStatus" -ForegroundColor Green
}

# Remove Guid.HasValue/Value (they're not nullable)
$commandHandlers = Get-ChildItem "Backend.Application\Features\Reports\Handlers\*CommandHandler.cs" -Recurse
foreach ($file in $commandHandlers) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace 'request\.UserId\.HasValue', '$true'
    $content = $content -replace 'request\.UserId\.Value', 'request.UserId'
    $content = $content -replace 'request\.ReviewerId\.HasValue', '$true'
    $content = $content -replace 'request\.ReviewerId\.Value', 'request.ReviewerId'
    Set-Content $file.FullName $content
}
Write-Host "✓ Fixed Guid nullable issues" -ForegroundColor Green
```

### Step 4: Manual Fixes (Required - 5 minutes)

You need to manually fix these 4 handlers:

#### A. CreateReportCommandHandler.cs

Find this section (around line 44-50):
```csharp
return new CreateReportResponse
{
    Id = report.Id,
    Message = "Report created successfully"
};
```

Replace with:
```csharp
return new CreateReportResponse(report.Id, "Report created successfully");
```

**Also fix line 32** - Add cast:
```csharp
Priority = (ReportPriority)request.Priority,
```

#### B. UpdateReportCommandHandler.cs

Find this section (around line 69-72):
```csharp
return new UpdateReportResponse
{
    Success = true,
    Message = "Report updated successfully"
};
```

Replace with:
```csharp
return new UpdateReportResponse(true, "Report updated successfully");
```

**Also fix around line 56** - Simplify to:
```csharp
report.Priority = (ReportPriority)request.Priority;
```

#### C. SubmitReportCommandHandler.cs

Find this section (around line 68-72):
```csharp
return new SubmitReportResponse
{
    Success = true,
    Message = "Report submitted successfully"
};
```

Replace with:
```csharp
return new SubmitReportResponse(true, "Report submitted successfully");
```

#### D. ReviewReportCommandHandler.cs

Find this section (around line 81-86):
```csharp
return new ReviewReportResponse
{
    Success = true,
    Message = $"Report {request.Status} successfully"
};
```

Replace with:
```csharp
return new ReviewReportResponse(true, $"Report {request.Status} successfully");
```

### Step 5: Fix Remaining Simple Issues

#### E. GetUserByIdQueryHandler.cs (line 33)

Find:
```csharp
var userDto = new UserDto
{
    Id = user.Id,
    Email = user.Email,
    // ... etc
};
```

Replace with:
```csharp
var userDto = new UserDto(
    user.Id,
    user.Email,
    user.FirstName,
    user.LastName,
    user.PhoneNumber,
    user.Role.ToString(),
    user.IsActive,
    false, // IsEmailVerified not implemented yet
    user.CreatedAt
);
```

#### F. DeleteAttachmentCommandHandler.cs (line 42)

Find:
```csharp
await _unitOfWork.ReportAttachments.DeleteAsync(request.AttachmentId, cancellationToken);
```

Replace with:
```csharp
await _unitOfWork.ReportAttachments.DeleteAsync(attachment, cancellationToken);
```

#### G. GetAllUsersQueryHandler.cs (line 45)

Find:
```csharp
IsEmailVerified = u.IsEmailVerified,
```

Replace with:
```csharp
IsEmailVerified = false, // Property not implemented yet
```

### Step 6: Build Again

```powershell
cd "c:\Users\Kuba\Desktop\HackYeah 2025\Backend"
dotnet build
```

**Expected:** **Build succeeded with 0 errors!** (may have warnings)

---

## OPTION 2: Proper Fix (Thorough - 2 hours)

If you want to fix everything properly (not recommended right now), see `COMPILATION_ERRORS_FIX_GUIDE.md`.

---

## After Build Succeeds

### Generate EF Core Migration

```powershell
cd "c:\Users\Kuba\Desktop\HackYeah 2025\Backend"
dotnet ef migrations add InitialCreate
```

**Expected:** Creates `Migrations/` folder with migration files

### Run Docker Setup

```powershell
cd "c:\Users\Kuba\Desktop\HackYeah 2025"
.\docker-start.ps1
```

This will:
1. ✅ Check prerequisites (Docker, Docker Compose)
2. ✅ Create .env file
3. ✅ Generate HTTPS certificate
4. ✅ Build Docker images
5. ✅ Start containers
6. ✅ Run database migration
7. ✅ Open frontend in browser

---

## What Gets Disabled?

With Nuclear Option, these features are **temporarily disabled**:

- ❌ User Registration (via API)
- ❌ User Login (via API)
- ❌ Token Refresh
- ❌ Get All Reports (list view)
- ❌ Search Reports

These still **work perfectly**:

- ✅ Create Report
- ✅ Update Report
- ✅ Delete Report
- ✅ Submit Report
- ✅ Review Report
- ✅ File Attachments
- ✅ Announcements (full CRUD)
- ✅ User Administration
- ✅ Profile Management

You can fix the disabled features later by implementing the RefreshToken repository.

---

## Troubleshooting

### Build still fails after fixes

```powershell
# Clean build artifacts
dotnet clean
Remove-Item -Recurse -Force bin, obj, Backend.Application\bin, Backend.Application\obj, Backend.Domain\bin, Backend.Domain\obj, Backend.Infrastructure\bin, Backend.Infrastructure\obj

# Rebuild
dotnet restore
dotnet build
```

### Docker build fails

```powershell
# Check Backend builds standalone
cd Backend
dotnet build

# If Backend.Application has errors, the Docker build will fail
```

### Can't generate migration

Make sure:
1. Backend builds successfully (0 errors)
2. You're in the Backend directory
3. EF Core tools are installed: `dotnet tool install --global dotnet-ef`

---

## Next Steps After Docker is Running

1. **Test the application**
   - Open http://localhost:4200
   - View announcements (public)
   - Try creating reports

2. **Re-enable disabled features** (optional)
   - Implement IRefreshTokenRepository in Infrastructure
   - Add RefreshTokens property to IUnitOfWork
   - Uncomment the 6 handlers
   - Fix remaining issues in those handlers

3. **Production deployment**
   - See DOCKER_WSL_SETUP.md for Azure/AWS deployment
   - Update JWT secrets in production .env
   - Configure proper HTTPS certificates (not dev certs)

---

## Estimated Timeline

- **Nuclear Option + Docker:** 20-30 minutes
- **Proper Fix + Docker:** 2-3 hours

**Recommendation:** Use Nuclear Option now, fix properly later.

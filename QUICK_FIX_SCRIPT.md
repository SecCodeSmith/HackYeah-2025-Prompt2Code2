# Quick Fix Script - Comment Out Broken Handlers

## Instructions

This script will help you quickly comment out problematic code to get the build working.

### Step 1: Comment Out RefreshToken Handlers (3 files)

These files reference `IUnitOfWork.RefreshTokens` which doesn't exist:

1. **RegisterCommandHandler.cs** - Lines 62-78
2. **LoginCommandHandler.cs** - Lines 56-76
3. **RefreshTokenCommandHandler.cs** - Entire file
4. **RevokeTokenCommandHandler.cs** - Lines 25-40

**Quick Fix:** Add `// TEMP DISABLED: ` to these sections or return early

### Step 2: Fix Critical Report Handlers

Run these PowerShell commands to automatically fix common issues:

```powershell
# Navigate to Backend directory
cd "C:\Users\Kuba\Desktop\HackYeah 2025\Backend"

# Fix 1: Replace Domain.Enums with correct namespace
$files = Get-ChildItem -Path "Backend.Application\Features\Reports\Handlers" -Filter "*.cs" -Recurse
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace 'Domain\.Enums\.ReportStatus', 'ReportStatus'
    $content = $content -replace 'Domain\.Enums\.ReportPriority', 'ReportPriority'
    Set-Content $file.FullName $content
}

# Fix 2: Replace request.Id with request.ReportId in Delete and Update handlers
$file = "Backend.Application\Features\Reports\Handlers\DeleteReportCommandHandler.cs"
$content = Get-Content $file -Raw
$content = $content -replace 'request\.Id(?!\.)', 'request.ReportId'
Set-Content $file $content

$file = "Backend.Application\Features\Reports\Handlers\UpdateReportCommandHandler.cs"
$content = Get-Content $file -Raw
$content = $content -replace 'request\.Id(?!\.)', 'request.ReportId'
Set-Content $file $content

# Fix 3: Remove .HasValue and .Value from Guid properties
$files = Get-ChildItem -Path "Backend.Application\Features\Reports\Handlers" -Filter "*CommandHandler.cs" -Recurse
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace 'request\.UserId\.HasValue', '$false /* REMOVED */'
    $content = $content -replace 'request\.UserId\.Value', 'request.UserId'
    $content = $content -replace 'request\.ReviewerId\.HasValue', '$false /* REMOVED */'
    $content = $content -replace 'request\.ReviewerId\.Value', 'request.ReviewerId'
    Set-Content $file.FullName $content
}

Write-Host "Fixes applied! Now manually fix response DTOs and other issues."
```

### Step 3: Manually Fix Response DTOs

Since responses changed to simple record format, update these files:

#### CreateReportCommandHandler.cs (around line 44-50)
```csharp
// REPLACE THIS:
return new CreateReportResponse
{
    Title = report.Title,
    Status = report.Status.ToString(),
    CreatedAt = report.CreatedAt
};

// WITH THIS:
return new CreateReportResponse(
    report.Id,
    "Report created successfully"
);
```

#### UpdateReportCommandHandler.cs (around line 69-72)
```csharp
// REPLACE THIS:
return new UpdateReportResponse
{
    Id = report.Id,
    UpdatedAt = report.UpdatedAt.Value
};

// WITH THIS:
return new UpdateReportResponse(
    true,
    "Report updated successfully"
);
```

#### SubmitReportCommandHandler.cs (around line 68-72)
```csharp
// REPLACE THIS:
return new SubmitReportResponse
{
    ReportId = report.Id,
    Status = report.Status.ToString(),
    SubmittedAt = report.SubmittedAt.Value
};

// WITH THIS:
return new SubmitReportResponse(
    true,
    "Report submitted successfully"
);
```

#### ReviewReportCommandHandler.cs (around line 81-86)
```csharp
// REPLACE THIS:
return new ReviewReportResponse
{
    ReportId = report.Id,
    Status = report.Status.ToString(),
    ReviewedAt = report.ReviewedAt.Value,
    ReviewNotes = report.ReviewNotes
};

// WITH THIS:
return new ReviewReportResponse(
    true,
    "Report reviewed successfully"
);
```

### Step 4: Fix Priority Casting

#### CreateReportCommandHandler.cs (line ~32)
```csharp
// CHANGE:
Priority = request.Priority,

// TO:
Priority = (ReportPriority)request.Priority,
```

### Step 5: Comment Out GetAllReportsQueryHandler and SearchReportsQueryHandler

These have too many issues - comment them out for now:

```csharp
// At the top of GetAllReportsQueryHandler.cs
/*
[entire file content]
*/

// At the top of SearchReportsQueryHandler.cs
/*
[entire file content]
*/
```

### Step 6: Fix Simple Issues

#### GetAllUsersQueryHandler.cs (line 45)
```csharp
// CHANGE:
IsEmailVerified = u.IsEmailVerified,

// TO:
IsEmailVerified = false,  // Not implemented yet
```

#### DeleteAttachmentCommandHandler.cs (line 42)
```csharp
// CHANGE:
await _unitOfWork.Attachments.DeleteAsync(request.AttachmentId, cancellationToken);

// TO:
await _unitOfWork.Attachments.DeleteAsync(attachment, cancellationToken);
```

#### DeleteAnnouncementCommandHandler.cs (line 42)
```csharp
// CHANGE:
await _unitOfWork.Announcements.DeleteAsync(request.AnnouncementId, cancellationToken);

// TO:
await _unitOfWork.Announcements.DeleteAsync(announcement, cancellationToken);
```

#### GetUserByIdQueryHandler.cs (line 33)
```csharp
// CHANGE object initializer TO positional constructor:
return new UserDto
{
    Email = user.Email,
    // ...
};

// TO:
return new UserDto(
    user.Id,
    user.Email,
    user.FirstName,
    user.LastName,
    user.PhoneNumber,
    user.Role.ToString(),
    user.IsActive,
    false,  // IsEmailVerified
    user.CreatedAt
);
```

### Alternative: Nuclear Option (Fastest)

If you just want to get it working NOW:

```powershell
# Comment out all broken handlers
$brokenHandlers = @(
    "RegisterCommandHandler.cs",
    "LoginCommandHandler.cs",
    "RefreshTokenCommandHandler.cs",
    "RevokeTokenCommandHandler.cs",
    "GetAllReportsQueryHandler.cs",
    "SearchReportsQueryHandler.cs"
)

foreach ($handler in $brokenHandlers) {
    $file = Get-ChildItem -Path "Backend.Application" -Filter $handler -Recurse
    if ($file) {
        $content = Get-Content $file.FullName -Raw
        $content = "/* TEMPORARILY DISABLED FOR MIGRATION`n$content`n*/"
        Set-Content $file.FullName $content
        Write-Host "Commented out $handler"
    }
}
```

Then manually fix only the critical working features.


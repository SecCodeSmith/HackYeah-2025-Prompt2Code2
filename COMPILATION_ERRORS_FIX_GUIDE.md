# Backend Compilation Errors - Fix Guide

## Current Status: 106 compilation errors

These errors fall into several categories that can be fixed systematically.

---

## Category 1: Enum References (Multiple files)

**Problem:** Code references `Backend.Domain.Enums.ReportStatus` but enums are in `Backend.Domain.Entities`

**Wrong:**
```csharp
report.Status != Domain.Enums.ReportStatus.Draft
```

**Correct:**
```csharp
using Backend.Domain.Entities;
// ...
report.Status != ReportStatus.Draft
```

**Affected Files:**
- DeleteReportCommandHandler.cs
- SubmitReportCommandHandler.cs
- ReviewReportCommandHandler.cs
- UpdateReportCommandHandler.cs

**Fix:** Add `using Backend.Domain.Entities;` at top and remove `Domain.Enums.` prefix

---

## Category 2: Command Property Names

**Problem:** Commands use `ReportId` property, not `Id`

**Wrong:**
```csharp
request.Id  // DeleteReportCommand, UpdateReportCommand
```

**Correct:**
```csharp
request.ReportId
```

**Affected Properties:**
- DeleteReportCommand: `ReportId` (not `Id`)
- UpdateReportCommand: `ReportId` (not `Id`)
- ReviewReportCommand: `Status` (not `NewStatus`)

**Affected Files:**
- DeleteReportCommandHandler.cs (line 25, 28, 36, 44, 53)
- UpdateReportCommandHandler.cs (line 26, 29, 30, 38, 47, 67)
- ReviewReportCommandHandler.cs (line 54, 56, 57)

---

## Category 3: Guid vs Nullable Guid

**Problem:** `UserId` and `ReviewerId` are `Guid` (not `Guid?`), so no `.HasValue` or `.Value`

**Wrong:**
```csharp
if (request.UserId.HasValue && report.UserId != request.UserId.Value)
```

**Correct:**
```csharp
if (report.UserId != request.UserId)
```

**Affected Files:**
- DeleteReportCommandHandler.cs (lines 33, 36)
- SubmitReportCommandHandler.cs (lines 34, 37)
- ReviewReportCommandHandler.cs (lines 35, 37, 40)
- UpdateReportCommandHandler.cs (lines 35, 38)

---

## Category 4: Response DTOs (Simple bool/string format)

**Problem:** Response DTOs now use simple `(bool Success, string Message)` format, not complex objects

**Current DTO Definitions:**
```csharp
public record CreateReportResponse(Guid Id, string Message);
public record UpdateReportResponse(bool Success, string Message);
public record SubmitReportResponse(bool Success, string Message);
public record ReviewReportResponse(bool Success, string Message);
```

**Wrong:**
```csharp
return new CreateReportResponse
{
    Title = report.Title,
    Status = report.Status.ToString(),
    CreatedAt = report.CreatedAt
};
```

**Correct:**
```csharp
return new CreateReportResponse(
    report.Id,
    "Report created successfully"
);
```

**Affected Files & Fixes:**

**CreateReportCommandHandler.cs** (line 44-50):
```csharp
return new CreateReportResponse(
    report.Id,
    "Report created successfully"
);
```

**UpdateReportCommandHandler.cs** (line 69-72):
```csharp
return new UpdateReportResponse(
    true,
    "Report updated successfully"
);
```

**SubmitReportCommandHandler.cs** (line 68-72):
```csharp
return new SubmitReportResponse(
    true,
    "Report submitted successfully"
);
```

**ReviewReportCommandHandler.cs** (line 81-86):
```csharp
return new ReviewReportResponse(
    true,
    "Report reviewed successfully"
);
```

---

## Category 5: Priority Casting

**Problem:** Commands pass Priority as `int`, need to cast to enum

**Wrong:**
```csharp
Priority = request.Priority  // int from command
```

**Correct:**
```csharp
Priority = (ReportPriority)request.Priority
```

**Affected Files:**
- CreateReportCommandHandler.cs (line 32)
- UpdateReportCommandHandler.cs - Priority parsing section (line 56)

**UpdateReportCommandHandler specific fix** (lines 52-58):
```csharp
// Update priority
report.Priority = (ReportPriority)request.Priority;
```

---

## Category 6: UserDto Construction

**Problem:** UserDto requires all parameters in correct order

**Current Definition:**
```csharp
public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    string Role,
    bool IsActive,
    bool IsEmailVerified,
    DateTime CreatedAt
);
```

**Wrong:**
```csharp
return new UserDto
{
    Email = user.Email,
    // ...
};
```

**Correct:**
```csharp
return new UserDto(
    user.Id,
    user.Email,
    user.FirstName,
    user.LastName,
    user.PhoneNumber,
    user.Role.ToString(),
    user.IsActive,
    user.IsEmailVerified,
    user.CreatedAt
);
```

**Affected Files:**
- GetUserByIdQueryHandler.cs (line 33)
- RegisterCommandHandler.cs (line 78)
- LoginCommandHandler.cs (line 72)
- RefreshTokenCommandHandler.cs (line 90)

---

## Category 7: RefreshToken Issues

**Problem:** IUnitOfWork doesn't have RefreshTokens repository (not implemented yet)

**Affected Files:**
- RevokeTokenCommandHandler.cs (lines 25, 40)
- RegisterCommandHandler.cs (lines 62, 70, 74)
- LoginCommandHandler.cs (lines 56, 64, 68)
- RefreshTokenCommandHandler.cs (lines 30, 39, 75, 82, 86)

**Solution Options:**
1. **Create RefreshToken repository** (recommended):
   - Create `IRefreshTokenRepository` interface
   - Create `RefreshTokenRepository` implementation
   - Add to UnitOfWork
   - Update handlers

2. **Use Users repository** (temporary):
   - RefreshTokens are navigation property of User
   - Access via Users.GetByIdAsync then user.RefreshTokens

3. **Remove token refresh functionality** (not recommended)

---

## Category 8: AuthResponse Construction

**Problem:** AuthResponse requires specific parameters

**Current Definition:**
```csharp
public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserDto User
);
```

**Wrong:**
```csharp
return new AuthResponse
{
    Token = token,
    User = userDto
};
```

**Correct:**
```csharp
return new AuthResponse(
    accessToken,
    refreshToken.Token,
    refreshToken.ExpiresAt,
    userDto
);
```

**Affected Files:**
- RegisterCommandHandler.cs (line 78)
- LoginCommandHandler.cs (line 72)
- RefreshTokenCommandHandler.cs (line 90)

---

## Category 9: GetAllReportsQueryHandler DateTime Mapping

**Problem:** DTOs expect DateTime, not string

**Wrong:**
```csharp
SubmittedAt = r.SubmittedAt?.ToString("o"),
ReviewedAt = r.ReviewedAt?.ToString("o"),
CreatedAt = r.CreatedAt.ToString("o"),
UpdatedAt = r.UpdatedAt?.ToString("o"),
```

**Correct:**
```csharp
SubmittedAt = r.SubmittedAt,
ReviewedAt = r.ReviewedAt,
CreatedAt = r.CreatedAt,
UpdatedAt = r.UpdatedAt,
```

**Affected Files:**
- GetAllReportsQueryHandler.cs (lines 53-57, 64)
- SearchReportsQueryHandler.cs (lines 92-96, 103)

---

## Category 10: ReportDto & ReportAttachmentDto Construction

**Problem:** Record types require positional constructor parameters

**ReportDto Definition:**
```csharp
public record ReportDto(
    Guid Id,
    string Title,
    string Description,
    string Status,
    string Priority,
    string? Category,
    Guid UserId,
    string UserName,
    DateTime? SubmittedAt,
    DateTime? ReviewedAt,
    string? ReviewNotes,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    List<ReportAttachmentDto> Attachments
);
```

**Correct Construction:**
```csharp
var reportDtos = paginatedReports.Select(r => new ReportDto(
    r.Id,
    r.Title,
    r.Description,
    r.Status.ToString(),
    r.Priority.ToString(),
    r.Category,
    r.UserId,
    r.User.Email,  // or $"{r.User.FirstName} {r.User.LastName}"
    r.SubmittedAt,
    r.ReviewedAt,
    r.ReviewNotes,
    r.CreatedAt,
    r.UpdatedAt,
    r.Attachments?.Select(a => new ReportAttachmentDto(
        a.Id,
        a.FileName,
        a.ContentType,
        a.FileSize,
        a.CreatedAt
    )).ToList() ?? new List<ReportAttachmentDto>()
)).ToList();
```

**Affected Files:**
- GetAllReportsQueryHandler.cs (lines 43-65)
- SearchReportsQueryHandler.cs (lines 82-104)

---

## Category 11: PagedResult Construction

**Wrong:**
```csharp
return new PagedResult<ReportDto>
{
    Data = reportDtos,
    // ...
};
```

**Correct:**
```csharp
return new PagedResult<ReportDto>(
    reportDtos,
    request.PageNumber,
    request.PageSize,
    totalCount,
    totalPages
);
```

**Affected Files:**
- GetAllReportsQueryHandler.cs (line 70)
- SearchReportsQueryHandler.cs (line 110)

---

## Category 12: SearchReportsQuery Properties

**Problem:** SearchReportsQuery doesn't have UserId, FromDate, ToDate properties

**Current Definition (needs checking):**
```csharp
public record SearchReportsQuery(
    int? Status,
    int? Priority,
    string? Category,
    DateTime? CreatedFrom,
    DateTime? CreatedTo,
    int PageNumber = 1,
    int PageSize = 10
) : IRequest<PagedResult<ReportDto>>;
```

**Fix:** Use correct property names in handler:
- `request.CreatedFrom` instead of `request.FromDate`
- `request.CreatedTo` instead of `request.ToDate`
- Remove `UserId` filtering (not in query)
- Status/Priority are `int?` not `string?`

**Affected File:**
- SearchReportsQueryHandler.cs (lines 30, 32, 35, 38, 41, 44, 60, 62, 65, 67)

---

## Category 13: DeleteAttachmentCommandHandler

**Problem:** DeleteAsync expects entity object, not Guid

**Wrong:**
```csharp
await _unitOfWork.Attachments.DeleteAsync(request.AttachmentId, cancellationToken);
```

**Correct:**
```csharp
await _unitOfWork.Attachments.DeleteAsync(attachment, cancellationToken);
```

**Affected File:**
- DeleteAttachmentCommandHandler.cs (line 42)

---

## Category 14: DeleteAnnouncementCommandHandler

**Same issue as Category 13**

**Wrong:**
```csharp
await _unitOfWork.Announcements.DeleteAsync(request.AnnouncementId, cancellationToken);
```

**Correct:**
```csharp
await _unitOfWork.Announcements.DeleteAsync(announcement, cancellationToken);
```

**Affected File:**
- DeleteAnnouncementCommandHandler.cs (line 42)

---

## Category 15: GetAllUsersQueryHandler

**Problem:** User entity doesn't have IsEmailVerified property

**Wrong:**
```csharp
IsEmailVerified = u.IsEmailVerified,
```

**Correct:**
```csharp
IsEmailVerified = false,  // or remove if not needed
```

**Affected File:**
- GetAllUsersQueryHandler.cs (line 45)

---

## Quick Fix Priority Order

1. **High Priority** (Blocks everything):
   - Category 1: Enum references
   - Category 2: Command property names
   - Category 3: Guid nullable issues
   
2. **Medium Priority** (Affects multiple files):
   - Category 4: Response DTOs
   - Category 5: Priority casting
   - Category 6: UserDto construction
   - Category 10: ReportDto construction

3. **Low Priority** (Single file issues):
   - Category 12: SearchReportsQuery
   - Category 13-15: Individual handler issues

4. **Deferred** (Requires new implementation):
   - Category 7: RefreshToken repository

---

## Recommended Approach

Since there are 106 errors, I recommend:

1. **Option A - Quick Fix (2-3 hours):**
   - Fix Categories 1-6 and 10-15
   - Comment out RefreshToken code (Category 7)
   - Test and generate migration

2. **Option B - Proper Fix (4-6 hours):**
   - Implement RefreshToken repository
   - Fix all categories systematically
   - Add unit tests
   - Generate migration

3. **Option C - Minimal Viable (30 mins):**
   - Comment out all broken handlers
   - Keep only: Announcements, Users, Attachments (working)
   - Generate migration with subset of features
   - Fix reports later

Choose based on your timeline and requirements.

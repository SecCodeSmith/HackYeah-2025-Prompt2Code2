namespace Backend.Application.DTOs.Reports;

// Request DTOs
public record CreateReportRequest(
    string Title,
    string Description,
    string? Category,
    int Priority
);

public record UpdateReportRequest(
    string Title,
    string Description,
    string? Category,
    int Priority,
    int Status
);

public record SubmitReportRequest(
    Guid ReportId
);

public record ReviewReportRequest(
    Guid ReportId,
    int Status,
    string? ReviewNotes
);

public record GetReportsQuery(
    int? Status,
    int? Priority,
    string? Category,
    DateTime? CreatedFrom,
    DateTime? CreatedTo,
    int PageNumber = 1,
    int PageSize = 10
);

// Response DTOs
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

public record ReportAttachmentDto(
    Guid Id,
    string FileName,
    string ContentType,
    long FileSize,
    DateTime CreatedAt
);

public record ReportSummaryDto(
    Guid Id,
    string Title,
    string Status,
    string Priority,
    DateTime CreatedAt
);

public record PagedResult<T>(
    List<T> Items,
    int PageNumber,
    int PageSize,
    int TotalCount,
    int TotalPages
);

public record CreateReportResponse(
    Guid Id,
    string Message
);

public record UpdateReportResponse(
    bool Success,
    string Message
);

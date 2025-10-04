using Backend.Application.DTOs.Reports;
using MediatR;

namespace Backend.Application.Features.Reports.Commands;

public record CreateReportCommand(
    string Title,
    string Description,
    string? Category,
    int Priority,
    Guid UserId
) : IRequest<CreateReportResponse>;

public record UpdateReportCommand(
    Guid ReportId,
    string Title,
    string Description,
    string? Category,
    int Priority,
    int Status,
    Guid UserId
) : IRequest<UpdateReportResponse>;

public record DeleteReportCommand(
    Guid ReportId,
    Guid UserId
) : IRequest<bool>;

public record SubmitReportCommand(
    Guid ReportId,
    Guid UserId
) : IRequest<bool>;

public record ReviewReportCommand(
    Guid ReportId,
    int Status,
    string? ReviewNotes,
    Guid ReviewerId
) : IRequest<bool>;

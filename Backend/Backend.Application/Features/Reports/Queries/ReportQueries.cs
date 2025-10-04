using Backend.Application.DTOs.Reports;
using Backend.Domain.Entities;
using MediatR;

namespace Backend.Application.Features.Reports.Queries;

public record GetReportByIdQuery(
    Guid ReportId,
    Guid UserId
) : IRequest<ReportDto?>;

public record GetAllReportsQuery(
    Guid UserId,
    int PageNumber = 1,
    int PageSize = 10
) : IRequest<PagedResult<ReportDto>>;

public record GetUserReportsQuery(
    Guid UserId,
    int PageNumber = 1,
    int PageSize = 10
) : IRequest<PagedResult<ReportDto>>;

public record GetReportsByStatusQuery(
    ReportStatus Status,
    int PageNumber = 1,
    int PageSize = 10
) : IRequest<PagedResult<ReportDto>>;

public record SearchReportsQuery(
    string? SearchTerm,
    int? Status,
    int? Priority,
    string? Category,
    DateTime? CreatedFrom,
    DateTime? CreatedTo,
    int PageNumber = 1,
    int PageSize = 10
) : IRequest<PagedResult<ReportDto>>;

public record ExportReportsQuery(
    string? SearchTerm,
    int? Status,
    int? Priority,
    string? Category,
    DateTime? CreatedFrom,
    DateTime? CreatedTo
) : IRequest<byte[]>;

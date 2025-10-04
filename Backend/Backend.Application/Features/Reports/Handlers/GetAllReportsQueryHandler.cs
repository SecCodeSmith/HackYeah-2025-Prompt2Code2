/* TEMP DISABLED - Complex DateTime/DTO issues need manual review
TODO: Fix DateTime string conversions and DTO constructors before uncommenting

// File: Backend/Backend.Application/Features/Reports/Handlers/GetAllReportsQueryHandler.cs
using Backend.Application.DTOs.Reports;
using Backend.Application.Features.Reports.Queries;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Reports.Handlers;

public class GetAllReportsQueryHandler : IRequestHandler<GetAllReportsQuery, PagedResult<ReportDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetAllReportsQueryHandler> _logger;

    public GetAllReportsQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<GetAllReportsQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PagedResult<ReportDto>> Handle(GetAllReportsQuery request, CancellationToken cancellationToken)
    {
        // Get all reports (in a real application, you might want to filter by user role)
        var allReports = await _unitOfWork.Reports.GetAllAsync(cancellationToken);
        
        // Convert to list for in-memory operations
        var reportsList = allReports.ToList();

        // Calculate pagination
        var totalCount = reportsList.Count;
        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);

        // Apply pagination
        var paginatedReports = reportsList
            .OrderByDescending(r => r.CreatedAt)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        // Map to DTOs
        var reportDtos = paginatedReports.Select(r => new ReportDto
        {
            Id = r.Id,
            Title = r.Title,
            Description = r.Description,
            Status = r.Status.ToString(),
            Priority = r.Priority.ToString(),
            Category = r.Category,
            UserId = r.UserId,
            UserName = $"{r.User?.FirstName} {r.User?.LastName}",
            SubmittedAt = r.SubmittedAt?.ToString("o"),
            ReviewedAt = r.ReviewedAt?.ToString("o"),
            ReviewNotes = r.ReviewNotes,
            CreatedAt = r.CreatedAt.ToString("o"),
            UpdatedAt = r.UpdatedAt?.ToString("o"),
            Attachments = r.Attachments?.Select(a => new ReportAttachmentDto
            {
                Id = a.Id,
                FileName = a.FileName,
                ContentType = a.ContentType,
                FileSize = a.FileSize,
                CreatedAt = a.CreatedAt.ToString("o")
            }).ToList() ?? new List<ReportAttachmentDto>()
        }).ToList();

        _logger.LogInformation("Retrieved {Count} reports for page {PageNumber}", reportDtos.Count, request.PageNumber);

        return new PagedResult<ReportDto>
        {
            Items = reportDtos,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };
    }
}

*/

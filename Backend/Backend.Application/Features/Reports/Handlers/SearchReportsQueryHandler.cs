/* TEMP DISABLED - Complex DateTime/DTO issues need manual review
TODO: Fix DateTime string conversions and DTO constructors before uncommenting

// File: Backend/Backend.Application/Features/Reports/Handlers/SearchReportsQueryHandler.cs
using Backend.Application.DTOs.Reports;
using Backend.Application.Features.Reports.Queries;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Reports.Handlers;

public class SearchReportsQueryHandler : IRequestHandler<SearchReportsQuery, PagedResult<ReportDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<SearchReportsQueryHandler> _logger;

    public SearchReportsQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<SearchReportsQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PagedResult<ReportDto>> Handle(SearchReportsQuery request, CancellationToken cancellationToken)
    {
        // Get all reports
        var allReports = await _unitOfWork.Reports.GetAllAsync(cancellationToken);
        var reportsList = allReports.ToList();

        // Apply filters
        if (request.UserId.HasValue)
        {
            reportsList = reportsList.Where(r => r.UserId == request.UserId.Value).ToList();
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            reportsList = reportsList.Where(r => 
                r.Status.ToString().Equals(request.Status, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        if (!string.IsNullOrWhiteSpace(request.Priority))
        {
            reportsList = reportsList.Where(r => 
                r.Priority.ToString().Equals(request.Priority, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            reportsList = reportsList.Where(r => 
                r.Category != null && r.Category.Contains(request.Category, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            reportsList = reportsList.Where(r =>
                (r.Title != null && r.Title.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase)) ||
                (r.Description != null && r.Description.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase))).ToList();
        }

        if (request.FromDate.HasValue)
        {
            reportsList = reportsList.Where(r => r.CreatedAt >= request.FromDate.Value).ToList();
        }

        if (request.ToDate.HasValue)
        {
            reportsList = reportsList.Where(r => r.CreatedAt <= request.ToDate.Value).ToList();
        }

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

        _logger.LogInformation("Found {Count} reports matching search criteria for page {PageNumber}", 
            reportDtos.Count, request.PageNumber);

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

using Backend.Application.DTOs.Reports;
using Backend.Application.Features.Reports.Queries;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Reports.Handlers;

public class GetUserReportsQueryHandler : IRequestHandler<GetUserReportsQuery, PagedResult<ReportDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetUserReportsQueryHandler> _logger;

    public GetUserReportsQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<GetUserReportsQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PagedResult<ReportDto>> Handle(GetUserReportsQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting reports for user {UserId}, page {PageNumber}, size {PageSize}", 
            request.UserId, request.PageNumber, request.PageSize);

        // Get all reports for the user
        var allReports = await _unitOfWork.Reports.GetAllAsync(cancellationToken);
        
        // Filter by user ID
        var userReports = allReports.Where(r => r.UserId == request.UserId).ToList();

        // Calculate pagination
        var totalCount = userReports.Count;
        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);

        // Apply pagination
        var paginatedReports = userReports
            .OrderByDescending(r => r.CreatedAt)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        // Map to DTOs
        var reportDtos = paginatedReports.Select(r => new ReportDto(
            Id: r.Id,
            Title: r.Title,
            Description: r.Description,
            Status: r.Status.ToString(),
            Priority: r.Priority.ToString(),
            Category: r.Category,
            UserId: r.UserId,
            UserName: r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : "Unknown",
            SubmittedAt: r.SubmittedAt,
            ReviewedAt: r.ReviewedAt,
            ReviewNotes: r.ReviewNotes,
            CreatedAt: r.CreatedAt,
            UpdatedAt: r.UpdatedAt,
            Attachments: r.Attachments?.Select(a => new ReportAttachmentDto(
                Id: a.Id,
                FileName: a.FileName,
                ContentType: a.ContentType,
                FileSize: a.FileSize,
                CreatedAt: a.CreatedAt
            )).ToList() ?? new List<ReportAttachmentDto>()
        )).ToList();

        _logger.LogInformation("Retrieved {Count} reports for user {UserId}", reportDtos.Count, request.UserId);

        return new PagedResult<ReportDto>(
            Items: reportDtos,
            PageNumber: request.PageNumber,
            PageSize: request.PageSize,
            TotalCount: totalCount,
            TotalPages: totalPages
        );
    }
}

// File: Backend/Backend.Application/Features/Reports/Handlers/CreateReportCommandHandler.cs
using Backend.Application.DTOs.Reports;
using Backend.Application.Features.Reports.Commands;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;

namespace Backend.Application.Features.Reports.Handlers;

public class CreateReportCommandHandler : IRequestHandler<CreateReportCommand, CreateReportResponse>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateReportCommandHandler> _logger;

    public CreateReportCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<CreateReportCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<CreateReportResponse> Handle(CreateReportCommand request, CancellationToken cancellationToken)
    {
        // Create new report entity
        var report = new Report
        {
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            Priority = request.Priority,
            UserId = request.UserId,
            Status = ReportStatus.Draft
        };

        // Add report to database
        await _unitOfWork.Reports.AddAsync(report, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Report created: {ReportId} by user: {UserId}", report.Id, request.UserId);

        // Return response
        return new CreateReportResponse
        {
            Id = report.Id,
            Title = report.Title,
            Status = report.Status.ToString(),
            CreatedAt = report.CreatedAt
        };
    }
}

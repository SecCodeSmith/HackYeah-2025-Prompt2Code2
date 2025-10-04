// File: Backend/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs
using Backend.Application.DTOs.Reports;
using Backend.Application.Features.Reports.Commands;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Reports.Handlers;

public class SubmitReportCommandHandler : IRequestHandler<SubmitReportCommand, SubmitReportResponse>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<SubmitReportCommandHandler> _logger;

    public SubmitReportCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<SubmitReportCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<SubmitReportResponse> Handle(SubmitReportCommand request, CancellationToken cancellationToken)
    {
        // Find the report
        var report = await _unitOfWork.Reports.GetByIdAsync(request.ReportId, cancellationToken);
        if (report == null)
        {
            _logger.LogWarning("Report with ID {ReportId} not found", request.ReportId);
            throw new KeyNotFoundException($"Report with ID {request.ReportId} not found");
        }

        // Authorization check - only the owner can submit their report
        if (report.UserId != request.UserId)
        {
            _logger.LogWarning("User {UserId} attempted to submit report {ReportId} they don't own", 
                request.UserId, request.ReportId);
            throw new UnauthorizedAccessException("You can only submit your own reports");
        }

        // Validate current status - only Draft reports can be submitted
        if (report.Status != ReportStatus.Draft)
        {
            _logger.LogWarning("Attempted to submit report {ReportId} with invalid status {Status}", 
                request.ReportId, report.Status);
            throw new InvalidOperationException($"Cannot submit report with status {report.Status}. Only Draft reports can be submitted.");
        }

        // Validate report has required data
        if (string.IsNullOrWhiteSpace(report.Title) || string.IsNullOrWhiteSpace(report.Description))
        {
            _logger.LogWarning("Attempted to submit incomplete report {ReportId}", request.ReportId);
            throw new InvalidOperationException("Report must have a title and description before submission");
        }

        // Update status to Submitted
        report.Status = ReportStatus.Submitted;
        report.SubmittedAt = DateTime.UtcNow;
        report.UpdatedAt = DateTime.UtcNow;

        // Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Report {ReportId} successfully submitted by user {UserId}", 
            request.ReportId, request.UserId);

        return new SubmitReportResponse(
            true,
            "Report submitted successfully"
        );
    }
}

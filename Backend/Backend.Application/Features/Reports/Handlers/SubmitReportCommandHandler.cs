// File: Backend/Backend.Application/Features/Reports/Handlers/SubmitReportCommandHandler.cs
using Backend.Application.DTOs.Reports;
using Backend.Application.Features.Reports.Commands;
using Backend.Domain.Interfaces;
using MediatR;

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
        if (request.UserId.HasValue && report.UserId != request.UserId.Value)
        {
            _logger.LogWarning("User {UserId} attempted to submit report {ReportId} they don't own", 
                request.UserId.Value, request.ReportId);
            throw new UnauthorizedAccessException("You can only submit your own reports");
        }

        // Validate current status - only Draft and Returned reports can be submitted
        if (report.Status != Domain.Enums.ReportStatus.Draft && 
            report.Status != Domain.Enums.ReportStatus.Returned)
        {
            _logger.LogWarning("Attempted to submit report {ReportId} with invalid status {Status}", 
                request.ReportId, report.Status);
            throw new InvalidOperationException($"Cannot submit report with status {report.Status}. Only Draft and Returned reports can be submitted.");
        }

        // Validate report has required data
        if (string.IsNullOrWhiteSpace(report.Title) || string.IsNullOrWhiteSpace(report.Description))
        {
            _logger.LogWarning("Attempted to submit incomplete report {ReportId}", request.ReportId);
            throw new InvalidOperationException("Report must have a title and description before submission");
        }

        // Update status to Submitted
        report.Status = Domain.Enums.ReportStatus.Submitted;
        report.SubmittedAt = DateTime.UtcNow;
        report.UpdatedAt = DateTime.UtcNow;

        // Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Report {ReportId} successfully submitted by user {UserId}", 
            request.ReportId, request.UserId);

        return new SubmitReportResponse
        {
            ReportId = report.Id,
            Status = report.Status.ToString(),
            SubmittedAt = report.SubmittedAt.Value
        };
    }
}

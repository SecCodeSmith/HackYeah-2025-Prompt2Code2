// File: Backend/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs
using Backend.Application.DTOs.Reports;
using Backend.Application.Features.Reports.Commands;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Reports.Handlers;

public class ReviewReportCommandHandler : IRequestHandler<ReviewReportCommand, ReviewReportResponse>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ReviewReportCommandHandler> _logger;

    public ReviewReportCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<ReviewReportCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<ReviewReportResponse> Handle(ReviewReportCommand request, CancellationToken cancellationToken)
    {
        // Find the report
        var report = await _unitOfWork.Reports.GetByIdAsync(request.ReportId, cancellationToken);
        if (report == null)
        {
            _logger.LogWarning("Report with ID {ReportId} not found", request.ReportId);
            throw new KeyNotFoundException($"Report with ID {request.ReportId} not found");
        }

        // Authorization check - verify the reviewing user is an admin
        var reviewer = await _unitOfWork.Users.GetByIdAsync(request.ReviewerId, cancellationToken);
        if (reviewer == null || reviewer.Role != UserRole.Administrator)
        {
            _logger.LogWarning("User {ReviewerId} is not authorized to review reports", request.ReviewerId);
            throw new UnauthorizedAccessException("Only administrators can review reports");
        }

        // Validate current status - only Submitted reports can be reviewed
        if (report.Status != ReportStatus.Submitted)
        {
            _logger.LogWarning("Attempted to review report {ReportId} with invalid status {Status}", 
                request.ReportId, report.Status);
            throw new InvalidOperationException($"Cannot review report with status {report.Status}. Only Submitted reports can be reviewed.");
        }

        // Convert status from int to enum
        var newStatus = (ReportStatus)request.Status;

        // Validate that the new status is a valid review outcome
        if (newStatus != ReportStatus.Approved && 
            newStatus != ReportStatus.Rejected && 
            newStatus != ReportStatus.Archived)
        {
            _logger.LogWarning("Invalid review status: {NewStatus}", newStatus);
            throw new ArgumentException($"Review status must be Approved, Rejected, or Archived. Provided: {newStatus}");
        }

        // Update report with review decision
        report.Status = newStatus;
        report.ReviewNotes = request.ReviewNotes;
        report.ReviewedAt = DateTime.UtcNow;
        report.UpdatedAt = DateTime.UtcNow;

        // Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Report {ReportId} reviewed by admin {ReviewerId} with status {Status}", 
            request.ReportId, request.ReviewerId, newStatus);

        return new ReviewReportResponse(
            true,
            $"Report {newStatus.ToString().ToLower()} successfully"
        );
    }
}

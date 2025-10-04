// File: Backend/Backend.Application/Features/Reports/Handlers/ReviewReportCommandHandler.cs
using Backend.Application.DTOs.Reports;
using Backend.Application.Features.Reports.Commands;
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
        // (In a real app, you would check the user's role from the authentication context)
        if (request.ReviewerId.HasValue)
        {
            var reviewer = await _unitOfWork.Users.GetByIdAsync(request.ReviewerId.Value, cancellationToken);
            if (reviewer == null || reviewer.Role != Domain.Enums.UserRole.Admin)
            {
                _logger.LogWarning("User {ReviewerId} is not authorized to review reports", request.ReviewerId.Value);
                throw new UnauthorizedAccessException("Only administrators can review reports");
            }
        }

        // Validate current status - only Submitted reports can be reviewed
        if (report.Status != Domain.Enums.ReportStatus.Submitted)
        {
            _logger.LogWarning("Attempted to review report {ReportId} with invalid status {Status}", 
                request.ReportId, report.Status);
            throw new InvalidOperationException($"Cannot review report with status {report.Status}. Only Submitted reports can be reviewed.");
        }

        // Parse and validate the requested status
        if (!Enum.TryParse<Domain.Enums.ReportStatus>(request.NewStatus, true, out var newStatus))
        {
            _logger.LogWarning("Invalid status provided for review: {NewStatus}", request.NewStatus);
            throw new ArgumentException($"Invalid status: {request.NewStatus}");
        }

        // Validate that the new status is a valid review outcome
        if (newStatus != Domain.Enums.ReportStatus.Approved && 
            newStatus != Domain.Enums.ReportStatus.Rejected && 
            newStatus != Domain.Enums.ReportStatus.Returned)
        {
            _logger.LogWarning("Invalid review status: {NewStatus}", newStatus);
            throw new ArgumentException($"Review status must be Approved, Rejected, or Returned. Provided: {newStatus}");
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

        return new ReviewReportResponse
        {
            ReportId = report.Id,
            Status = report.Status.ToString(),
            ReviewedAt = report.ReviewedAt.Value,
            ReviewNotes = report.ReviewNotes
        };
    }
}

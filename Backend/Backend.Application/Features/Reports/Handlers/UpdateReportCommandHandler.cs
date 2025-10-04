// File: Backend/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs
using Backend.Application.DTOs.Reports;
using Backend.Application.Features.Reports.Commands;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Reports.Handlers;

public class UpdateReportCommandHandler : IRequestHandler<UpdateReportCommand, UpdateReportResponse>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdateReportCommandHandler> _logger;

    public UpdateReportCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<UpdateReportCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<UpdateReportResponse> Handle(UpdateReportCommand request, CancellationToken cancellationToken)
    {
        // Find the report
        var report = await _unitOfWork.Reports.GetByIdAsync(request.ReportId, cancellationToken);
        if (report == null)
        {
            _logger.LogWarning("Report with ID {ReportId} not found", request.ReportId);
            throw new KeyNotFoundException($"Report with ID {request.ReportId} not found");
        }

        // Authorization check - only the owner can edit their report
        if (report.UserId != request.UserId)
        {
            _logger.LogWarning("User {UserId} attempted to update report {ReportId} they don't own", 
                request.UserId, request.ReportId);
            throw new UnauthorizedAccessException("You can only update your own reports");
        }

        // Only Draft reports can be updated
        if (report.Status != ReportStatus.Draft)
        {
            _logger.LogWarning("Attempted to update report {ReportId} with status {Status}", 
                request.ReportId, report.Status);
            throw new InvalidOperationException($"Cannot update report with status {report.Status}. Only Draft reports can be edited.");
        }

        // Update fields
        report.Title = request.Title;
        report.Description = request.Description;
        report.Category = request.Category;
        report.Priority = (ReportPriority)request.Priority;
        report.UpdatedAt = DateTime.UtcNow;

        // Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Report {ReportId} successfully updated by user {UserId}", 
            request.ReportId, request.UserId);

        return new UpdateReportResponse(
            true,
            "Report updated successfully"
        );
    }
}

// File: Backend/Backend.Application/Features/Reports/Handlers/UpdateReportCommandHandler.cs
using Backend.Application.DTOs.Reports;
using Backend.Application.Features.Reports.Commands;
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
        var report = await _unitOfWork.Reports.GetByIdAsync(request.Id, cancellationToken);
        if (report == null)
        {
            _logger.LogWarning("Report with ID {ReportId} not found", request.Id);
            throw new KeyNotFoundException($"Report with ID {request.Id} not found");
        }

        // Authorization check - only the owner can edit their report
        // (In a real app, you would pass the current user's ID from the request/context)
        if (request.UserId.HasValue && report.UserId != request.UserId.Value)
        {
            _logger.LogWarning("User {UserId} attempted to update report {ReportId} they don't own", 
                request.UserId.Value, request.Id);
            throw new UnauthorizedAccessException("You can only update your own reports");
        }

        // Only Draft and Returned reports can be updated
        if (report.Status != Domain.Enums.ReportStatus.Draft && 
            report.Status != Domain.Enums.ReportStatus.Returned)
        {
            _logger.LogWarning("Attempted to update report {ReportId} with status {Status}", 
                request.Id, report.Status);
            throw new InvalidOperationException($"Cannot update report with status {report.Status}. Only Draft and Returned reports can be edited.");
        }

        // Update fields
        report.Title = request.Title ?? report.Title;
        report.Description = request.Description ?? report.Description;
        report.Category = request.Category ?? report.Category;

        if (Enum.TryParse<Domain.Enums.ReportPriority>(request.Priority, true, out var priority))
        {
            report.Priority = priority;
        }

        report.UpdatedAt = DateTime.UtcNow;

        // Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Report {ReportId} successfully updated by user {UserId}", 
            request.Id, request.UserId);

        return new UpdateReportResponse
        {
            Id = report.Id,
            UpdatedAt = report.UpdatedAt.Value
        };
    }
}

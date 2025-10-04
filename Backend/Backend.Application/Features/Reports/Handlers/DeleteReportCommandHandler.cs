// File: Backend/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs
using Backend.Application.Features.Reports.Commands;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Reports.Handlers;

public class DeleteReportCommandHandler : IRequestHandler<DeleteReportCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DeleteReportCommandHandler> _logger;

    public DeleteReportCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<DeleteReportCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<bool> Handle(DeleteReportCommand request, CancellationToken cancellationToken)
    {
        // Find the report
        var report = await _unitOfWork.Reports.GetByIdAsync(request.ReportId, cancellationToken);
        if (report == null)
        {
            _logger.LogWarning("Report with ID {ReportId} not found", request.ReportId);
            return false;
        }

        // Authorization check - only the owner can delete their report
        if (report.UserId != request.UserId)
        {
            _logger.LogWarning("User {UserId} attempted to delete report {ReportId} they don't own", 
                request.UserId, request.ReportId);
            throw new UnauthorizedAccessException("You can only delete your own reports");
        }

        // Only Draft reports can be deleted
        if (report.Status != ReportStatus.Draft)
        {
            _logger.LogWarning("Attempted to delete report {ReportId} with status {Status}", 
                request.ReportId, report.Status);
            throw new InvalidOperationException($"Cannot delete report with status {report.Status}. Only Draft reports can be deleted.");
        }

        // Delete the report
        await _unitOfWork.Reports.DeleteAsync(report, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Report {ReportId} successfully deleted by user {UserId}", 
            request.ReportId, request.UserId);

        return true;
    }
}

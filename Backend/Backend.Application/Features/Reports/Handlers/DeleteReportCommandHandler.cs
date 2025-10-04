// File: Backend/Backend.Application/Features/Reports/Handlers/DeleteReportCommandHandler.cs
using Backend.Application.Features.Reports.Commands;
using Backend.Domain.Interfaces;
using MediatR;

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
        var report = await _unitOfWork.Reports.GetByIdAsync(request.Id, cancellationToken);
        if (report == null)
        {
            _logger.LogWarning("Report with ID {ReportId} not found", request.Id);
            return false;
        }

        // Authorization check - only the owner can delete their report
        if (request.UserId.HasValue && report.UserId != request.UserId.Value)
        {
            _logger.LogWarning("User {UserId} attempted to delete report {ReportId} they don't own", 
                request.UserId.Value, request.Id);
            throw new UnauthorizedAccessException("You can only delete your own reports");
        }

        // Only Draft reports can be deleted
        if (report.Status != Domain.Enums.ReportStatus.Draft)
        {
            _logger.LogWarning("Attempted to delete report {ReportId} with status {Status}", 
                request.Id, report.Status);
            throw new InvalidOperationException($"Cannot delete report with status {report.Status}. Only Draft reports can be deleted.");
        }

        // Delete the report
        await _unitOfWork.Reports.DeleteAsync(report.Id, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Report {ReportId} successfully deleted by user {UserId}", 
            request.Id, request.UserId);

        return true;
    }
}

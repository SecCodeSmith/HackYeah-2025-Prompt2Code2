// File: Backend/Backend.Application/Features/Announcements/Handlers/UpdateAnnouncementCommandHandler.cs
using Backend.Application.Features.Announcements.Commands;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Announcements.Handlers;

public class UpdateAnnouncementCommandHandler : IRequestHandler<UpdateAnnouncementCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdateAnnouncementCommandHandler> _logger;

    public UpdateAnnouncementCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<UpdateAnnouncementCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<bool> Handle(UpdateAnnouncementCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Verify the updater is an admin
            var updater = await _unitOfWork.Users.GetByIdAsync(request.UpdatedBy, cancellationToken);
            if (updater == null || updater.Role != UserRole.Administrator)
            {
                _logger.LogWarning("Unauthorized access attempt to update announcement by UserId: {UpdatedBy}", request.UpdatedBy);
                throw new UnauthorizedAccessException("Only administrators can update announcements");
            }

            var announcement = await _unitOfWork.Announcements.GetByIdAsync(request.Id, cancellationToken);
            if (announcement == null)
            {
                _logger.LogWarning("Announcement not found: {AnnouncementId}", request.Id);
                return false;
            }

            announcement.Title = request.Title;
            announcement.Content = request.Content;
            announcement.Priority = (AnnouncementPriority)request.Priority;
            announcement.IsActive = request.IsActive;
            announcement.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Announcements.UpdateAsync(announcement, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Announcement updated: {AnnouncementId} by {UpdatedBy}", request.Id, request.UpdatedBy);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating announcement: {AnnouncementId}", request.Id);
            throw;
        }
    }
}

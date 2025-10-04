// File: Backend/Backend.Application/Features/Announcements/Handlers/DeleteAnnouncementCommandHandler.cs
using Backend.Application.Features.Announcements.Commands;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Announcements.Handlers;

public class DeleteAnnouncementCommandHandler : IRequestHandler<DeleteAnnouncementCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DeleteAnnouncementCommandHandler> _logger;

    public DeleteAnnouncementCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<DeleteAnnouncementCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<bool> Handle(DeleteAnnouncementCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Verify the deleter is an admin
            var deleter = await _unitOfWork.Users.GetByIdAsync(request.DeletedBy, cancellationToken);
            if (deleter == null || deleter.Role != UserRole.Administrator)
            {
                _logger.LogWarning("Unauthorized access attempt to delete announcement by UserId: {DeletedBy}", request.DeletedBy);
                throw new UnauthorizedAccessException("Only administrators can delete announcements");
            }

            var announcement = await _unitOfWork.Announcements.GetByIdAsync(request.Id, cancellationToken);
            if (announcement == null)
            {
                _logger.LogWarning("Announcement not found: {AnnouncementId}", request.Id);
                return false;
            }

            await _unitOfWork.Announcements.DeleteAsync(announcement, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Announcement deleted: {AnnouncementId} by {DeletedBy}", request.Id, request.DeletedBy);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting announcement: {AnnouncementId}", request.Id);
            throw;
        }
    }
}

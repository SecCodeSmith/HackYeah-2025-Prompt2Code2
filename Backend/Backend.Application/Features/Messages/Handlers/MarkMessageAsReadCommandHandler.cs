// File: Backend/Backend.Application/Features/Messages/Handlers/MarkMessageAsReadCommandHandler.cs
using Backend.Application.Features.Messages.Commands;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Messages.Handlers;

public class MarkMessageAsReadCommandHandler : IRequestHandler<MarkMessageAsReadCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<MarkMessageAsReadCommandHandler> _logger;

    public MarkMessageAsReadCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<MarkMessageAsReadCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<bool> Handle(MarkMessageAsReadCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var message = await _unitOfWork.Messages.GetByIdAsync(request.MessageId, cancellationToken);

            if (message == null)
            {
                _logger.LogWarning("Message {MessageId} not found", request.MessageId);
                return false;
            }

            // Verify user is the recipient
            if (message.RecipientUserId != request.UserId)
            {
                throw new UnauthorizedAccessException($"User {request.UserId} is not the recipient of message {request.MessageId}");
            }

            // Mark as read
            message.Status = MessageStatus.Read;
            message.ReadAt = DateTime.UtcNow;
            message.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Message {MessageId} marked as read by user {UserId}", request.MessageId, request.UserId);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking message {MessageId} as read", request.MessageId);
            throw;
        }
    }
}

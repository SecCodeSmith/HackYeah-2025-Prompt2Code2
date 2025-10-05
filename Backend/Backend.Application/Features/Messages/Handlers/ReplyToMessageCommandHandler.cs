// File: Backend/Backend.Application/Features/Messages/Handlers/ReplyToMessageCommandHandler.cs
using Backend.Application.DTOs.Messages;
using Backend.Application.Features.Messages.Commands;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Messages.Handlers;

public class ReplyToMessageCommandHandler : IRequestHandler<ReplyToMessageCommand, MessageDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ReplyToMessageCommandHandler> _logger;

    public ReplyToMessageCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<ReplyToMessageCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<MessageDto> Handle(ReplyToMessageCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Get parent message
            var parentMessage = await _unitOfWork.Messages.GetByIdWithDetailsAsync(request.ParentMessageId, cancellationToken);

            if (parentMessage == null)
            {
                throw new InvalidOperationException($"Parent message {request.ParentMessageId} not found");
            }

            // Verify sender has access to parent message
            if (parentMessage.SenderUserId != request.SenderUserId && parentMessage.RecipientUserId != request.SenderUserId)
            {
                throw new UnauthorizedAccessException($"User {request.SenderUserId} does not have access to parent message");
            }

            // Determine recipient (if replying, recipient is the other party)
            Guid? recipientUserId = parentMessage.SenderUserId == request.SenderUserId
                ? parentMessage.RecipientUserId
                : parentMessage.SenderUserId;

            var sender = await _unitOfWork.Users.GetByIdAsync(request.SenderUserId, cancellationToken);
            if (sender == null)
            {
                throw new InvalidOperationException($"Sender with ID {request.SenderUserId} not found");
            }

            var isFromUKNF = sender.Role == UserRole.Administrator;

            // Create reply message
            var replyMessage = new Message
            {
                Id = Guid.NewGuid(),
                Subject = parentMessage.Subject.StartsWith("Re: ") ? parentMessage.Subject : $"Re: {parentMessage.Subject}",
                Content = request.Content,
                Priority = (MessagePriority)request.Priority,
                Status = MessageStatus.Unread,
                SentAt = DateTime.UtcNow,
                SenderUserId = request.SenderUserId,
                RecipientUserId = recipientUserId,
                PodmiotId = parentMessage.PodmiotId,
                ParentMessageId = request.ParentMessageId,
                ThreadId = parentMessage.ThreadId,
                IsFromUKNF = isFromUKNF,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Messages.AddAsync(replyMessage, cancellationToken);

            // Update parent message status
            if (parentMessage.Status == MessageStatus.Unread)
            {
                parentMessage.Status = MessageStatus.Replied;
                parentMessage.UpdatedAt = DateTime.UtcNow;
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Reply sent from {SenderId} to message {ParentMessageId}", 
                request.SenderUserId, request.ParentMessageId);

            // Reload with details
            var createdReply = await _unitOfWork.Messages.GetByIdWithDetailsAsync(replyMessage.Id, cancellationToken);

            return new MessageDto(
                createdReply!.Id,
                createdReply.Subject,
                createdReply.Content,
                createdReply.Priority.ToString(),
                createdReply.Status.ToString(),
                createdReply.SentAt,
                createdReply.ReadAt,
                createdReply.SenderUserId,
                createdReply.Sender != null ? $"{createdReply.Sender.FirstName} {createdReply.Sender.LastName}" : "Unknown",
                createdReply.RecipientUserId,
                createdReply.Recipient != null ? $"{createdReply.Recipient.FirstName} {createdReply.Recipient.LastName}" : null,
                createdReply.PodmiotId,
                createdReply.Podmiot?.Nazwa,
                createdReply.ParentMessageId,
                createdReply.ThreadId,
                createdReply.IsFromUKNF,
                createdReply.Replies?.Count ?? 0,
                createdReply.CreatedAt
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error replying to message {ParentMessageId}", request.ParentMessageId);
            throw;
        }
    }
}

// File: Backend/Backend.Application/Features/Messages/Handlers/SendMessageCommandHandler.cs
using Backend.Application.DTOs.Messages;
using Backend.Application.Features.Messages.Commands;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Messages.Handlers;

public class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, MessageDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<SendMessageCommandHandler> _logger;

    public SendMessageCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<SendMessageCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<MessageDto> Handle(SendMessageCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Validate sender exists
            var sender = await _unitOfWork.Users.GetByIdAsync(request.SenderUserId, cancellationToken);
            if (sender == null)
            {
                throw new InvalidOperationException($"Sender with ID {request.SenderUserId} not found");
            }

            // Validate priority
            if (!Enum.IsDefined(typeof(MessagePriority), request.Priority))
            {
                throw new ArgumentException($"Invalid priority value: {request.Priority}");
            }

            // Validate recipient or podmiot
            if (request.RecipientUserId == null && request.PodmiotId == null)
            {
                throw new ArgumentException("Either RecipientUserId or PodmiotId must be provided");
            }

            // If recipient specified, validate it exists
            if (request.RecipientUserId.HasValue)
            {
                var recipient = await _unitOfWork.Users.GetByIdAsync(request.RecipientUserId.Value, cancellationToken);
                if (recipient == null)
                {
                    throw new InvalidOperationException($"Recipient with ID {request.RecipientUserId} not found");
                }
            }

            // If podmiot specified, validate it exists
            if (request.PodmiotId.HasValue)
            {
                var podmiot = await _unitOfWork.Podmioty.GetByIdAsync(request.PodmiotId.Value, cancellationToken);
                if (podmiot == null)
                {
                    throw new InvalidOperationException($"Podmiot with ID {request.PodmiotId} not found");
                }
            }

            // Determine if sender is from UKNF (admin role)
            var isFromUKNF = sender.Role == Domain.Entities.UserRole.Administrator;

            // Create message
            var message = new Message
            {
                Id = Guid.NewGuid(),
                Subject = request.Subject,
                Content = request.Content,
                Priority = (MessagePriority)request.Priority,
                Status = MessageStatus.Unread,
                SentAt = DateTime.UtcNow,
                SenderUserId = request.SenderUserId,
                RecipientUserId = request.RecipientUserId,
                PodmiotId = request.PodmiotId,
                ThreadId = Guid.NewGuid(), // New thread
                IsFromUKNF = isFromUKNF,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Messages.AddAsync(message, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Message sent from {SenderId} to {RecipientId}/{PodmiotId}", 
                request.SenderUserId, request.RecipientUserId, request.PodmiotId);

            // Reload with details
            var createdMessage = await _unitOfWork.Messages.GetByIdWithDetailsAsync(message.Id, cancellationToken);
            
            return MapToDto(createdMessage!);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending message");
            throw;
        }
    }

    private static MessageDto MapToDto(Message message)
    {
        return new MessageDto(
            message.Id,
            message.Subject,
            message.Content,
            message.Priority.ToString(),
            message.Status.ToString(),
            message.SentAt,
            message.ReadAt,
            message.SenderUserId,
            message.Sender != null ? $"{message.Sender.FirstName} {message.Sender.LastName}" : "Unknown",
            message.RecipientUserId,
            message.Recipient != null ? $"{message.Recipient.FirstName} {message.Recipient.LastName}" : null,
            message.PodmiotId,
            message.Podmiot?.Nazwa,
            message.ParentMessageId,
            message.ThreadId,
            message.IsFromUKNF,
            message.Replies?.Count ?? 0,
            message.CreatedAt
        );
    }
}

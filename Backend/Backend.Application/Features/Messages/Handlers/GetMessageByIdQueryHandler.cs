// File: Backend/Backend.Application/Features/Messages/Handlers/GetMessageByIdQueryHandler.cs
using Backend.Application.DTOs.Messages;
using Backend.Application.Features.Messages.Queries;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Messages.Handlers;

public class GetMessageByIdQueryHandler : IRequestHandler<GetMessageByIdQuery, MessageDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetMessageByIdQueryHandler> _logger;

    public GetMessageByIdQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<GetMessageByIdQueryHandler> _logger)
    {
        _unitOfWork = unitOfWork;
        this._logger = _logger;
    }

    public async Task<MessageDto> Handle(GetMessageByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var message = await _unitOfWork.Messages.GetByIdWithDetailsAsync(request.MessageId, cancellationToken);

            if (message == null)
            {
                throw new InvalidOperationException($"Message {request.MessageId} not found");
            }

            // Verify user has access
            if (message.SenderUserId != request.UserId && message.RecipientUserId != request.UserId)
            {
                throw new UnauthorizedAccessException($"User {request.UserId} does not have access to message {request.MessageId}");
            }

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
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving message {MessageId}", request.MessageId);
            throw;
        }
    }
}

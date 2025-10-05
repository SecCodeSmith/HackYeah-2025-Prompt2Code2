// File: Backend/Backend.Application/Features/Messages/Handlers/GetMessageThreadQueryHandler.cs
using Backend.Application.DTOs.Messages;
using Backend.Application.Features.Messages.Queries;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Messages.Handlers;

public class GetMessageThreadQueryHandler : IRequestHandler<GetMessageThreadQuery, MessageThreadDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetMessageThreadQueryHandler> _logger;

    public GetMessageThreadQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<GetMessageThreadQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<MessageThreadDto> Handle(GetMessageThreadQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var messages = await _unitOfWork.Messages.GetThreadMessagesAsync(request.ThreadId, cancellationToken);

            if (messages.Count == 0)
            {
                throw new InvalidOperationException($"Thread {request.ThreadId} not found");
            }

            // Verify user has access to this thread
            var userHasAccess = messages.Any(m =>
                m.SenderUserId == request.UserId ||
                m.RecipientUserId == request.UserId);

            if (!userHasAccess)
            {
                throw new UnauthorizedAccessException($"User {request.UserId} does not have access to thread {request.ThreadId}");
            }

            var messageDtos = messages.Select(m => new MessageDto(
                m.Id,
                m.Subject,
                m.Content,
                m.Priority.ToString(),
                m.Status.ToString(),
                m.SentAt,
                m.ReadAt,
                m.SenderUserId,
                m.Sender != null ? $"{m.Sender.FirstName} {m.Sender.LastName}" : "Unknown",
                m.RecipientUserId,
                m.Recipient != null ? $"{m.Recipient.FirstName} {m.Recipient.LastName}" : null,
                m.PodmiotId,
                m.Podmiot?.Nazwa,
                m.ParentMessageId,
                m.ThreadId,
                m.IsFromUKNF,
                m.Replies?.Count ?? 0,
                m.CreatedAt
            )).ToList();

            return new MessageThreadDto(
                request.ThreadId,
                messages.First().Subject,
                messageDtos,
                messageDtos.Count
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving message thread {ThreadId}", request.ThreadId);
            throw;
        }
    }
}

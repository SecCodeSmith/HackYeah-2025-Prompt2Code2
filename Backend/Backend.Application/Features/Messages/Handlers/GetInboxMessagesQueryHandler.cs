// File: Backend/Backend.Application/Features/Messages/Handlers/GetInboxMessagesQueryHandler.cs
using Backend.Application.DTOs.Messages;
using Backend.Application.Features.Messages.Queries;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Messages.Handlers;

public class GetInboxMessagesQueryHandler : IRequestHandler<GetInboxMessagesQuery, PaginatedMessageResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetInboxMessagesQueryHandler> _logger;

    public GetInboxMessagesQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<GetInboxMessagesQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PaginatedMessageResult> Handle(GetInboxMessagesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var messages = await _unitOfWork.Messages.GetInboxAsync(
                request.UserId,
                request.PageNumber,
                request.PageSize,
                request.Status,
                cancellationToken);

            var totalCount = await _unitOfWork.Messages.GetInboxCountAsync(
                request.UserId,
                request.Status,
                cancellationToken);

            var messageDtos = messages.Select(m => new MessageListDto(
                m.Id,
                m.Subject,
                m.Priority.ToString(),
                m.Status.ToString(),
                m.SentAt,
                m.Sender != null ? $"{m.Sender.FirstName} {m.Sender.LastName}" : "Unknown",
                m.Recipient != null ? $"{m.Recipient.FirstName} {m.Recipient.LastName}" : null,
                m.IsFromUKNF,
                m.Attachments?.Count > 0,
                m.Replies?.Count ?? 0
            )).ToList();

            var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);

            return new PaginatedMessageResult(
                messageDtos,
                request.PageNumber,
                request.PageSize,
                totalCount,
                totalPages
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving inbox messages for user {UserId}", request.UserId);
            throw;
        }
    }
}

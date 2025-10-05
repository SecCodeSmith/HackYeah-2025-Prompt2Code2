// File: Backend/Backend.Application/Features/Messages/Handlers/GetSentMessagesQueryHandler.cs
using Backend.Application.DTOs.Messages;
using Backend.Application.Features.Messages.Queries;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Messages.Handlers;

public class GetSentMessagesQueryHandler : IRequestHandler<GetSentMessagesQuery, PaginatedMessageResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetSentMessagesQueryHandler> _logger;

    public GetSentMessagesQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<GetSentMessagesQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PaginatedMessageResult> Handle(GetSentMessagesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var messages = await _unitOfWork.Messages.GetSentMessagesAsync(
                request.UserId,
                request.PageNumber,
                request.PageSize,
                cancellationToken);

            var totalCount = await _unitOfWork.Messages.GetSentMessagesCountAsync(request.UserId, cancellationToken);

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
            _logger.LogError(ex, "Error retrieving sent messages for user {UserId}", request.UserId);
            throw;
        }
    }
}

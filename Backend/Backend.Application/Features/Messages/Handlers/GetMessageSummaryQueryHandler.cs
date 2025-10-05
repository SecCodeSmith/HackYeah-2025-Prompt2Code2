// File: Backend/Backend.Application/Features/Messages/Handlers/GetMessageSummaryQueryHandler.cs
using Backend.Application.DTOs.Messages;
using Backend.Application.Features.Messages.Queries;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Messages.Handlers;

public class GetMessageSummaryQueryHandler : IRequestHandler<GetMessageSummaryQuery, MessageSummaryDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetMessageSummaryQueryHandler> _logger;

    public GetMessageSummaryQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<GetMessageSummaryQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<MessageSummaryDto> Handle(GetMessageSummaryQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var unreadCount = await _unitOfWork.Messages.GetUnreadCountAsync(request.UserId, cancellationToken);
            var totalInbox = await _unitOfWork.Messages.GetInboxCountAsync(request.UserId, null, cancellationToken);
            var totalSent = await _unitOfWork.Messages.GetSentMessagesCountAsync(request.UserId, cancellationToken);

            return new MessageSummaryDto(unreadCount, totalInbox, totalSent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving message summary for user {UserId}", request.UserId);
            throw;
        }
    }
}

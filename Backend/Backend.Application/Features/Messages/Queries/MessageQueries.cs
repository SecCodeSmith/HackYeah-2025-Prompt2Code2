// File: Backend/Backend.Application/Features/Messages/Queries/MessageQueries.cs
using Backend.Application.DTOs.Messages;
using MediatR;

namespace Backend.Application.Features.Messages.Queries;

public record GetInboxMessagesQuery(
    Guid UserId,
    int PageNumber = 1,
    int PageSize = 20,
    string? Status = null
) : IRequest<PaginatedMessageResult>;

public record GetSentMessagesQuery(
    Guid UserId,
    int PageNumber = 1,
    int PageSize = 20
) : IRequest<PaginatedMessageResult>;

public record GetMessageThreadQuery(
    Guid ThreadId,
    Guid UserId
) : IRequest<MessageThreadDto>;

public record GetMessageByIdQuery(
    Guid MessageId,
    Guid UserId
) : IRequest<MessageDto>;

public record GetUnreadCountQuery(
    Guid UserId
) : IRequest<int>;

public record GetMessageSummaryQuery(
    Guid UserId
) : IRequest<MessageSummaryDto>;

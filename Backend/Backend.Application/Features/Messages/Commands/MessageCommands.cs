// File: Backend/Backend.Application/Features/Messages/Commands/MessageCommands.cs
using Backend.Application.DTOs.Messages;
using MediatR;

namespace Backend.Application.Features.Messages.Commands;

public record SendMessageCommand(
    string Subject,
    string Content,
    int Priority,
    Guid? RecipientUserId,
    Guid? PodmiotId,
    Guid SenderUserId
) : IRequest<MessageDto>;

public record ReplyToMessageCommand(
    Guid ParentMessageId,
    string Content,
    int Priority,
    Guid SenderUserId
) : IRequest<MessageDto>;

public record MarkMessageAsReadCommand(
    Guid MessageId,
    Guid UserId
) : IRequest<bool>;

public record ArchiveMessageCommand(
    Guid MessageId,
    Guid UserId
) : IRequest<bool>;

public record DeleteMessageCommand(
    Guid MessageId,
    Guid UserId
) : IRequest<bool>;

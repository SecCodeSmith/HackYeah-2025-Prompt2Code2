// File: Backend/Backend.Application/DTOs/Messages/MessageDTOs.cs
namespace Backend.Application.DTOs.Messages;

public record MessageDto(
    Guid Id,
    string Subject,
    string Content,
    string Priority,
    string Status,
    DateTime SentAt,
    DateTime? ReadAt,
    Guid SenderUserId,
    string SenderName,
    Guid? RecipientUserId,
    string? RecipientName,
    Guid? PodmiotId,
    string? PodmiotName,
    Guid? ParentMessageId,
    Guid ThreadId,
    bool IsFromUKNF,
    int ReplyCount,
    DateTime CreatedAt
);

public record MessageListDto(
    Guid Id,
    string Subject,
    string Priority,
    string Status,
    DateTime SentAt,
    string SenderName,
    string? RecipientName,
    bool IsFromUKNF,
    bool HasAttachments,
    int ReplyCount
);

public record MessageThreadDto(
    Guid ThreadId,
    string Subject,
    List<MessageDto> Messages,
    int TotalMessages
);

public record SendMessageRequest(
    string Subject,
    string Content,
    int Priority,
    Guid? RecipientUserId,
    Guid? PodmiotId
);

public record ReplyToMessageRequest(
    Guid ParentMessageId,
    string Content,
    int Priority
);

public record MessageAttachmentDto(
    Guid Id,
    Guid MessageId,
    string FileName,
    string ContentType,
    long FileSize,
    DateTime CreatedAt
);

public record MessageSummaryDto(
    int UnreadCount,
    int TotalInbox,
    int TotalSent
);

public record PaginatedMessageResult(
    IEnumerable<MessageListDto> Items,
    int PageNumber,
    int PageSize,
    int TotalCount,
    int TotalPages
);

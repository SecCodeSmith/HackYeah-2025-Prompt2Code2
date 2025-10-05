using Backend.Domain.Common;

namespace Backend.Domain.Entities;

public class Message : BaseEntity
{
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public MessagePriority Priority { get; set; } = MessagePriority.Normal;
    public MessageStatus Status { get; set; } = MessageStatus.Unread;
    public DateTime SentAt { get; set; }
    public DateTime? ReadAt { get; set; }
    
    // Sender/Recipient
    public Guid SenderUserId { get; set; }
    public Guid? RecipientUserId { get; set; }
    public Guid? PodmiotId { get; set; }
    
    // Thread management
    public Guid? ParentMessageId { get; set; }
    public Guid ThreadId { get; set; }
    public bool IsFromUKNF { get; set; }
    
    // Navigation properties
    public User Sender { get; set; } = null!;
    public User? Recipient { get; set; }
    public Podmiot? Podmiot { get; set; }
    public Message? ParentMessage { get; set; }
    public ICollection<Message> Replies { get; set; } = new List<Message>();
    public ICollection<MessageAttachment> Attachments { get; set; } = new List<MessageAttachment>();
}

public class MessageAttachment : BaseEntity
{
    public Guid MessageId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    
    // Navigation properties
    public Message Message { get; set; } = null!;
}

public enum MessagePriority
{
    Low = 0,
    Normal = 1,
    High = 2,
    Urgent = 3
}

public enum MessageStatus
{
    Unread = 0,
    Read = 1,
    Replied = 2,
    Archived = 3
}

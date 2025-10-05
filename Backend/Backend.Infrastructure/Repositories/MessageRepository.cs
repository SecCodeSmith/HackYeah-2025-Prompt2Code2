// File: Backend/Backend.Infrastructure/Repositories/MessageRepository.cs
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using Backend.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories;

public class MessageRepository : Repository<Message>, IMessageRepository
{
    public MessageRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<List<Message>> GetInboxAsync(
        Guid userId,
        int pageNumber,
        int pageSize,
        string? status,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Set<Message>()
            .Include(m => m.Sender)
            .Include(m => m.Recipient)
            .Include(m => m.Podmiot)
            .Include(m => m.Replies)
            .Where(m => m.RecipientUserId == userId);

        if (!string.IsNullOrEmpty(status))
        {
            if (Enum.TryParse<MessageStatus>(status, true, out var messageStatus))
            {
                query = query.Where(m => m.Status == messageStatus);
            }
        }

        return await query
            .OrderByDescending(m => m.SentAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetInboxCountAsync(Guid userId, string? status, CancellationToken cancellationToken = default)
    {
        var query = _context.Set<Message>()
            .Where(m => m.RecipientUserId == userId);

        if (!string.IsNullOrEmpty(status))
        {
            if (Enum.TryParse<MessageStatus>(status, true, out var messageStatus))
            {
                query = query.Where(m => m.Status == messageStatus);
            }
        }

        return await query.CountAsync(cancellationToken);
    }

    public async Task<List<Message>> GetSentMessagesAsync(
        Guid userId,
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<Message>()
            .Include(m => m.Sender)
            .Include(m => m.Recipient)
            .Include(m => m.Podmiot)
            .Include(m => m.Replies)
            .Where(m => m.SenderUserId == userId)
            .OrderByDescending(m => m.SentAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetSentMessagesCountAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Message>()
            .Where(m => m.SenderUserId == userId)
            .CountAsync(cancellationToken);
    }

    public async Task<List<Message>> GetThreadMessagesAsync(Guid threadId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Message>()
            .Include(m => m.Sender)
            .Include(m => m.Recipient)
            .Include(m => m.Podmiot)
            .Include(m => m.Attachments)
            .Where(m => m.ThreadId == threadId)
            .OrderBy(m => m.SentAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Message>()
            .Where(m => m.RecipientUserId == userId && m.Status == MessageStatus.Unread)
            .CountAsync(cancellationToken);
    }

    public async Task<Message?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Message>()
            .Include(m => m.Sender)
            .Include(m => m.Recipient)
            .Include(m => m.Podmiot)
            .Include(m => m.ParentMessage)
            .Include(m => m.Replies)
            .Include(m => m.Attachments)
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
    }
}

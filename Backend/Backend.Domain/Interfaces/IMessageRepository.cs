// File: Backend/Backend.Domain/Interfaces/IMessageRepository.cs
using Backend.Domain.Entities;

namespace Backend.Domain.Interfaces;

public interface IMessageRepository : IRepository<Message>
{
    Task<List<Message>> GetInboxAsync(
        Guid userId,
        int pageNumber,
        int pageSize,
        string? status,
        CancellationToken cancellationToken = default);
    
    Task<int> GetInboxCountAsync(Guid userId, string? status, CancellationToken cancellationToken = default);
    
    Task<List<Message>> GetSentMessagesAsync(
        Guid userId,
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken = default);
    
    Task<int> GetSentMessagesCountAsync(Guid userId, CancellationToken cancellationToken = default);
    
    Task<List<Message>> GetThreadMessagesAsync(Guid threadId, CancellationToken cancellationToken = default);
    
    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default);
    
    Task<Message?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
}

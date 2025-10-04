// File: Backend/Backend.Domain/Interfaces/IAnnouncementRepository.cs
using Backend.Domain.Entities;

namespace Backend.Domain.Interfaces;

public interface IAnnouncementRepository : IRepository<Announcement>
{
    Task<List<Announcement>> GetActiveAnnouncementsAsync(CancellationToken cancellationToken = default);
}

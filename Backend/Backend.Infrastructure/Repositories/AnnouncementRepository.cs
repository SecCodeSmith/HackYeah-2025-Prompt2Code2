// File: Backend/Backend.Infrastructure/Repositories/AnnouncementRepository.cs
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using Backend.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories;

public class AnnouncementRepository : Repository<Announcement>, IAnnouncementRepository
{
    public AnnouncementRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<List<Announcement>> GetActiveAnnouncementsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Set<Announcement>()
            .Include(a => a.Creator)
            .Where(a => a.IsActive)
            .OrderByDescending(a => a.Priority)
            .ThenByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}

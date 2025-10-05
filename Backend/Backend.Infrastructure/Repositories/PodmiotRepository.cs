using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using Backend.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories;

public class PodmiotRepository : Repository<Podmiot>, IPodmiotRepository
{
    public PodmiotRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Podmiot?> GetByKodUKNFAsync(string kodUKNF, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(p => p.KodUKNF == kodUKNF, cancellationToken);
    }

    public async Task<(IEnumerable<Podmiot> Items, int TotalCount)> GetPagedAsync(
        int page,
        int pageSize,
        TypPodmiotu? typ = null,
        StatusPodmiotu? status = null,
        string? searchTerm = null,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.AsQueryable();

        // Apply filters
        if (typ.HasValue)
        {
            query = query.Where(p => p.TypPodmiotu == typ.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(p => p.Status == status.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(p => 
                p.Nazwa.Contains(searchTerm) ||
                p.KodUKNF.Contains(searchTerm) ||
                (p.NIP != null && p.NIP.Contains(searchTerm)) ||
                (p.REGON != null && p.REGON.Contains(searchTerm)));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderBy(p => p.Nazwa)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }
}

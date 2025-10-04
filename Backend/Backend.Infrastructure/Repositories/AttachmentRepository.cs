// File: Backend/Backend.Infrastructure/Repositories/AttachmentRepository.cs
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using Backend.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories;

public class AttachmentRepository : Repository<ReportAttachment>, IAttachmentRepository
{
    public AttachmentRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<List<ReportAttachment>> GetByReportIdAsync(Guid reportId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<ReportAttachment>()
            .Where(a => a.ReportId == reportId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}

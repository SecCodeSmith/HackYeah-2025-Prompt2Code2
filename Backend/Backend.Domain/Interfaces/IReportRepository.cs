using Backend.Domain.Entities;

namespace Backend.Domain.Interfaces;

public interface IReportRepository : IRepository<Report>
{
    Task<IEnumerable<Report>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Report>> GetByStatusAsync(ReportStatus status, CancellationToken cancellationToken = default);
}

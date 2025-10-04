// File: Backend/Backend.Domain/Interfaces/IAttachmentRepository.cs
using Backend.Domain.Entities;

namespace Backend.Domain.Interfaces;

public interface IAttachmentRepository : IRepository<ReportAttachment>
{
    Task<List<ReportAttachment>> GetByReportIdAsync(Guid reportId, CancellationToken cancellationToken = default);
}

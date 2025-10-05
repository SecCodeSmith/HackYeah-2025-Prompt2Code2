using Backend.Domain.Entities;

namespace Backend.Domain.Interfaces;

public interface IPodmiotRepository : IRepository<Podmiot>
{
    Task<Podmiot?> GetByKodUKNFAsync(string kodUKNF, CancellationToken cancellationToken = default);
    Task<(IEnumerable<Podmiot> Items, int TotalCount)> GetPagedAsync(
        int page,
        int pageSize,
        TypPodmiotu? typ = null,
        StatusPodmiotu? status = null,
        string? searchTerm = null,
        CancellationToken cancellationToken = default);
}

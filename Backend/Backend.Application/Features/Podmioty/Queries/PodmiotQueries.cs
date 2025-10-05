using Backend.Application.DTOs.Podmiot;
using MediatR;

namespace Backend.Application.Features.Podmioty.Queries;

public record GetAllPodmiotyQuery(
    int PageNumber = 1,
    int PageSize = 10,
    string? SearchTerm = null,
    int? TypPodmiotu = null,
    int? Status = null
) : IRequest<PaginatedResult<PodmiotListDto>>;

public record GetPodmiotByIdQuery(
    Guid Id
) : IRequest<PodmiotDto>;

public record GetPodmiotByKodUKNFQuery(
    string KodUKNF
) : IRequest<PodmiotDto>;

public record PaginatedResult<T>(
    IEnumerable<T> Items,
    int PageNumber,
    int PageSize,
    int TotalCount,
    int TotalPages
);

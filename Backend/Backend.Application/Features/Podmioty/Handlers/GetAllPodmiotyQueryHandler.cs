using Backend.Application.DTOs.Podmiot;
using Backend.Application.Features.Podmioty.Queries;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Podmioty.Handlers;

public class GetAllPodmiotyQueryHandler : IRequestHandler<GetAllPodmiotyQuery, PaginatedResult<PodmiotListDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetAllPodmiotyQueryHandler> _logger;

    public GetAllPodmiotyQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<GetAllPodmiotyQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PaginatedResult<PodmiotListDto>> Handle(GetAllPodmiotyQuery request, CancellationToken cancellationToken)
    {
        // Convert nullable int to enum
        TypPodmiotu? typPodmiotu = request.TypPodmiotu.HasValue ? (TypPodmiotu)request.TypPodmiotu.Value : null;
        StatusPodmiotu? status = request.Status.HasValue ? (StatusPodmiotu)request.Status.Value : null;

        var (items, totalCount) = await _unitOfWork.Podmioty.GetPagedAsync(
            request.PageNumber,
            request.PageSize,
            typPodmiotu,
            status,
            request.SearchTerm,
            cancellationToken);

        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);

        var podmioty = items.Select(p => new PodmiotListDto(
            p.Id,
            p.KodUKNF,
            p.Nazwa,
            p.TypPodmiotu.ToString(),
            p.Status.ToString(),
            p.DataRejestracjiUKNF
        )).ToList();

        _logger.LogInformation("Retrieved {Count} of {Total} Podmioty", podmioty.Count, totalCount);

        return new PaginatedResult<PodmiotListDto>(
            podmioty,
            request.PageNumber,
            request.PageSize,
            totalCount,
            totalPages
        );
    }
}

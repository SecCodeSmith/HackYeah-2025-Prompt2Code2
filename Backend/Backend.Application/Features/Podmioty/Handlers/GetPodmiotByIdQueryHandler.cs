using Backend.Application.DTOs.Podmiot;
using Backend.Application.Features.Podmioty.Queries;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Podmioty.Handlers;

public class GetPodmiotByIdQueryHandler : IRequestHandler<GetPodmiotByIdQuery, PodmiotDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetPodmiotByIdQueryHandler> _logger;

    public GetPodmiotByIdQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<GetPodmiotByIdQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PodmiotDto> Handle(GetPodmiotByIdQuery request, CancellationToken cancellationToken)
    {
        var podmiot = await _unitOfWork.Podmioty
            .GetByIdAsync(request.Id, cancellationToken);

        if (podmiot == null)
        {
            throw new InvalidOperationException($"Podmiot with ID '{request.Id}' not found.");
        }

        _logger.LogInformation("Retrieved Podmiot with ID: {PodmiotId}", podmiot.Id);

        return new PodmiotDto(
            podmiot.Id,
            podmiot.KodUKNF,
            podmiot.Nazwa,
            podmiot.TypPodmiotu.ToString(),
            podmiot.NIP,
            podmiot.REGON,
            podmiot.KRS,
            podmiot.Email,
            podmiot.Telefon,
            podmiot.Adres,
            podmiot.Miasto,
            podmiot.KodPocztowy,
            podmiot.Status.ToString(),
            podmiot.DataRejestracjiUKNF,
            podmiot.DataZawieszenia,
            podmiot.Uwagi,
            podmiot.CreatedAt,
            podmiot.UpdatedAt
        );
    }
}

using Backend.Application.DTOs.Podmiot;
using Backend.Application.Features.Podmioty.Commands;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Podmioty.Handlers;

public class CreatePodmiotCommandHandler : IRequestHandler<CreatePodmiotCommand, PodmiotDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreatePodmiotCommandHandler> _logger;

    public CreatePodmiotCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<CreatePodmiotCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PodmiotDto> Handle(CreatePodmiotCommand request, CancellationToken cancellationToken)
    {
        // Check if KodUKNF already exists
        var existingPodmiot = await _unitOfWork.Podmioty
            .GetByKodUKNFAsync(request.KodUKNF, cancellationToken);

        if (existingPodmiot != null)
        {
            throw new InvalidOperationException($"Podmiot with KodUKNF '{request.KodUKNF}' already exists.");
        }

        var podmiot = new Podmiot
        {
            Id = Guid.NewGuid(),
            KodUKNF = request.KodUKNF,
            Nazwa = request.Nazwa,
            TypPodmiotu = (TypPodmiotu)request.TypPodmiotu,
            NIP = request.NIP,
            REGON = request.REGON,
            KRS = request.KRS,
            Email = request.Email,
            Telefon = request.Telefon,
            Adres = request.Adres,
            Miasto = request.Miasto,
            KodPocztowy = request.KodPocztowy,
            Status = (StatusPodmiotu)request.Status,
            DataRejestracjiUKNF = request.DataRejestracjiUKNF,
            Uwagi = request.Uwagi,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Podmioty.AddAsync(podmiot, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created new Podmiot with ID: {PodmiotId}, KodUKNF: {KodUKNF}", podmiot.Id, podmiot.KodUKNF);

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

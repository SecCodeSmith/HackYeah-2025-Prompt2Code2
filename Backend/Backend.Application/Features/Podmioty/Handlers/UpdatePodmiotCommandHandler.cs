using Backend.Application.DTOs.Podmiot;
using Backend.Application.Features.Podmioty.Commands;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Podmioty.Handlers;

public class UpdatePodmiotCommandHandler : IRequestHandler<UpdatePodmiotCommand, PodmiotDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdatePodmiotCommandHandler> _logger;

    public UpdatePodmiotCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<UpdatePodmiotCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PodmiotDto> Handle(UpdatePodmiotCommand request, CancellationToken cancellationToken)
    {
        var podmiot = await _unitOfWork.Podmioty
            .GetByIdAsync(request.Id, cancellationToken);

        if (podmiot == null)
        {
            throw new InvalidOperationException($"Podmiot with ID '{request.Id}' not found.");
        }

        // Check if new KodUKNF is already taken by another entity
        if (podmiot.KodUKNF != request.KodUKNF)
        {
            var existingPodmiot = await _unitOfWork.Podmioty
                .GetByKodUKNFAsync(request.KodUKNF, cancellationToken);

            if (existingPodmiot != null && existingPodmiot.Id != request.Id)
            {
                throw new InvalidOperationException($"Podmiot with KodUKNF '{request.KodUKNF}' already exists.");
            }
        }

        podmiot.KodUKNF = request.KodUKNF;
        podmiot.Nazwa = request.Nazwa;
        podmiot.TypPodmiotu = (TypPodmiotu)request.TypPodmiotu;
        podmiot.NIP = request.NIP;
        podmiot.REGON = request.REGON;
        podmiot.KRS = request.KRS;
        podmiot.Email = request.Email;
        podmiot.Telefon = request.Telefon;
        podmiot.Adres = request.Adres;
        podmiot.Miasto = request.Miasto;
        podmiot.KodPocztowy = request.KodPocztowy;
        podmiot.Status = (StatusPodmiotu)request.Status;
        podmiot.DataRejestracjiUKNF = request.DataRejestracjiUKNF;
        podmiot.DataZawieszenia = request.DataZawieszenia;
        podmiot.Uwagi = request.Uwagi;
        podmiot.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated Podmiot with ID: {PodmiotId}", podmiot.Id);

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

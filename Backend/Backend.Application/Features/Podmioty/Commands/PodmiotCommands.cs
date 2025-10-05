using Backend.Application.DTOs.Podmiot;
using MediatR;

namespace Backend.Application.Features.Podmioty.Commands;

public record CreatePodmiotCommand(
    string KodUKNF,
    string Nazwa,
    int TypPodmiotu,
    string? NIP,
    string? REGON,
    string? KRS,
    string? Email,
    string? Telefon,
    string? Adres,
    string? Miasto,
    string? KodPocztowy,
    int Status,
    DateTime DataRejestracjiUKNF,
    string? Uwagi
) : IRequest<PodmiotDto>;

public record UpdatePodmiotCommand(
    Guid Id,
    string KodUKNF,
    string Nazwa,
    int TypPodmiotu,
    string? NIP,
    string? REGON,
    string? KRS,
    string? Email,
    string? Telefon,
    string? Adres,
    string? Miasto,
    string? KodPocztowy,
    int Status,
    DateTime DataRejestracjiUKNF,
    DateTime? DataZawieszenia,
    string? Uwagi
) : IRequest<PodmiotDto>;

public record DeletePodmiotCommand(
    Guid Id
) : IRequest<bool>;

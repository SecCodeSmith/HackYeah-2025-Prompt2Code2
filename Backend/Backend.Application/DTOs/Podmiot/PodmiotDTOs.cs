namespace Backend.Application.DTOs.Podmiot;

public record PodmiotDto(
    Guid Id,
    string KodUKNF,
    string Nazwa,
    string TypPodmiotu,
    string? NIP,
    string? REGON,
    string? KRS,
    string? Email,
    string? Telefon,
    string? Adres,
    string? Miasto,
    string? KodPocztowy,
    string Status,
    DateTime DataRejestracjiUKNF,
    DateTime? DataZawieszenia,
    string? Uwagi,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record CreatePodmiotRequest(
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
);

public record UpdatePodmiotRequest(
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
);

public record PodmiotListDto(
    Guid Id,
    string KodUKNF,
    string Nazwa,
    string TypPodmiotu,
    string Status,
    DateTime DataRejestracjiUKNF
);

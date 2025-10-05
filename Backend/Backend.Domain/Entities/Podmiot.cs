using Backend.Domain.Common;

namespace Backend.Domain.Entities;

public class Podmiot : BaseEntity
{
    public string KodUKNF { get; set; } = string.Empty;
    public string Nazwa { get; set; } = string.Empty;
    public TypPodmiotu TypPodmiotu { get; set; }
    public string? NIP { get; set; }
    public string? REGON { get; set; }
    public string? KRS { get; set; }
    public string? Email { get; set; }
    public string? Telefon { get; set; }
    public string? Adres { get; set; }
    public string? Miasto { get; set; }
    public string? KodPocztowy { get; set; }
    public StatusPodmiotu Status { get; set; } = StatusPodmiotu.Aktywny;
    public DateTime DataRejestracjiUKNF { get; set; }
    public DateTime? DataZawieszenia { get; set; }
    public string? Uwagi { get; set; }
    
    // Navigation properties
    public ICollection<Report> Reports { get; set; } = new List<Report>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
    public ICollection<Announcement> Announcements { get; set; } = new List<Announcement>();
}

public enum TypPodmiotu
{
    BankKrajowy = 0,
    BankZagraniczny = 1,
    SKOK = 2,
    FirmaInwestycyjna = 3,
    TowarzystwoFunduszy = 4,
    ZakladUbezpieczen = 5,
    Emitent = 6,
    InnyPodmiot = 99
}

public enum StatusPodmiotu
{
    Aktywny = 0,
    Zawieszony = 1,
    Wykreslony = 2,
    WTrakcieRejestracji = 3
}

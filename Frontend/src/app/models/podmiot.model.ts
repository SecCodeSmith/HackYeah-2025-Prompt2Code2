// Entity Management Models

export interface PodmiotDto {
  id: string;
  kodUKNF: string;
  nazwa: string;
  typPodmiotu: string;
  nip: string | null;
  regon: string | null;
  krs: string | null;
  email: string | null;
  telefon: string | null;
  adres: string | null;
  miasto: string | null;
  kodPocztowy: string | null;
  status: string;
  dataRejestracjiUKNF: Date;
  dataZawieszenia: Date | null;
  uwagi: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface PodmiotListDto {
  id: string;
  kodUKNF: string;
  nazwa: string;
  typPodmiotu: string;
  status: string;
  dataRejestracjiUKNF: Date;
}

export interface CreatePodmiotRequest {
  kodUKNF: string;
  nazwa: string;
  typPodmiotu: number;
  nip?: string;
  regon?: string;
  krs?: string;
  email?: string;
  telefon?: string;
  adres?: string;
  miasto?: string;
  kodPocztowy?: string;
  status: number;
  dataRejestracjiUKNF: Date;
  uwagi?: string;
}

export interface UpdatePodmiotRequest extends CreatePodmiotRequest {
  dataZawieszenia?: Date;
}

export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export enum TypPodmiotu {
  BankKrajowy = 0,
  BankZagraniczny = 1,
  SKOK = 2,
  FirmaInwestycyjna = 3,
  TowarzystwoFunduszy = 4,
  ZakladUbezpieczen = 5,
  Emitent = 6,
  InnyPodmiot = 99
}

export enum StatusPodmiotu {
  Aktywny = 0,
  Zawieszony = 1,
  Wykreslony = 2,
  WTrakcieRejestracji = 3
}

export const TypPodmiotuLabels: Record<number, string> = {
  [TypPodmiotu.BankKrajowy]: 'Bank Krajowy',
  [TypPodmiotu.BankZagraniczny]: 'Bank Zagraniczny',
  [TypPodmiotu.SKOK]: 'SKOK',
  [TypPodmiotu.FirmaInwestycyjna]: 'Firma Inwestycyjna',
  [TypPodmiotu.TowarzystwoFunduszy]: 'Towarzystwo Funduszy',
  [TypPodmiotu.ZakladUbezpieczen]: 'Zakład Ubezpieczeń',
  [TypPodmiotu.Emitent]: 'Emitent',
  [TypPodmiotu.InnyPodmiot]: 'Inny Podmiot'
};

export const StatusPodmiotuLabels: Record<number, string> = {
  [StatusPodmiotu.Aktywny]: 'Aktywny',
  [StatusPodmiotu.Zawieszony]: 'Zawieszony',
  [StatusPodmiotu.Wykreslony]: 'Wykreślony',
  [StatusPodmiotu.WTrakcieRejestracji]: 'W trakcie rejestracji'
};

export const StatusPodmiotuColors: Record<number, string> = {
  [StatusPodmiotu.Aktywny]: 'success',
  [StatusPodmiotu.Zawieszony]: 'warning',
  [StatusPodmiotu.Wykreslony]: 'danger',
  [StatusPodmiotu.WTrakcieRejestracji]: 'info'
};

-- Create Podmioty table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Podmioty')
BEGIN
    CREATE TABLE [Podmioty] (
        [Id] uniqueidentifier NOT NULL,
        [KodUKNF] nvarchar(50) NOT NULL,
        [Nazwa] nvarchar(500) NOT NULL,
        [TypPodmiotu] int NOT NULL,
        [NIP] nvarchar(20) NULL,
        [REGON] nvarchar(20) NULL,
        [KRS] nvarchar(20) NULL,
        [Email] nvarchar(100) NULL,
        [Telefon] nvarchar(20) NULL,
        [Adres] nvarchar(500) NULL,
        [Miasto] nvarchar(max) NULL,
        [KodPocztowy] nvarchar(max) NULL,
        [Status] int NOT NULL,
        [DataRejestracjiUKNF] datetime2 NOT NULL,
        [DataZawieszenia] datetime2 NULL,
        [Uwagi] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_Podmioty] PRIMARY KEY ([Id])
    );

    CREATE UNIQUE INDEX [IX_Podmioty_KodUKNF] ON [Podmioty] ([KodUKNF]);

    -- Update migration history
    IF NOT EXISTS (SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20251005080856_AddPodmiotyTable')
    BEGIN
        INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
        VALUES (N'20251005080856_AddPodmiotyTable', N'9.0.0');
    END;

    PRINT 'Podmioty table and related changes created successfully';
END
ELSE
BEGIN
    PRINT 'Podmioty table already exists';
END;

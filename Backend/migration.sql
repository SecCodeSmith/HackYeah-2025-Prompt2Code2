IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
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
        [Uwagi] nvarchar(2000) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_Podmioty] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE TABLE [Users] (
        [Id] uniqueidentifier NOT NULL,
        [Email] nvarchar(256) NOT NULL,
        [PasswordHash] nvarchar(max) NOT NULL,
        [FirstName] nvarchar(100) NOT NULL,
        [LastName] nvarchar(100) NOT NULL,
        [PhoneNumber] nvarchar(20) NULL,
        [Role] int NOT NULL,
        [IsActive] bit NOT NULL,
        [EmailConfirmed] bit NOT NULL,
        [LastLoginAt] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE TABLE [Announcements] (
        [Id] uniqueidentifier NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [Priority] int NOT NULL,
        [Type] int NOT NULL,
        [PublishedAt] datetime2 NOT NULL,
        [ExpiresAt] datetime2 NULL,
        [RequiresConfirmation] bit NOT NULL,
        [IsPublished] bit NOT NULL,
        [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
        [PodmiotId] uniqueidentifier NULL,
        [TargetAllEntities] bit NOT NULL DEFAULT CAST(1 AS bit),
        [TargetEntityTypes] nvarchar(500) NULL,
        [TargetSpecificEntities] nvarchar(2000) NULL,
        [CreatorId] uniqueidentifier NULL,
        [PodmiotId1] uniqueidentifier NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_Announcements] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Announcements_Podmioty_PodmiotId] FOREIGN KEY ([PodmiotId]) REFERENCES [Podmioty] ([Id]) ON DELETE SET NULL,
        CONSTRAINT [FK_Announcements_Podmioty_PodmiotId1] FOREIGN KEY ([PodmiotId1]) REFERENCES [Podmioty] ([Id]),
        CONSTRAINT [FK_Announcements_Users_CreatorId] FOREIGN KEY ([CreatorId]) REFERENCES [Users] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE TABLE [Message] (
        [Id] uniqueidentifier NOT NULL,
        [Subject] nvarchar(max) NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [Priority] int NOT NULL,
        [Status] int NOT NULL,
        [SentAt] datetime2 NOT NULL,
        [ReadAt] datetime2 NULL,
        [SenderUserId] uniqueidentifier NOT NULL,
        [RecipientUserId] uniqueidentifier NULL,
        [PodmiotId] uniqueidentifier NULL,
        [ParentMessageId] uniqueidentifier NULL,
        [ThreadId] uniqueidentifier NOT NULL,
        [IsFromUKNF] bit NOT NULL,
        [SenderId] uniqueidentifier NOT NULL,
        [RecipientId] uniqueidentifier NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_Message] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Message_Message_ParentMessageId] FOREIGN KEY ([ParentMessageId]) REFERENCES [Message] ([Id]),
        CONSTRAINT [FK_Message_Podmioty_PodmiotId] FOREIGN KEY ([PodmiotId]) REFERENCES [Podmioty] ([Id]),
        CONSTRAINT [FK_Message_Users_RecipientId] FOREIGN KEY ([RecipientId]) REFERENCES [Users] ([Id]),
        CONSTRAINT [FK_Message_Users_SenderId] FOREIGN KEY ([SenderId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE TABLE [RefreshTokens] (
        [Id] uniqueidentifier NOT NULL,
        [Token] nvarchar(500) NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [ExpiresAt] datetime2 NOT NULL,
        [IsRevoked] bit NOT NULL,
        [RevokedByIp] nvarchar(50) NULL,
        [RevokedAt] datetime2 NULL,
        [ReplacedByToken] nvarchar(500) NULL,
        [CreatedByIp] nvarchar(50) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_RefreshTokens] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_RefreshTokens_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE TABLE [Reports] (
        [Id] uniqueidentifier NOT NULL,
        [Title] nvarchar(200) NOT NULL,
        [Description] nvarchar(2000) NOT NULL,
        [Status] int NOT NULL,
        [Priority] int NOT NULL,
        [Category] nvarchar(100) NULL,
        [UserId] uniqueidentifier NOT NULL,
        [SubmittedAt] datetime2 NULL,
        [ReviewedAt] datetime2 NULL,
        [ReviewNotes] nvarchar(1000) NULL,
        [PodmiotId] uniqueidentifier NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_Reports] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Reports_Podmioty_PodmiotId] FOREIGN KEY ([PodmiotId]) REFERENCES [Podmioty] ([Id]),
        CONSTRAINT [FK_Reports_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE TABLE [AnnouncementConfirmation] (
        [Id] uniqueidentifier NOT NULL,
        [AnnouncementId] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [ConfirmedAt] datetime2 NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_AnnouncementConfirmation] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AnnouncementConfirmation_Announcements_AnnouncementId] FOREIGN KEY ([AnnouncementId]) REFERENCES [Announcements] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_AnnouncementConfirmation_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE TABLE [MessageAttachment] (
        [Id] uniqueidentifier NOT NULL,
        [MessageId] uniqueidentifier NOT NULL,
        [FileName] nvarchar(max) NOT NULL,
        [FilePath] nvarchar(max) NOT NULL,
        [ContentType] nvarchar(max) NOT NULL,
        [FileSize] bigint NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_MessageAttachment] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_MessageAttachment_Message_MessageId] FOREIGN KEY ([MessageId]) REFERENCES [Message] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE TABLE [ReportAttachments] (
        [Id] uniqueidentifier NOT NULL,
        [ReportId] uniqueidentifier NOT NULL,
        [FileName] nvarchar(255) NOT NULL,
        [FilePath] nvarchar(500) NOT NULL,
        [ContentType] nvarchar(100) NOT NULL,
        [FileSize] bigint NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_ReportAttachments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ReportAttachments_Reports_ReportId] FOREIGN KEY ([ReportId]) REFERENCES [Reports] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE INDEX [IX_AnnouncementConfirmation_AnnouncementId] ON [AnnouncementConfirmation] ([AnnouncementId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE INDEX [IX_AnnouncementConfirmation_UserId] ON [AnnouncementConfirmation] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE INDEX [IX_Announcements_CreatorId] ON [Announcements] ([CreatorId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE INDEX [IX_Announcements_PodmiotId] ON [Announcements] ([PodmiotId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE INDEX [IX_Announcements_PodmiotId1] ON [Announcements] ([PodmiotId1]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE INDEX [IX_Message_ParentMessageId] ON [Message] ([ParentMessageId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE INDEX [IX_Message_PodmiotId] ON [Message] ([PodmiotId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE INDEX [IX_Message_RecipientId] ON [Message] ([RecipientId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE INDEX [IX_Message_SenderId] ON [Message] ([SenderId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE INDEX [IX_MessageAttachment_MessageId] ON [MessageAttachment] ([MessageId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Podmioty_KodUKNF] ON [Podmioty] ([KodUKNF]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE UNIQUE INDEX [IX_RefreshTokens_Token] ON [RefreshTokens] ([Token]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE INDEX [IX_RefreshTokens_UserId] ON [RefreshTokens] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE INDEX [IX_ReportAttachments_ReportId] ON [ReportAttachments] ([ReportId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE INDEX [IX_Reports_PodmiotId] ON [Reports] ([PodmiotId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE INDEX [IX_Reports_UserId] ON [Reports] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005080856_AddPodmiotyTable'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20251005080856_AddPodmiotyTable', N'8.0.0');
END;
GO

COMMIT;
GO


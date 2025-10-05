// File: Backend/Backend.Application/Features/Attachments/Commands/AttachmentCommands.cs
using Backend.Application.DTOs.Reports;
using MediatR;

namespace Backend.Application.Features.Attachments.Commands;

public record UploadAttachmentCommand(
    Guid ReportId,
    string FileName,
    string ContentType,
    long FileSize,
    Stream FileStream,
    Guid UserId
) : IRequest<AttachmentDto>;

public record DeleteAttachmentCommand(
    Guid AttachmentId,
    Guid UserId
) : IRequest<bool>;

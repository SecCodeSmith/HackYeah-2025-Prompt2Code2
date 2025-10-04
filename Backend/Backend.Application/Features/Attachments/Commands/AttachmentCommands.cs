// File: Backend/Backend.Application/Features/Attachments/Commands/AttachmentCommands.cs
using Backend.Application.DTOs.Reports;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Backend.Application.Features.Attachments.Commands;

public record UploadAttachmentCommand(
    Guid ReportId,
    IFormFile File,
    Guid UserId
) : IRequest<AttachmentDto>;

public record DeleteAttachmentCommand(
    Guid AttachmentId,
    Guid UserId
) : IRequest<bool>;

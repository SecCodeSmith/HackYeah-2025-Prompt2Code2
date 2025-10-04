// File: Backend/Backend.Application/Features/Attachments/Queries/AttachmentQueries.cs
using MediatR;

namespace Backend.Application.Features.Attachments.Queries;

public record GetAttachmentQuery(
    Guid AttachmentId,
    Guid UserId
) : IRequest<(Stream FileStream, string FileName, string ContentType)>;

public record GetReportAttachmentsQuery(
    Guid ReportId,
    Guid UserId
) : IRequest<List<Backend.Application.DTOs.Reports.AttachmentDto>>;

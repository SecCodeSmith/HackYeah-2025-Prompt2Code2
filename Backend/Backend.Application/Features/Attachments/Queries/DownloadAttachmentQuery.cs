using MediatR;

namespace Backend.Application.Features.Attachments.Queries;

public record DownloadAttachmentQuery(Guid AttachmentId) 
    : IRequest<(Stream FileStream, string FileName, string ContentType)?>;

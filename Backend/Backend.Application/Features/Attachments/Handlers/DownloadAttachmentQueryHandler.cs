using Backend.Application.Features.Attachments.Queries;
using Backend.Application.Interfaces;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Attachments.Handlers;

public class DownloadAttachmentQueryHandler : IRequestHandler<DownloadAttachmentQuery, (Stream FileStream, string FileName, string ContentType)?>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<DownloadAttachmentQueryHandler> _logger;

    public DownloadAttachmentQueryHandler(
        IUnitOfWork unitOfWork,
        IFileStorageService fileStorageService,
        ILogger<DownloadAttachmentQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    public async Task<(Stream FileStream, string FileName, string ContentType)?> Handle(
        DownloadAttachmentQuery request, 
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Downloading attachment {AttachmentId}", request.AttachmentId);

        // Get attachment metadata
        var attachment = await _unitOfWork.Attachments.GetByIdAsync(request.AttachmentId, cancellationToken);
        if (attachment == null)
        {
            _logger.LogWarning("Attachment {AttachmentId} not found", request.AttachmentId);
            return null;
        }

        // Get file stream from storage
        var fileStream = await _fileStorageService.GetFileAsync(attachment.FilePath, cancellationToken);
        if (fileStream == null)
        {
            _logger.LogWarning("File not found in storage: {FilePath}", attachment.FilePath);
            return null;
        }

        return (fileStream, attachment.FileName, attachment.ContentType);
    }
}

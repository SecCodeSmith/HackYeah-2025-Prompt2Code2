// File: Backend/Backend.Application/Features/Attachments/Handlers/GetAttachmentQueryHandler.cs
using Backend.Application.Features.Attachments.Queries;
using Backend.Application.Interfaces;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Attachments.Handlers;

public class GetAttachmentQueryHandler : IRequestHandler<GetAttachmentQuery, (Stream FileStream, string FileName, string ContentType)>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<GetAttachmentQueryHandler> _logger;

    public GetAttachmentQueryHandler(
        IUnitOfWork unitOfWork,
        IFileStorageService fileStorageService,
        ILogger<GetAttachmentQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    public async Task<(Stream FileStream, string FileName, string ContentType)> Handle(GetAttachmentQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Get attachment from database
            var attachment = await _unitOfWork.Attachments.GetByIdAsync(request.AttachmentId, cancellationToken);
            if (attachment == null)
            {
                _logger.LogWarning("Attachment not found: {AttachmentId}", request.AttachmentId);
                throw new InvalidOperationException($"Attachment with ID {request.AttachmentId} not found");
            }

            // Get file from storage
            var (fileStream, contentType) = await _fileStorageService.GetFileAsync(attachment.FilePath, cancellationToken);

            _logger.LogInformation("Attachment retrieved successfully: {AttachmentId}", request.AttachmentId);

            return (fileStream, attachment.FileName, attachment.ContentType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving attachment: {AttachmentId}", request.AttachmentId);
            throw;
        }
    }
}

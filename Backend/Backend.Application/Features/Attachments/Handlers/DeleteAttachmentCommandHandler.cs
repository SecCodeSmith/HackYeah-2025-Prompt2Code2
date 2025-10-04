// File: Backend/Backend.Application/Features/Attachments/Handlers/DeleteAttachmentCommandHandler.cs
using Backend.Application.Features.Attachments.Commands;
using Backend.Application.Interfaces;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Attachments.Handlers;

public class DeleteAttachmentCommandHandler : IRequestHandler<DeleteAttachmentCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<DeleteAttachmentCommandHandler> _logger;

    public DeleteAttachmentCommandHandler(
        IUnitOfWork unitOfWork,
        IFileStorageService fileStorageService,
        ILogger<DeleteAttachmentCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    public async Task<bool> Handle(DeleteAttachmentCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Get attachment from database
            var attachment = await _unitOfWork.Attachments.GetByIdAsync(request.AttachmentId, cancellationToken);
            if (attachment == null)
            {
                _logger.LogWarning("Attachment not found: {AttachmentId}", request.AttachmentId);
                return false;
            }

            // Delete file from storage
            await _fileStorageService.DeleteFileAsync(attachment.FilePath, cancellationToken);

            // Delete from database
            await _unitOfWork.Attachments.DeleteAsync(attachment, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Attachment deleted successfully: {AttachmentId}", request.AttachmentId);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting attachment: {AttachmentId}", request.AttachmentId);
            throw;
        }
    }
}

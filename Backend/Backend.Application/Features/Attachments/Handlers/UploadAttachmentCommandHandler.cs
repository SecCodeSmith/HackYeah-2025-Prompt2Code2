// File: Backend/Backend.Application/Features/Attachments/Handlers/UploadAttachmentCommandHandler.cs
using Backend.Application.DTOs.Reports;
using Backend.Application.Features.Attachments.Commands;
using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Attachments.Handlers;

public class UploadAttachmentCommandHandler : IRequestHandler<UploadAttachmentCommand, AttachmentDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<UploadAttachmentCommandHandler> _logger;

    public UploadAttachmentCommandHandler(
        IUnitOfWork unitOfWork,
        IFileStorageService fileStorageService,
        ILogger<UploadAttachmentCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    public async Task<AttachmentDto> Handle(UploadAttachmentCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Validate report exists
            var report = await _unitOfWork.Reports.GetByIdAsync(request.ReportId, cancellationToken);
            if (report == null)
            {
                _logger.LogWarning("Report not found: {ReportId}", request.ReportId);
                throw new InvalidOperationException($"Report with ID {request.ReportId} not found");
            }

            // Validate file size (max 10MB)
            const long maxFileSize = 10 * 1024 * 1024;
            if (request.FileSize > maxFileSize)
            {
                throw new InvalidOperationException($"File size exceeds maximum allowed size of {maxFileSize / (1024 * 1024)}MB");
            }

            // Validate file type
            var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".jpg", ".jpeg", ".png", ".gif", ".zip" };
            var fileExtension = Path.GetExtension(request.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                throw new InvalidOperationException($"File type '{fileExtension}' is not allowed");
            }

            // Save file to storage
            var filePath = await _fileStorageService.SaveFileAsync(request.FileStream, request.FileName, cancellationToken);

            // Create attachment entity
            var attachment = new ReportAttachment
            {
                Id = Guid.NewGuid(),
                ReportId = request.ReportId,
                FileName = request.FileName,
                FilePath = filePath,
                ContentType = request.ContentType,
                FileSize = request.FileSize,
                CreatedAt = DateTime.UtcNow
            };

            // Save to database
            await _unitOfWork.Attachments.AddAsync(attachment, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Attachment uploaded successfully: {AttachmentId} for Report: {ReportId}", attachment.Id, request.ReportId);

            return new AttachmentDto(
                attachment.Id,
                attachment.ReportId,
                attachment.FileName,
                attachment.ContentType,
                attachment.FileSize,
                attachment.CreatedAt
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading attachment for Report: {ReportId}", request.ReportId);
            throw;
        }
    }
}

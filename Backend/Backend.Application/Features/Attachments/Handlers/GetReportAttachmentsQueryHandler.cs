// File: Backend/Backend.Application/Features/Attachments/Handlers/GetReportAttachmentsQueryHandler.cs
using Backend.Application.DTOs.Reports;
using Backend.Application.Features.Attachments.Queries;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Attachments.Handlers;

public class GetReportAttachmentsQueryHandler : IRequestHandler<GetReportAttachmentsQuery, List<AttachmentDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetReportAttachmentsQueryHandler> _logger;

    public GetReportAttachmentsQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<GetReportAttachmentsQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<List<AttachmentDto>> Handle(GetReportAttachmentsQuery request, CancellationToken cancellationToken)
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

            // Get attachments for the report
            var attachments = await _unitOfWork.Attachments.FindAsync(
                a => a.ReportId == request.ReportId,
                cancellationToken);

            var attachmentDtos = attachments.Select(a => new AttachmentDto(
                a.Id,
                a.ReportId,
                a.FileName,
                a.ContentType,
                a.FileSize,
                a.CreatedAt
            )).ToList();

            _logger.LogInformation("Retrieved {Count} attachments for Report: {ReportId}", attachmentDtos.Count, request.ReportId);

            return attachmentDtos;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving attachments for Report: {ReportId}", request.ReportId);
            throw;
        }
    }
}

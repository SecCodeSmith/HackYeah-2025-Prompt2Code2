using Backend.Application.Features.Attachments.Commands;
using Backend.Application.Features.Attachments.Queries;
using Backend.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.API.Controllers;

[ApiController]
[Route("api/reports/{reportId}/[controller]")]
[Authorize]
public class AttachmentsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<AttachmentsController> _logger;

    public AttachmentsController(IMediator mediator, ILogger<AttachmentsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Upload file attachment to a report
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [RequestSizeLimit(52428800)] // 50MB
    public async Task<IActionResult> UploadAttachment(
        [FromRoute] Guid reportId,
        [FromForm] IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded" });
            }

            var userId = GetCurrentUserId();

            using var stream = file.OpenReadStream();
            var command = new UploadAttachmentCommand(
                reportId,
                file.FileName,
                file.ContentType,
                file.Length,
                stream,
                userId
            );

            var attachmentId = await _mediator.Send(command);

            return CreatedAtAction(
                nameof(GetAttachmentsByReport),
                new { reportId },
                new { id = attachmentId, fileName = file.FileName });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid file upload request for report {ReportId}", reportId);
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized file upload attempt for report {ReportId}", reportId);
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading attachment for report {ReportId}", reportId);
            return StatusCode(500, new { message = "An error occurred while uploading the file" });
        }
    }

    /// <summary>
    /// Get all attachments for a report
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<ReportAttachment>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAttachmentsByReport([FromRoute] Guid reportId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new GetReportAttachmentsQuery(reportId, userId);
            var attachments = await _mediator.Send(query);
            
            return Ok(attachments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving attachments for report {ReportId}", reportId);
            return StatusCode(500, new { message = "An error occurred while retrieving attachments" });
        }
    }

    /// <summary>
    /// Download specific attachment
    /// </summary>
    [HttpGet("{attachmentId}/download")]
    [ProducesResponseType(typeof(FileStreamResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DownloadAttachment(
        [FromRoute] Guid reportId,
        [FromRoute] Guid attachmentId)
    {
        try
        {
            var query = new DownloadAttachmentQuery(attachmentId);
            var result = await _mediator.Send(query);

            if (result == null)
            {
                return NotFound(new { message = "Attachment not found" });
            }

            return File(result.Value.FileStream, result.Value.ContentType, result.Value.FileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading attachment {AttachmentId}", attachmentId);
            return StatusCode(500, new { message = "An error occurred while downloading the file" });
        }
    }

    /// <summary>
    /// Delete attachment
    /// </summary>
    [HttpDelete("{attachmentId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> DeleteAttachment(
        [FromRoute] Guid reportId,
        [FromRoute] Guid attachmentId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var command = new DeleteAttachmentCommand(attachmentId, userId);
            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound(new { message = "Attachment not found" });
            }

            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized delete attempt for attachment {AttachmentId}", attachmentId);
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting attachment {AttachmentId}", attachmentId);
            return StatusCode(500, new { message = "An error occurred while deleting the file" });
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }
        return userId;
    }
}

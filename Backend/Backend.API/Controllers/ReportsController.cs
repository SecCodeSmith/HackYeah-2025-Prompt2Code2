using Backend.Application.DTOs.Reports;
using Backend.Application.Features.Reports.Commands;
using Backend.Application.Features.Reports.Queries;
using Backend.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ReportsController> _logger;

    public ReportsController(IMediator mediator, ILogger<ReportsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Get all reports (paginated)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<ReportDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new GetAllReportsQuery(userId, pageNumber, pageSize);
            var result = await _mediator.Send(query);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving reports");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get report by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ReportDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new GetReportByIdQuery(id, userId);
            var result = await _mediator.Send(query);
            
            if (result == null)
                return NotFound(new { message = "Report not found" });
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving report {ReportId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get reports for current user
    /// </summary>
    [HttpGet("my-reports")]
    [ProducesResponseType(typeof(PagedResult<ReportDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyReports([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new GetUserReportsQuery(userId, pageNumber, pageSize);
            var result = await _mediator.Send(query);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user reports");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get reports by status
    /// </summary>
    [HttpGet("by-status/{status}")]
    [ProducesResponseType(typeof(PagedResult<ReportDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByStatus(ReportStatus status, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = new GetReportsByStatusQuery(status, pageNumber, pageSize);
            var result = await _mediator.Send(query);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving reports by status {Status}", status);
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Search reports with filters
    /// </summary>
    [HttpPost("search")]
    [ProducesResponseType(typeof(PagedResult<ReportDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Search([FromBody] GetReportsQuery request)
    {
        try
        {
            var query = new SearchReportsQuery(
                null,
                request.Status,
                request.Priority,
                request.Category,
                request.CreatedFrom,
                request.CreatedTo,
                request.PageNumber,
                request.PageSize
            );
            
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching reports");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Create a new report
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(CreateReportResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateReportRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            var command = new CreateReportCommand(
                request.Title,
                request.Description,
                request.Category,
                request.Priority,
                userId
            );
            
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating report");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing report
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(UpdateReportResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateReportRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            var command = new UpdateReportCommand(
                id,
                request.Title,
                request.Description,
                request.Category,
                request.Priority,
                request.Status,
                userId
            );
            
            var result = await _mediator.Send(command);
            
            if (!result.Success)
                return NotFound(new { message = result.Message });
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating report {ReportId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Delete a report
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var command = new DeleteReportCommand(id, userId);
            var result = await _mediator.Send(command);
            
            if (!result)
                return NotFound(new { message = "Report not found" });
            
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting report {ReportId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Submit a report for review
    /// </summary>
    [HttpPost("{id}/submit")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Submit(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var command = new SubmitReportCommand(id, userId);
            var result = await _mediator.Send(command);
            
            if (!result)
                return NotFound(new { message = "Report not found" });
            
            return Ok(new { message = "Report submitted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error submitting report {ReportId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Review a report (Administrator/Supervisor only)
    /// </summary>
    [HttpPost("{id}/review")]
    [Authorize(Roles = "Administrator,Supervisor")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Review(Guid id, [FromBody] ReviewReportRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            var command = new ReviewReportCommand(
                id,
                request.Status,
                request.ReviewNotes,
                userId
            );
            
            var result = await _mediator.Send(command);
            
            if (!result)
                return NotFound(new { message = "Report not found" });
            
            return Ok(new { message = "Report reviewed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reviewing report {ReportId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Upload attachment to a report
    /// </summary>
    [HttpPost("{id}/attachments")]
    [ProducesResponseType(typeof(AttachmentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UploadAttachment(Guid id, [FromForm] IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded" });

            var userId = GetCurrentUserId();
            var command = new Backend.Application.Features.Attachments.Commands.UploadAttachmentCommand(id, file, userId);
            var result = await _mediator.Send(command);
            
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid attachment upload for Report {ReportId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading attachment to Report {ReportId}", id);
            return StatusCode(500, new { message = "An error occurred while uploading the file" });
        }
    }

    /// <summary>
    /// Get all attachments for a report
    /// </summary>
    [HttpGet("{id}/attachments")]
    [ProducesResponseType(typeof(List<AttachmentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetReportAttachments(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new Backend.Application.Features.Attachments.Queries.GetReportAttachmentsQuery(id, userId);
            var result = await _mediator.Send(query);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving attachments for Report {ReportId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Download an attachment
    /// </summary>
    [HttpGet("attachments/{attachmentId}")]
    [ProducesResponseType(typeof(FileStreamResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DownloadAttachment(Guid attachmentId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new Backend.Application.Features.Attachments.Queries.GetAttachmentQuery(attachmentId, userId);
            var (fileStream, fileName, contentType) = await _mediator.Send(query);
            
            return File(fileStream, contentType, fileName);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Attachment not found: {AttachmentId}", attachmentId);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading attachment {AttachmentId}", attachmentId);
            return StatusCode(500, new { message = "An error occurred while downloading the file" });
        }
    }

    /// <summary>
    /// Delete an attachment
    /// </summary>
    [HttpDelete("attachments/{attachmentId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAttachment(Guid attachmentId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var command = new Backend.Application.Features.Attachments.Commands.DeleteAttachmentCommand(attachmentId, userId);
            var result = await _mediator.Send(command);
            
            if (!result)
                return NotFound(new { message = "Attachment not found" });
            
            return Ok(new { message = "Attachment deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting attachment {AttachmentId}", attachmentId);
            return BadRequest(new { message = ex.Message });
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
            throw new UnauthorizedAccessException("User ID not found in token");
        
        return Guid.Parse(userIdClaim);
    }
}

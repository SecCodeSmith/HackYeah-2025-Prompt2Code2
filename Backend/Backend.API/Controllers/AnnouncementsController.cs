// File: Backend/Backend.API/Controllers/AnnouncementsController.cs
using Backend.Application.DTOs.Announcements;
using Backend.Application.Features.Announcements.Commands;
using Backend.Application.Features.Announcements.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnnouncementsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<AnnouncementsController> _logger;

    public AnnouncementsController(IMediator mediator, ILogger<AnnouncementsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Get all active announcements (public access)
    /// </summary>
    [HttpGet("active")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(List<AnnouncementDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActive()
    {
        try
        {
            var query = new GetActiveAnnouncementsQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving active announcements");
            return StatusCode(500, new { message = "An error occurred while retrieving announcements" });
        }
    }

    /// <summary>
    /// Create announcement (Administrator only)
    /// </summary>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(AnnouncementDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Create([FromBody] CreateAnnouncementRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            var command = new CreateAnnouncementCommand(
                request.Title,
                request.Content,
                request.Priority,
                userId
            );
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetActive), new { id = result.Id }, result);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access to create announcement");
            return Forbid();
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid argument when creating announcement");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating announcement");
            return StatusCode(500, new { message = "An error occurred while creating announcement" });
        }
    }

    /// <summary>
    /// Update announcement (Administrator only)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAnnouncementRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            var command = new UpdateAnnouncementCommand(
                id,
                request.Title,
                request.Content,
                request.Priority,
                request.IsActive,
                userId
            );
            var result = await _mediator.Send(command);
            
            if (!result)
                return NotFound(new { message = "Announcement not found" });
            
            return Ok(new { message = "Announcement updated successfully" });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access to update announcement");
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating announcement {AnnouncementId}", id);
            return StatusCode(500, new { message = "An error occurred while updating announcement" });
        }
    }

    /// <summary>
    /// Delete announcement (Administrator only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var command = new DeleteAnnouncementCommand(id, userId);
            var result = await _mediator.Send(command);
            
            if (!result)
                return NotFound(new { message = "Announcement not found" });
            
            return Ok(new { message = "Announcement deleted successfully" });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access to delete announcement");
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting announcement {AnnouncementId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting announcement" });
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

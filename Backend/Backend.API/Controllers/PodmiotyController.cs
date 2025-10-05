using Backend.Application.DTOs.Podmiot;
using Backend.Application.Features.Podmioty.Commands;
using Backend.Application.Features.Podmioty.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PodmiotyController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<PodmiotyController> _logger;

    public PodmiotyController(IMediator mediator, ILogger<PodmiotyController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Get all supervised entities (Podmioty) with pagination and filtering
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<PodmiotListDto>>> GetAll(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null,
        [FromQuery] int? typPodmiotu = null,
        [FromQuery] int? status = null)
    {
        try
        {
            var query = new GetAllPodmiotyQuery(pageNumber, pageSize, searchTerm, typPodmiotu, status);
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving Podmioty");
            return StatusCode(500, new { message = "An error occurred while retrieving entities." });
        }
    }

    /// <summary>
    /// Get a specific Podmiot by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<PodmiotDto>> GetById(Guid id)
    {
        try
        {
            var query = new GetPodmiotByIdQuery(id);
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving Podmiot {PodmiotId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the entity." });
        }
    }

    /// <summary>
    /// Create a new supervised entity
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<PodmiotDto>> Create([FromBody] CreatePodmiotRequest request)
    {
        try
        {
            var command = new CreatePodmiotCommand(
                request.KodUKNF,
                request.Nazwa,
                request.TypPodmiotu,
                request.NIP,
                request.REGON,
                request.KRS,
                request.Email,
                request.Telefon,
                request.Adres,
                request.Miasto,
                request.KodPocztowy,
                request.Status,
                request.DataRejestracjiUKNF,
                request.Uwagi
            );

            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Podmiot");
            return StatusCode(500, new { message = "An error occurred while creating the entity." });
        }
    }

    /// <summary>
    /// Update an existing supervised entity
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<PodmiotDto>> Update(Guid id, [FromBody] UpdatePodmiotRequest request)
    {
        try
        {
            var command = new UpdatePodmiotCommand(
                id,
                request.KodUKNF,
                request.Nazwa,
                request.TypPodmiotu,
                request.NIP,
                request.REGON,
                request.KRS,
                request.Email,
                request.Telefon,
                request.Adres,
                request.Miasto,
                request.KodPocztowy,
                request.Status,
                request.DataRejestracjiUKNF,
                request.DataZawieszenia,
                request.Uwagi
            );

            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating Podmiot {PodmiotId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the entity." });
        }
    }

    /// <summary>
    /// Delete a supervised entity
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            var command = new DeletePodmiotCommand(id);
            await _mediator.Send(command);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting Podmiot {PodmiotId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the entity." });
        }
    }
}

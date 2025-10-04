using Backend.Application.DTOs.Auth;
using Backend.Application.Features.Auth.Commands;
using Backend.Application.Features.Auth.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IMediator mediator, ILogger<AuthController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var command = new RegisterCommand(
                request.Email,
                request.Password,
                request.FirstName,
                request.LastName,
                request.PhoneNumber
            );

            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during user registration");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Login with email and password
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var command = new LoginCommand(request.Email, request.Password);
            var result = await _mediator.Send(command);
            
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Failed login attempt for {Email}", request.Email);
            return Unauthorized(new { message = "Invalid email or password" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Refresh access token using refresh token
    /// </summary>
    [HttpPost("refresh-token")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var command = new RefreshTokenCommand(request.AccessToken, request.RefreshToken);
            var result = await _mediator.Send(command);
            
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Invalid refresh token attempt");
            return Unauthorized(new { message = "Invalid or expired refresh token" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Change user password
    /// </summary>
    [HttpPost("change-password")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst("userId")?.Value ?? throw new UnauthorizedAccessException());
            
            var command = new ChangePasswordCommand(
                userId,
                request.CurrentPassword,
                request.NewPassword
            );

            var result = await _mediator.Send(command);
            
            if (result)
                return Ok(new { message = "Password changed successfully" });
            
            return BadRequest(new { message = "Failed to change password" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing password");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Revoke refresh token
    /// </summary>
    [HttpPost("revoke-token")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RevokeToken([FromBody] string refreshToken)
    {
        try
        {
            var command = new RevokeTokenCommand(refreshToken);
            var result = await _mediator.Send(command);
            
            if (result)
                return Ok(new { message = "Token revoked successfully" });
            
            return BadRequest(new { message = "Failed to revoke token" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error revoking token");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get current user profile
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst("userId")?.Value ?? throw new UnauthorizedAccessException());
            var query = new GetUserByIdQuery(userId);
            var result = await _mediator.Send(query);
            
            if (result == null)
                return NotFound(new { message = "User not found" });
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user profile");
            return BadRequest(new { message = ex.Message });
        }
    }
}

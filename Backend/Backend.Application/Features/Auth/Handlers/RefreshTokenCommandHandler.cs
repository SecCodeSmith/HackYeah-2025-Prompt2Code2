// File: Backend/Backend.Application/Features/Auth/Handlers/RefreshTokenCommandHandler.cs
using Backend.Application.DTOs.Auth;
using Backend.Application.Features.Auth.Commands;
using Backend.Application.Interfaces;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Auth.Handlers;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponse>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;
    private readonly ILogger<RefreshTokenCommandHandler> _logger;

    public RefreshTokenCommandHandler(
        IUnitOfWork unitOfWork,
        IJwtService jwtService,
        ILogger<RefreshTokenCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
        _logger = logger;
    }

    public async Task<AuthResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        // Validate the current access token (even if expired) to get user ID
        var userId = await _jwtService.GetUserIdFromToken(request.AccessToken);
        
        if (userId == Guid.Empty)
        {
            _logger.LogWarning("Invalid access token provided for refresh");
            throw new UnauthorizedAccessException("Invalid access token");
        }

        // Find the refresh token in database
        var refreshTokens = await _unitOfWork.RefreshTokens.FindAsync(
            rt => rt.Token == request.RefreshToken && rt.UserId == userId && !rt.IsRevoked,
            cancellationToken);
        
        var refreshToken = refreshTokens.FirstOrDefault();

        if (refreshToken == null)
        {
            _logger.LogWarning("Refresh token not found or revoked for user: {UserId}", userId);
            throw new UnauthorizedAccessException("Invalid or revoked refresh token");
        }

        // Check if refresh token has expired
        if (refreshToken.ExpiryDate < DateTime.UtcNow)
        {
            _logger.LogWarning("Expired refresh token used for user: {UserId}", userId);
            throw new UnauthorizedAccessException("Refresh token has expired");
        }

        // Get user from database
        var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
        
        if (user == null)
        {
            _logger.LogError("User not found during token refresh: {UserId}", userId);
            throw new UnauthorizedAccessException("User not found");
        }

        _logger.LogInformation("Refreshing token for user: {Email}", user.Email);

        // Generate new JWT tokens
        var newAccessToken = await _jwtService.GenerateAccessToken(user);
        var newRefreshToken = _jwtService.GenerateRefreshToken();

        // Revoke old refresh token
        refreshToken.IsRevoked = true;
        await _unitOfWork.RefreshTokens.UpdateAsync(refreshToken, cancellationToken);

        // Store new refresh token
        var newRefreshTokenEntity = new Backend.Domain.Entities.RefreshToken
        {
            Token = newRefreshToken,
            UserId = user.Id,
            ExpiryDate = DateTime.UtcNow.AddDays(7),
            IsRevoked = false
        };

        await _unitOfWork.RefreshTokens.AddAsync(newRefreshTokenEntity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Return new authentication response
        return new AuthResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role.ToString()
            }
        };
    }
}

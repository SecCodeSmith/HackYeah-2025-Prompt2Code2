// File: Backend/Backend.Application/Features/Auth/Handlers/RevokeTokenCommandHandler.cs
using Backend.Application.Features.Auth.Commands;
using Backend.Domain.Interfaces;
using MediatR;

namespace Backend.Application.Features.Auth.Handlers;

public class RevokeTokenCommandHandler : IRequestHandler<RevokeTokenCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RevokeTokenCommandHandler> _logger;

    public RevokeTokenCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<RevokeTokenCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<bool> Handle(RevokeTokenCommand request, CancellationToken cancellationToken)
    {
        // Find the refresh token in database
        var refreshTokens = await _unitOfWork.RefreshTokens.FindAsync(
            rt => rt.Token == request.RefreshToken && !rt.IsRevoked,
            cancellationToken);

        var refreshToken = refreshTokens.FirstOrDefault();

        if (refreshToken == null)
        {
            _logger.LogWarning("Attempted to revoke non-existent or already revoked token");
            return false;
        }

        // Mark token as revoked
        refreshToken.IsRevoked = true;
        
        await _unitOfWork.RefreshTokens.UpdateAsync(refreshToken, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Refresh token revoked for user: {UserId}", refreshToken.UserId);

        return true;
    }
}

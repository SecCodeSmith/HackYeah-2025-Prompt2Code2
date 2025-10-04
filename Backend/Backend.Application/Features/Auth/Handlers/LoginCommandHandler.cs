/* TEMP DISABLED - RefreshToken repository not implemented
TODO: Implement IRefreshTokenRepository and add to IUnitOfWork before uncommenting

// File: Backend/Backend.Application/Features/Auth/Handlers/LoginCommandHandler.cs
using Backend.Application.DTOs.Auth;
using Backend.Application.Features.Auth.Commands;
using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Auth.Handlers;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<LoginCommandHandler> _logger;

    public LoginCommandHandler(
        IUnitOfWork unitOfWork,
        IJwtService jwtService,
        IPasswordHasher passwordHasher,
        ILogger<LoginCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        // Find user by email
        var users = await _unitOfWork.Users.FindAsync(
            u => u.Email == request.Email,
            cancellationToken);
        
        var user = users.FirstOrDefault();

        if (user == null)
        {
            _logger.LogWarning("Login attempt with non-existent email: {Email}", request.Email);
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        // Verify password
        if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Failed login attempt for user: {Email}", request.Email);
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        _logger.LogInformation("Successful login for user: {Email}", user.Email);

        // Generate JWT tokens
        var accessToken = await _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        // Store refresh token in database
        var refreshTokenEntity = new RefreshToken
        {
            Token = refreshToken,
            UserId = user.Id,
            ExpiryDate = DateTime.UtcNow.AddDays(7),
            IsRevoked = false
        };

        await _unitOfWork.RefreshTokens.AddAsync(refreshTokenEntity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Return authentication response
        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
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

*/

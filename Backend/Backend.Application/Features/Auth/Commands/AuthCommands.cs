using Backend.Application.DTOs.Auth;
using MediatR;

namespace Backend.Application.Features.Auth.Commands;

public record RegisterCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? PhoneNumber
) : IRequest<AuthResponse>;

public record LoginCommand(
    string Email,
    string Password
) : IRequest<AuthResponse>;

public record RefreshTokenCommand(
    string AccessToken,
    string RefreshToken
) : IRequest<AuthResponse>;

public record ChangePasswordCommand(
    Guid UserId,
    string CurrentPassword,
    string NewPassword
) : IRequest<bool>;

public record RevokeTokenCommand(
    string RefreshToken
) : IRequest<bool>;

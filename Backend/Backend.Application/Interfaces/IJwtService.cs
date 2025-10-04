using Backend.Domain.Entities;

namespace Backend.Application.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    Task<string?> ValidateTokenAsync(string token);
    string? GetUserIdFromToken(string token);
}

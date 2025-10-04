namespace Backend.Application.DTOs.Auth;

// Request DTOs
public record RegisterRequest(
    string Email,
    string Password,
    string ConfirmPassword,
    string FirstName,
    string LastName,
    string? PhoneNumber
);

public record LoginRequest(
    string Email,
    string Password
);

public record RefreshTokenRequest(
    string AccessToken,
    string RefreshToken
);

public record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword,
    string ConfirmNewPassword
);

public record ForgotPasswordRequest(
    string Email
);

public record ResetPasswordRequest(
    string Email,
    string Token,
    string NewPassword,
    string ConfirmNewPassword
);

// Response DTOs
public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserDto User
);

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    string Role,
    bool IsActive,
    bool EmailConfirmed,
    DateTime CreatedAt
);

public record TokenValidationResponse(
    bool IsValid,
    string? UserId,
    string? Email,
    string? ErrorMessage
);

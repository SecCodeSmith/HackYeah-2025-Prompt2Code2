// File: Backend/Backend.Application/Features/Auth/Handlers/ChangePasswordCommandHandler.cs
using Backend.Application.Features.Auth.Commands;
using Backend.Domain.Interfaces;
using Backend.Infrastructure.Services;
using MediatR;

namespace Backend.Application.Features.Auth.Handlers;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<ChangePasswordCommandHandler> _logger;

    public ChangePasswordCommandHandler(
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        ILogger<ChangePasswordCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    public async Task<bool> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        // Get user from database
        var user = await _unitOfWork.Users.GetByIdAsync(request.UserId, cancellationToken);

        if (user == null)
        {
            _logger.LogWarning("Password change attempted for non-existent user: {UserId}", request.UserId);
            throw new InvalidOperationException("User not found");
        }

        // Verify current password
        if (!_passwordHasher.VerifyPassword(request.CurrentPassword, user.PasswordHash))
        {
            _logger.LogWarning("Invalid current password provided for user: {UserId}", request.UserId);
            throw new UnauthorizedAccessException("Current password is incorrect");
        }

        // Hash and update new password
        user.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);
        
        await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Password changed successfully for user: {UserId}", request.UserId);

        return true;
    }
}

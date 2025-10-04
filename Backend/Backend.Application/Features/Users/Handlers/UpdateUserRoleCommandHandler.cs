// File: Backend/Backend.Application/Features/Users/Handlers/UpdateUserRoleCommandHandler.cs
using Backend.Application.Features.Users.Commands;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Users.Handlers;

public class UpdateUserRoleCommandHandler : IRequestHandler<UpdateUserRoleCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdateUserRoleCommandHandler> _logger;

    public UpdateUserRoleCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<UpdateUserRoleCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<bool> Handle(UpdateUserRoleCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Verify the requester is an admin
            var admin = await _unitOfWork.Users.GetByIdAsync(request.AdminId, cancellationToken);
            if (admin == null || admin.Role != UserRole.Administrator)
            {
                _logger.LogWarning("Unauthorized access attempt to update user role by UserId: {AdminId}", request.AdminId);
                throw new UnauthorizedAccessException("Only administrators can update user roles");
            }

            // Get the user to update
            var user = await _unitOfWork.Users.GetByIdAsync(request.UserId, cancellationToken);
            if (user == null)
            {
                _logger.LogWarning("User not found: {UserId}", request.UserId);
                return false;
            }

            // Validate role value
            if (!Enum.IsDefined(typeof(UserRole), request.Role))
            {
                _logger.LogWarning("Invalid role value: {Role}", request.Role);
                throw new ArgumentException($"Invalid role value: {request.Role}");
            }

            var newRole = (UserRole)request.Role;

            // Prevent admins from demoting themselves
            if (request.AdminId == request.UserId && newRole != UserRole.Administrator)
            {
                _logger.LogWarning("Admin {AdminId} attempted to demote themselves", request.AdminId);
                throw new InvalidOperationException("You cannot change your own administrator role");
            }

            var oldRole = user.Role;
            user.Role = newRole;
            user.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("User role updated: UserId={UserId}, OldRole={OldRole}, NewRole={NewRole}, UpdatedBy={AdminId}",
                request.UserId, oldRole, newRole, request.AdminId);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user role for UserId: {UserId}", request.UserId);
            throw;
        }
    }
}

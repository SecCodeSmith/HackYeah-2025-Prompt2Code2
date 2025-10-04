// File: Backend/Backend.Application/Features/Users/Handlers/GetAllUsersQueryHandler.cs
using Backend.Application.DTOs.Auth;
using Backend.Application.Features.Users.Queries;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Users.Handlers;

public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, List<UserDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetAllUsersQueryHandler> _logger;

    public GetAllUsersQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<GetAllUsersQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<List<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Verify the requester is an admin
            var admin = await _unitOfWork.Users.GetByIdAsync(request.AdminId, cancellationToken);
            if (admin == null || admin.Role != Backend.Domain.Entities.UserRole.Administrator)
            {
                _logger.LogWarning("Unauthorized access attempt to get all users by UserId: {AdminId}", request.AdminId);
                throw new UnauthorizedAccessException("Only administrators can access user list");
            }

            // Get all users
            var users = await _unitOfWork.Users.GetAllAsync(cancellationToken);

            var userDtos = users.Select(u => new UserDto(
                u.Id,
                u.Email,
                u.FirstName,
                u.LastName,
                u.PhoneNumber,
                u.Role.ToString(),
                u.IsEmailVerified,
                u.IsActive,
                u.CreatedAt
            )).ToList();

            _logger.LogInformation("Retrieved {Count} users for admin {AdminId}", userDtos.Count, request.AdminId);

            return userDtos;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all users");
            throw;
        }
    }
}

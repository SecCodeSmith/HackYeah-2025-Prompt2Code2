// File: Backend/Backend.Application/Features/Auth/Handlers/GetUserByIdQueryHandler.cs
using Backend.Application.DTOs.Auth;
using Backend.Application.Features.Auth.Queries;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Auth.Handlers;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserDto?>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetUserByIdQueryHandler> _logger;

    public GetUserByIdQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<GetUserByIdQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<UserDto?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(request.UserId, cancellationToken);

        if (user == null)
        {
            _logger.LogWarning("User not found: {UserId}", request.UserId);
            return null;
        }

        return new UserDto(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.PhoneNumber,
            user.Role.ToString(),
            user.IsActive,
            false, // EmailConfirmed - property not implemented yet
            user.CreatedAt
        );
    }
}

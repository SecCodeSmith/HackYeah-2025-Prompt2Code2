// File: Backend/Backend.Application/Features/Users/Queries/UserQueries.cs
using Backend.Application.DTOs.Auth;
using MediatR;

namespace Backend.Application.Features.Users.Queries;

public record GetAllUsersQuery(
    Guid AdminId
) : IRequest<List<UserDto>>;

public record GetUserByIdQuery(
    Guid UserId
) : IRequest<UserDto?>;

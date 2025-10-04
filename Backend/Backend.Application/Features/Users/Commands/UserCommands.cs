// File: Backend/Backend.Application/Features/Users/Commands/UserCommands.cs
using MediatR;

namespace Backend.Application.Features.Users.Commands;

public record UpdateUserRoleCommand(
    Guid UserId,
    int Role,
    Guid AdminId
) : IRequest<bool>;

using Backend.Application.DTOs.Auth;
using MediatR;

namespace Backend.Application.Features.Auth.Queries;

public record GetUserByIdQuery(
    Guid UserId
) : IRequest<UserDto?>;

public record GetUserByEmailQuery(
    string Email
) : IRequest<UserDto?>;

public record ValidateTokenQuery(
    string Token
) : IRequest<TokenValidationResponse>;

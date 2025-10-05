// File: Backend/Backend.Application/Features/Messages/Handlers/GetUnreadCountQueryHandler.cs
using Backend.Application.Features.Messages.Queries;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Messages.Handlers;

public class GetUnreadCountQueryHandler : IRequestHandler<GetUnreadCountQuery, int>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetUnreadCountQueryHandler> _logger;

    public GetUnreadCountQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<GetUnreadCountQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<int> Handle(GetUnreadCountQuery request, CancellationToken cancellationToken)
    {
        try
        {
            return await _unitOfWork.Messages.GetUnreadCountAsync(request.UserId, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving unread count for user {UserId}", request.UserId);
            throw;
        }
    }
}

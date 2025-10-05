using Backend.Application.Features.Podmioty.Commands;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Podmioty.Handlers;

public class DeletePodmiotCommandHandler : IRequestHandler<DeletePodmiotCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DeletePodmiotCommandHandler> _logger;

    public DeletePodmiotCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<DeletePodmiotCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<bool> Handle(DeletePodmiotCommand request, CancellationToken cancellationToken)
    {
        var podmiot = await _unitOfWork.Podmioty
            .GetByIdAsync(request.Id, cancellationToken);

        if (podmiot == null)
        {
            throw new InvalidOperationException($"Podmiot with ID '{request.Id}' not found.");
        }

        await _unitOfWork.Podmioty.DeleteAsync(podmiot, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted Podmiot with ID: {PodmiotId}", request.Id);

        return true;
    }
}

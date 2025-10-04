// File: Backend/Backend.Application/Features/Reports/Validators/SubmitReportCommandValidator.cs
using Backend.Application.Features.Reports.Commands;
using FluentValidation;

namespace Backend.Application.Features.Reports.Validators;

public class SubmitReportCommandValidator : AbstractValidator<SubmitReportCommand>
{
    public SubmitReportCommandValidator()
    {
        RuleFor(x => x.ReportId)
            .NotEmpty().WithMessage("Report ID is required.");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.");
    }
}

// File: Backend/Backend.Application/Features/Reports/Validators/ReviewReportCommandValidator.cs
using Backend.Application.Features.Reports.Commands;
using FluentValidation;

namespace Backend.Application.Features.Reports.Validators;

public class ReviewReportCommandValidator : AbstractValidator<ReviewReportCommand>
{
    public ReviewReportCommandValidator()
    {
        RuleFor(x => x.ReportId)
            .NotEmpty().WithMessage("Report ID is required.");

        RuleFor(x => x.Status)
            .InclusiveBetween(0, 5).WithMessage("Invalid status value.");

        RuleFor(x => x.ReviewNotes)
            .MaximumLength(2000).WithMessage("Review notes must not exceed 2000 characters.")
            .When(x => !string.IsNullOrEmpty(x.ReviewNotes));

        RuleFor(x => x.ReviewerId)
            .NotEmpty().WithMessage("Reviewer ID is required.");
    }
}

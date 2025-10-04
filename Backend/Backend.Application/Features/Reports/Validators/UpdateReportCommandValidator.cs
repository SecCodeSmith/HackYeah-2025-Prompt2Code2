// File: Backend/Backend.Application/Features/Reports/Validators/UpdateReportCommandValidator.cs
using Backend.Application.Features.Reports.Commands;
using FluentValidation;

namespace Backend.Application.Features.Reports.Validators;

public class UpdateReportCommandValidator : AbstractValidator<UpdateReportCommand>
{
    public UpdateReportCommandValidator()
    {
        RuleFor(x => x.ReportId)
            .NotEmpty().WithMessage("Report ID is required");

        RuleFor(x => x.Title)
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.Title));

        RuleFor(x => x.Description)
            .MaximumLength(5000).WithMessage("Description must not exceed 5000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.Category)
            .MaximumLength(100).WithMessage("Category must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Category));

        RuleFor(x => x.Priority)
            .InclusiveBetween(0, 2).WithMessage("Invalid priority value (0=Low, 1=Medium, 2=High)");

        RuleFor(x => x.Status)
            .InclusiveBetween(0, 5).WithMessage("Invalid status value");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");
    }
}

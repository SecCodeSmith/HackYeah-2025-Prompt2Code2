// File: Backend/Backend.Application/Features/Reports/Validators/CreateReportCommandValidator.cs
using Backend.Application.Features.Reports.Commands;
using FluentValidation;

namespace Backend.Application.Features.Reports.Validators;

public class CreateReportCommandValidator : AbstractValidator<CreateReportCommand>
{
    public CreateReportCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Report title is required")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Report description is required")
            .MaximumLength(5000).WithMessage("Description must not exceed 5000 characters");

        RuleFor(x => x.Category)
            .MaximumLength(100).WithMessage("Category must not exceed 100 characters");

        RuleFor(x => x.Priority)
            .InclusiveBetween(0, 2).WithMessage("Invalid priority value (0=Low, 1=Medium, 2=High)");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");
    }
}

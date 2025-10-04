using Backend.Application.DTOs.Reports;
using Backend.Application.Features.Reports.Queries;
using Backend.Domain.Interfaces;
using Backend.Domain.Entities;
using ClosedXML.Excel;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Reports.Handlers;

public class ExportReportsQueryHandler : IRequestHandler<ExportReportsQuery, byte[]>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ExportReportsQueryHandler> _logger;

    public ExportReportsQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<ExportReportsQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<byte[]> Handle(ExportReportsQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Exporting reports to Excel with filters: {@Filters}", request);

        // Get all reports from database
        var allReports = await _unitOfWork.Reports.GetAllAsync(cancellationToken);
        var reportsList = allReports.ToList();

        // Apply filters (same logic as SearchReportsQueryHandler)
        if (request.Status.HasValue)
        {
            reportsList = reportsList.Where(r => (int)r.Status == request.Status.Value).ToList();
        }

        if (request.Priority.HasValue)
        {
            reportsList = reportsList.Where(r => (int)r.Priority == request.Priority.Value).ToList();
        }

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            reportsList = reportsList.Where(r => 
                r.Category != null && 
                r.Category.Contains(request.Category, StringComparison.OrdinalIgnoreCase)
            ).ToList();
        }

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTermLower = request.SearchTerm.ToLower();
            reportsList = reportsList.Where(r =>
                (r.Title != null && r.Title.ToLower().Contains(searchTermLower)) ||
                (r.Description != null && r.Description.ToLower().Contains(searchTermLower))
            ).ToList();
        }

        if (request.CreatedFrom.HasValue)
        {
            reportsList = reportsList.Where(r => r.CreatedAt >= request.CreatedFrom.Value).ToList();
        }

        if (request.CreatedTo.HasValue)
        {
            reportsList = reportsList.Where(r => r.CreatedAt <= request.CreatedTo.Value).ToList();
        }

        // Order by creation date (newest first)
        reportsList = reportsList.OrderByDescending(r => r.CreatedAt).ToList();

        _logger.LogInformation("Found {Count} reports matching filters", reportsList.Count);

        // Create Excel workbook
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Raporty UKNF");

        // Create header row
        worksheet.Cell(1, 1).Value = "ID";
        worksheet.Cell(1, 2).Value = "Tytuł";
        worksheet.Cell(1, 3).Value = "Opis";
        worksheet.Cell(1, 4).Value = "Status";
        worksheet.Cell(1, 5).Value = "Priorytet";
        worksheet.Cell(1, 6).Value = "Kategoria";
        worksheet.Cell(1, 7).Value = "Data utworzenia";
        worksheet.Cell(1, 8).Value = "Data przekazania";
        worksheet.Cell(1, 9).Value = "Data zatwierdzenia";
        worksheet.Cell(1, 10).Value = "Uwagi z walidacji";

        // Style header row
        var headerRow = worksheet.Row(1);
        headerRow.Style.Font.Bold = true;
        headerRow.Style.Fill.BackgroundColor = XLColor.LightBlue;
        headerRow.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

        // Add data rows
        int currentRow = 2;
        foreach (var report in reportsList)
        {
            worksheet.Cell(currentRow, 1).Value = report.Id.ToString();
            worksheet.Cell(currentRow, 2).Value = report.Title ?? "";
            worksheet.Cell(currentRow, 3).Value = report.Description ?? "";
            worksheet.Cell(currentRow, 4).Value = GetStatusText(report.Status);
            worksheet.Cell(currentRow, 5).Value = GetPriorityText(report.Priority);
            worksheet.Cell(currentRow, 6).Value = report.Category ?? "";
            worksheet.Cell(currentRow, 7).Value = report.CreatedAt;
            worksheet.Cell(currentRow, 8).Value = report.SubmittedAt?.ToString("yyyy-MM-dd HH:mm") ?? "";
            worksheet.Cell(currentRow, 9).Value = report.ReviewedAt?.ToString("yyyy-MM-dd HH:mm") ?? "";
            worksheet.Cell(currentRow, 10).Value = report.ReviewNotes ?? "";

            currentRow++;
        }

        // Auto-fit columns for better readability
        worksheet.Columns().AdjustToContents();

        // Freeze header row
        worksheet.SheetView.FreezeRows(1);

        // Add auto-filter to header row
        worksheet.RangeUsed().SetAutoFilter();

        // Save to memory stream
        using var memoryStream = new MemoryStream();
        workbook.SaveAs(memoryStream);
        
        var byteArray = memoryStream.ToArray();
        
        _logger.LogInformation("Excel file generated successfully with {Rows} data rows", reportsList.Count);
        
        return byteArray;
    }

    private static string GetStatusText(ReportStatus status)
    {
        return status switch
        {
            ReportStatus.Draft => "Szkic",
            ReportStatus.Submitted => "Przekazany",
            ReportStatus.UnderReview => "W trakcie weryfikacji",
            ReportStatus.Approved => "Zatwierdzony",
            ReportStatus.Rejected => "Odrzucony",
            ReportStatus.Archived => "Zarchiwizowany",
            _ => status.ToString()
        };
    }

    private static string GetPriorityText(ReportPriority priority)
    {
        return priority switch
        {
            ReportPriority.Low => "Niski",
            ReportPriority.Normal => "Normalny",
            ReportPriority.High => "Wysoki",
            ReportPriority.Critical => "Krytyczny",
            _ => priority.ToString()
        };
    }
}

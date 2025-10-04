# Report Dashboard Component

## Overview

The `ReportDashboardComponent` is a comprehensive, enterprise-grade Angular component designed for the UKNF Communication Platform. It provides a feature-rich interface for supervised entities to view, manage, and track their regulatory reports.

## Features

### Core Functionality

- **Interactive Data Table** - PrimeNG `p-table` with full CRUD operations
- **18 Mock Reports** - Demonstrates all 6 status types with realistic data
- **Global Search** - Real-time filtering across all text fields
- **Column Sorting** - Ascending/descending sort on all columns
- **Status Filtering** - Dropdown filter with icon-enhanced options
- **Pagination** - Configurable rows per page (5, 10, 25, 50)
- **Action Buttons** - View, Download, and Submit Correction per report
- **Export Functions** - CSV and XLSX export with data preservation
- **Responsive Design** - Mobile-first approach with Tailwind CSS

### UI/UX Features

- **Sticky Header** - Table header remains visible while scrolling
- **Loading States** - Simulated async data loading with spinner
- **Empty States** - User-friendly message when no results found
- **Tooltips** - Contextual help on all action buttons
- **Status Badges** - Color-coded visual indicators
- **Gradient Backgrounds** - Professional blue-indigo theme
- **Hover Effects** - Smooth transitions on interactive elements
- **Polish Language** - All UI text in Polish

## Report Statuses

The component supports 6 different report statuses with unique styling:

| Status | Color | Icon | Description |
|--------|-------|------|-------------|
| Robocze | Gray | `pi-file-edit` | Draft reports in progress |
| Przekazane | Blue | `pi-send` | Reports submitted to UKNF |
| W trakcie walidacji | Orange | `pi-clock` | Under validation review |
| Proces zakończony sukcesem | Green | `pi-check-circle` | Successfully completed |
| Błędy z reguł walidacji | Red | `pi-exclamation-triangle` | Validation errors detected |
| Zakwestionowane przez UKNF | Red | `pi-question-circle` | Questioned by UKNF |

## Component Structure

### Template Sections

1. **Header Card** - Title, description, and total report count
2. **Toolbar Card** - Search input, status filter, export buttons
3. **Table Card** - Main data table with pagination
4. **Footer** - Last update timestamp

### Data Model

```typescript
interface Report {
  id: number;
  name: string;
  submissionPeriod: string;
  submissionDate: Date;
  status: ReportStatus;
}

enum ReportStatus {
  DRAFT = 'Robocze',
  SUBMITTED = 'Przekazane',
  VALIDATING = 'W trakcie walidacji',
  SUCCESS = 'Proces zakończony sukcesem',
  VALIDATION_ERROR = 'Błędy z reguł walidacji',
  QUESTIONED = 'Zakwestionowane przez UKNF'
}
```

## Usage

### Basic Setup

```typescript
import { ReportDashboardComponent } from './components/report-dashboard/report-dashboard.component';

// In your routing configuration
{
  path: 'reports',
  loadComponent: () => import('./components/report-dashboard/report-dashboard.component')
    .then(m => m.ReportDashboardComponent)
}
```

### Navigation

```html
<a routerLink="/reports">View Reports Dashboard</a>
```

## Features in Detail

### Global Search

The search input filters reports by:
- Report name
- Submission period
- Status

**Implementation:**
```typescript
onGlobalFilter(event: Event): void {
  const value = (event.target as HTMLInputElement).value.toLowerCase();
  this.applyFilters(value, this.selectedStatus);
}
```

### Status Filter

Dropdown allows filtering by specific status:
- Displays icon + label for each status
- "Clear" button to reset filter
- Applies in combination with search

### Column Sorting

All columns support sorting:
- Click header to sort ascending
- Click again to sort descending
- Visual indicator shows active sort

### Pagination

Customizable pagination:
- Default: 10 rows per page
- Options: 5, 10, 25, 50
- Shows current page and total records
- First/Previous/Next/Last buttons

### Action Buttons

Each row has 3 action buttons:

1. **View Details** (Eye icon)
   - Opens report details modal (placeholder)
   - Always enabled

2. **Download Report** (Download icon)
   - Downloads report as PDF (placeholder)
   - Always enabled

3. **Submit Correction** (Pencil icon)
   - Opens correction form (placeholder)
   - Disabled for completed reports

### Export Functions

Two export options:

1. **CSV Export**
   - Exports filtered/sorted data
   - UTF-8 encoding
   - Includes all visible columns
   - Console logs data preview

2. **XLSX Export**
   - Excel 2007+ format
   - Multiple sheets capability
   - Formatted columns
   - Requires ExcelJS or SheetJS (to be implemented)

## Styling

### Tailwind CSS Classes

The component uses Tailwind for:
- Responsive layouts (`md:`, `lg:` breakpoints)
- Spacing utilities (`p-4`, `mb-6`, `gap-4`)
- Colors (`bg-white`, `text-gray-800`, `text-indigo-600`)
- Effects (`shadow-lg`, `rounded-lg`, `hover:bg-gray-50`)
- Gradients (`bg-gradient-to-br from-blue-50 to-indigo-100`)

### PrimeNG Theme

Uses Lara Light Blue theme:
- Professional blue color scheme
- Material Design inspired
- High contrast for accessibility

### Custom Styles

Component-specific styles:
- Sticky table header
- Hover effects on sortable columns
- Custom tag styling
- Button hover animations
- Responsive table scrolling

## Mock Data

The component includes 18 mock reports covering:
- Financial reports (Raport Finansowy, Raport Płynności)
- Risk reports (Raport Ryzyka Operacyjnego)
- Capital reports (Sprawozdanie Kapitałowe, Raport Adekwatności)
- Compliance reports (Raport Compliance, Raport AML/KYC)
- Regulatory reports (COREP, FINREP, BION)

Reports are distributed across all quarters and months to demonstrate:
- Different time periods
- All status types
- Various report types
- Realistic naming conventions

## Extending the Component

### Connecting to Backend API

Replace mock data with API calls:

```typescript
import { HttpClient } from '@angular/common/http';

constructor(private http: HttpClient) {}

ngOnInit(): void {
  this.loadReportsFromAPI();
}

private loadReportsFromAPI(): void {
  this.loading.set(true);
  this.http.get<Report[]>('/api/reports')
    .subscribe({
      next: (data) => {
        this.reports = data;
        this.filteredReports.set([...this.reports]);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.loading.set(false);
      }
    });
}
```

### Implementing Real Export

Install export libraries:

```bash
npm install xlsx file-saver
npm install --save-dev @types/file-saver
```

Update export methods:

```typescript
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

exportToXLSX(): void {
  const ws = XLSX.utils.json_to_sheet(this.filteredReports());
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reports');
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `raporty_${new Date().getTime()}.xlsx`);
}
```

### Adding Modals for Actions

Create modal components for:
- Report details view
- Correction form
- Confirmation dialogs

Example with PrimeNG Dialog:

```typescript
import { DialogModule } from 'primeng/dialog';

// Add to imports array
imports: [..., DialogModule]

// In template
<p-dialog [(visible)]="displayDetailsDialog" [style]="{width: '50vw'}">
  <ng-template pTemplate="header">
    <h3>Report Details</h3>
  </ng-template>
  <!-- Report details content -->
</p-dialog>

// In component
displayDetailsDialog = false;

viewDetails(report: Report): void {
  this.selectedReport = report;
  this.displayDetailsDialog = true;
}
```

## Accessibility

The component implements WCAG 2.2 guidelines:
- Keyboard navigation support
- ARIA labels on interactive elements
- Tooltips for icon-only buttons
- High contrast color scheme
- Focus indicators
- Screen reader friendly

## Performance Considerations

- **Lazy Loading** - Component loaded on demand
- **Virtual Scrolling** - Can be enabled for large datasets
- **Efficient Filtering** - Uses signals for reactive updates
- **Optimized Rendering** - PrimeNG table handles large datasets efficiently

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- **@angular/core**: ^18.0.0
- **@angular/common**: ^18.0.0
- **@angular/forms**: ^18.0.0
- **primeng**: ^18.0.7-lts
- **primeicons**: ^7.0.0
- **tailwindcss**: ^3.4.15

## Troubleshooting

### PrimeNG Styles Not Loading

Ensure CDN links in `index.html`:
```html
<link rel="stylesheet" href="https://unpkg.com/primeng@18.0.7/resources/themes/lara-light-blue/theme.css">
<link rel="stylesheet" href="https://unpkg.com/primeng@18.0.7/resources/primeng.min.css">
<link rel="stylesheet" href="https://unpkg.com/primeicons@7.0.0/primeicons.css">
```

### Tailwind Classes Not Working

Check `tailwind.config.js` content paths:
```javascript
content: ["./src/**/*.{html,ts}"]
```

### Table Not Responsive

Ensure `responsiveLayout="scroll"` on `p-table` and parent container has proper width constraints.

## Future Enhancements

- [ ] Real-time updates via WebSocket
- [ ] Bulk actions (select multiple reports)
- [ ] Advanced filtering (date range, multiple statuses)
- [ ] Column visibility toggle
- [ ] Save filter preferences
- [ ] Report preview in modal
- [ ] File upload for corrections
- [ ] Audit trail view
- [ ] Custom column ordering
- [ ] Print-friendly view

## License

This component is part of the UKNF Communication Platform and is proprietary software.

## Support

For issues or questions, contact the development team.

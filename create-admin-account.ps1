# Script to create an admin account for the UKNF application
# This script uses the registration API endpoint and then updates the role in the database

Write-Host "Creating Admin Account for UKNF Application" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Admin account details
$adminEmail = "admin@uknf.gov.pl"
$adminPassword = "Admin123!"

$adminData = @{
    email = $adminEmail
    password = $adminPassword
    firstName = "Admin"
    lastName = "Administrator"
    phoneNumber = "+48123456789"
} | ConvertTo-Json

# API endpoint
$apiUrl = "http://localhost:5000/api/auth/register"

Write-Host "Step 1: Attempting to register admin account via API..." -ForegroundColor Yellow
Write-Host "Email: $adminEmail" -ForegroundColor White
Write-Host ""

$accountCreated = $false

try {
    # Make the API request
    $response = Invoke-RestMethod -Uri $apiUrl `
        -Method Post `
        -Body $adminData `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "Admin account registered successfully!" -ForegroundColor Green
    $accountCreated = $true
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorMessage = $_.ErrorDetails.Message
    
    if ($statusCode -eq 400) {
        Write-Host "Account already exists" -ForegroundColor Yellow
        $accountCreated = $true
    }
    elseif ($statusCode -eq 0 -or $null -eq $statusCode) {
        Write-Host "Cannot connect to the API" -ForegroundColor Red
        Write-Host "Please make sure the application is running:" -ForegroundColor Yellow
        Write-Host "  docker-compose up -d" -ForegroundColor White
        Write-Host ""
        exit 1
    }
    else {
        Write-Host "Error creating account" -ForegroundColor Red
        Write-Host "Status Code: $statusCode" -ForegroundColor Yellow
        Write-Host "Error: $errorMessage" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "Step 2: Updating user role to Administrator in database..." -ForegroundColor Yellow

# Update role in database via Docker (MS SQL Server)
$sqlCommand = "UPDATE [Users] SET [Role] = 1, [IsActive] = 1, [EmailConfirmed] = 1 WHERE [Email] = '$adminEmail';"
$dbPassword = "YourStrong@Password123"
$dbName = "UknfCommunicationDb"

try {
    $result = wsl docker exec -i uknf-database /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $dbPassword -d $dbName -C -Q $sqlCommand 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "User role updated to Administrator!" -ForegroundColor Green
    } else {
        Write-Host "Could not update role automatically" -ForegroundColor Yellow
        Write-Host "Error: $result" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "Could not update role automatically" -ForegroundColor Yellow
    Write-Host "You can manually run this SQL command:" -ForegroundColor Yellow
    Write-Host $sqlCommand -ForegroundColor White
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Admin Account Setup Complete!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login Credentials:" -ForegroundColor Cyan
Write-Host "  Email: $adminEmail" -ForegroundColor White
Write-Host "  Password: $adminPassword" -ForegroundColor White
Write-Host "  Role: Administrator" -ForegroundColor White
Write-Host ""
Write-Host "Application URL: http://localhost:4200" -ForegroundColor Green
Write-Host ""

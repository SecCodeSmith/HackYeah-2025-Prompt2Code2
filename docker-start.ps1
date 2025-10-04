# Docker Quick Start Script for Windows/WSL

Write-Host "=== UKNF Communication Platform - Docker Quick Start ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check prerequisites
Write-Host "Step 1: Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check Docker
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerInstalled) {
    Write-Host "❌ Docker is not installed!" -ForegroundColor Red
    Write-Host "   Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Docker is installed" -ForegroundColor Green

# Check Docker Compose
$dockerComposeInstalled = Get-Command docker-compose -ErrorAction SilentlyContinue
if (-not $dockerComposeInstalled) {
    Write-Host "❌ Docker Compose is not installed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker Compose is installed" -ForegroundColor Green

# Check if Docker is running
try {
    docker ps | Out-Null
    Write-Host "✓ Docker daemon is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker daemon is not running!" -ForegroundColor Red
    Write-Host "   Please start Docker Desktop" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 2: Check .env file
Write-Host "Step 2: Checking environment configuration..." -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path ".env")) {
    Write-Host "⚠ .env file not found. Creating from template..." -ForegroundColor Yellow
    if (Test-Path ".env.template") {
        Copy-Item ".env.template" ".env"
        Write-Host "✓ Created .env from template" -ForegroundColor Green
        Write-Host "  Please review and update .env file before running again!" -ForegroundColor Yellow
        notepad .env
        exit 0
    } else {
        Write-Host "❌ .env.template not found!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ .env file exists" -ForegroundColor Green
}

Write-Host ""

# Step 3: Generate HTTPS certificate
Write-Host "Step 3: Checking HTTPS certificate..." -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path "Backend\https\aspnetapp.pfx")) {
    Write-Host "⚠ HTTPS certificate not found. Generating..." -ForegroundColor Yellow
    
    # Create https directory
    New-Item -ItemType Directory -Force -Path "Backend\https" | Out-Null
    
    # Generate certificate
    Push-Location Backend
    dotnet dev-certs https -ep https\aspnetapp.pfx -p devcert --trust
    Pop-Location
    
    if (Test-Path "Backend\https\aspnetapp.pfx") {
        Write-Host "✓ HTTPS certificate generated" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to generate certificate!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ HTTPS certificate exists" -ForegroundColor Green
}

Write-Host ""

# Step 4: Stop any running containers
Write-Host "Step 4: Stopping any existing containers..." -ForegroundColor Yellow
Write-Host ""

docker-compose down 2>&1 | Out-Null
Write-Host "✓ Existing containers stopped" -ForegroundColor Green

Write-Host ""

# Step 5: Build images
Write-Host "Step 5: Building Docker images..." -ForegroundColor Yellow
Write-Host "   This may take 5-10 minutes on first run..." -ForegroundColor Cyan
Write-Host ""

docker-compose build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    Write-Host "   Check the error messages above for details." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✓ Docker images built successfully" -ForegroundColor Green

Write-Host ""

# Step 6: Start containers
Write-Host "Step 6: Starting containers..." -ForegroundColor Yellow
Write-Host ""

docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start containers!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Containers started" -ForegroundColor Green

Write-Host ""

# Step 7: Wait for services to be healthy
Write-Host "Step 7: Waiting for services to be healthy..." -ForegroundColor Yellow
Write-Host "   This may take 30-60 seconds..." -ForegroundColor Cyan
Write-Host ""

$maxWait = 60
$waited = 0
$allHealthy = $false

while ($waited -lt $maxWait -and -not $allHealthy) {
    Start-Sleep -Seconds 5
    $waited += 5
    
    $containers = docker-compose ps --format json | ConvertFrom-Json
    $healthyCount = 0
    
    foreach ($container in $containers) {
        if ($container.Health -eq "healthy" -or $container.State -eq "running") {
            $healthyCount++
        }
    }
    
    if ($healthyCount -eq 3) {
        $allHealthy = $true
    }
    
    Write-Host "  Waiting... ($waited seconds)" -ForegroundColor Cyan
}

if ($allHealthy) {
    Write-Host "✓ All services are healthy" -ForegroundColor Green
} else {
    Write-Host "⚠ Services may still be starting. Check logs with: docker-compose logs -f" -ForegroundColor Yellow
}

Write-Host ""

# Step 8: Run database migration (optional, comment out if auto-migration is enabled)
Write-Host "Step 8: Running database migration..." -ForegroundColor Yellow
Write-Host ""

$runMigration = Read-Host "Do you want to run database migration now? (Y/n)"
if ($runMigration -ne "n" -and $runMigration -ne "N") {
    docker-compose exec -T backend dotnet ef database update
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database migration completed" -ForegroundColor Green
    } else {
        Write-Host "⚠ Database migration failed. You can run it later with:" -ForegroundColor Yellow
        Write-Host "  docker-compose exec backend dotnet ef database update" -ForegroundColor Cyan
    }
}

Write-Host ""

# Success message
Write-Host "=== 🎉 Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Your application is now running:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend:      http://localhost:4200" -ForegroundColor White
Write-Host "  Backend HTTP:  http://localhost:5000" -ForegroundColor White
Write-Host "  Backend HTTPS: https://localhost:5001" -ForegroundColor White
Write-Host "  Database:      localhost:1433" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  View logs:           docker-compose logs -f" -ForegroundColor White
Write-Host "  Stop containers:     docker-compose down" -ForegroundColor White
Write-Host "  Restart service:     docker-compose restart backend" -ForegroundColor White
Write-Host "  Access backend:      docker-compose exec backend bash" -ForegroundColor White
Write-Host "  Database migration:  docker-compose exec backend dotnet ef database update" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to open frontend in browser..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Start-Process "http://localhost:4200"

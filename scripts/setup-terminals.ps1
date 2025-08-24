# AutoCare Advisor - Development Environment Setup Script
# Team: CLEANtastic
# Usage: .\scripts\setup-terminals.ps1

param(
    [Parameter(Mandatory=$false)]
    [string]$Action = "start",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipDocker = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$TestsOnly = $false
)

# Color-coded output functions
function Write-Success($message) {
    Write-Host "✅ $message" -ForegroundColor Green
}

function Write-Info($message) {
    Write-Host "ℹ️  $message" -ForegroundColor Cyan  
}

function Write-Warning($message) {
    Write-Host "⚠️  $message" -ForegroundColor Yellow
}

function Write-Error($message) {
    Write-Host "❌ $message" -ForegroundColor Red
}

function Start-AutoCareDevEnvironment {
    Write-Info "Starting AutoCare Advisor Development Environment..."
    Write-Info "Project: AutoCare Advisor - SaaS Development"
    Write-Info "Team: CLEANtastic"
    Write-Host ""

    # Check if we're in the right directory
    if (-not (Test-Path ".copilot-instructions.md")) {
        Write-Error "Not in AutoCare Advisor project root directory!"
        Write-Info "Please run this script from the project root containing .copilot-instructions.md"
        exit 1
    }

    # Start Docker services first (if not skipped)
    if (-not $SkipDocker) {
        Write-Info "🐳 Starting Docker services..."
        try {
            docker-compose up -d postgres mongodb redis
            Write-Success "Database services started"
        }
        catch {
            Write-Warning "Docker services failed to start - continuing anyway"
        }
    }

    # Check for backend directory
    if (Test-Path "backend") {
        Write-Info "🚀 Starting Backend Server (Port 3000)..."
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal
        Start-Sleep 2
    } else {
        Write-Warning "Backend directory not found - skipping backend server"
    }

    # Check for frontend directory  
    if (Test-Path "frontend") {
        Write-Info "🌐 Starting Frontend Server (Port 3001)..."
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start" -WindowStyle Normal
        Start-Sleep 2
    } else {
        Write-Warning "Frontend directory not found - skipping frontend server"
    }

    # Start test runner if requested
    if ($TestsOnly -or $Action -eq "test") {
        Write-Info "🧪 Starting Test Runner..."
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run test:watch" -WindowStyle Normal
    }

    Write-Success "Development environment started!"
    Write-Info "Backend:  http://localhost:3000"
    Write-Info "Frontend: http://localhost:3001"  
    Write-Info "Admin:    http://localhost:3002"
    Write-Host ""
    Write-Info "Use 'Ctrl+C' in each terminal to stop servers"
}

function Stop-AutoCareDevEnvironment {
    Write-Info "Stopping AutoCare Advisor Development Environment..."
    
    # Stop Docker services
    Write-Info "🐳 Stopping Docker services..."
    docker-compose down
    
    # Kill node processes (be careful - this affects all node processes)
    Write-Info "🛑 Stopping Node.js processes..."
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "node" } | Stop-Process -Force
    
    Write-Success "Development environment stopped!"
}

function Show-AutoCareStatus {
    Write-Info "AutoCare Advisor - Development Status"
    Write-Host "================================="
    
    # Check Docker services
    Write-Info "🐳 Docker Services:"
    docker-compose ps
    Write-Host ""
    
    # Check ports
    Write-Info "📡 Port Status:"
    $ports = @(3000, 3001, 3002, 5432, 27017, 6379)
    foreach ($port in $ports) {
        $connection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
        if ($connection.TcpTestSucceeded) {
            Write-Success "Port $port - OPEN"
        } else {
            Write-Warning "Port $port - CLOSED"
        }
    }
    Write-Host ""
    
    # Check Node processes
    Write-Info "⚡ Node.js Processes:"
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, CPU, WorkingSet
}

function Install-AutoCareDependencies {
    Write-Info "📦 Installing AutoCare Advisor Dependencies..."
    
    # Root dependencies
    if (Test-Path "package.json") {
        Write-Info "Installing root dependencies..."
        npm install
    }
    
    # Backend dependencies
    if (Test-Path "backend/package.json") {
        Write-Info "Installing backend dependencies..."
        Set-Location backend
        npm install
        Set-Location ..
    }
    
    # Frontend dependencies
    if (Test-Path "frontend/package.json") {
        Write-Info "Installing frontend dependencies..."
        Set-Location frontend
        npm install  
        Set-Location ..
    }
    
    Write-Success "All dependencies installed!"
}

function Reset-AutoCareDatabase {
    Write-Info "🗄️  Resetting AutoCare Advisor Database..."
    Write-Warning "This will delete ALL data in development databases!"
    
    $confirmation = Read-Host "Are you sure? Type 'yes' to continue"
    if ($confirmation -eq 'yes') {
        # Stop and remove Docker volumes
        docker-compose down -v
        
        # Restart with fresh databases
        docker-compose up -d postgres mongodb redis
        
        # Run database setup if script exists
        if (Test-Path "backend/scripts/database-setup.ts") {
            Write-Info "Running database setup script..."
            Set-Location backend
            npm run db:reset
            npm run db:seed
            Set-Location ..
        }
        
        Write-Success "Database reset complete!"
    } else {
        Write-Info "Database reset cancelled."
    }
}

# Main script execution
switch ($Action.ToLower()) {
    "start" { Start-AutoCareDevEnvironment }
    "stop" { Stop-AutoCareDevEnvironment }
    "status" { Show-AutoCareStatus }
    "install" { Install-AutoCareDependencies }
    "reset-db" { Reset-AutoCareDatabase }
    default {
        Write-Info "AutoCare Advisor - Development Environment Script"
        Write-Host "Usage: .\scripts\setup-terminals.ps1 -Action <start|stop|status|install|reset-db>"
        Write-Host ""
        Write-Host "Actions:"
        Write-Host "  start     - Start development servers and databases"
        Write-Host "  stop      - Stop all development services"  
        Write-Host "  status    - Show status of all services"
        Write-Host "  install   - Install all project dependencies"
        Write-Host "  reset-db  - Reset development databases (DESTRUCTIVE)"
        Write-Host ""
        Write-Host "Options:"
        Write-Host "  -SkipDocker  - Skip starting Docker services"
        Write-Host "  -TestsOnly   - Only start test runner"
        Write-Host ""
        Write-Host "Examples:"
        Write-Host "  .\scripts\setup-terminals.ps1 -Action start"
        Write-Host "  .\scripts\setup-terminals.ps1 -Action start -SkipDocker"
        Write-Host "  .\scripts\setup-terminals.ps1 -Action status"
    }
}

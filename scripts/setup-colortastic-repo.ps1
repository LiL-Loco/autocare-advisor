# AutoCare Advisor - GitHub Repository Setup für COLORtastic
# Verwendung: .\scripts\setup-colortastic-repo.ps1

# Farbige Ausgabe Funktionen
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

Write-Info "🚀 AutoCare Advisor - GitHub Repository Setup für COLORtastic"
Write-Info "GitHub Account: COLORtastic"
Write-Info "Repository: autocare-advisor"
Write-Host ""

# Prüfen ob wir im richtigen Verzeichnis sind
if (-not (Test-Path ".copilot-instructions.md")) {
    Write-Error "Bitte führen Sie dieses Skript aus dem AutoCare Advisor Projektordner aus!"
    Write-Info "Das Skript sollte vom Verzeichnis mit der .copilot-instructions.md ausgeführt werden"
    exit 1
}

# Git Repository initialisieren (falls noch nicht geschehen)
if (-not (Test-Path ".git")) {
    Write-Info "🔧 Git Repository initialisieren..."
    git init
    Write-Success "Git Repository initialisiert"
} else {
    Write-Info "Git Repository bereits vorhanden"
}

# .gitattributes erstellen
Write-Info "📝 Erstelle .gitattributes..."
@"
# AutoCare Advisor Git Attributes - COLORtastic
* text=auto

# Text files
*.js text
*.jsx text
*.ts text
*.tsx text
*.json text
*.md text
*.yml text
*.yaml text
*.xml text
*.html text
*.css text
*.scss text
*.sql text

# Line endings
*.sh text eol=lf
*.sln text eol=crlf

# Binary files
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.pdf binary
*.zip binary
*.jar binary

# GitHub Linguist
docs/* linguist-documentation
*.md linguist-detectable=true
*.sql linguist-detectable=true
*.js linguist-detectable=true
*.ts linguist-detectable=true
"@ | Out-File -FilePath ".gitattributes" -Encoding UTF8

# Alle Dateien hinzufügen
Write-Info "📦 Alle Dateien zu Git hinzufügen..."
git add .

# Initial Commit
Write-Info "💾 Initial Commit erstellen..."
git commit -m "feat: AutoCare Advisor - Initial Setup für COLORtastic

🚀 Complete B2B SaaS Platform Setup:
- Rule-based recommendation engine (no AI/ML)
- VS Code development environment configured
- Docker compose for development databases
- Comprehensive documentation and guidelines
- GitHub Actions CI/CD pipeline
- Linear integration (Project: 6fa9d986-c3cf-4e35-97ba-97b29e999c53)
- Team CLEANtastic development ready

🎯 Ready for 18-month development phases:
- Phase 1: MVP Foundation (3 months)
- Phase 2: Core Features (5 months)  
- Phase 3: Scale & Optimize (6 months)
- Phase 4: Launch & Growth (4 months)

Repository: https://github.com/COLORtastic/autocare-advisor
Linear: https://linear.app/cleantastic

Closes: CL-1"

Write-Success "Initial Commit erstellt"

# GitHub CLI prüfen
Write-Info "🐙 GitHub CLI Status prüfen..."
try {
    $ghVersion = gh --version
    Write-Success "GitHub CLI verfügbar: $($ghVersion[0])"
    
    # Authentication prüfen
    $authStatus = gh auth status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "GitHub CLI authentifiziert"
        
        # Repository erstellen
        Write-Info "🏗️  GitHub Repository erstellen..."
        
        $createResult = gh repo create "COLORtastic/autocare-advisor" --public --description "AutoCare Advisor - Rule-based Car Care Product Recommendation SaaS Platform. B2B platform for car care manufacturers and retailers. Built with TypeScript, React, Node.js. Team CLEANtastic development." --clone=false
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Repository erstellt: https://github.com/COLORtastic/autocare-advisor"
            
            # Remote hinzufügen
            Write-Info "🔗 Git Remote konfigurieren..."
            git remote add origin https://github.com/COLORtastic/autocare-advisor.git
            
            # Main branch zu GitHub pushen
            Write-Info "📤 Code zu GitHub pushen..."
            git branch -M main
            git push -u origin main
            Write-Success "Code erfolgreich zu GitHub gepusht!"
            
            # Develop Branch erstellen
            Write-Info "🌿 Develop Branch erstellen..."
            git checkout -b develop
            git push -u origin develop
            git checkout main
            Write-Success "Develop Branch erstellt"
            
            # Repository Topics hinzufügen
            Write-Info "🏷️  Repository Topics hinzufügen..."
            gh repo edit COLORtastic/autocare-advisor --add-topic="autocare"
            gh repo edit COLORtastic/autocare-advisor --add-topic="car-care"
            gh repo edit COLORtastic/autocare-advisor --add-topic="b2b-saas"
            gh repo edit COLORtastic/autocare-advisor --add-topic="recommendation-engine"
            gh repo edit COLORtastic/autocare-advisor --add-topic="rule-based"
            gh repo edit COLORtastic/autocare-advisor --add-topic="typescript"
            gh repo edit COLORtastic/autocare-advisor --add-topic="react"
            gh repo edit COLORtastic/autocare-advisor --add-topic="nodejs"
            gh repo edit COLORtastic/autocare-advisor --add-topic="mongodb"
            gh repo edit COLORtastic/autocare-advisor --add-topic="postgresql"
            Write-Success "Repository Topics hinzugefügt"
            
        } else {
            Write-Error "Repository-Erstellung fehlgeschlagen"
            Write-Info "Manueller Ansatz:"
            Write-Host "1. Gehen Sie zu https://github.com/new"
            Write-Host "2. Repository Name: autocare-advisor"
            Write-Host "3. Description: AutoCare Advisor - Rule-based Car Care Product Recommendation SaaS Platform"
            Write-Host "4. Public Repository"
            Write-Host "5. Danach: git remote add origin https://github.com/COLORtastic/autocare-advisor.git"
            Write-Host "6. Und: git push -u origin main"
        }
        
    } else {
        Write-Warning "GitHub CLI nicht authentifiziert"
        Write-Info "Bitte authentifizieren: gh auth login"
        Write-Info "Danach dieses Skript erneut ausführen"
    }
    
} catch {
    Write-Warning "GitHub CLI nicht installiert"
    Write-Info "GitHub CLI installieren:"
    Write-Host "- Download: https://cli.github.com/"
    Write-Host "- Oder: winget install --id GitHub.cli"
    Write-Host ""
    Write-Info "Manueller GitHub Repository Setup:"
    Write-Host "1. Gehen Sie zu https://github.com/new"
    Write-Host "2. Repository Name: autocare-advisor"
    Write-Host "3. Owner: COLORtastic"
    Write-Host "4. Public Repository"
    Write-Host "5. Erstellen und dann:"
    Write-Host "   git remote add origin https://github.com/COLORtastic/autocare-advisor.git"
    Write-Host "   git branch -M main"
    Write-Host "   git push -u origin main"
}

Write-Host ""
Write-Success "🎉 AutoCare Advisor Setup für COLORtastic abgeschlossen!"
Write-Host ""
Write-Info "📋 Nächste Schritte:"
Write-Host "1. 🌐 Repository besuchen: https://github.com/COLORtastic/autocare-advisor"
Write-Host "2. 🔧 GitHub Secrets konfigurieren (für CI/CD):"
Write-Host "   - AWS_ACCESS_KEY_ID"
Write-Host "   - AWS_SECRET_ACCESS_KEY"  
Write-Host "   - LINEAR_API_KEY"
Write-Host "   - CODECOV_TOKEN"
Write-Host "3. 👥 Team-Mitglieder einladen (falls gewünscht)"
Write-Host "4. 🔗 Linear Workspace mit GitHub verknüpfen"
Write-Host "5. 🚀 Development starten:"
Write-Host "   npm run install:all"
Write-Host "   npm run dev"
Write-Host ""
Write-Info "📚 Wichtige Links:"
Write-Host "- GitHub Repository: https://github.com/COLORtastic/autocare-advisor"
Write-Host "- Linear Project: https://linear.app/cleantastic (Project ID: 6fa9d986-c3cf-4e35-97ba-97b29e999c53)"
Write-Host "- VS Code: Öffnen Sie das Projekt und installieren Sie empfohlene Extensions"
Write-Host ""
Write-Success "Viel Erfolg mit AutoCare Advisor, Team CLEANtastic! 🚀"
Write-Host ""
Write-Info "💡 Tipp: Verwenden Sie 'git status' um den aktuellen Git-Status zu prüfen"

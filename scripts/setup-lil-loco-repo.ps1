# AutoCare Advisor - GitHub Repository Setup für LiL-Loco
# Verwendung: .\scripts\setup-lil-loco-repo.ps1

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

Write-Info "🚀 AutoCare Advisor - GitHub Repository Setup für LiL-Loco"
Write-Info "GitHub Account: LiL-Loco"
Write-Info "Repository: autocare-advisor"
Write-Host ""

# Prüfen ob wir im richtigen Verzeichnis sind
if (-not (Test-Path ".copilot-instructions.md")) {
    Write-Error "Bitte führen Sie dieses Skript aus dem AutoCare Advisor Projektordner aus!"
    Write-Info "Das Skript sollte vom Verzeichnis mit der .copilot-instructions.md ausgeführt werden"
    exit 1
}

# Aktuellen Git Remote prüfen
$currentRemote = git remote get-url origin 2>$null
if ($currentRemote) {
    Write-Info "🔗 Aktueller Git Remote: $currentRemote"
    if ($currentRemote -notlike "*LiL-Loco*") {
        Write-Warning "Git Remote zeigt nicht auf LiL-Loco Account"
        Write-Info "Aktualisiere Remote URL..."
        git remote set-url origin https://github.com/LiL-Loco/autocare-advisor.git
        Write-Success "Remote URL auf LiL-Loco aktualisiert"
    }
} else {
    Write-Info "🔧 Kein Git Remote gefunden, füge hinzu..."
    git remote add origin https://github.com/LiL-Loco/autocare-advisor.git
    Write-Success "Git Remote für LiL-Loco hinzugefügt"
}

# GitHub CLI prüfen
Write-Info "🐙 GitHub CLI Status prüfen..."
try {
    $ghVersion = gh --version
    Write-Success "GitHub CLI verfügbar: $($ghVersion[0])"
    
    # Authentication prüfen und aktuellen User anzeigen
    $authStatus = gh auth status 2>&1
    if ($LASTEXITCODE -eq 0) {
        $currentUser = gh api user --jq .login
        Write-Success "GitHub CLI authentifiziert als: $currentUser"
        
        # Repository erstellen für den aktuell authentifizierten User
        Write-Info "🏗️  GitHub Repository erstellen für $currentUser..."
        
        $createResult = gh repo create "autocare-advisor" --public --description "AutoCare Advisor - Rule-based Car Care Product Recommendation SaaS Platform. B2B platform for car care manufacturers and retailers. Built with TypeScript, React, Node.js. Team CLEANtastic development." --clone=false
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Repository erstellt: https://github.com/$currentUser/autocare-advisor"
            
            # Remote URL entsprechend anpassen
            git remote set-url origin https://github.com/$currentUser/autocare-advisor.git
            Write-Info "🔗 Git Remote aktualisiert auf: https://github.com/$currentUser/autocare-advisor.git"
            
            # Main branch zu GitHub pushen
            Write-Info "📤 Code zu GitHub pushen..."
            git branch -M main
            $pushResult = git push -u origin main 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Code erfolgreich zu GitHub gepusht!"
            } else {
                Write-Warning "Push möglicherweise fehlgeschlagen: $pushResult"
                Write-Info "Versuchen Sie manuell: git push -u origin main"
            }
            
            # Develop Branch erstellen
            Write-Info "🌿 Develop Branch erstellen..."
            git checkout -b develop
            $devPushResult = git push -u origin develop 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Develop Branch erstellt und gepusht"
            } else {
                Write-Warning "Develop Branch Push fehlgeschlagen: $devPushResult"
            }
            git checkout main
            
            # Repository Topics hinzufügen
            Write-Info "🏷️  Repository Topics hinzufügen..."
            try {
                gh repo edit "$currentUser/autocare-advisor" --add-topic="autocare"
                gh repo edit "$currentUser/autocare-advisor" --add-topic="car-care"
                gh repo edit "$currentUser/autocare-advisor" --add-topic="b2b-saas"
                gh repo edit "$currentUser/autocare-advisor" --add-topic="recommendation-engine"
                gh repo edit "$currentUser/autocare-advisor" --add-topic="rule-based"
                gh repo edit "$currentUser/autocare-advisor" --add-topic="typescript"
                gh repo edit "$currentUser/autocare-advisor" --add-topic="react"
                gh repo edit "$currentUser/autocare-advisor" --add-topic="nodejs"
                gh repo edit "$currentUser/autocare-advisor" --add-topic="mongodb"
                gh repo edit "$currentUser/autocare-advisor" --add-topic="postgresql"
                Write-Success "Repository Topics hinzugefügt"
            } catch {
                Write-Warning "Topics hinzufügen teilweise fehlgeschlagen: $_"
            }
            
            # Repository Settings
            Write-Info "⚙️  Repository Einstellungen konfigurieren..."
            try {
                gh repo edit "$currentUser/autocare-advisor" --enable-issues=true
                gh repo edit "$currentUser/autocare-advisor" --enable-projects=true
                gh repo edit "$currentUser/autocare-advisor" --enable-wiki=true
                Write-Success "Repository Einstellungen konfiguriert"
            } catch {
                Write-Warning "Repository Einstellungen teilweise fehlgeschlagen: $_"
            }
            
        } else {
            Write-Error "Repository-Erstellung fehlgeschlagen"
            Write-Info "Fehler Details: $createResult"
            Write-Info ""
            Write-Info "Manueller Ansatz:"
            Write-Host "1. Gehen Sie zu https://github.com/new"
            Write-Host "2. Repository Name: autocare-advisor"
            Write-Host "3. Description: AutoCare Advisor - Rule-based Car Care Product Recommendation SaaS Platform"
            Write-Host "4. Public Repository"
            Write-Host "5. Danach: git push -u origin main"
        }
        
    } else {
        Write-Warning "GitHub CLI nicht authentifiziert"
        Write-Info "Bitte authentifizieren: gh auth login"
        Write-Info "Danach dieses Skript erneut ausführen"
    }
    
} catch {
    Write-Warning "GitHub CLI nicht installiert oder nicht verfügbar"
    Write-Info "GitHub CLI installieren:"
    Write-Host "- Download: https://cli.github.com/"
    Write-Host "- Oder: winget install --id GitHub.cli"
    Write-Host ""
    Write-Info "Manueller GitHub Repository Setup:"
    Write-Host "1. Gehen Sie zu https://github.com/new"
    Write-Host "2. Repository Name: autocare-advisor"
    Write-Host "3. Public Repository"
    Write-Host "4. Erstellen und dann:"
    Write-Host "   git remote add origin https://github.com/LiL-Loco/autocare-advisor.git"
    Write-Host "   git branch -M main"
    Write-Host "   git push -u origin main"
}

# Git Status anzeigen
Write-Info "📊 Aktueller Git Status:"
git status --short
Write-Info "📍 Aktuelle Branches:"
git branch -a

Write-Host ""
Write-Success "🎉 AutoCare Advisor Setup abgeschlossen!"
Write-Host ""
Write-Info "📋 Nächste Schritte:"
$finalUser = gh api user --jq .login 2>/dev/null
if ($finalUser) {
    Write-Host "1. 🌐 Repository besuchen: https://github.com/$finalUser/autocare-advisor"
} else {
    Write-Host "1. 🌐 Repository besuchen: https://github.com/LiL-Loco/autocare-advisor"
}
Write-Host "2. 🔧 GitHub Secrets konfigurieren (Settings > Secrets and variables > Actions):"
Write-Host "   - AWS_ACCESS_KEY_ID"
Write-Host "   - AWS_SECRET_ACCESS_KEY"  
Write-Host "   - LINEAR_API_KEY"
Write-Host "   - CODECOV_TOKEN"
Write-Host "   - SNYK_TOKEN"
Write-Host "3. 👥 Collaborators einladen (falls gewünscht)"
Write-Host "4. 🔗 Linear Workspace mit GitHub verknüpfen"
Write-Host "5. 🚀 Development starten:"
Write-Host "   npm run install:all"
Write-Host "   npm run dev"
Write-Host ""
Write-Info "📚 Wichtige Links:"
if ($finalUser) {
    Write-Host "- GitHub Repository: https://github.com/$finalUser/autocare-advisor"
} else {
    Write-Host "- GitHub Repository: https://github.com/LiL-Loco/autocare-advisor"
}
Write-Host "- Linear Project: https://linear.app/cleantastic (Project ID: 6fa9d986-c3cf-4e35-97ba-97b29e999c53)"
Write-Host "- VS Code: Öffnen Sie das Projekt und installieren Sie empfohlene Extensions"
Write-Host ""
Write-Success "Viel Erfolg mit AutoCare Advisor! 🚀"
Write-Host ""
Write-Info "💡 Tipp: Verwenden Sie 'git remote -v' um die aktuellen Remote URLs zu prüfen"

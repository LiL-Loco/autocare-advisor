#!/usr/bin/env pwsh
# 🔧 AutoCare Advisor - Temporäre CI/CD Deaktivierung
# Deaktiviert CI/CD Pipeline bis Secrets konfiguriert sind

Write-Host "🔧 Temporäre CI/CD Deaktivierung..." -ForegroundColor Yellow
Write-Host "Bis GitHub Secrets konfiguriert sind" -ForegroundColor Gray

# GitHub Workflow temporär deaktivieren
$workflowPath = ".github/workflows/ci-cd.yml"
$backupPath = ".github/workflows/ci-cd.yml.backup"

if (Test-Path $workflowPath) {
    Write-Host "💾 Backup erstellen: $backupPath" -ForegroundColor Blue
    Copy-Item $workflowPath $backupPath
    
    Write-Host "⏸️  CI/CD Workflow deaktivieren..." -ForegroundColor Blue
    Remove-Item $workflowPath
    
    # Commit der Änderung
    git add -A
    git commit -m "⏸️ Temporarily disable CI/CD until secrets are configured

- Backup workflow as ci-cd.yml.backup
- Enables immediate development without secret setup
- Re-enable with: git mv .github/workflows/ci-cd.yml.backup .github/workflows/ci-cd.yml"
    
    git push origin main
    
    Write-Host "✅ CI/CD temporär deaktiviert" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Jetzt können Sie sofort entwickeln:" -ForegroundColor Green
    Write-Host "   npm run install:all" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "🔑 Später reaktivieren mit:" -ForegroundColor Yellow
    Write-Host "   git mv .github/workflows/ci-cd.yml.backup .github/workflows/ci-cd.yml" -ForegroundColor White
    Write-Host "   git commit -m 'Re-enable CI/CD with secrets configured'" -ForegroundColor White
    Write-Host "   git push origin main" -ForegroundColor White
} else {
    Write-Host "❌ Workflow nicht gefunden: $workflowPath" -ForegroundColor Red
}

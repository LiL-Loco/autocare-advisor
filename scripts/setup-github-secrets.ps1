#!/usr/bin/env pwsh
<#
.SYNOPSIS
    AutoCare Advisor - GitHub Secrets Setup Script
.DESCRIPTION
    Hilft beim Einrichten der erforderlichen GitHub Secrets für CI/CD Pipeline
.AUTHOR
    LiL-Loco
#>

Write-Host "🔑 AutoCare Advisor - GitHub Secrets Setup" -ForegroundColor Cyan
Write-Host "Repository: LiL-Loco/autocare-advisor" -ForegroundColor Yellow
Write-Host ""

# GitHub CLI Check
if (!(Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI nicht gefunden. Bitte installieren: https://cli.github.com/" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Erforderliche Secrets für AutoCare Advisor:" -ForegroundColor Green
Write-Host ""

Write-Host "1. 🔗 AWS Keys (für Deployment)" -ForegroundColor Yellow
Write-Host "   - AWS_ACCESS_KEY_ID: AWS IAM User Access Key"
Write-Host "   - AWS_SECRET_ACCESS_KEY: AWS IAM User Secret Key"
Write-Host "   📍 Erstellen: https://console.aws.amazon.com/iam/home#/users"
Write-Host ""

Write-Host "2. 🎯 Linear API Key (für Project Management)" -ForegroundColor Yellow  
Write-Host "   - LINEAR_API_KEY: Linear Workspace API Token"
Write-Host "   📍 Erstellen: https://linear.app/cleantastic/settings/api"
Write-Host ""

Write-Host "3. 📊 Code Coverage Token (optional)" -ForegroundColor Yellow
Write-Host "   - CODECOV_TOKEN: Codecov Repository Token"
Write-Host "   📍 Erstellen: https://codecov.io/gh/LiL-Loco/autocare-advisor"
Write-Host ""

Write-Host "4. 🔒 Security Scanning Token (optional)" -ForegroundColor Yellow
Write-Host "   - SNYK_TOKEN: Snyk Authentication Token"
Write-Host "   📍 Erstellen: https://app.snyk.io/account"
Write-Host ""

Write-Host "🚀 Quick Start Option:" -ForegroundColor Green
Write-Host "Für sofortigen Start können Sie temporäre Werte verwenden:"
Write-Host ""

$useQuickStart = Read-Host "Möchten Sie temporäre Test-Werte für den Quick Start verwenden? (y/N)"

if ($useQuickStart.ToLower() -eq 'y' -or $useQuickStart.ToLower() -eq 'yes') {
    Write-Host ""
    Write-Host "🔧 Setze temporäre Test-Secrets..." -ForegroundColor Cyan
    
    try {
        # Temporäre Werte für Development/Testing
        gh secret set AWS_ACCESS_KEY_ID --body "temp-development-key" --repo LiL-Loco/autocare-advisor
        gh secret set AWS_SECRET_ACCESS_KEY --body "temp-development-secret" --repo LiL-Loco/autocare-advisor  
        gh secret set LINEAR_API_KEY --body "temp-linear-key" --repo LiL-Loco/autocare-advisor
        gh secret set CODECOV_TOKEN --body "temp-codecov-disabled" --repo LiL-Loco/autocare-advisor
        gh secret set SNYK_TOKEN --body "temp-snyk-disabled" --repo LiL-Loco/autocare-advisor
        
        Write-Host "✅ Temporäre Secrets gesetzt!" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  WICHTIG: Ersetzen Sie diese durch echte Werte vor Production Deployment!" -ForegroundColor Red
        Write-Host ""
        Write-Host "🎯 Nächste Schritte:" -ForegroundColor Yellow
        Write-Host "1. npm run install:all && npm run dev"
        Write-Host "2. Echte AWS Keys für Production erstellen"
        Write-Host "3. Linear API Key aus https://linear.app/cleantastic/settings/api holen"
        Write-Host ""
        
    } catch {
        Write-Host "❌ Fehler beim Setzen der Secrets: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host ""
    Write-Host "💡 Manuelle Secret-Erstellung:" -ForegroundColor Cyan
    Write-Host "1. Besuchen Sie: https://github.com/LiL-Loco/autocare-advisor/settings/secrets/actions"
    Write-Host "2. Klicken Sie 'New repository secret' für jeden Secret"
    Write-Host "3. Verwenden Sie die oben genannten Links zur Key-Erstellung"
    Write-Host ""
    Write-Host "📋 Secret Names (genau so verwenden):"
    Write-Host "   - AWS_ACCESS_KEY_ID"
    Write-Host "   - AWS_SECRET_ACCESS_KEY"  
    Write-Host "   - LINEAR_API_KEY"
    Write-Host "   - CODECOV_TOKEN"
    Write-Host "   - SNYK_TOKEN"
}

Write-Host ""
Write-Host "🔗 Nützliche Links:" -ForegroundColor Green
Write-Host "• GitHub Secrets: https://github.com/LiL-Loco/autocare-advisor/settings/secrets/actions"
Write-Host "• AWS Free Tier: https://aws.amazon.com/de/free/"
Write-Host "• Linear Settings: https://linear.app/cleantastic/settings/api"
Write-Host "• Codecov Setup: https://codecov.io/gh/LiL-Loco/autocare-advisor"
Write-Host "• Snyk Account: https://app.snyk.io/account"
Write-Host ""
Write-Host "✅ AutoCare Advisor ist bereit für Development! 🚀" -ForegroundColor Green

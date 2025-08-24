# AutoCare Advisor - GitHub Repository Setup Script
# Team: CLEANtastic
# Usage: .\scripts\create-github-repo.ps1

param(
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "autocare-advisor",
    
    [Parameter(Mandatory=$false)]
    [string]$Organization = "CLEANtastic",
    
    [Parameter(Mandatory=$false)]
    [string]$Description = "AutoCare Advisor - Rule-based Car Care Product Recommendation SaaS Platform",
    
    [Parameter(Mandatory=$false)]
    [switch]$Private = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipGitInit = $false
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

function Initialize-GitRepository {
    Write-Info "🚀 Initializing Git repository..."
    
    # Check if already a git repository
    if (Test-Path ".git") {
        Write-Warning "Git repository already exists!"
        $overwrite = Read-Host "Do you want to reinitialize? This will remove git history (y/N)"
        if ($overwrite -eq 'y' -or $overwrite -eq 'Y') {
            Remove-Item -Recurse -Force ".git"
            Write-Info "Removed existing git repository"
        } else {
            Write-Info "Keeping existing git repository"
            return
        }
    }
    
    # Initialize git repository
    git init
    Write-Success "Git repository initialized"
    
    # Create .gitattributes
    @"
# AutoCare Advisor Git Attributes
# Handle line endings automatically for files detected as text
* text=auto

# Explicitly declare text files you want to always be normalized and converted 
# to native line endings on checkout.
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

# Declare files that will always have CRLF line endings on checkout.
*.sln text eol=crlf

# Declare files that will always have LF line endings on checkout.
*.sh text eol=lf

# Denote all files that are truly binary and should not be modified.
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.mov binary
*.mp4 binary
*.mp3 binary
*.flv binary
*.fla binary
*.swf binary
*.gz binary
*.zip binary
*.7z binary
*.ttf binary
*.eot binary
*.woff binary
*.woff2 binary
*.pyc binary
*.pdf binary
*.ez binary
*.bz2 binary
*.swp binary
*.jar binary

# GitHub Linguist overrides
docs/* linguist-documentation
*.md linguist-detectable=true
*.sql linguist-detectable=true
*.js linguist-detectable=true
*.ts linguist-detectable=true
"@ | Out-File -FilePath ".gitattributes" -Encoding UTF8
    
    Write-Success "Created .gitattributes"
    
    # Add all files
    git add .
    Write-Info "Added all files to git"
    
    # Initial commit
    git commit -m "feat: initial AutoCare Advisor project setup

- Complete VS Code configuration with debugging and tasks
- Rule-based recommendation engine architecture
- B2B SaaS platform structure ready for development
- Linear integration (Project ID: 6fa9d986-c3cf-4e35-97ba-97b29e999c53)
- Team CLEANtastic development environment
- Comprehensive documentation and contributing guidelines
- Docker compose setup for development databases
- GitHub Actions CI/CD pipeline ready
- Security policy and issue templates

Closes: CL-1 (Initial Project Setup)"
    
    Write-Success "Created initial commit"
}

function Create-GitHubRepository {
    param([string]$repoName, [string]$org, [string]$desc, [bool]$isPrivate)
    
    Write-Info "🐙 Creating GitHub repository..."
    
    # Check if GitHub CLI is installed
    try {
        $ghVersion = gh --version
        Write-Success "GitHub CLI detected: $($ghVersion[0])"
    } catch {
        Write-Error "GitHub CLI not found! Please install it first:"
        Write-Info "Download from: https://cli.github.com/"
        Write-Info "Or use winget: winget install --id GitHub.cli"
        return $false
    }
    
    # Check authentication
    try {
        $authStatus = gh auth status 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "GitHub CLI not authenticated!"
            Write-Info "Please authenticate first: gh auth login"
            return $false
        }
        Write-Success "GitHub CLI authenticated"
    } catch {
        Write-Error "Failed to check GitHub authentication"
        return $false
    }
    
    # Create repository
    $visibility = if ($isPrivate) { "private" } else { "public" }
    $repoUrl = if ($org) { "https://github.com/$org/$repoName" } else { "" }
    
    try {
        if ($org) {
            gh repo create "$org/$repoName" --$visibility --description "$desc" --clone=false
        } else {
            gh repo create "$repoName" --$visibility --description "$desc" --clone=false  
        }
        Write-Success "GitHub repository created: $repoUrl"
        return $true
    } catch {
        Write-Error "Failed to create GitHub repository: $_"
        return $false
    }
}

function Setup-GitRemote {
    param([string]$repoName, [string]$org)
    
    Write-Info "🔗 Setting up git remote..."
    
    $repoUrl = if ($org) { 
        "https://github.com/$org/$repoName.git" 
    } else { 
        "https://github.com/$(gh api user --jq .login)/$repoName.git"
    }
    
    # Add origin remote
    try {
        git remote add origin $repoUrl
        Write-Success "Added origin remote: $repoUrl"
    } catch {
        Write-Warning "Remote origin might already exist"
        git remote set-url origin $repoUrl
        Write-Info "Updated origin remote: $repoUrl"
    }
    
    # Push to GitHub
    try {
        git push -u origin main
        Write-Success "Pushed code to GitHub!"
    } catch {
        Write-Error "Failed to push to GitHub: $_"
        Write-Info "You may need to push manually: git push -u origin main"
    }
}

function Setup-GitHubSettings {
    param([string]$repoName, [string]$org)
    
    Write-Info "⚙️  Configuring GitHub repository settings..."
    
    $fullRepoName = if ($org) { "$org/$repoName" } else { $repoName }
    
    try {
        # Enable Issues
        gh repo edit $fullRepoName --enable-issues=true
        
        # Enable Projects
        gh repo edit $fullRepoName --enable-projects=true
        
        # Enable Wiki
        gh repo edit $fullRepoName --enable-wiki=true
        
        # Set default branch to main
        gh repo edit $fullRepoName --default-branch=main
        
        # Add topics/tags
        gh repo edit $fullRepoName --add-topic="autocare"
        gh repo edit $fullRepoName --add-topic="car-care"
        gh repo edit $fullRepoName --add-topic="b2b-saas"
        gh repo edit $fullRepoName --add-topic="recommendation-engine"
        gh repo edit $fullRepoName --add-topic="typescript"
        gh repo edit $fullRepoName --add-topic="react"
        gh repo edit $fullRepoName --add-topic="nodejs"
        
        Write-Success "Repository settings configured"
    } catch {
        Write-Warning "Some repository settings might not be applied: $_"
    }
}

function Create-DevelopmentBranch {
    Write-Info "🌿 Creating development branch..."
    
    try {
        git checkout -b develop
        git push -u origin develop
        Write-Success "Created and pushed 'develop' branch"
        
        # Switch back to main
        git checkout main
        Write-Info "Switched back to 'main' branch"
    } catch {
        Write-Warning "Failed to create develop branch: $_"
    }
}

function Setup-BranchProtection {
    param([string]$repoName, [string]$org)
    
    Write-Info "🛡️  Setting up branch protection rules..."
    
    $fullRepoName = if ($org) { "$org/$repoName" } else { $repoName }
    
    try {
        # Protect main branch
        gh api repos/$fullRepoName/branches/main/protection `
            --method PUT `
            --field required_status_checks='{"strict":true,"contexts":["🧹 Lint & Format Check","🧪 Tests & Coverage","⚡ Performance Tests"]}' `
            --field enforce_admins=true `
            --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' `
            --field restrictions=null
            
        Write-Success "Main branch protection enabled"
    } catch {
        Write-Warning "Branch protection setup failed (may require admin rights): $_"
    }
}

function Display-NextSteps {
    param([string]$repoName, [string]$org)
    
    $repoUrl = if ($org) { "https://github.com/$org/$repoName" } else { "https://github.com/$(gh api user --jq .login 2>/dev/null)/$repoName" }
    
    Write-Host ""
    Write-Success "🎉 AutoCare Advisor GitHub Repository Setup Complete!"
    Write-Host ""
    Write-Info "📋 Next Steps:"
    Write-Host "1. 🌐 Visit your repository: $repoUrl"
    Write-Host "2. 🔧 Set up GitHub Secrets for CI/CD:"
    Write-Host "   - AWS_ACCESS_KEY_ID"
    Write-Host "   - AWS_SECRET_ACCESS_KEY"
    Write-Host "   - LINEAR_API_KEY"
    Write-Host "   - CODECOV_TOKEN"
    Write-Host "   - SNYK_TOKEN"
    Write-Host "3. 👥 Invite team members to the repository"
    Write-Host "4. 🔗 Link Linear workspace to GitHub repository"
    Write-Host "5. 🚀 Start development with: npm run dev"
    Write-Host ""
    Write-Info "📚 Resources:"
    Write-Host "- Repository: $repoUrl"
    Write-Host "- Linear Project: https://linear.app/cleantastic"
    Write-Host "- VS Code: Open project and install recommended extensions"
    Write-Host ""
    Write-Success "Happy coding, Team CLEANtastic! 🚀"
}

# Main execution
Write-Info "🚀 AutoCare Advisor - GitHub Repository Setup"
Write-Info "Team: CLEANtastic"
Write-Info "Project: AutoCare Advisor SaaS Development Platform"
Write-Host ""

# Check prerequisites
if (-not (Test-Path ".copilot-instructions.md")) {
    Write-Error "Please run this script from the AutoCare Advisor project root!"
    Write-Info "The script should be run from the directory containing .copilot-instructions.md"
    exit 1
}

# Initialize Git repository
if (-not $SkipGitInit) {
    Initialize-GitRepository
} else {
    Write-Info "Skipping git initialization (--SkipGitInit flag used)"
}

# Create GitHub repository
$repoCreated = Create-GitHubRepository -repoName $RepoName -org $Organization -desc $Description -isPrivate $Private

if ($repoCreated) {
    # Set up git remote and push
    Setup-GitRemote -repoName $RepoName -org $Organization
    
    # Configure repository settings
    Setup-GitHubSettings -repoName $RepoName -org $Organization
    
    # Create development branch
    Create-DevelopmentBranch
    
    # Set up branch protection (may fail without admin rights)
    Setup-BranchProtection -repoName $RepoName -org $Organization
    
    # Display next steps
    Display-NextSteps -repoName $RepoName -org $Organization
} else {
    Write-Error "Repository creation failed. Please create the repository manually."
    Write-Info "Manual steps:"
    Write-Host "1. Go to GitHub and create a new repository"
    Write-Host "2. Add the remote: git remote add origin <repo-url>"
    Write-Host "3. Push the code: git push -u origin main"
}

Write-Host ""
Write-Info "Script completed. Check above for any warnings or errors."

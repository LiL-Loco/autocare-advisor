# PowerShell Script to convert all SVG files to React components
$SvgPath = "e:\00000001_TRIXI\CLEAN\docs\SVG"
$IconPath = "e:\00000001_TRIXI\CLEAN\frontend\src\components\icons"

# Ensure icon directory exists
if (!(Test-Path $IconPath)) {
    New-Item -ItemType Directory -Path $IconPath -Force
}

# Function to convert kebab-case or space-separated names to PascalCase
function ConvertTo-PascalCase {
    param($Name)
    
    $Name = $Name -replace '[\s\-_\.]', ' '
    $Words = $Name -split ' '
    $PascalCase = ''
    
    foreach ($Word in $Words) {
        if ($Word -ne '') {
            $PascalCase += $Word.Substring(0,1).ToUpper() + $Word.Substring(1).ToLower()
        }
    }
    
    return $PascalCase
}

# Function to extract path elements from SVG
function Extract-SvgPaths {
    param($SvgContent)
    
    $Paths = @()
    $PathMatches = [regex]::Matches($SvgContent, '<path[^>]*d="([^"]*)"[^>]*/?>')
    
    foreach ($Match in $PathMatches) {
        $PathElement = $Match.Value -replace 'class="[^"]*"', ''
        $PathElement = $PathElement -replace '\s+', ' '
        $PathElement = $PathElement.Trim()
        $Paths += "    $PathElement"
    }
    
    return $Paths -join "`n"
}

# Function to create React component
function Create-ReactComponent {
    param($ComponentName, $Paths, $ViewBox = "0 0 24 24")
    
    return @"
import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

const ${ComponentName}Icon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="$ViewBox"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
$Paths
  </svg>
);

export default ${ComponentName}Icon;
"@
}
}

# Process all SVG files
$SvgFiles = Get-ChildItem -Path $SvgPath -Filter "*.svg"
$ExportLines = @("// Auto-generated icon exports")

foreach ($SvgFile in $SvgFiles) {
    Write-Host "Processing $($SvgFile.Name)..." -ForegroundColor Green
    
    $SvgContent = Get-Content $SvgFile.FullName -Raw
    
    # Extract viewBox
    $ViewBoxMatch = [regex]::Match($SvgContent, 'viewBox="([^"]*)"')
    $ViewBox = if ($ViewBoxMatch.Success) { $ViewBoxMatch.Groups[1].Value } else { "0 0 24 24" }
    
    # Extract paths
    $Paths = Extract-SvgPaths $SvgContent
    
    if ($Paths) {
        # Generate component name
        $BaseName = [System.IO.Path]::GetFileNameWithoutExtension($SvgFile.Name)
        $ComponentName = ConvertTo-PascalCase $BaseName
        $FileName = "${ComponentName}Icon.tsx"
        
        # Create React component
        $ComponentCode = Create-ReactComponent $ComponentName $Paths $ViewBox
        
        # Write file
        $ComponentPath = Join-Path $IconPath $FileName
        Set-Content -Path $ComponentPath -Value $ComponentCode -Encoding UTF8
        
        # Add to exports
        $ExportLines += "export { default as ${ComponentName}Icon } from './${ComponentName}Icon';"
        
        Write-Host "✓ Created ${ComponentName}Icon" -ForegroundColor Cyan
    }
    else {
        Write-Host "⚠ No paths found in $($SvgFile.Name)" -ForegroundColor Yellow
    }
}

# Create index file
$IndexContent = $ExportLines -join "`n"
Set-Content -Path (Join-Path $IconPath "index.ts") -Value $IndexContent -Encoding UTF8

Write-Host "`n🎉 Successfully generated $($SvgFiles.Count) icon components!" -ForegroundColor Green
Write-Host "📁 Icons are available at: $IconPath" -ForegroundColor Green

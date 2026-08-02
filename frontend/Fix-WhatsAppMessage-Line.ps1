<#
    Fix : Ligne du message WhatsApp cassee (backtick mal place) dans Admin.js
    --------------------------------------------------------------
    A executer depuis la racine du dossier frontend/
#>

$ErrorActionPreference = "Stop"

$AdminFile = Join-Path $PSScriptRoot "src\pages\admin\Admin.js"

if (-not (Test-Path $AdminFile)) {
    Write-Host "Fichier introuvable : $AdminFile" -ForegroundColor Red
    Write-Host "Execute ce script depuis le dossier frontend/ (celui qui contient src/)." -ForegroundColor Yellow
    exit 1
}

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupPath = "$AdminFile.bak_$Timestamp"
Copy-Item $AdminFile $BackupPath
Write-Host "Backup cree : $(Split-Path $BackupPath -Leaf)" -ForegroundColor Green

$raw = [System.IO.File]::ReadAllText($AdminFile, (New-Object System.Text.UTF8Encoding($false)))
$norm = $raw -replace "`r`n", "`n"

$oldLine = '      `Bonjour ${u.username}, c''est la reception administrative MoneyGreen ! Nous vous attendons  sur la plateforme pour un entretien.` : https://moneygreeny.vercel.app`'
$newLine = '      `Bonjour ${u.username}, c''est la reception administrative MoneyGreen ! Nous vous attendons sur la plateforme pour un entretien. https://moneygreeny.vercel.app`'

if ($norm -notmatch [regex]::Escape($oldLine)) {
    Write-Host "Ligne exacte non trouvee. Le fichier a peut-etre deja change." -ForegroundColor Red
    Write-Host "Aucune modification faite." -ForegroundColor Yellow
    exit 1
}

$norm = $norm.Replace($oldLine, $newLine)
[System.IO.File]::WriteAllText($AdminFile, $norm, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "Ligne corrigee dans Admin.js" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaine etape : commit + push." -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host "  git commit -m fix-message-whatsapp-admin"
Write-Host "  git push"
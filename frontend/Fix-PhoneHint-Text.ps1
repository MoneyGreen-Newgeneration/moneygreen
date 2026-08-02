<#
    Fix : Texte d'aide WhatsApp (reformulation + faute d'accent corrigee)
    --------------------------------------------------------------
    A executer depuis la racine du dossier frontend/
#>

$ErrorActionPreference = "Stop"

$TranslationsFile = Join-Path $PSScriptRoot "src\context\translations.js"

if (-not (Test-Path $TranslationsFile)) {
    Write-Host "Fichier introuvable : $TranslationsFile" -ForegroundColor Red
    Write-Host "Execute ce script depuis le dossier frontend/ (celui qui contient src/)." -ForegroundColor Yellow
    exit 1
}

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupPath = "$TranslationsFile.bak_$Timestamp"
Copy-Item $TranslationsFile $BackupPath
Write-Host "Backup cree : $(Split-Path $BackupPath -Leaf)" -ForegroundColor Green

$raw = [System.IO.File]::ReadAllText($TranslationsFile, (New-Object System.Text.UTF8Encoding($false)))
$norm = $raw -replace "`r`n", "`n"

$eacute = [System.Char]::ConvertFromUtf32(0x00E9)
$egrave = [System.Char]::ConvertFromUtf32(0x00E8)
$agrave = [System.Char]::ConvertFromUtf32(0x00E0)

$oldText = 'Ce num' + $eacute + 'ro doit ' + $egrave + 'tre votre num' + $eacute + 'ro WhatsApp, il nous servira ' + $egrave + ' vous contacter.'
$newText = 'Ce num' + $eacute + 'ro doit avoir un compte WhatsApp afin de vous contacter.'

if ($norm -notmatch [regex]::Escape($oldText)) {
    Write-Host "Ancienne phrase non trouvee telle quelle. Aucune modification faite." -ForegroundColor Red
    exit 1
}

$norm = $norm.Replace($oldText, $newText)
[System.IO.File]::WriteAllText($TranslationsFile, $norm, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "Texte d'aide WhatsApp corrige (FR)" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaine etape : commit + push." -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host "  git commit -m fix-texte-aide-whatsapp"
Write-Host "  git push"
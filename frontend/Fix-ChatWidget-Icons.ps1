<#
    Fix : Icones cassees (bouton flottant du chat) dans ChatWidget.js
    --------------------------------------------------------------
    Le bouton qui ouvre/ferme le chat affichait un texte corrompu
    (mojibake) au lieu de l'icone croix (fermer) ou bulle (ouvrir).
    Version robuste : les emojis sont reconstruits via leur code
    Unicode, pas copies-colles directement dans ce script.

    A executer depuis la racine du dossier frontend/
#>

$ErrorActionPreference = "Stop"

$TargetFile = Join-Path $PSScriptRoot "src\components\chat\ChatWidget.js"

if (-not (Test-Path $TargetFile)) {
    Write-Host "Fichier introuvable : $TargetFile" -ForegroundColor Red
    Write-Host "Execute ce script depuis le dossier frontend/ (celui qui contient src/)." -ForegroundColor Yellow
    exit 1
}

# --- Backup horodate ---
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupPath = "$TargetFile.bak_$Timestamp"
Copy-Item $TargetFile $BackupPath
Write-Host "Backup cree : $(Split-Path $BackupPath -Leaf)" -ForegroundColor Green

# --- Construction des icones via code Unicode (fiable) ---
$closeIcon = [System.Char]::ConvertFromUtf32(0x2715)     # ✕
$bubbleIcon = [System.Char]::ConvertFromUtf32(0x1F4AC)   # 💬

$correctLine = '        {open ? "' + $closeIcon + '" : "' + $bubbleIcon + '"}'

# --- Lecture ligne par ligne, remplacement par ancre stable ---
$lines = Get-Content $TargetFile
$changedCount = 0

$newLines = $lines | ForEach-Object {
    if ($_ -match '\{open \? ') {
        $changedCount++
        $correctLine
    }
    else {
        $_
    }
}

if ($changedCount -eq 0) {
    Write-Host "Aucune ligne correspondante trouvee. Rien a corriger (ou deja fait)." -ForegroundColor Yellow
    exit 0
}

# --- Ecriture UTF-8 sans BOM, LF ---
$content = ($newLines -join "`n") + "`n"
[System.IO.File]::WriteAllText($TargetFile, $content, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "$changedCount ligne(s) corrigee(s) dans ChatWidget.js" -ForegroundColor Green
Write-Host ""
Write-Host "En cas de probleme, restaure avec :" -ForegroundColor Yellow
Write-Host "  Copy-Item '$BackupPath' '$TargetFile' -Force"
Write-Host ""
Write-Host "Prochaine etape : commit + push pour relancer le build Vercel." -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host "  git commit -m fix-chatwidget-icons"
Write-Host "  git push"
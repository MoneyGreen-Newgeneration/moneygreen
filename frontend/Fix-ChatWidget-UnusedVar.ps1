<#
    Fix : Variable inutilisee 'setMessages' dans ChatWidget.js
    --------------------------------------------------------------
    Vercel (CI=true) transforme les warnings ESLint en erreurs bloquantes.
    'setMessages' est extraite du hook useChat() mais jamais utilisee
    dans ce composant -> sans risque de la retirer de la destructuration.

    A executer depuis la racine du dossier frontend/
#>

$ErrorActionPreference = "Stop"

$TargetFile = Join-Path $PSScriptRoot "src\components\chat\ChatWidget.js"

if (-not (Test-Path $TargetFile)) {
    Write-Host "❌ Fichier introuvable : $TargetFile" -ForegroundColor Red
    exit 1
}

# --- Backup horodate ---
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupPath = "$TargetFile.bak_$Timestamp"
Copy-Item $TargetFile $BackupPath
Write-Host "✅ Backup cree : $(Split-Path $BackupPath -Leaf)" -ForegroundColor Green

# --- Lecture (normalisation des fins de ligne pour un ancrage fiable) ---
$raw = Get-Content $TargetFile -Raw
$normalized = $raw -replace "`r`n", "`n"

$anchor = "    messages,`n    setMessages,`n    text,"
if ($normalized -notmatch [regex]::Escape($anchor)) {
    Write-Host "❌ Ancre introuvable. Le fichier a peut-etre change depuis la derniere fois. Aucune modification faite." -ForegroundColor Red
    Write-Host "Verifie manuellement la ligne 'setMessages,' dans ChatWidget.js et retire-la de la destructuration." -ForegroundColor Yellow
    exit 1
}

$replacement = "    messages,`n    text,"
$newContent = $normalized.Replace($anchor, $replacement)

# --- Ecriture UTF-8 sans BOM, LF ---
[System.IO.File]::WriteAllText($TargetFile, $newContent, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "✅ 'setMessages' retire de la destructuration dans ChatWidget.js" -ForegroundColor Green
Write-Host "`nEn cas de probleme, restaure avec :" -ForegroundColor Yellow
Write-Host "  Copy-Item '$BackupPath' '$TargetFile' -Force"
Write-Host "`nProchaine etape : commit + push pour relancer le build Vercel." -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host "  git commit -m `"fix: retrait de setMessages inutilisee dans ChatWidget`""
Write-Host "  git push"
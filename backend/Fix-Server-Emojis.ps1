<#
    Fix : Emojis casses (mojibake) dans server.js
    --------------------------------------------------------------
    Les emojis des console.log/res.send ont ete corrompus lors d'une
    precedente edition (double encodage). Ce script remet le texte
    correct, sans toucher au reste du fichier.

    A executer depuis la racine du dossier backend/
#>

$ErrorActionPreference = "Stop"

$TargetFile = Join-Path $PSScriptRoot "server.js"

if (-not (Test-Path $TargetFile)) {
    Write-Host "❌ Fichier introuvable : $TargetFile" -ForegroundColor Red
    Write-Host "Execute ce script depuis le dossier backend/ (celui qui contient server.js)." -ForegroundColor Yellow
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

$replacements = @(
    @{
        Old = '"Ã°Å¸Å¡â‚¬ Backend MoneyGreen2 fonctionne !"'
        New = '"🚀 Backend MoneyGreen2 fonctionne !"'
    },
    @{
        Old = '"Ã¢Å“â€¦ MongoDB connectÃƒÂ©"'
        New = '"✅ MongoDB connecté"'
    },
    @{
        Old = '"Ã°Å¸Å¡â‚¬ Serveur lancÃƒÂ© sur le port 5000"'
        New = '"🚀 Serveur lancé sur le port 5000"'
    }
)

$changedCount = 0
foreach ($r in $replacements) {
    if ($normalized -match [regex]::Escape($r.Old)) {
        $normalized = $normalized.Replace($r.Old, $r.New)
        Write-Host "✅ Corrige : $($r.New)" -ForegroundColor Green
        $changedCount++
    } else {
        Write-Host "⚠️  Motif non trouve (deja corrige ou texte different) : $($r.Old)" -ForegroundColor Yellow
    }
}

if ($changedCount -eq 0) {
    Write-Host "`nAucune correction appliquee (rien a corriger ou fichier deja modifie)." -ForegroundColor Yellow
    exit 0
}

# --- Ecriture UTF-8 sans BOM, LF ---
[System.IO.File]::WriteAllText($TargetFile, $normalized, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "`n✅ $changedCount ligne(s) corrigee(s) dans server.js" -ForegroundColor Green
Write-Host "`nEn cas de probleme, restaure avec :" -ForegroundColor Yellow
Write-Host "  Copy-Item '$BackupPath' '$TargetFile' -Force"
Write-Host "`nProchaine etape : commit + push pour relancer le deploiement Railway." -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host "  git commit -m `"fix: emojis casses dans server.js`""
Write-Host "  git push"
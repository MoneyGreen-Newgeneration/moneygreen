<#
    Fix : "Application failed to respond" sur Railway
    --------------------------------------------------------------
    Le serveur demarre et tourne (logs propres, MongoDB connecte),
    mais le proxy public de Railway n'arrive pas a le joindre.
    Cause frequente : server.listen(PORT) sans preciser l'hote peut,
    selon l'environnement Docker, ne pas binder sur toutes les
    interfaces reseau (0.0.0.0), ce qui le rend injoignable depuis
    l'exterieur du conteneur meme s'il tourne correctement en interne.

    Fix : lier explicitement sur "0.0.0.0".

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

if ($normalized -match [regex]::Escape('"0.0.0.0"')) {
    Write-Host "⚠️  Le patch semble deja applique (0.0.0.0 trouve dans le fichier). Aucune modification faite." -ForegroundColor Yellow
    exit 0
}

$anchor = 'server.listen(process.env.PORT || 5000, () => {'
if ($normalized -notmatch [regex]::Escape($anchor)) {
    Write-Host "❌ Ancre introuvable. Le fichier a peut-etre change depuis la derniere fois." -ForegroundColor Red
    Write-Host "Verifie manuellement l'appel a server.listen() dans server.js." -ForegroundColor Yellow
    exit 1
}

$replacement = 'server.listen(process.env.PORT || 5000, "0.0.0.0", () => {'
$newContent = $normalized.Replace($anchor, $replacement)

# --- Ecriture UTF-8 sans BOM, LF ---
[System.IO.File]::WriteAllText($TargetFile, $newContent, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "✅ Serveur lie explicitement sur 0.0.0.0 dans server.js" -ForegroundColor Green
Write-Host "`nEn cas de probleme, restaure avec :" -ForegroundColor Yellow
Write-Host "  Copy-Item '$BackupPath' '$TargetFile' -Force"
Write-Host "`nProchaine etape : commit + push pour relancer le deploiement Railway." -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host "  git commit -m `"fix: bind explicite sur 0.0.0.0 pour Railway`""
Write-Host "  git push"
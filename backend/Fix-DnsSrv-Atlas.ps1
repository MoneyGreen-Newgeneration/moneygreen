<#
    Patch : Fix DNS SRV lookup Atlas (ECONNREFUSED querySrv)
    ----------------------------------------------------------
    Force Node.js a utiliser un DNS public (Google/Cloudflare) pour ses
    propres resolutions, independamment de la config DNS de Windows.
    Necessaire quand nslookup fonctionne mais que Node echoue quand meme
    sur la resolution SRV du cluster Atlas (mongodb+srv://...).

    Cible : backend/server.js
    Backup automatique en .bak avant modification.
#>

$ErrorActionPreference = "Stop"

$TargetFile = ".\server.js"

if (-not (Test-Path $TargetFile)) {
    Write-Host "❌ Fichier introuvable : $TargetFile" -ForegroundColor Red
    Write-Host "Execute ce script depuis le dossier backend/ (celui qui contient server.js)." -ForegroundColor Yellow
    exit 1
}

# --- Backup horodate ---
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupPath = "$TargetFile.bak_$Timestamp"
Copy-Item $TargetFile $BackupPath
Write-Host "✅ Backup cree : $BackupPath" -ForegroundColor Green

# --- Lecture (on normalise les fins de ligne pour un ancrage fiable) ---
$raw = Get-Content $TargetFile -Raw
$normalized = $raw -replace "`r`n", "`n"

if ($normalized -match [regex]::Escape('dns.setServers')) {
    Write-Host "⚠️  Le patch semble deja applique (dns.setServers trouve dans le fichier). Aucune modification faite." -ForegroundColor Yellow
    exit 0
}

$anchor = 'require("dotenv").config();'
if ($normalized -notmatch [regex]::Escape($anchor)) {
    Write-Host "❌ Ancre introuvable : '$anchor'" -ForegroundColor Red
    Write-Host "Le fichier a peut-etre change depuis la derniere fois. Aucune modification faite." -ForegroundColor Yellow
    exit 1
}

$patchBlock = @'
require("dotenv").config();

// ---- Fix DNS SRV Atlas (ECONNREFUSED querySrv) ----
// Force Node a utiliser un DNS public au lieu du DNS Windows/reseau local,
// qui echoue parfois sur les requetes SRV (mongodb+srv://) meme quand
// nslookup fonctionne. Voir : github.com/nodejs/node/issues (dns c-ares).
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
'@

# Remplacement en texte simple (pas de regex) pour eviter tout souci
# d'echappement sur le bloc de code insere.
$newContent = $normalized.Replace($anchor, $patchBlock)

# --- Ecriture UTF-8 sans BOM, LF ---
[System.IO.File]::WriteAllText((Resolve-Path $TargetFile), $newContent, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "✅ Patch applique : dns.setServers ajoute apres dotenv.config() dans $TargetFile" -ForegroundColor Green
Write-Host "`nRedemarre ton serveur (npm run dev) pour tester." -ForegroundColor Cyan
Write-Host "En cas de probleme, restaure avec :" -ForegroundColor Yellow
Write-Host "  Copy-Item '$BackupPath' '$TargetFile' -Force"
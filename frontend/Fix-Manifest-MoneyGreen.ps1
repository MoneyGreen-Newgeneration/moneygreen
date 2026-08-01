<#
    Fix : manifest.json contenait encore les valeurs par defaut de
    Create React App (nom, couleurs). Mise a jour avec les infos
    MoneyGreen et la couleur de marque (vert).

    A executer depuis la racine du dossier frontend/
#>

$ErrorActionPreference = "Stop"

$TargetFile = Join-Path $PSScriptRoot "public\manifest.json"

if (-not (Test-Path $TargetFile)) {
    Write-Host "Fichier introuvable : $TargetFile" -ForegroundColor Red
    Write-Host "Execute ce script depuis le dossier frontend/ (celui qui contient public/)." -ForegroundColor Yellow
    exit 1
}

# --- Backup horodate ---
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupPath = "$TargetFile.bak_$Timestamp"
Copy-Item $TargetFile $BackupPath
Write-Host "Backup cree : $(Split-Path $BackupPath -Leaf)" -ForegroundColor Green

$correctContent = @'
{
  "short_name": "MoneyGreen",
  "name": "MoneyGreen - Plateforme de microcredit en ligne",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#1E8A3E",
  "background_color": "#ffffff"
}
'@

$normalized = $correctContent -replace "`r`n", "`n"
[System.IO.File]::WriteAllText($TargetFile, $normalized, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "manifest.json mis a jour (nom MoneyGreen + couleur de marque)" -ForegroundColor Green
Write-Host ""
Write-Host "En cas de probleme, restaure avec :" -ForegroundColor Yellow
Write-Host "  Copy-Item '$BackupPath' '$TargetFile' -Force"
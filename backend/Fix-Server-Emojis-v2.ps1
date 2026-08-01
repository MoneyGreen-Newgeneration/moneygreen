<#
    Fix : Emojis casses (mojibake) dans server.js
    --------------------------------------------------------------
    Version robuste : ce script ne contient AUCUN caractere accentue
    ou emoji directement dans son propre texte (pour eviter tout
    probleme de transfert/encodage du script lui-meme). Il cible les
    lignes via des ancres ASCII stables et reconstruit les emojis via
    leur code Unicode.

    A executer depuis la racine du dossier backend/
#>

$ErrorActionPreference = "Stop"

$TargetFile = Join-Path $PSScriptRoot "server.js"

if (-not (Test-Path $TargetFile)) {
    Write-Host "Fichier introuvable : $TargetFile" -ForegroundColor Red
    Write-Host "Execute ce script depuis le dossier backend/ (celui qui contient server.js)." -ForegroundColor Yellow
    exit 1
}

# --- Backup horodate ---
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupPath = "$TargetFile.bak_$Timestamp"
Copy-Item $TargetFile $BackupPath
Write-Host "Backup cree : $(Split-Path $BackupPath -Leaf)" -ForegroundColor Green

# --- Construction des emojis/accents via code Unicode (fiable, pas de copier-coller) ---
$rocket = [System.Char]::ConvertFromUtf32(0x1F680)   # 🚀
$check  = [System.Char]::ConvertFromUtf32(0x2705)    # ✅
$eacute = [System.Char]::ConvertFromUtf32(0x00E9)    # é

$correctLine1 = 'app.get("/", (req, res) => res.send("' + $rocket + ' Backend MoneyGreen2 fonctionne !"));'
$correctLine2 = '    console.log("' + $check + ' MongoDB connect' + $eacute + '");'
$correctLine3 = '      console.log("' + $rocket + ' Serveur lanc' + $eacute + ' sur le port 5000");'

# --- Lecture ligne par ligne, remplacement par ancre ASCII stable ---
$lines = Get-Content $TargetFile
$changedCount = 0

$newLines = $lines | ForEach-Object {
    if ($_ -match 'res\.send\(.*Backend MoneyGreen2 fonctionne') {
        $changedCount++
        $correctLine1
    }
    elseif ($_ -match 'console\.log\(.*MongoDB connect') {
        $changedCount++
        $correctLine2
    }
    elseif ($_ -match 'console\.log\(.*Serveur lanc.*port 5000') {
        $changedCount++
        $correctLine3
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

Write-Host "$changedCount ligne(s) corrigee(s) dans server.js" -ForegroundColor Green
Write-Host ""
Write-Host "En cas de probleme, restaure avec :" -ForegroundColor Yellow
Write-Host "  Copy-Item '$BackupPath' '$TargetFile' -Force"
Write-Host ""
Write-Host "Prochaine etape : commit + push pour relancer le deploiement Railway." -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host "  git commit -m fix-emojis-server"
Write-Host "  git push"
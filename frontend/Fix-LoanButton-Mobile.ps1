<#
    Fix : Garder le texte "Demander un pret" visible en mobile
    --------------------------------------------------------------
    Le CSS actuel cachait le texte sur mobile (<640px), ne laissant
    que l'icone "+". On garde le texte visible partout, en ajustant
    juste les tailles/paddings pour que ca reste bien proportionne
    sur petit ecran.

    A executer depuis la racine du dossier frontend/
#>

$ErrorActionPreference = "Stop"

$TargetFile = Join-Path $PSScriptRoot "src\components\LoanRequestButton.css"

if (-not (Test-Path $TargetFile)) {
    Write-Host "Fichier introuvable : $TargetFile" -ForegroundColor Red
    Write-Host "Execute ce script depuis le dossier frontend/ (celui qui contient src/)." -ForegroundColor Yellow
    exit 1
}

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupPath = "$TargetFile.bak_$Timestamp"
Copy-Item $TargetFile $BackupPath
Write-Host "Backup cree : $(Split-Path $BackupPath -Leaf)" -ForegroundColor Green

$raw = [System.IO.File]::ReadAllText($TargetFile, (New-Object System.Text.UTF8Encoding($false)))
$normalized = $raw -replace "`r`n", "`n"

$oldBlock = @'
@media (max-width: 640px) {
  .loan-request-widget { bottom: 80px; right: 16px; }
  .loan-request-bubble {
    height: 44px;
    padding: 0 14px 0 12px;
    font-size: .85rem;
  }
  .loan-request-label { display: none; }
  .loan-request-icon { width: 20px; height: 20px; }
}
'@

$newBlock = @'
@media (max-width: 640px) {
  .loan-request-widget { bottom: 80px; right: 16px; left: 16px; align-items: flex-end; }
  .loan-request-bubble {
    height: 44px;
    padding: 0 14px 0 10px;
    font-size: .8rem;
    max-width: calc(100vw - 32px);
  }
  .loan-request-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .loan-request-icon { width: 20px; height: 20px; font-size: .95rem; }
  .loan-request-menu { width: calc(100vw - 32px); min-width: 0; }
}
'@

if ($normalized -notmatch [regex]::Escape($oldBlock)) {
    Write-Host "Bloc mobile non trouve tel quel (deja modifie ?). Aucune modification faite." -ForegroundColor Yellow
    exit 0
}

$newContent = $normalized.Replace($oldBlock, $newBlock)
[System.IO.File]::WriteAllText($TargetFile, $newContent, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "LoanRequestButton.css mis a jour : texte visible sur mobile" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaine etape : commit + push pour relancer le build Vercel." -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host "  git commit -m fix-loan-button-mobile-label"
Write-Host "  git push"
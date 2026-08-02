<#
    Fix : Garder le texte "Demander un pret" visible en mobile
    --------------------------------------------------------------
    Version robuste : reecrit le fichier CSS entier (au lieu d'un
    patch par correspondance de bloc, fragile face aux differences
    de fin de ligne CRLF/LF entre systemes).

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

$correctContent = @'
.loan-request-widget {
  position: fixed;
  bottom: 100px;
  right: 24px;
  z-index: 1500;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.loan-request-bubble {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 18px 0 14px;
  border-radius: 24px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #22a349, #176e30);
  color: #fff;
  font-size: .92rem;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 8px 22px rgba(23,110,48,.4), 0 2px 6px rgba(0,0,0,.15);
  transition: transform .2s ease, box-shadow .2s ease;
}

.loan-request-bubble:hover {
  transform: scale(1.04) translateY(-2px);
  box-shadow: 0 12px 28px rgba(23,110,48,.45), 0 4px 10px rgba(0,0,0,.18);
}

.loan-request-bubble:active {
  transform: scale(.97);
}

.loan-request-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255,255,255,.22);
  font-size: 1.05rem;
  line-height: 1;
  flex-shrink: 0;
}

.loan-request-menu {
  margin-bottom: 12px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(0,0,0,.18);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 220px;
  animation: loanMenuIn .18s ease;
}

@keyframes loanMenuIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.loan-request-menu-title {
  font-size: .72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: #6b7280;
  padding: 6px 10px 4px;
}

.loan-request-menu-item {
  display: block;
  padding: 10px 12px;
  border-radius: 10px;
  color: #1c1f1d;
  text-decoration: none;
  font-size: .92rem;
  font-weight: 600;
  transition: background .15s ease;
}

.loan-request-menu-item:hover {
  background: #eef7f0;
  color: #176e30;
}

body.dark-mode .loan-request-menu {
  background: #23262a;
  box-shadow: 0 12px 32px rgba(0,0,0,.5);
}

body.dark-mode .loan-request-menu-title {
  color: #9aa0a6;
}

body.dark-mode .loan-request-menu-item {
  color: #f1f1f1;
}

body.dark-mode .loan-request-menu-item:hover {
  background: #2e3a30;
  color: #4ade80;
}

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

$normalized = $correctContent -replace "`r`n", "`n"
[System.IO.File]::WriteAllText($TargetFile, $normalized, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "LoanRequestButton.css reecrit : texte visible sur mobile" -ForegroundColor Green
Write-Host ""
Write-Host "En cas de probleme, restaure avec :" -ForegroundColor Yellow
Write-Host "  Copy-Item '$BackupPath' '$TargetFile' -Force"
Write-Host ""
Write-Host "Prochaine etape : commit + push pour relancer le build Vercel." -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host "  git commit -m fix-loan-button-mobile-label"
Write-Host "  git push"
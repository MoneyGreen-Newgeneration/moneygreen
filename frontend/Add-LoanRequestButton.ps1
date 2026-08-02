<#
    Ajout : Bouton flottant "Demander un pret" sur le dashboard client
    --------------------------------------------------------------
    - Cree src/components/LoanRequestButton.js (nouveau composant)
    - Cree src/components/LoanRequestButton.css (style, positionne
      juste au-dessus de la bulle de chat)
    - Modifie src/pages/Dashboard.js pour l'importer et l'afficher

    A executer depuis la racine du dossier frontend/
#>

$ErrorActionPreference = "Stop"

$ComponentsDir = Join-Path $PSScriptRoot "src\components"
$DashboardFile = Join-Path $PSScriptRoot "src\pages\Dashboard.js"

if (-not (Test-Path $DashboardFile)) {
    Write-Host "Fichier introuvable : $DashboardFile" -ForegroundColor Red
    Write-Host "Execute ce script depuis le dossier frontend/ (celui qui contient src/)." -ForegroundColor Yellow
    exit 1
}

# --- 1. Creation du composant LoanRequestButton.js ---
$jsContent = @'
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import "./LoanRequestButton.css";

export default function LoanRequestButton() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loanTypes = [
    { to: "/prets/auto", label: t("loan_auto_title") },
    { to: "/prets/immobilier", label: t("loan_immo_title") },
    { to: "/prets/scolaire", label: t("loan_sco_title") },
    { to: "/prets/personnel", label: t("loan_per_title") },
  ];

  return (
    <div className="loan-request-widget" ref={wrapperRef}>
      {open && (
        <div className="loan-request-menu">
          <span className="loan-request-menu-title">{t("home_hero_cta")}</span>
          {loanTypes.map((loan) => (
            <Link
              key={loan.to}
              to={loan.to}
              className="loan-request-menu-item"
              onClick={() => setOpen(false)}
            >
              {loan.label}
            </Link>
          ))}
        </div>
      )}
      <button
        className="loan-request-bubble"
        onClick={() => setOpen((o) => !o)}
        title={t("home_hero_cta")}
      >
        <span className="loan-request-icon" aria-hidden="true">+</span>
        <span className="loan-request-label">{t("home_hero_cta")}</span>
      </button>
    </div>
  );
}
'@

$cssContent = @'
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

$jsPath = Join-Path $ComponentsDir "LoanRequestButton.js"
$cssPath = Join-Path $ComponentsDir "LoanRequestButton.css"

if (Test-Path $jsPath) {
    Write-Host "LoanRequestButton.js existe deja, il sera remplace (backup cree)." -ForegroundColor Yellow
    Copy-Item $jsPath "$jsPath.bak_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
}
if (Test-Path $cssPath) {
    Copy-Item $cssPath "$cssPath.bak_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
}

[System.IO.File]::WriteAllText($jsPath, ($jsContent -replace "`r`n", "`n"), (New-Object System.Text.UTF8Encoding($false)))
[System.IO.File]::WriteAllText($cssPath, ($cssContent -replace "`r`n", "`n"), (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Cree : src/components/LoanRequestButton.js" -ForegroundColor Green
Write-Host "Cree : src/components/LoanRequestButton.css" -ForegroundColor Green

# --- 2. Modification de Dashboard.js ---
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$DashboardBackup = "$DashboardFile.bak_$Timestamp"
Copy-Item $DashboardFile $DashboardBackup
Write-Host "Backup cree : $(Split-Path $DashboardBackup -Leaf)" -ForegroundColor Green

$raw = Get-Content $DashboardFile -Raw
$normalized = $raw -replace "`r`n", "`n"

if ($normalized -match [regex]::Escape('LoanRequestButton')) {
    Write-Host "Dashboard.js contient deja une reference a LoanRequestButton. Aucune modification faite sur ce fichier." -ForegroundColor Yellow
}
else {
    $importAnchor = 'import ChatWidget from "../components/chat/ChatWidget";'
    if ($normalized -notmatch [regex]::Escape($importAnchor)) {
        Write-Host "Ancre d'import introuvable dans Dashboard.js. Modification manuelle necessaire." -ForegroundColor Red
        Write-Host "Ajoute manuellement :" -ForegroundColor Yellow
        Write-Host '  import LoanRequestButton from "../components/LoanRequestButton";'
        Write-Host '  et <LoanRequestButton /> juste avant <ChatWidget />'
        exit 1
    }

    $newImport = $importAnchor + "`nimport LoanRequestButton from " + '"../components/LoanRequestButton";'
    $normalized = $normalized.Replace($importAnchor, $newImport)

    $renderAnchor = '<ChatWidget />'
    if ($normalized -notmatch [regex]::Escape($renderAnchor)) {
        Write-Host "Ancre de rendu <ChatWidget /> introuvable. Ajoute manuellement <LoanRequestButton /> juste avant." -ForegroundColor Red
        exit 1
    }
    $newRender = "<LoanRequestButton />`n      " + $renderAnchor
    $normalized = $normalized.Replace($renderAnchor, $newRender)

    [System.IO.File]::WriteAllText($DashboardFile, $normalized, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Dashboard.js mis a jour (import + <LoanRequestButton />)" -ForegroundColor Green
}

Write-Host ""
Write-Host "En cas de probleme, restaure Dashboard.js avec :" -ForegroundColor Yellow
Write-Host "  Copy-Item '$DashboardBackup' '$DashboardFile' -Force"
Write-Host ""
Write-Host "Prochaine etape : commit + push pour relancer le build Vercel." -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host "  git commit -m add-loan-request-button"
Write-Host "  git push"
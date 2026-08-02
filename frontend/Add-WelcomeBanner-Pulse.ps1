<#
    Ajout : Banniere de bienvenue (nouveaux clients) + animation
    de pulsation sur les boutons flottants
    --------------------------------------------------------------
    - Ajoute des cles de traduction (5 langues) pour la banniere
    - Insere la banniere dans Dashboard.js, visible seulement si
      le client n'a encore aucun pret ni aucune transaction
    - Ajoute une animation de pulsation douce sur le bouton
      "Demander un pret" et la bulle de chat

    A executer depuis la racine du dossier frontend/
#>

$ErrorActionPreference = "Stop"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

function Backup-File($path) {
    $bak = "$path.bak_$Timestamp"
    Copy-Item $path $bak
    Write-Host "Backup cree : $(Split-Path $bak -Leaf)" -ForegroundColor Green
}

# ================== 1. translations.js : nouvelles cles ==================
$TranslationsFile = Join-Path $PSScriptRoot "src\context\translations.js"

if (-not (Test-Path $TranslationsFile)) {
    Write-Host "Fichier introuvable : $TranslationsFile" -ForegroundColor Red
    exit 1
}

Backup-File $TranslationsFile

$raw = [System.IO.File]::ReadAllText($TranslationsFile, (New-Object System.Text.UTF8Encoding($false)))
$normalized = $raw -replace "`r`n", "`n"

# Chaque ligne (unique par langue) sert d'ancre pour inserer les nouvelles cles juste apres.
$anchors = @(
    @{ Find = 'dash_greeting: "Bonjour", dash_balance: "Solde actuel", dash_income: "Revenus", dash_expense: "D__EACUTE__penses",'
       Add  = '    dash_welcome_title: "Bienvenue sur MoneyGreen !", dash_welcome_text: "Faites votre premi__EGRAVE__re demande de financement en quelques clics.",' },
    @{ Find = 'dash_greeting: "Hello", dash_balance: "Current balance", dash_income: "Income", dash_expense: "Expenses",'
       Add  = '    dash_welcome_title: "Welcome to MoneyGreen!", dash_welcome_text: "Make your first financing request in just a few clicks.",' },
    @{ Find = 'dash_greeting: "Hola", dash_balance: "Saldo actual", dash_income: "Ingresos", dash_expense: "Gastos",'
       Add  = '    dash_welcome_title: "__IEXCL__Bienvenido a MoneyGreen!", dash_welcome_text: "Solicita tu primer financiamiento en unos clics.",' },
    @{ Find = 'dash_greeting: "Ola", dash_balance: "Saldo atual", dash_income: "Receitas", dash_expense: "Despesas",'
       Add  = '    dash_welcome_title: "Bem-vindo ao MoneyGreen!", dash_welcome_text: "Fa__CCEDIL__a seu primeiro pedido de financiamento em poucos cliques.",' },
    @{ Find = 'dash_greeting: "Hallo", dash_balance: "Aktuelles Guthaben", dash_income: "Einnahmen", dash_expense: "Ausgaben",'
       Add  = '    dash_welcome_title: "Willkommen bei MoneyGreen!", dash_welcome_text: "Stellen Sie Ihren ersten Finanzierungsantrag in wenigen Klicks.",' }
)

$eacute = [System.Char]::ConvertFromUtf32(0x00E9)
$egrave = [System.Char]::ConvertFromUtf32(0x00E8)
$iexcl  = [System.Char]::ConvertFromUtf32(0x00A1)
$ccedil = [System.Char]::ConvertFromUtf32(0x00E7)

$changedCount = 0
foreach ($a in $anchors) {
    $find = ($a.Find -replace "`r`n", "`n").Replace('__EACUTE__', $eacute)
    $add  = ($a.Add -replace "`r`n", "`n").Replace('__EACUTE__', $eacute).Replace('__EGRAVE__', $egrave).Replace('__IEXCL__', $iexcl).Replace('__CCEDIL__', $ccedil)

    if ($normalized -match [regex]::Escape($find)) {
        $normalized = $normalized.Replace($find, $find + "`n" + $add)
        $changedCount++
    }
}

if ($changedCount -gt 0) {
    [System.IO.File]::WriteAllText($TranslationsFile, $normalized, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "$changedCount langue(s) mise(s) a jour dans translations.js" -ForegroundColor Green
} else {
    Write-Host "Aucune ancre trouvee dans translations.js. Verifie que le fichier n'a pas change." -ForegroundColor Yellow
}

# ================== 2. Dashboard.js : insertion de la banniere ==================
$DashboardFile = Join-Path $PSScriptRoot "src\pages\Dashboard.js"

if (-not (Test-Path $DashboardFile)) {
    Write-Host "Fichier introuvable : $DashboardFile" -ForegroundColor Red
    exit 1
}

Backup-File $DashboardFile

$rawDash = [System.IO.File]::ReadAllText($DashboardFile, (New-Object System.Text.UTF8Encoding($false)))
$normDash = $rawDash -replace "`r`n", "`n"

if ($normDash -match [regex]::Escape('dash-welcome-banner')) {
    Write-Host "Dashboard.js contient deja la banniere. Aucune modification faite." -ForegroundColor Yellow
}
else {
    $dashAnchor = '{error && <p className="dash-alert">{error}</p>}'
    if ($normDash -notmatch [regex]::Escape($dashAnchor)) {
        Write-Host "Ancre introuvable dans Dashboard.js. Insertion manuelle necessaire." -ForegroundColor Red
        exit 1
    }

    $bannerTemplate = @'
{error && <p className="dash-alert">{error}</p>}

        {!loading && loans.length === 0 && transactions.length === 0 && (
          <section className="dash-welcome-banner">
            <div className="dash-welcome-text">
              <h2>{t("dash_welcome_title")}</h2>
              <p>{t("dash_welcome_text")}</p>
            </div>
            <div className="dash-welcome-links">
              <Link to="/prets/auto" className="dash-welcome-link">{t("loan_auto_title")}</Link>
              <Link to="/prets/immobilier" className="dash-welcome-link">{t("loan_immo_title")}</Link>
              <Link to="/prets/scolaire" className="dash-welcome-link">{t("loan_sco_title")}</Link>
              <Link to="/prets/personnel" className="dash-welcome-link">{t("loan_per_title")}</Link>
            </div>
          </section>
        )}
'@

    $bannerReplacement = ($bannerTemplate -replace "`r`n", "`n")
    $normDash = $normDash.Replace($dashAnchor, $bannerReplacement)

    [System.IO.File]::WriteAllText($DashboardFile, $normDash, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Banniere ajoutee dans Dashboard.js" -ForegroundColor Green
}

# ================== 3. CSS : banniere + animation pulsation ==================
$DashboardCssFile = Join-Path $PSScriptRoot "src\pages\Dashboard.css"
$LoanCssFile = Join-Path $PSScriptRoot "src\components\LoanRequestButton.css"
$ChatCssFile = Join-Path $PSScriptRoot "src\components\chat\Chat.css"

if (Test-Path $DashboardCssFile) {
    Backup-File $DashboardCssFile
    $bannerCss = @'

.dash-welcome-banner {
  background: linear-gradient(135deg, #1e8a3e, #146b30);
  color: #fff;
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.dash-welcome-text h2 {
  margin: 0 0 6px;
  font-size: 1.3rem;
}

.dash-welcome-text p {
  margin: 0;
  opacity: .9;
  font-size: .95rem;
}

.dash-welcome-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.dash-welcome-link {
  background: rgba(255,255,255,.16);
  color: #fff;
  text-decoration: none;
  padding: 9px 16px;
  border-radius: 20px;
  font-size: .85rem;
  font-weight: 600;
  white-space: nowrap;
  transition: background .15s ease;
}

.dash-welcome-link:hover {
  background: rgba(255,255,255,.3);
}

@media (max-width: 640px) {
  .dash-welcome-banner { flex-direction: column; align-items: flex-start; padding: 20px; }
}
'@
    $cssRaw = [System.IO.File]::ReadAllText($DashboardCssFile, (New-Object System.Text.UTF8Encoding($false)))
    if ($cssRaw -notmatch [regex]::Escape('dash-welcome-banner')) {
        $newCss = $cssRaw + "`n" + ($bannerCss -replace "`r`n", "`n")
        [System.IO.File]::WriteAllText($DashboardCssFile, $newCss, (New-Object System.Text.UTF8Encoding($false)))
        Write-Host "Style de la banniere ajoute dans Dashboard.css" -ForegroundColor Green
    } else {
        Write-Host "Dashboard.css contient deja le style de la banniere." -ForegroundColor Yellow
    }
}

$pulseKeyframes = @'

@keyframes gentlePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34,163,73,.5); }
  50% { box-shadow: 0 0 0 10px rgba(34,163,73,0); }
}

@media (prefers-reduced-motion: no-preference) {
  .loan-request-bubble, .chat-bubble {
    animation: gentlePulse 2.5s ease-in-out infinite;
  }
}
'@

if (Test-Path $LoanCssFile) {
    $loanCssRaw = [System.IO.File]::ReadAllText($LoanCssFile, (New-Object System.Text.UTF8Encoding($false)))
    if ($loanCssRaw -notmatch [regex]::Escape('gentlePulse')) {
        Backup-File $LoanCssFile
        $newLoanCss = $loanCssRaw + "`n" + ($pulseKeyframes -replace "`r`n", "`n")
        [System.IO.File]::WriteAllText($LoanCssFile, $newLoanCss, (New-Object System.Text.UTF8Encoding($false)))
        Write-Host "Animation de pulsation ajoutee dans LoanRequestButton.css" -ForegroundColor Green
    } else {
        Write-Host "LoanRequestButton.css a deja l'animation de pulsation." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Prochaine etape : commit + push pour relancer le build Vercel." -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host "  git commit -m feat-welcome-banner-and-pulse"
Write-Host "  git push"
<#
    Etape 2/2 : Bouton "Relancer sur WhatsApp" dans le dashboard admin
    --------------------------------------------------------------
    Ajoute une fonction utilitaire qui construit un lien wa.me a
    partir du numero du client (avec message pre-rempli), et un
    bouton dans la colonne Actions du tableau utilisateurs.
    Le bouton est grise/inactif si le client n'a pas de numero.

    A executer depuis la racine du dossier frontend/
#>

$ErrorActionPreference = "Stop"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

$AdminFile = Join-Path $PSScriptRoot "src\pages\admin\Admin.js"

if (-not (Test-Path $AdminFile)) {
    Write-Host "Fichier introuvable : $AdminFile" -ForegroundColor Red
    Write-Host "Execute ce script depuis le dossier frontend/ (celui qui contient src/)." -ForegroundColor Yellow
    exit 1
}

$bak = "$AdminFile.bak_$Timestamp"
Copy-Item $AdminFile $bak
Write-Host "Backup cree : $(Split-Path $bak -Leaf)" -ForegroundColor Green

$raw = [System.IO.File]::ReadAllText($AdminFile, (New-Object System.Text.UTF8Encoding($false)))
$norm = $raw -replace "`r`n", "`n"

if ($norm -match [regex]::Escape('buildWhatsAppLink')) {
    Write-Host "Admin.js contient deja le bouton WhatsApp. Aucune modification faite." -ForegroundColor Yellow
    exit 0
}

# --- 1. Ajout de la fonction utilitaire, juste avant handleToggleAdmin ---
$fnAnchor = @'
  const handleToggleAdmin = async (id) => {
'@
$fnAnchor = ($fnAnchor -replace "`r`n", "`n")

$fnAddition = @'
  const buildWhatsAppLink = (u) => {
    if (!u.phoneNumber) return null;
    const digits = u.phoneNumber.replace(/[^\d]/g, "");
    const message = encodeURIComponent(
      `Bonjour ${u.username}, c'est la reception administrative MoneyGreen ! Nous vous attendons  sur la plateforme pour un entretien.` : https://moneygreeny.vercel.app`
    );
    return `https://wa.me/${digits}?text=${message}`;
  };

  const handleToggleAdmin = async (id) => {
'@
$fnAddition = ($fnAddition -replace "`r`n", "`n")

if ($norm -notmatch [regex]::Escape($fnAnchor)) {
    Write-Host "Ancre de fonction introuvable. Modification manuelle necessaire." -ForegroundColor Red
    exit 1
}
$norm = $norm.Replace($fnAnchor, $fnAddition)

# --- 2. Ajout du bouton dans la colonne Actions du tableau utilisateurs ---
$btnAnchor = @'
                        <td>
                          <button
                            className={u.isAdmin ? "adm-btn-reject" : "adm-btn-approve"}
                            disabled={updating === u._id || u._id === user?._id || u._id === user?.id}
                            onClick={() => handleToggleAdmin(u._id)}
                          >
                            {u.isAdmin ? t("adm_btn_remove_admin") : t("adm_btn_promote_admin")}
                          </button>
                        </td>
'@
$btnAnchor = ($btnAnchor -replace "`r`n", "`n")

$btnAddition = @'
                        <td>
                          <button
                            className={u.isAdmin ? "adm-btn-reject" : "adm-btn-approve"}
                            disabled={updating === u._id || u._id === user?._id || u._id === user?.id}
                            onClick={() => handleToggleAdmin(u._id)}
                          >
                            {u.isAdmin ? t("adm_btn_remove_admin") : t("adm_btn_promote_admin")}
                          </button>
                          {buildWhatsAppLink(u) ? (
                            <a
                              href={buildWhatsAppLink(u)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="adm-btn-whatsapp"
                            >
                              {t("adm_btn_whatsapp")}
                            </a>
                          ) : (
                            <button className="adm-btn-whatsapp" disabled title="Aucun numero WhatsApp">
                              {t("adm_btn_whatsapp")}
                            </button>
                          )}
                        </td>
'@
$btnAddition = ($btnAddition -replace "`r`n", "`n")

if ($norm -notmatch [regex]::Escape($btnAnchor)) {
    Write-Host "Ancre du bouton introuvable. La fonction a ete ajoutee mais pas le bouton." -ForegroundColor Red
    Write-Host "Modification manuelle necessaire dans le tableau utilisateurs." -ForegroundColor Yellow
    [System.IO.File]::WriteAllText($AdminFile, $norm, (New-Object System.Text.UTF8Encoding($false)))
    exit 1
}
$norm = $norm.Replace($btnAnchor, $btnAddition)

[System.IO.File]::WriteAllText($AdminFile, $norm, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Admin.js : fonction + bouton WhatsApp ajoutes" -ForegroundColor Green

Write-Host ""
Write-Host "N'oublie pas d'ajouter le style .adm-btn-whatsapp dans Admin.css (voir instructions)." -ForegroundColor Cyan
Write-Host ""
Write-Host "Prochaine etape : commit + push pour relancer le build Vercel + Railway." -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host "  git commit -m feat-admin-whatsapp-notify"
Write-Host "  git push"
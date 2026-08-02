<#
    Fix : Icones/accents casses dans Dashboard.js et ReplyPreview.js
    --------------------------------------------------------------
    Version robuste : utilise des chaines a guillemet simple (aucune
    interpretation/echappement par PowerShell) avec des jetons de
    substitution, pour eviter tout risque d'erreur de syntaxe liee
    aux guillemets imbriques.

    A executer depuis la racine du dossier frontend/
#>

$ErrorActionPreference = "Stop"

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# --- Icones/caracteres construits via code Unicode (fiable) ---
$leftArrow = [System.Char]::ConvertFromUtf32(0x2190)   # fleche gauche
$closeIcon = [System.Char]::ConvertFromUtf32(0x2715)   # croix fermeture
$eacute    = [System.Char]::ConvertFromUtf32(0x00E9)   # e accent aigu
$agrave    = [System.Char]::ConvertFromUtf32(0x00E0)   # a accent grave
$ecirc     = [System.Char]::ConvertFromUtf32(0x00EA)   # e accent circonflexe

# ================== 1. Dashboard.js ==================
$DashboardFile = Join-Path $PSScriptRoot "src\pages\Dashboard.js"

if (-not (Test-Path $DashboardFile)) {
    Write-Host "Fichier introuvable : $DashboardFile" -ForegroundColor Red
    Write-Host "Execute ce script depuis le dossier frontend/ (celui qui contient src/)." -ForegroundColor Yellow
    exit 1
}

$backup1 = "$DashboardFile.bak_$Timestamp"
Copy-Item $DashboardFile $backup1
Write-Host "Backup cree : $(Split-Path $backup1 -Leaf)" -ForegroundColor Green

$lines = ([System.IO.File]::ReadAllText($DashboardFile, (New-Object System.Text.UTF8Encoding($false)))) -replace "`r`n", "`n" -split "`n"
$changed1 = 0

$ariaTemplate = '      <Link to="/" className="dash-home-fab" aria-label="Retour __AGRAVE__ l__APOS__accueil">'
$ariaLine = $ariaTemplate.Replace('__AGRAVE__', $agrave).Replace('__APOS__', "'")

$newLines = $lines | ForEach-Object {
    if ($_ -match 'aria-label="Retour') {
        $changed1++
        $ariaLine
    }
    elseif ($_.Trim().Length -gt 0 -and $_.Trim().Length -lt 20 -and $_ -notmatch '<' -and $_ -notmatch '=' -and $_ -cnotmatch '^[\x00-\x7F]*$') {
        $changed1++
        '        ' + $leftArrow
    }
    else {
        $_
    }
}

if ($changed1 -gt 0) {
    $content1 = ($newLines -join "`n") + "`n"
    [System.IO.File]::WriteAllText($DashboardFile, $content1, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "$changed1 ligne(s) corrigee(s) dans Dashboard.js" -ForegroundColor Green
} else {
    Write-Host "Aucune ligne correspondante trouvee dans Dashboard.js (deja corrige ?)." -ForegroundColor Yellow
}

# ================== 2. ReplyPreview.js ==================
$ReplyFile = Join-Path $PSScriptRoot "src\components\chat\ReplyPreview.js"

if (-not (Test-Path $ReplyFile)) {
    Write-Host "Fichier introuvable : $ReplyFile (ignore)" -ForegroundColor Yellow
}
else {
    $backup2 = "$ReplyFile.bak_$Timestamp"
    Copy-Item $ReplyFile $backup2
    Write-Host "Backup cree : $(Split-Path $backup2 -Leaf)" -ForegroundColor Green

    $replyTemplate = @'
export default function ReplyPreview({ replyingTo, onCancel }) {
  if (!replyingTo) return null;

  const author = replyingTo.sender === "client" ? "vous-m__ECIRC__me" : "Support";

  return (
    <div className="chat-reply-bar">
      <div>
        <span className="chat-reply-author">R__EACUTE__pondre __AGRAVE__ {author}</span>

        <span className="chat-reply-text">
          {replyingTo.deleted ? "Message supprim__EACUTE__" : replyingTo.text || "Photo"}
        </span>
      </div>

      <button onClick={onCancel} title="Annuler">
        __CLOSE__
      </button>
    </div>
  );
}
'@

    $replyContent = $replyTemplate.Replace('__ECIRC__', $ecirc).Replace('__EACUTE__', $eacute).Replace('__AGRAVE__', $agrave).Replace('__CLOSE__', $closeIcon)
    $replyContent = $replyContent -replace "`r`n", "`n"

    [System.IO.File]::WriteAllText($ReplyFile, $replyContent, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "ReplyPreview.js reecrit proprement" -ForegroundColor Green
}

Write-Host ""
Write-Host "Prochaine etape : commit + push pour relancer le build Vercel." -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host "  git commit -m fix-icones-dashboard-replypreview-v2"
Write-Host "  git push"
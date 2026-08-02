<#
    Fix : Icones/accents casses dans Dashboard.js et ReplyPreview.js
    --------------------------------------------------------------
    - Dashboard.js : le bouton "retour a l'accueil" (bas gauche) avait
      son icone fleche corrompue (devrait etre "<-")
    - ReplyPreview.js : accents et icone de fermeture corrompus
      (deja signale une fois, visiblement pas encore pousse)

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

$lines = Get-Content $DashboardFile
$changed1 = 0

$newLines = $lines | ForEach-Object {
    if ($_ -match 'aria-label="Retour') {
        $changed1++
        '      <Link to="/" className="dash-home-fab" aria-label="Retour ' + $agrave + " l'accueil" + '">'
    }
    elseif ($_ -match '^\s*â†\s*$') {
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

    $correctReply = @(
        'export default function ReplyPreview({ replyingTo, onCancel }) {',
        '  if (!replyingTo) return null;',
        '',
        "  const author = replyingTo.sender === ""client"" ? ""vous-m" + $ecirc + "me"" : ""Support"";",
        '',
        '  return (',
        '    <div className="chat-reply-bar">',
        '      <div>',
        "        <span className=""chat-reply-author"">R" + $eacute + "pondre " + $agrave + " {author}</span>",
        '',
        '        <span className="chat-reply-text">',
        "          {replyingTo.deleted ? ""Message supprim" + $eacute + """ : replyingTo.text || ""Photo""}",
        '        </span>',
        '      </div>',
        '',
        '      <button onClick={onCancel} title="Annuler">',
        '        ' + $closeIcon,
        '      </button>',
        '    </div>',
        '  );',
        '}'
    ) -join "`n"

    [System.IO.File]::WriteAllText($ReplyFile, ($correctReply + "`n"), (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "ReplyPreview.js reecrit proprement" -ForegroundColor Green
}

Write-Host ""
Write-Host "Prochaine etape : commit + push pour relancer le build Vercel." -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host "  git commit -m fix-icones-dashboard-replypreview"
Write-Host "  git push"
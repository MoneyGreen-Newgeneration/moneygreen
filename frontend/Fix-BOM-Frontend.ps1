<#
    Fix : Suppression du BOM UTF-8 (cause de l'echec de build Vercel)
    --------------------------------------------------------------------
    Vercel active le mode CI strict, qui transforme les warnings ESLint
    "Unexpected Unicode BOM" en erreurs bloquantes au build.
    Ce script retire le BOM en tete des fichiers concernes, sans toucher
    au contenu, et fait un backup .bak de chaque fichier modifie.

    A executer depuis la racine du dossier frontend/
    (celui qui contient le dossier src/)
#>

$ErrorActionPreference = "Stop"

$Files = @(
    "src\components\DarkModeToggle.js",
    "src\components\LangSelector.js",
    "src\components\LoanIllustration.js",
    "src\components\Flag.js",
    "src\components\chat\TeamChat.js",
    "src\components\AdminRoute.js",
    "src\components\DocumentIcons.js",
    "src\components\MoneyGreenMark.js",
    "src\components\ProtectedRoute.js",
    "src\api\loans.js",
    "src\api\axios.js",
    "src\api\dashboard.js",
    "src\api\admin.js",
    "src\pages\admin\Admin.js",
    "src\pages\loans\LoanScolaire.js",
    "src\pages\loans\LoanPersonnel.js",
    "src\pages\Login.js",
    "src\pages\payment\PaymentInfoPage.js",
    "src\context\LangContext.js",
    "src\context\AuthContext.js",
    "src\context\ThemeContext.js"
)

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$fixedCount = 0
$skippedCount = 0
$missingCount = 0

Write-Host "=== Suppression du BOM UTF-8 ===" -ForegroundColor Cyan

foreach ($relPath in $Files) {
    $fullPath = Join-Path $PSScriptRoot $relPath

    if (-not (Test-Path $fullPath)) {
        Write-Host "⚠️  Introuvable, ignore : $relPath" -ForegroundColor Yellow
        $missingCount++
        continue
    }

    $bytes = [System.IO.File]::ReadAllBytes($fullPath)

    $hasBom = ($bytes.Length -ge 3) -and ($bytes[0] -eq 0xEF) -and ($bytes[1] -eq 0xBB) -and ($bytes[2] -eq 0xBF)

    if (-not $hasBom) {
        Write-Host "-- Pas de BOM, deja propre : $relPath" -ForegroundColor DarkGray
        $skippedCount++
        continue
    }

    # Backup avant modification
    $backupPath = "$fullPath.bak_$Timestamp"
    Copy-Item $fullPath $backupPath

    # Retire les 3 premiers octets (le BOM) et reecrit le fichier tel quel
    $newBytes = $bytes[3..($bytes.Length - 1)]
    [System.IO.File]::WriteAllBytes($fullPath, $newBytes)

    Write-Host "✅ BOM retire : $relPath (backup : $(Split-Path $backupPath -Leaf))" -ForegroundColor Green
    $fixedCount++
}

Write-Host "`n=== Resume ===" -ForegroundColor Cyan
Write-Host "Fichiers corriges : $fixedCount" -ForegroundColor Green
Write-Host "Deja propres      : $skippedCount"
Write-Host "Introuvables      : $missingCount" -ForegroundColor $(if ($missingCount -gt 0) { "Yellow" } else { "DarkGray" })

if ($fixedCount -gt 0) {
    Write-Host "`nProchaine etape : commit + push ces changements sur GitHub, Vercel relancera le build automatiquement." -ForegroundColor Cyan
    Write-Host "  git add ." 
    Write-Host "  git commit -m `"fix: retrait du BOM UTF-8 dans plusieurs fichiers frontend`""
    Write-Host "  git push"
}
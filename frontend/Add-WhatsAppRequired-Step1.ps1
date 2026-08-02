<#
    Etape 1/2 : Numero WhatsApp obligatoire + traductions
    --------------------------------------------------------------
    1. backend/models/User.js       : phoneNumber devient obligatoire
    2. backend/controllers/auth.controller.js : validation a l'inscription
    3. frontend/src/pages/Register.js : champ obligatoire + libelle WhatsApp
    4. frontend/src/context/translations.js : libelles mis a jour (5 langues)
       + nouvelle cle adm_btn_whatsapp pour le bouton admin

    A executer depuis la racine du dossier frontend/
    (le dossier backend/ doit etre son voisin, structure standard du projet)
#>

$ErrorActionPreference = "Stop"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

function Backup-File($path) {
    $bak = "$path.bak_$Timestamp"
    Copy-Item $path $bak
    Write-Host "Backup cree : $(Split-Path $bak -Leaf)" -ForegroundColor Green
}

$FrontendRoot = $PSScriptRoot
$BackendRoot = Join-Path (Split-Path $PSScriptRoot -Parent) "backend"

$eacute = [System.Char]::ConvertFromUtf32(0x00E9)
$egrave = [System.Char]::ConvertFromUtf32(0x00E8)
$ntilde = [System.Char]::ConvertFromUtf32(0x00F1)
$uacute = [System.Char]::ConvertFromUtf32(0x00FA)
$aacute = [System.Char]::ConvertFromUtf32(0x00E1)

# ================== 1. backend/models/User.js ==================
$UserModelFile = Join-Path $BackendRoot "models\User.js"
if (Test-Path $UserModelFile) {
    $raw = [System.IO.File]::ReadAllText($UserModelFile, (New-Object System.Text.UTF8Encoding($false)))
    $norm = $raw -replace "`r`n", "`n"
    $oldLine = 'phoneNumber: { type: String },'
    $newLine = 'phoneNumber: { type: String, required: true },'
    if ($norm -match [regex]::Escape($oldLine)) {
        Backup-File $UserModelFile
        $norm = $norm.Replace($oldLine, $newLine)
        [System.IO.File]::WriteAllText($UserModelFile, $norm, (New-Object System.Text.UTF8Encoding($false)))
        Write-Host "User.js : phoneNumber rendu obligatoire" -ForegroundColor Green
    } else {
        Write-Host "User.js : ligne non trouvee telle quelle (deja modifie ?)" -ForegroundColor Yellow
    }
} else {
    Write-Host "backend/models/User.js introuvable ($UserModelFile). Ignore." -ForegroundColor Yellow
}

# ================== 2. backend/controllers/auth.controller.js ==================
$AuthCtrlFile = Join-Path $BackendRoot "controllers\auth.controller.js"
if (Test-Path $AuthCtrlFile) {
    $raw2 = [System.IO.File]::ReadAllText($AuthCtrlFile, (New-Object System.Text.UTF8Encoding($false)))
    $norm2 = $raw2 -replace "`r`n", "`n"

    if ($norm2 -match [regex]::Escape('WhatsApp phone number required')) {
        Write-Host "auth.controller.js : validation deja presente." -ForegroundColor Yellow
    }
    else {
        $anchor2 = @'
    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }
'@
        $anchor2 = ($anchor2 -replace "`r`n", "`n")

        $addition2 = @'
    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    if (!phoneNumber) {
      return res.status(400).json({ message: "WhatsApp phone number required" });
    }
'@
        $addition2 = ($addition2 -replace "`r`n", "`n")

        if ($norm2 -match [regex]::Escape($anchor2)) {
            Backup-File $AuthCtrlFile
            $norm2 = $norm2.Replace($anchor2, $addition2)
            [System.IO.File]::WriteAllText($AuthCtrlFile, $norm2, (New-Object System.Text.UTF8Encoding($false)))
            Write-Host "auth.controller.js : validation phoneNumber ajoutee" -ForegroundColor Green
        } else {
            Write-Host "auth.controller.js : ancre non trouvee. Modification manuelle necessaire." -ForegroundColor Red
        }
    }
} else {
    Write-Host "backend/controllers/auth.controller.js introuvable. Ignore." -ForegroundColor Yellow
}

# ================== 3. frontend/src/pages/Register.js ==================
$RegisterFile = Join-Path $FrontendRoot "src\pages\Register.js"
if (Test-Path $RegisterFile) {
    $raw3 = [System.IO.File]::ReadAllText($RegisterFile, (New-Object System.Text.UTF8Encoding($false)))
    $norm3 = $raw3 -replace "`r`n", "`n"
    $oldInput = '<input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={styles.input} />'
    $newInput = '<input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={styles.input} required placeholder="+237 6XX XXX XXX" />'
    if ($norm3 -match [regex]::Escape($oldInput)) {
        Backup-File $RegisterFile
        $norm3 = $norm3.Replace($oldInput, $newInput)
        [System.IO.File]::WriteAllText($RegisterFile, $norm3, (New-Object System.Text.UTF8Encoding($false)))
        Write-Host "Register.js : champ telephone rendu obligatoire (+ placeholder)" -ForegroundColor Green
    } else {
        Write-Host "Register.js : ligne non trouvee telle quelle (deja modifie ?)" -ForegroundColor Yellow
    }
} else {
    Write-Host "frontend/src/pages/Register.js introuvable. Ignore." -ForegroundColor Yellow
}

# ================== 4. translations.js ==================
$TranslationsFile = Join-Path $FrontendRoot "src\context\translations.js"
if (Test-Path $TranslationsFile) {
    Backup-File $TranslationsFile
    $raw4 = [System.IO.File]::ReadAllText($TranslationsFile, (New-Object System.Text.UTF8Encoding($false)))
    $norm4 = $raw4 -replace "`r`n", "`n"

    # --- 4a. Libelles du champ telephone (5 langues) ---
    $phoneLabels = @(
        @{ Old = 'register_phone: "T__EACUTE__l__EACUTE__phone (optionnel)",'; New = 'register_phone: "T__EACUTE__l__EACUTE__phone WhatsApp",' },
        @{ Old = 'register_phone: "Phone (optional)",'; New = 'register_phone: "WhatsApp phone number",' },
        @{ Old = 'register_phone: "Telefono (opcional)",'; New = 'register_phone: "N__UACUTE__mero de WhatsApp",' },
        @{ Old = 'register_phone: "Telefone (opcional)",'; New = 'register_phone: "N__UACUTE__mero de WhatsApp",' },
        @{ Old = 'register_phone: "Telefon (optional)",'; New = 'register_phone: "WhatsApp-Telefonnummer",' }
    )

    $changed4a = 0
    foreach ($p in $phoneLabels) {
        $old = $p.Old.Replace('__EACUTE__', $eacute).Replace('__UACUTE__', $uacute)
        $new = $p.New.Replace('__EACUTE__', $eacute).Replace('__UACUTE__', $uacute)
        if ($norm4 -match [regex]::Escape($old)) {
            $norm4 = $norm4.Replace($old, $new)
            $changed4a++
        }
    }
    Write-Host "$changed4a libelle(s) telephone mis a jour" -ForegroundColor Green

    # --- 4b. Cle adm_btn_whatsapp (5 langues), ajoutee juste apres adm_th_actions ---
    $adminAnchors = @(
        @{ Old = 'adm_th_actions: "Actions",'; New = 'adm_th_actions: "Actions", adm_btn_whatsapp: "Relancer sur WhatsApp",'; Count = 1 },
        @{ Old = 'adm_th_actions: "Aktionen",'; New = 'adm_th_actions: "Aktionen", adm_btn_whatsapp: "Per WhatsApp erinnern",' }
    )

    # FR et EN partagent tous deux "adm_th_actions: "Actions","" -> on les distingue par le contexte du bloc entier (Duree vs Duration)
    $adminAnchorsPrecise = @(
        @{ Old = 'adm_th_duration: "Dur__EACUTE__e", adm_th_status: "Statut", adm_th_actions: "Actions",'; New = 'adm_th_duration: "Dur__EACUTE__e", adm_th_status: "Statut", adm_th_actions: "Actions", adm_btn_whatsapp: "Relancer sur WhatsApp",' },
        @{ Old = 'adm_th_duration: "Duration", adm_th_status: "Status", adm_th_actions: "Actions",'; New = 'adm_th_duration: "Duration", adm_th_status: "Status", adm_th_actions: "Actions", adm_btn_whatsapp: "Follow up on WhatsApp",' },
        @{ Old = 'adm_th_duration: "Duracion", adm_th_status: "Estado", adm_th_actions: "Acciones",'; New = 'adm_th_duration: "Duracion", adm_th_status: "Estado", adm_th_actions: "Acciones", adm_btn_whatsapp: "Reenviar por WhatsApp",' },
        @{ Old = 'adm_th_duration: "Duracao", adm_th_status: "Estado", adm_th_actions: "Acoes",'; New = 'adm_th_duration: "Duracao", adm_th_status: "Estado", adm_th_actions: "Acoes", adm_btn_whatsapp: "Reenviar por WhatsApp",' },
        @{ Old = 'adm_th_duration: "Laufzeit", adm_th_status: "Status", adm_th_actions: "Aktionen",'; New = 'adm_th_duration: "Laufzeit", adm_th_status: "Status", adm_th_actions: "Aktionen", adm_btn_whatsapp: "Per WhatsApp erinnern",' }
    )

    $changed4b = 0
    foreach ($p in $adminAnchorsPrecise) {
        $old = $p.Old.Replace('__EACUTE__', $eacute)
        $new = $p.New.Replace('__EACUTE__', $eacute)
        if ($norm4 -match [regex]::Escape($old)) {
            $norm4 = $norm4.Replace($old, $new)
            $changed4b++
        }
    }
    Write-Host "$changed4b cle(s) adm_btn_whatsapp ajoutee(s)" -ForegroundColor Green

    [System.IO.File]::WriteAllText($TranslationsFile, $norm4, (New-Object System.Text.UTF8Encoding($false)))
} else {
    Write-Host "translations.js introuvable. Ignore." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Etape 1/2 terminee. Lance maintenant Add-AdminWhatsAppButton.ps1 (etape 2/2)." -ForegroundColor Cyan
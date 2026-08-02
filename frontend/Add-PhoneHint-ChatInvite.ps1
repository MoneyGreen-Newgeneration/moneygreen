<#
    Ajout : (1) Texte d'aide "numero WhatsApp" sur la page d'inscription
            (2) Bulle d'invitation au chat avec effet machine a ecrire
                en boucle, a cote de l'icone de chat

    A executer depuis la racine du dossier frontend/
#>

$ErrorActionPreference = "Stop"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

function Backup-File($path) {
    $bak = "$path.bak_$Timestamp"
    Copy-Item $path $bak
    Write-Host "Backup cree : $(Split-Path $bak -Leaf)" -ForegroundColor Green
}

# ================== 1. Register.js : texte d'aide ==================
$RegisterFile = Join-Path $PSScriptRoot "src\pages\Register.js"

if (Test-Path $RegisterFile) {
    $raw = [System.IO.File]::ReadAllText($RegisterFile, (New-Object System.Text.UTF8Encoding($false)))
    $norm = $raw -replace "`r`n", "`n"

    if ($norm -match [regex]::Escape('register_phone_hint')) {
        Write-Host "Register.js contient deja le texte d'aide. Aucune modification faite." -ForegroundColor Yellow
    }
    else {
        $anchor = '<input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={styles.input} required placeholder="+237 6XX XXX XXX" />'
        if ($norm -match [regex]::Escape($anchor)) {
            Backup-File $RegisterFile
            $addition = $anchor + "`n          <small style={styles.hint}>{t(`"register_phone_hint`")}</small>"
            $norm = $norm.Replace($anchor, $addition)

            # Ajout du style "hint" s'il n'existe pas deja (recherche de getStyles)
            if ($norm -notmatch [regex]::Escape('hint:')) {
                $styleAnchor = 'label: {'
                if ($norm -match [regex]::Escape($styleAnchor)) {
                    $styleAddition = "hint: { fontSize: `".78rem`", opacity: .7, fontWeight: 400, marginTop: 4, display: `"block`" },`n    " + $styleAnchor
                    $norm = $norm.Replace($styleAnchor, $styleAddition)
                }
            }

            [System.IO.File]::WriteAllText($RegisterFile, $norm, (New-Object System.Text.UTF8Encoding($false)))
            Write-Host "Register.js : texte d'aide ajoute" -ForegroundColor Green
        } else {
            Write-Host "Register.js : ancre introuvable (deja modifie ?)." -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "Register.js introuvable. Ignore." -ForegroundColor Yellow
}

# ================== 2. translations.js : cle register_phone_hint ==================
$TranslationsFile = Join-Path $PSScriptRoot "src\context\translations.js"

if (Test-Path $TranslationsFile) {
    $raw2 = [System.IO.File]::ReadAllText($TranslationsFile, (New-Object System.Text.UTF8Encoding($false)))
    $norm2 = $raw2 -replace "`r`n", "`n"

    if ($norm2 -match [regex]::Escape('register_phone_hint')) {
        Write-Host "translations.js contient deja register_phone_hint." -ForegroundColor Yellow
    }
    else {
        Backup-File $TranslationsFile

        $eacute = [System.Char]::ConvertFromUtf32(0x00E9)
        $egrave = [System.Char]::ConvertFromUtf32(0x00E8)

        $hints = @(
            @{ Old = 'register_phone: "T__EACUTE__l__EACUTE__phone WhatsApp",'; New = 'register_phone: "T__EACUTE__l__EACUTE__phone WhatsApp", register_phone_hint: "Ce num__EACUTE__ro doit __EGRAVE__tre votre num__EACUTE__ro WhatsApp, il nous servira __EGRAVE__ vous contacter.",' },
            @{ Old = 'register_phone: "WhatsApp phone number",'; New = 'register_phone: "WhatsApp phone number", register_phone_hint: "This must be your WhatsApp number, we will use it to contact you.",' },
            @{ Old = 'register_phone: "N__UACUTE__mero de WhatsApp", register_password: "Contrasena",'; New = 'register_phone: "N__UACUTE__mero de WhatsApp", register_phone_hint: "Debe ser tu numero de WhatsApp, lo usaremos para contactarte.", register_password: "Contrasena",' },
            @{ Old = 'register_phone: "N__UACUTE__mero de WhatsApp", register_password: "Palavra-passe",'; New = 'register_phone: "N__UACUTE__mero de WhatsApp", register_phone_hint: "Deve ser o seu numero de WhatsApp, vamos usa-lo para contata-lo.", register_password: "Palavra-passe",' },
            @{ Old = 'register_phone: "WhatsApp-Telefonnummer",'; New = 'register_phone: "WhatsApp-Telefonnummer", register_phone_hint: "Dies muss Ihre WhatsApp-Nummer sein, wir verwenden sie, um Sie zu kontaktieren.",' }
        )
        $uacute = [System.Char]::ConvertFromUtf32(0x00FA)

        $changed = 0
        foreach ($h in $hints) {
            $old = $h.Old.Replace('__EACUTE__', $eacute).Replace('__EGRAVE__', $egrave).Replace('__UACUTE__', $uacute)
            $new = $h.New.Replace('__EACUTE__', $eacute).Replace('__EGRAVE__', $egrave).Replace('__UACUTE__', $uacute)
            if ($norm2 -match [regex]::Escape($old)) {
                $norm2 = $norm2.Replace($old, $new)
                $changed++
            }
        }

        [System.IO.File]::WriteAllText($TranslationsFile, $norm2, (New-Object System.Text.UTF8Encoding($false)))
        Write-Host "$changed langue(s) : cle register_phone_hint ajoutee" -ForegroundColor Green
    }
} else {
    Write-Host "translations.js introuvable. Ignore." -ForegroundColor Yellow
}

# ================== 3. Nouveau composant ChatTypingHint ==================
$ComponentsDir = Join-Path $PSScriptRoot "src\components\chat"
$HintJsPath = Join-Path $ComponentsDir "ChatTypingHint.js"
$HintCssPath = Join-Path $ComponentsDir "ChatTypingHint.css"

$hintJsContent = @'
import { useEffect, useState } from "react";
import "./ChatTypingHint.css";

export default function ChatTypingHint({ text }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    let i = 0;
    let deleting = false;
    let timeoutId;

    function tick() {
      if (!deleting) {
        i++;
        setDisplayText(text.slice(0, i));
        if (i === text.length) {
          timeoutId = setTimeout(() => { deleting = true; tick(); }, 1800);
          return;
        }
        timeoutId = setTimeout(tick, 55);
      } else {
        i--;
        setDisplayText(text.slice(0, i));
        if (i === 0) {
          deleting = false;
          timeoutId = setTimeout(tick, 900);
          return;
        }
        timeoutId = setTimeout(tick, 28);
      }
    }

    timeoutId = setTimeout(tick, 500);
    return () => clearTimeout(timeoutId);
  }, [text]);

  return (
    <div className="chat-typing-hint">
      {displayText}
      <span className="chat-typing-cursor">|</span>
    </div>
  );
}
'@

$hintCssContent = @'
.chat-typing-hint {
  position: fixed;
  bottom: 34px;
  right: 92px;
  z-index: 1499;
  background: #fff;
  color: #1c1f1d;
  padding: 10px 14px;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0,0,0,.18);
  font-size: .82rem;
  font-weight: 600;
  max-width: 210px;
  min-height: 20px;
  line-height: 1.3;
}

.chat-typing-hint::after {
  content: "";
  position: absolute;
  top: 50%;
  right: -7px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 7px solid #fff;
}

.chat-typing-cursor {
  display: inline-block;
  animation: chatCursorBlink 1s step-end infinite;
}

@keyframes chatCursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

body.dark-mode .chat-typing-hint {
  background: #23262a;
  color: #f1f1f1;
  box-shadow: 0 8px 20px rgba(0,0,0,.5);
}

body.dark-mode .chat-typing-hint::after {
  border-left-color: #23262a;
}

@media (max-width: 640px) {
  .chat-typing-hint { bottom: 26px; right: 76px; font-size: .78rem; max-width: 170px; }
}
'@

if (-not (Test-Path $HintJsPath)) {
    New-Item -ItemType Directory -Path $ComponentsDir -Force | Out-Null
    [System.IO.File]::WriteAllText($HintJsPath, ($hintJsContent -replace "`r`n", "`n"), (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Cree : src/components/chat/ChatTypingHint.js" -ForegroundColor Green
} else {
    Write-Host "ChatTypingHint.js existe deja, non modifie." -ForegroundColor Yellow
}

if (-not (Test-Path $HintCssPath)) {
    [System.IO.File]::WriteAllText($HintCssPath, ($hintCssContent -replace "`r`n", "`n"), (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Cree : src/components/chat/ChatTypingHint.css" -ForegroundColor Green
} else {
    Write-Host "ChatTypingHint.css existe deja, non modifie." -ForegroundColor Yellow
}

# ================== 4. Integration dans ChatWidget.js ==================
$ChatWidgetFile = Join-Path $PSScriptRoot "src\components\chat\ChatWidget.js"

if (Test-Path $ChatWidgetFile) {
    $raw4 = [System.IO.File]::ReadAllText($ChatWidgetFile, (New-Object System.Text.UTF8Encoding($false)))
    $norm4 = $raw4 -replace "`r`n", "`n"

    if ($norm4 -match [regex]::Escape('ChatTypingHint')) {
        Write-Host "ChatWidget.js integre deja ChatTypingHint. Aucune modification faite." -ForegroundColor Yellow
    }
    else {
        Backup-File $ChatWidgetFile

        $importAnchor = 'import ReplyPreview from "./ReplyPreview";'
        $importAddition = $importAnchor + "`nimport ChatTypingHint from " + '"./ChatTypingHint";'
        if ($norm4 -notmatch [regex]::Escape($importAnchor)) {
            Write-Host "Ancre d'import introuvable dans ChatWidget.js." -ForegroundColor Red
            exit 1
        }
        $norm4 = $norm4.Replace($importAnchor, $importAddition)

        $renderAnchor = @'
      <button className="chat-bubble" onClick={() => setOpen(o => !o)}>
'@
        $renderAnchor = ($renderAnchor -replace "`r`n", "`n")

        $renderAddition = @'
      {!open && (
        <ChatTypingHint text="Rejoignez-nous via le chat" />
      )}
      <button className="chat-bubble" onClick={() => setOpen(o => !o)}>
'@
        $renderAddition = ($renderAddition -replace "`r`n", "`n")

        if ($norm4 -notmatch [regex]::Escape($renderAnchor)) {
            Write-Host "Ancre de rendu introuvable dans ChatWidget.js." -ForegroundColor Red
            [System.IO.File]::WriteAllText($ChatWidgetFile, $norm4, (New-Object System.Text.UTF8Encoding($false)))
            exit 1
        }
        $norm4 = $norm4.Replace($renderAnchor, $renderAddition)

        [System.IO.File]::WriteAllText($ChatWidgetFile, $norm4, (New-Object System.Text.UTF8Encoding($false)))
        Write-Host "ChatWidget.js : ChatTypingHint integre" -ForegroundColor Green
    }
} else {
    Write-Host "ChatWidget.js introuvable. Ignore." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Prochaine etape : commit + push pour relancer le build Vercel." -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host "  git commit -m feat-whatsapp-hint-and-chat-bubble-invite"
Write-Host "  git push"
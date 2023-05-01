// Deutsch

export default {
  'commands': {
    'lint-file': {
      'name': 'Flusen Sie die aktuelle Datei',
      'error-message': 'Lint-Datei-Fehler in der Datei',
    },
    'lint-file-unless-ignored': {
      'name': 'Flusen Sie die aktuelle Datei, es sei denn, sie wird ignoriert',
    },
    'lint-all-files': {
      'name': 'Flusen Sie alle Dateien im Tresor',
      'error-message': 'Lint alle Dateien Fehler in der Datei',
      'success-message': 'Alle Dateien gelinzelt',
      'errors-message-singular': 'Alle Dateien wurden gefüttert und es gab 1 Fehler.',
      'errors-message-plural': 'Alle Dateien wurden gelähmt und es gab {NUM}-Fehler.',
      'start-message': 'Dadurch werden alle Ihre Dateien bearbeitet und es kann zu Fehlern kommen.',
      'submit-button-text': 'Fussel alle',
      'submit-button-notice-text': 'Linting alle Dateien...',
    },
    'lint-all-files-in-folder': {
      'name': 'Flusen Sie alle Dateien im aktuellen Ordner',
      'start-message': 'Dadurch werden alle Ihre Dateien in {FOLDER_NAME} bearbeitet, einschließlich der Dateien in den Unterordnern, die zu Fehlern führen können.',
      'submit-button-text': 'Lint alle Dateien in {FOLDER_NAME}',
      'submit-button-notice-text': 'Linting aller Dateien in {FOLDER_NAME}...',
      'error-message': 'Lint alle Dateien im Ordner Fehler in der Datei',
      'success-message': 'Alle {NUM}-Dateien wurden in {FOLDER_NAME} gelinzelt.',
      'message-singular': 'Alle {NUM}-Dateien in {FOLDER_NAME} wurden gefüttert und es trat 1 Fehler auf.',
      'message-plural': 'Alle {FILE_COUNT}-Dateien in {FOLDER_NAME} wurden gelinzelt und es gab einen {ERROR_COUNT}-Fehler.',
    },
    'paste-as-plain-text': {
      'name': 'Einfügen als reiner Text und ohne Änderungen',
    },
    'lint-file-pop-up-menu-text': {
      'name': 'Lint-Datei',
    },
    'lint-folder-pop-up-menu-text': {
      'name': 'Fussel-Ordnerr',
    },
  },

  'logs': {
    'plugin-load': 'Plugin wird geladen',
    'plugin-unload': 'Plugin entladen',
    'folder-lint': 'Linting-Ordner ',
    'linter-run': 'Laufender Linter',
    'paste-link-warning': 'Abgebrochenes Einfügen von Flusen, da der Inhalt der Zwischenablage ein Link ist, wodurch Konflikte mit anderen Plugins vermieden werden, die das Einfügen ändern.',
    'see-console': 'Weitere Informationen finden Sie unter Konsole.',
    'unknown-error': 'Beim Flusen ist ein unbekannter Fehler aufgetreten.',
    'moment-locale-not-found': 'Beim Versuch, Moment.js locale auf {MOMENT_LOCALE} umzustellen, wurde {CURRENT_LOCALE} angezeigt',

    // rules-runner.ts
    'pre-rules': 'Regeln vor regulären Regeln',
    'post-rules': 'Regeln nach regulären Regeln',
    'rule-running': 'Laufende Regeln',
    'custom-regex': 'Benutzerdefinierte Regex-Regeln',
    'running-custom-regex': 'Ausführen von benutzerdefinierten Regex',
    'running-custom-lint-command': 'Ausführen von benutzerdefinierten Lint-Befehlen',
    'custom-lint-duplicate-warning': 'Sie können denselben Befehl ("{COMMAND_NAME}") nicht zweimal als benutzerdefinierte Lint-Regel ausführen.',
    'custom-lint-error-message': 'Benutzerdefinierter Lint-Befehl',

    // rules-runner.ts and rule-builder.ts
    'disabled-text': 'ist deaktiviert',

    // rule-builder.ts
    'run-rule-text': 'Ausgeführte',

    // logger.ts
    'timing-key-not-found': 'Der Timing-Schlüssel \'{TIMING_KEY}\' ist in der Timing-Info-Liste nicht vorhanden, daher wurde er ignoriert',
    'milliseconds-abbreviation': 'ms',

    'invalid-date-format-error': `Das Format des Erstellungsdatums '{DATE}' konnte nicht analysiert oder bestimmt werden, sodass das Erstellungsdatum in '{FILE_NAME}`,

    // yaml.ts
    'invalid-delimiter-error-message': 'Trennzeichen darf nur ein einzelnes Zeichen sein',

    // mdast.ts
    'missing-footnote-error-message': `Die Fußnote '{FOOTNOTE}' hat keinen entsprechenden Fußnotenverweis vor dem Fußnoteninhalt und kann nicht verarbeitet werden. Bitte achten Sie darauf, dass alle Fußnoten vor dem Inhalt der Fußnote einen entsprechenden Verweis haben.`,
    'too-many-footnotes-error-message': `Der Fußnotenschlüssel '{FOOTNOTE_KEY}' hat mehr als 1 Fußnote, die darauf verweist. Bitte aktualisieren Sie die Fußnoten so, dass es nur noch eine Fußnote pro Fußnotenschlüssel gibt.`,

    // rules.ts
    'wrapper-yaml-error': 'Fehler in der YAML: {ERROR_MESSAGE}',
    'wrapper-unknown-error': 'Unbekannter Fehler: {ERROR_MESSAGE}',
  },

  'notice-text': {
    'empty-clipboard': 'Es gibt keinen Inhalt der Zwischenablage.',
    'characters-added': 'Hinzugefügte Charaktere',
    'characters-removed': 'Zeichen entfernt',
  },

  // settings.ts
  'linter-title': 'Linter',
  'empty-search-results-text': 'Keine Einstellungen stimmen mit der Suche überein',

  // lint-confirmation-modal.ts
  'warning-text': 'Warnung',
  'file-backup-text': 'Stellen Sie sicher, dass Sie Ihre Dateien gesichert haben.',

  'tabs': {
    'names': {
      // tab.ts
      'general': 'Allgemeine Einstellungen',
      'custom': 'Benutzerdefinierte Einstellungen',
      'yaml': 'YAML-Einstellungen',
      'heading': 'Einstellungen für die Überschrift',
      'content': 'Fußnoten-Einstellungen',
      'footnote': 'Inhaltseinstellungen',
      'spacing': 'Abstandseinstellungen',
      'paste': 'Einstellungen einfügen',
      'debug': 'Debug-Einstellungen',
    },
    // tab-searcher.ts
    'default-search-bar-text': 'Alle Einstellungen durchsuchen',
    'general': {
      // general-tab.ts
      'lint-on-save': {
        'name': 'Flusen beim Speichern',
        'description': 'Lenken Sie die Datei beim manuellen Speichern (wenn `Strg + S` gedrückt wird oder wenn `:w` ausgeführt wird, während vim-Tastenkombinationen verwendet werden)',
      },
      'display-message': {
        'name': 'Meldung auf Flusen anzeigen',
        'description': 'Zeigen Sie die Anzahl der Zeichen an, die sich nach dem Linsen geändert haben',
      },
      'folders-to-ignore': {
        'name': 'Ordner, die ignoriert werden sollen',
        'description': 'Ordner, die ignoriert werden sollen, wenn alle Dateien gestürzt oder beim Speichern gestürzt werden. Geben Sie Ordnerpfade ein, die durch Zeilenumbrüche getrennt sind',
      },
      'override-locale': {
        'name': 'Gebietsschema überschreiben',
        'description': 'Legen Sie diese Option fest, wenn Sie ein anderes Gebietsschema als das Standardgebietsschema verwenden möchten',
      },
      'same-as-system-locale': 'Identisch mit System ({SYS_LOCALE})',
      'yaml-aliases-section-style': {
        'name': 'YAML-Aliase-Abschnittsstil',
        'description': 'Der Stil des YAML-Aliasabschnitts',
      },
      'yaml-tags-section-style': {
        'name': 'Abschnittsstil für YAML-Tags',
        'description': 'Der Stil des YAML-Tags-Abschnitts',
      },
      'default-escape-character': {
        'name': 'Standard-Escape-Zeichen',
        'description': 'Das Standardzeichen, das zum Maskieren von YAML-Werten verwendet werden soll, wenn ein einfaches Anführungszeichen und kein doppeltes Anführungszeichen vorhanden sind.',
      },
      'remove-unnecessary-escape-chars-in-multi-line-arrays': {
        'name': 'Entfernen Sie unnötige Escape-Zeichen im mehrzeiligen Array-Format',
        'description': 'Escape-Zeichen für mehrzeilige YAML-Arrays benötigen nicht die gleiche Escape-Funktion wie einzeilige Arrays. Entfernen Sie also im mehrzeiligen Format zusätzliche Escapezeichen, die nicht erforderlich sind',
      },
      'number-of-dollar-signs-to-indicate-math-block': {
        'name': 'Anzahl der Dollarzeichen, die den Matheblock anzeigen',
        'description': 'Die Anzahl der Dollarzeichen, um den mathematischen Inhalt als mathematischen Block anstelle von Inline-Mathematik zu betrachten',
      },
    },
    'debug': {
    // debug-tab.ts
      'log-level': {
        'name': 'Log-Ebene',
        'description': 'Die Arten von Protokollen, die vom Dienst protokolliert werden dürfen. Der Standardwert ist Fehler.',
      },
      'linter-config': {
        'name': 'Linter-Konfiguration',
        'description': 'Der Inhalt der data.json für den Linter zum Zeitpunkt des Ladens der Einstellungsseite',
      },
      'log-collection': {
        'name': 'Sammeln Sie Protokolle, wenn Sie beim Speichern und Flusen der aktuellen Datei flusen',
        'description': 'Geht voran und sammelt Protokolle, wenn Sie `Flusen beim Speichern` und die aktuelle Datei flusen. Diese Protokolle können beim Debuggen und Erstellen von Fehlerberichten hilfreich sein.',
      },
      'linter-logs': {
        'name': 'Linter-Protokolle',
        'description': 'Die Protokolle der letzten `Flusen beim Speichern` oder der letzten aktuellen Flusendatei werden ausgeführt, wenn sie aktiviert sind.',
      },
    },
  },

  'options': {
    'custom-command': {
      // custom-command-option.ts
      'name': 'Benutzerdefinierte Befehle',
      'description': 'Benutzerdefinierte Befehle sind Obsidian-Befehle, die ausgeführt werden, nachdem der Linter seine regulären Regeln ausgeführt hat. Dies bedeutet, dass sie nicht ausgeführt werden, bevor die YAML-Zeitstempellogik ausgeführt wird, sodass sie dazu führen können, dass der YAML-Zeitstempel bei der nächsten Ausführung des Linter ausgelöst wird. Sie können einen Obsidian-Befehl nur einmal auswählen. **_Beachten Sie, dass dies derzeit nur beim Flusen der aktuellen Datei funktioniert._**',
      'warning': 'Wenn Sie eine Option auswählen, stellen Sie sicher, dass Sie die Option entweder mit der Maus oder durch Drücken der Eingabetaste auswählen. Andere Auswahlmethoden funktionieren möglicherweise nicht und es werden nur Auswahlen eines tatsächlichen Obsidian-Befehls oder einer leeren Zeichenfolge gespeichert.',

      'add-input-button-text': 'Neuen Befehl hinzufügen',
      'command-search-placeholder-text': 'Obsidian-Befehl',
      'move-up-tooltip': 'Aufrücken',
      'move-down-tooltip': 'Bewegen Sie sich nach unten',
      'delete-tooltip': 'Löschen',
    },
    'custom-replace': {
      // custom-replace-option.ts
      'name': 'Benutzerdefinierter Regex-Ersatz',
      'description': 'Der benutzerdefinierte Regex-Ersatz kann verwendet werden, um alles zu ersetzen, was mit dem Such-Regex mit dem Ersatzwert übereinstimmt. Bei den Werten replace und find muss es sich um gültige Regex-Werte handeln.',
      'warning': 'Verwenden Sie dies mit Vorsicht, wenn Sie Regex nicht kennen. Stellen Sie außerdem sicher, dass Sie keine Lookbehinds in Ihrem regulären Ausdruck auf iOS-Mobilgeräten verwenden, da dies dazu führt, dass Flusen fehlschlagen, da dies auf dieser Plattform nicht unterstützt wird.',
      'add-input-button-text': 'Neuen Regex-Ersatz hinzufügen',
      'regex-to-find-placeholder-text': 'Regex zu finden',
      'flags-placeholder-text': 'Flaggen',
      'regex-to-replace-placeholder-text': 'Regex zu ersetzen',
      'delete-tooltip': 'Löschen',
    },
  },

  // rules
  'rules': {
    // auto-correct-common-misspellings.ts
    'auto-correct-common-misspellings': {
      'name': 'Häufige Rechtschreibfehler automatisch korrigieren',
      'description': 'Verwendet ein Wörterbuch mit häufigen Rechtschreibfehlern, um sie automatisch in die richtige Schreibweise umzuwandeln. Siehe [Autokorrekturkarte](https://github.com/platers/obsidian-linter/tree/master/src/utils/auto-correct-misspellings.ts) für die vollständige Liste der automatisch korrigierten Wörter.',
      'ignore-words': {
        'name': 'Ignorieren Sie Wörter',
        'description': 'Eine durch Kommas getrennte Liste von Wörtern in Kleinbuchstaben, die bei der automatischen Korrektur ignoriert werden sollen',
      },
    },
    // blockquotify-on-paste.ts
    'add-blockquote-indentation-on-paste': {
      'name': 'Blockquote-Einrückung beim Einfügen hinzufügen',
      'description': 'Fügt Blockzitate zu allen außer der ersten Zeile hinzu, wenn sich der Cursor während des Einfügens in einer Blockquote/Callout-Zeile befindet',
    },
    // capitalize-headings.ts
    'capitalize-headings': {
      'name': 'Überschriften groß schreiben',
      'description': 'Überschriften sollten mit Groß- und Kleinschreibung formatiert werden',
      'style': {
        'name': 'Stil',
        'description': 'Die Art der zu verwendenden Großschreibung',
      },
      'ignore-case-words': {
        'name': 'Ignore Cased Words',
        'description': 'Only apply title case style to words that are all lowercase',
      },
      'ignore-words': {
        'name': 'Ignorieren Sie Groß-/Kleinschreibungswörter',
        'description': 'Eine durch Kommas getrennte Liste von Wörtern, die bei der Großschreibung ignoriert werden sollen',
      },
      'lowercase-words': {
        'name': 'Wörter in Kleinbuchstaben',
        'description': 'Eine durch Kommas getrennte Liste von Wörtern, um Kleinbuchstaben zu behalten',
      },
    },
    // compact-yaml.ts
    'compact-yaml': {
      'name': 'Kompakte YAML',
      'description': 'Entfernt führende und nachfolgende Leerzeilen in der YAML-Frontmaterie.',
      'inner-new-lines': {
        'name': 'Innere neue Linien',
        'description': 'Entfernen Sie neue Zeilen, die sich nicht am Anfang oder am Ende der YAML befinden',
      },
    },
    // consecutive-blank-lines.ts
    'consecutive-blank-lines': {
      'name': 'Consecutive blank lines',
      'description': 'There should be at most one consecutive blank line.',
    },
    // convert-bullet-list-markers.ts
    'convert-bullet-list-markers': {
      'name': 'Aufeinanderfolgende Leerzeilen',
      'description': 'Konvertiert gängige Symbole für Aufzählungslisten in Markdown-Listenmarkierungen.',
    },
    // convert-spaces-to-tabs.ts
    'convert-spaces-to-tabs': {
      'name': 'Leerzeichen in Tabulatoren konvertieren',
      'description': 'Konvertiert führende Leerzeichen in Tabulatoren.',
      'tabsize': {
        'name': 'Tabgröße',
        'description': 'Anzahl der Leerzeichen, die in eine Registerkarte umgewandelt werden',
      },
    },
    // emphasis-style.ts
    'emphasis-style': {
      'name': 'Betonung Stil',
      'description': 'Stellt sicher, dass der Hervorhebungsstil konsistent ist.',
      'style': {
        'name': 'Stil',
        'description': 'Der Stil, der verwendet wird, um hervorgehobene Inhalte zu kennzeichnen',
      },
    },
    // empty-line-around-blockquotes.ts
    'empty-line-around-blockquotes': {
      'name': 'Leere Zeile um Blockquotes',
      'description': 'Stellt sicher, dass Blockzitate in einer leeren Zeile stehen, es sei denn, sie beginnen oder beenden ein Dokument. **Beachten Sie, dass eine leere Zeile entweder eine Verschachtelungsebene weniger für Blockzitate oder ein Zeilenumbruchzeichen ist.**',
    },
    // empty-line-around-code-fences.ts
    'empty-line-around-code-fences': {
      'name': 'Leere Zeile um Code-Zäune',
      'description': 'Stellt sicher, dass Codezäune mit einer leeren Zeile versehen sind, es sei denn, sie beginnen oder beenden ein Dokument.',
    },
    // empty-line-around-math-block.ts
    'empty-line-around-math-blocks': {
      'name': 'Leere Zeile um mathematische Blöcke',
      'description': 'Stellt sicher, dass es eine leere Zeile um mathematische Blöcke gibt, indem `Anzahl der Dollarzeichen, die einen mathematischen Block anzeigen` verwendet wird, um zu bestimmen, wie viele Dollarzeichen einen mathematischen Block für einzeilige Mathematik anzeigen.',
    },
    // empty-line-around-tables.ts
    'empty-line-around-tables': {
      'name': 'Leere Zeile um Tabellen',
      'description': 'Stellt sicher, dass es eine leere Zeile um Github-Tabellen gibt, es sei denn, sie beginnen oder beenden ein Dokument.',
    },
    // escape-yaml-special-characters.ts
    'escape-yaml-special-characters': {
      'name': 'Escape-YAML-Sonderzeichen',
      'description': 'Maskiert Doppelpunkte mit einem Leerzeichen nach ihnen (:), einfache Anführungszeichen (\') und doppelte Anführungszeichen (") in YAML.',
      'try-to-escape-single-line-arrays': {
        'name': 'Versuchen Sie, Single-Line-Arrays zu umgehen',
        'description': 'Versucht, Arraywerte zu maskieren, wobei davon ausgegangen wird, dass ein Array mit "[" beginnt, mit "]" endet und Elemente enthält, die durch "," getrennt sind.',
      },
    },
    // file-name-heading.ts
    'file-name-heading': {
      'name': 'Überschrift des Dateinamens',
      'description': 'Fügt den Dateinamen als H1-Überschrift ein, wenn keine H1-Überschrift vorhanden ist.',
    },
    // footnote-after-punctuation.ts
    'footnote-after-punctuation': {
      'name': 'Fußnote nach Interpunktion',
      'description': 'Stellt sicher, dass Fußnotenverweise nach der Interpunktion und nicht davor platziert werden.',
    },
    // force-yaml-escape.ts
    'force-yaml-escape': {
      'name': 'YAML-Escape erzwingen',
      'description': 'Maskiert die Werte für die angegebenen YAML-Schlüssel.',
      'force-yaml-escape-keys': {
        'name': 'Erzwingen Sie die YAML-Escape-Klausel für Schlüssel',
        'description': 'Verwendet das YAML-Escapezeichen für die angegebenen YAML-Schlüssel, die durch ein Zeilenumbruchzeichen getrennt sind, wenn es nicht bereits mit Escapezeichen versehen ist. Nicht auf YAML-Arrays verwenden.',
      },
    },
    // format-tags-in-yaml.ts
    'format-tags-in-yaml': {
      'name': 'Formatieren von Tags in YAML',
      'description': 'Entfernen Sie Hashtags aus Tags in der YAML-Frontmaterie, da sie die Tags dort ungültig machen.',
    },
    // format-yaml-array.ts
    'format-yaml-array': {
      'name': 'Formatieren des Yaml-Arrays',
      'description': 'Ermöglicht die Formatierung von regulären yaml-Arrays als mehrzeilig oder einzeilig und `schilder` und `decknamen` dürfen einige Obsidian-spezifische Yaml-Formate haben. Beachten Sie, dass eine einzelne Zeichenfolge zu einer einzelnen Zeile von einem einzelnen Zeichenfolgeneintrag zu einem einzeiligen Array wechselt, wenn mehr als 1 Eintrag vorhanden ist. Das Gleiche gilt für eine einzelne Zeichenfolge bis zu einer mehrzeiligen Zeichenfolge, mit der Ausnahme, dass sie zu einem mehrzeiligen Array wird.',
      'alias-key': {
        'name': 'Abschnitt "YAML-Aliase" formatieren',
        'description': 'Aktiviert die Formatierung für den Abschnitt YAML-Aliase. Sie sollten diese Option nicht zusammen mit der Regel `YAML-Titel-Alias` aktivieren, da sie möglicherweise nicht gut zusammenarbeiten oder unterschiedliche Formatstile ausgewählt haben, was zu unerwarteten Ergebnissen führt.',
      },
      'tag-key': {
        'name': 'Abschnitt "YAML-Tags formatieren"',
        'description': 'Aktiviert die Formatierung für den Abschnitt YAML-Tags.',
      },
      'default-array-style': {
        'name': 'Standardmäßiger YAML-Array-Abschnittsstil',
        'description': 'Der Stil anderer yaml-Arrays, die nicht `schilder`, `decknamen` oder in `Erzwingen von Schlüsselwerten, dass es sich um einzeilige Arrays handelt` und `Erzwingen von Schlüsselwerten, dass es sich um mehrzeilige Arrays handelt` sind',
      },
      'default-array-keys': {
        'name': 'Formatieren von Yaml-Array-Abschnitten',
        'description': 'Aktiviert die Formatierung für reguläre YAML-Arrays',
      },
      'force-single-line-array-style': {
        'name': 'Erzwingen von Schlüsselwerten, dass es sich um einzeilige Arrays handelt',
        'description': 'Erzwingt, dass das YAML-Array für die neuen zeilengetrennten Schlüssel im einzeiligen Format vorliegt (leer lassen, um diese Option zu deaktivieren)',
      },
      'force-multi-line-array-style': {
        'name': 'Erzwingen von Schlüsselwerten, dass es sich um mehrzeilige Arrays handelt',
        'description': 'Erzwingt, dass das yaml-Array für die neuen zeilengetrennten Schlüssel im mehrzeiligen Format vorliegt (leer lassen, um diese Option zu deaktivieren)',
      },
    },
    // header-increment.ts
    'header-increment': {
      'name': 'Header-Inkrement',
      'description': 'Überschriftenebenen sollten jeweils nur um eine Ebene erhöht werden',
      'start-at-h2': {
        'name': 'Start-Header-Inkrement auf Überschriftenebene 2',
        'description': 'Legt die Überschriftenebene 2 als minimale Überschriftenebene in einer Datei für das Kopfzeileninkrement fest und verschiebt alle Überschriften entsprechend, sodass sie beginnend mit einer Überschrift der Ebene 2 inkrementiert werden.',
      },
    },
    // heading-blank-lines.ts
    'heading-blank-lines': {
      'name': 'Überschrift Leerzeilen',
      'description': 'Alle Überschriften haben sowohl davor als auch danach eine Leerzeile (außer wenn sich die Überschrift am Anfang oder Ende des Dokuments befindet).',
      'bottom': {
        'name': 'Unteres',
        'description': 'Einfügen einer Leerzeile nach Überschriften',
      },
      'empty-line-after-yaml': {
        'name': 'Leere Zeile zwischen Yaml und Header',
        'description': 'Behalten Sie die leere Zeile zwischen der Yaml-Frontmaterie und dem Header bei',
      },
    },
    // headings-start-line.ts
    'headings-start-line': {
      'name': 'Überschriften Startlinie',
      'description': 'Bei Überschriften, die keine Zeile beginnen, wird der vorangehende Leerraum entfernt, um sicherzustellen, dass sie als Überschriften erkannt werden.',
    },
    // insert-yaml-attributes.ts
    'insert-yaml-attributes': {
      'name': 'Einfügen von YAML-Attributen',
      'description': 'Fügt die angegebenen YAML-Attribute in die YAML-Frontmaterie ein. Setzen Sie jedes Attribut in eine einzelne Zeile.',
      'text-to-insert': {
        'name': 'Text zum Einfügen',
        'description': 'Text, der in die YAML-Frontsache eingefügt werden soll',
      },
    },
    // line-break-at-document-end.ts
    'line-break-at-document-end': {
      'name': 'Zeilenumbruch am Dokumentende',
      'description': 'Stellt sicher, dass am Ende eines Dokuments genau ein Zeilenumbruch steht.',
    },
    // move-footnotes-to-the-bottom.ts
    'move-footnotes-to-the-bottom': {
      'name': 'Fußnoten nach unten verschieben',
      'description': 'Verschieben Sie alle Fußnoten an das Ende des Dokuments.',
    },
    // move-math-block-indicators-to-their-own-line.ts
    'move-math-block-indicators-to-their-own-line': {
      'name': 'Verschieben Sie mathematische Blockindikatoren in eine eigene Zeile',
      'description': 'Verschieben Sie alle Anfangs- und Endindikatoren für mathematische Blöcke in ihre eigenen Zeilen, indem Sie `Anzahl der Dollarzeichen, die einen mathematischen Block anzeigen` verwenden, um zu bestimmen, wie viele Dollarzeichen einen mathematischen Block für einzeilige Mathematik anzeigen.',
    },
    // move-tags-to-yaml.ts
    'move-tags-to-yaml': {
      'name': 'Tags nach Yaml verschieben',
      'description': 'Verschieben Sie alle Tags in die Yaml-Frontsache des Dokuments.',
      'how-to-handle-existing-tags': {
        'name': 'Body-Tag-Betrieb',
        'description': 'Die Aktion, die mit nicht ignorierten Tags im Hauptteil der Datei ausgeführt werden soll, nachdem sie in die Frontmaterie verschoben wurden',
      },
      'tags-to-ignore': {
        'name': 'Tags zum Ignorieren',
        'description': 'Die Tags, die nicht in das Tags-Array verschoben oder aus dem Textinhalt entfernt werden, wenn `Entfernen Sie den Hashtag aus Tags im Inhaltstext` aktiviert ist. Jedes Tag sollte in einer neuen Zeile und ohne das `#`` stehen. **Stellen Sie sicher, dass Sie den Hashtag nicht in den Tag-Namen aufnehmen.**',
      },
    },
    // no-bare-urls.ts
    'no-bare-urls': {
      'name': 'Keine bloßen URLs',
      'description': 'Umschließt bloße URLs mit spitzen Klammern, es sei denn, sie sind in hintere Häkchen, eckige Klammern oder einfache oder doppelte Anführungszeichen eingeschlossen.',
    },
    // ordered-list-style.ts
    'ordered-list-style': {
      'name': 'Geordneter Listenstil',
      'description': 'Stellt sicher, dass geordnete Listen dem angegebenen Stil entsprechen. Beachten Sie, dass 2 Leerzeichen oder 1 Tabulator als Einrückungsebene betrachtet werden.',
      'number-style': {
        'name': 'Zahlen-Stil',
        'description': 'Der Zahlenstil, der in geordneten Listenindikatoren verwendet wird',
      },
      'list-end-style': {
        'name': 'Endstil des geordneten Listenindikators',
        'description': 'Das Endzeichen eines geordneten Listenkennzeichens',
      },
    },
    // paragraph-blank-lines.ts
    'paragraph-blank-lines': {
      'name': 'Leere Absatzzeilen',
      'description': 'Alle Absätze sollten sowohl davor als auch danach genau eine Leerzeile haben.',
    },
    // prevent-double-checklist-indicator-on-paste.ts
    'prevent-double-checklist-indicator-on-paste': {
      'name': 'Verhindern Sie eine doppelte Checklistenanzeige beim Einfügen',
      'description': 'Entfernt die Start-Checklisten-Anzeige aus dem Text, um sie einzufügen, wenn die Zeile, auf der sich der Cursor in der Datei befindet, über eine Checklistenanzeige verfügt',
    },
    // prevent-double-list-item-indicator-on-paste.ts
    'prevent-double-list-item-indicator-on-paste': {
      'name': 'Verhindern Sie die Anzeige für doppelte Listenelemente beim Einfügen',
      'description': 'Entfernt den Startlistenindikator aus dem Text, der eingefügt werden soll, wenn die Zeile, auf der sich der Cursor in der Datei befindet, einen Listenindikator hat',
    },
    // proper-ellipsis-on-paste.ts
    'proper-ellipsis-on-paste': {
      'name': 'Richtige Auslassungspunkte auf Paste',
      'description': 'Ersetzt drei aufeinanderfolgende Punkte durch Auslassungspunkte, auch wenn sie im Text ein Leerzeichen zum Einfügen haben',
    },
    // proper-ellipsis.ts
    'proper-ellipsis': {
      'name': 'Richtige Auslassungspunkte',
      'description': 'Ersetzt drei aufeinanderfolgende Punkte durch Auslassungspunkte.',
    },
    // re-index-footnotes.ts
    're-index-footnotes': {
      'name': 'Fußnoten neu indizieren',
      'description': 'Indiziert Fußnotenschlüssel und Fußnoten basierend auf der Reihenfolge des Auftretens neu (HINWEIS: Diese Regel funktioniert *nicht*, wenn es mehr als eine Fußnote für einen Schlüssel gibt.)',
    },
    // remove-consecutive-list-markers.ts
    'remove-consecutive-list-markers': {
      'name': 'Entfernen Sie aufeinanderfolgende Listenmarkierungen',
      'description': 'Entfernt aufeinanderfolgende Listenmarkierungen. Nützlich beim Kopieren und Einfügen von Listenelementen.',
    },
    // remove-empty-lines-between-list-markers-and-checklists.ts
    'remove-empty-lines-between-list-markers-and-checklists': {
      'name': 'Entfernen Sie leere Zeilen zwischen Listenmarkierungen und Checklisten',
      'description': 'Es sollten keine leeren Zeilen zwischen Listenmarkierungen und Checklisten stehen.',
    },
    // remove-empty-list-markers.ts
    'remove-empty-list-markers': {
      'name': 'Entfernen Sie leere Listenmarkierungen',
      'description': 'Entfernt leere Listenmarkierungen, d.h. Listenelemente ohne Inhalt.',
    },
    // remove-hyphenated-line-breaks.ts
    'remove-hyphenated-line-breaks': {
      'name': 'Entfernen Sie Zeilenumbrüche mit Bindestrich',
      'description': 'Entfernt Zeilenumbrüche mit Bindestrich. Nützlich beim Einfügen von Text aus Lehrbüchern.',
    },
    // remove-hyphens-on-paste.ts
    'remove-hyphens-on-paste': {
      'name': 'Entfernen Sie Bindestriche auf Paste',
      'description': 'Entfernt Bindestriche aus dem Text zum Einfügen',
    },
    // remove-leading-or-trailing-whitespace-on-paste.ts
    'remove-leading-or-trailing-whitespace-on-paste': {
      'name': 'Entfernen Sie führende oder nachgestellte Leerzeichen beim Einfügen',
      'description': 'Entfernt alle führenden Leerzeichen ohne Tabulatoren und alle nachgestellten Leerzeichen, die der Text einfügen kann',
    },
    // remove-leftover-footnotes-from-quote-on-paste.ts
    'remove-leftover-footnotes-from-quote-on-paste': {
      'name': 'Entfernen Sie übrig gebliebene Fußnoten aus dem Zitat beim Einfügen',
      'description': 'Entfernt alle übrig gebliebenen Fußnotenverweise, die der Text einfügen kann',
    },
    // remove-link-spacing.ts
    'remove-link-spacing': {
      'name': 'Linkabstand entfernen',
      'description': 'Entfernt den Abstand um den Linktext.',
    },
    // remove-multiple-blank-lines-on-paste.ts
    'remove-multiple-blank-lines-on-paste': {
      'name': 'Entfernen Sie mehrere Leerzeilen beim Einfügen',
      'description': 'Verdichtet mehrere Leerzeilen zu einer Leerzeile, damit der Text eingefügt werden kann',
    },
    // remove-multiple-spaces.ts
    'remove-multiple-spaces': {
      'name': 'Entfernen Sie mehrere Leerzeichen',
      'description': 'Entfernt zwei oder mehr aufeinanderfolgende Leerzeichen. Ignoriert Leerzeichen am Anfang und am Ende der Zeile.',
    },
    // remove-space-around-characters.ts
    'remove-space-around-characters': {
      'name': 'Entfernen Sie den Abstand um die Zeichen',
      'description': 'Stellt sicher, dass bestimmte Zeichen nicht von Leerzeichen umgeben sind (entweder einzelne Leerzeichen oder ein Tabulator). Beachten Sie, dass dies in einigen Fällen zu Problemen mit dem Markdown-Format führen kann.',
      'include-fullwidth-forms': {
        'name': 'Einfügen von Formularen in voller Breite',
        'description': 'Einschließen <a href="https://de.wikipedia.org/wiki/Unicodeblock_Halbbreite_und_vollbreite_Formen">Unicode-Block "Formulare" in voller Breite</a>',
      },
      'include-cjk-symbols-and-punctuation': {
        'name': 'CJK-Symbole und Satzzeichen einschließen',
        'description': 'Einschließen <a href="https://de.wikipedia.org/wiki/Unicodeblock_CJK-Symbole_und_-Interpunktion">CJK-Symbole und Satzzeichen Unicode-Block</a>',
      },
      'include-dashes': {
        'name': 'Bindestriche einschließen',
        'description': 'Fügen Sie den Gedankenstrich (–) und den Gedankenstrich (—) ein',
      },
      'other-symbols': {
        'name': 'Andere Symbole',
        'description': 'Andere Symbole, die enthalten sind',
      },
    },
    // remove-trailing-punctuation-in-heading.ts
    'remove-trailing-punctuation-in-heading': {
      'name': 'Entfernen Sie nachgestellte Satzzeichen in der Überschrift',
      'description': 'Entfernt die angegebene Interpunktion am Ende von Überschriften, wobei darauf zu achten ist, dass das Semikolon am Ende von [HTML-Entitätsreferenzen](https://de.wikipedia.org/wiki/Typografische_Zeichen_in_XML_und_HTML) ignoriert wird.',
      'punctuation-to-remove': {
        'name': 'Nachfolgende Interpunktion',
        'description': 'Das nachfolgende Satzzeichen, das aus den Überschriften in der Datei entfernt werden soll.',
      },
    },
    // remove-yaml-keys.ts
    'remove-yaml-keys': {
      'name': 'Entfernen von YAML-Schlüsseln',
      'description': 'Entfernt die angegebenen YAML-Schlüssel',
      'yaml-keys-to-remove': {
        'name': 'Zu entfernende YAML-Schlüssel',
        'description': 'Die zu entfernenden yaml-Tasten aus der yaml-Frontmaterie mit oder ohne Doppelpunkt',
      },
    },
    // space-after-list-markers.ts
    'space-after-list-markers': {
      'name': 'Leerzeichen nach Listenmarkierungen',
      'description': 'Es sollte ein einzelnes Leerzeichen nach Listenmarkierungen und Kontrollkästchen geben.',
    },
    // space-between-chinese-japanese-or-korean-and-english-or-numbers.ts
    'space-between-chinese-japanese-or-korean-and-english-or-numbers': {
      'name': 'Leerzeichen zwischen Chinesisch, Japanisch oder Koreanisch und Englisch oder Zahlen',
      'description': 'Stellt sicher, dass Chinesisch, Japanisch oder Koreanisch und Englisch oder Zahlen durch ein einziges Leerzeichen getrennt werden. Folgt diesen [Richtlinien](https://github.com/sparanoid/chinese-copywriting-guidelines)',
    },
    // strong-style.ts
    'strong-style': {
      'name': 'Starker Stil',
      'description': 'Stellt sicher, dass der starke Stil konsistent ist.',
      'style': {
        'name': 'Stil',
        'description': 'Der Stil, der verwendet wird, um starke/fettgedruckte Inhalte zu kennzeichnen',
      },
    },
    // trailing-spaces.ts
    'trailing-spaces': {
      'name': 'Nachgestellte Leerzeichen',
      'description': 'Entfernt zusätzliche Leerzeichen nach jeder Zeile.',
      'twp-space-line-break': {
        'name': 'Zwei Leerzeichen Zeilenumbruch',
        'description': 'Ignorieren Sie zwei Leerzeichen, gefolgt von einem Zeilenumbruch ("Zwei-Leerzeichen-Regel").',
      },
    },
    // two-spaces-between-lines-with-content.ts
    'two-spaces-between-lines-with-content': {
      'name': 'Zwei Leerzeichen zwischen Zeilen mit Inhalt',
      'description': 'Stellt sicher, dass zwei Leerzeichen an den Zeilenenden hinzugefügt werden, wobei der Inhalt in der nächsten Zeile für Absätze, Blockzitate und Listenelemente fortgesetzt wird',
    },
    // unordered-list-style.ts
    'unordered-list-style': {
      'name': 'Ungeordneter Listenstil',
      'description': 'Stellt sicher, dass ungeordnete Listen dem angegebenen Stil folgen.',
      'list-style': {
        'name': 'Stil des Listenelements',
        'description': 'Das Listenelementformat, das in ungeordneten Listen verwendet werden soll',
      },
    },
    // yaml-key-sort.ts
    'yaml-key-sort': {
      'name': 'Sortierung von YAML-Schlüsseln',
      'description': 'Sortiert die YAML-Schlüssel basierend auf der angegebenen Reihenfolge und Priorität. Hinweis: Kann auch Leerzeilen entfernen.',
      'yaml-key-priority-sort-order': {
        'name': 'Sortierreihenfolge der YAML-Schlüsselpriorität',
        'description': 'Die Reihenfolge, in der Schlüssel sortiert werden sollen, wobei einer in jeder Zeile sortiert wird, in der er in der Reihenfolge sortiert wird, die in der Liste gefunden wird',
      },
      'priority-keys-at-start-of-yaml': {
        'name': 'Prioritätstasten beim Start von YAML',
        'description': 'Die Sortierreihenfolge der YAML-Schlüsselpriorität wird am Anfang der YAML-Frontmaterie platziert',
      },
      'yaml-sort-order-for-other-keys': {
        'name': 'YAML-Sortierreihenfolge für andere Schlüssel',
        'description': 'Die Art und Weise, wie die Schlüssel sortiert werden, die nicht im Textbereich Sortierreihenfolge der YAML-Schlüsselpriorität gefunden werden',
      },
    },
    // yaml-timestamp.ts
    'yaml-timestamp': {
      'name': 'YAML-Zeitstempel',
      'description': 'Verfolgen Sie das Datum, an dem die Datei zuletzt bearbeitet wurde, in der YAML-Front. Ruft Datumsangaben aus Dateimetadaten ab.',
      'date-created': {
        'name': 'Erstellungsdatum',
        'description': 'Der YAML-Schlüssel, der für das Erstellungsdatum verwendet werden soll',
      },
      'date-created-key': {
        'name': 'Erstellungsdatum des Schlüssels',
        'description': 'Welcher YAML-Schlüssel soll für das Erstellungsdatum verwendet werden',
      },
      'force-retention-of-create-value': {
        'name': 'Erstellungsdatum erzwingen Schlüsselwertaufbewahrung',
        'description': 'Verwendet den Wert in der YAML-Frontmaterie für das Erstellungsdatum anstelle der Dateimetadaten, was nützlich ist, um zu verhindern, dass Änderungen an Dateimetadaten dazu führen, dass der Wert in einen anderen Wert geändert wird.',
      },
      'date-modified': {
        'name': 'Änderungsdatum',
        'description': 'Geben Sie das Datum ein, an dem die Datei zuletzt geändert wurde',
      },
      'date-modified-key': {
        'name': 'Änderungsdatum des Schlüssels',
        'description': 'Der YAML-Schlüssel, der für das Änderungsdatum verwendet werden soll',
      },
      'format': {
        'name': 'Format',
        'description': 'Zu verwendendes Momentdatumsformat (siehe [Momentformatoptionen](https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/))',
      },
    },
    // yaml-title-alias.ts
    'yaml-title-alias': {
      'name': 'YAML-Titel-Alias',
      'description': 'Fügt den Titel der Datei in den Aliasabschnitt der YAML-Frontmaterie ein. Ruft den Titel aus dem ersten H1- oder Dateinamen ab.',
      'preserve-existing-alias-section-style': {
        'name': 'Vorhandenes Alias-Abschnittsformat beibehalten',
        'description': 'Wenn diese Option festgelegt ist, gilt die Einstellung `YAML-Aliase-Abschnittsstil` nur für die neu erstellten Abschnitte',
      },
      'keep-alias-that-matches-the-filename': {
        'name': 'Behalten Sie einen Alias bei, der mit dem Dateinamen übereinstimmt',
        'description': 'Solche Aliase sind in der Regel redundant',
      },
      'use-yaml-key-to-keep-track-of-old-filename-or-heading': {
        'name': 'Verwenden Sie den YAML-Schlüssel `linter-yaml-title-alias`, um bei Änderungen von Dateinamen und Überschriften zu helfen',
        'description': 'Wenn sich die erste H1-Überschrift ändert oder der Dateiname geändert wird, wenn der erste H1 nicht vorhanden ist, wird der alte Alias, der in diesem Schlüssel gespeichert ist, durch den neuen Wert ersetzt, anstatt nur einen neuen Eintrag in das Alias-Array einzufügen',
      },
    },
    // yaml-title.ts
    'yaml-title': {
      'name': 'YAML-Titel',
      'description': 'Fügt den Titel der Datei in die YAML-Frontmaterie ein. Ruft den Titel aus dem ersten H1 oder Dateinamen ab, wenn kein H1 vorhanden ist.',
      'title-key': {
        'name': 'Titel-Schlüssel',
        'description': 'Der YAML-Schlüssel, der für den Titel verwendet werden soll',
      },
    },
  },

  // These are the string values in the UI for enum values and thus they do not follow the key format as used above
  'enums': {
    'Title Case': 'Titel Groß- und Kleinschreibung',
    'ALL CAPS': 'GROSSBUCHSTABEN',
    'First letter': 'Anfangsbuchstabe',
    '.': '.', // leave as is
    ')': ')', // leave as is
    'ERROR': 'Fehler',
    'TRACE': 'Spur',
    'DEBUG': 'Debuggen',
    'INFO': 'Info',
    'WARN': 'Warnen',
    'SILENT': 'Leise',
    'ascending': 'aufsteigend',
    'lazy': 'lazy',
    'Nothing': 'Faul',
    'Remove hashtag': 'Hashtag entfernen',
    'Remove whole tag': 'Ganzes Tag entfernen',
    'asterisk': 'Sternchen',
    'underscore': 'unterstreichen',
    'consistent': 'folgerichtig',
    '-': '-', // leave as is
    '*': '*', // leave as is
    '+': '+', // leave as is
    'None': 'Nichts',
    'Ascending Alphabetical': 'Aufsteigend Alphabetisch',
    'Descending Alphabetical': 'Absteigend Alphabetisch',
    // yaml.ts
    'multi-line': 'mehrzeilig',
    'single-line': 'einzeilig',
    'single string to single-line': 'Single String zu Single-Line',
    'single string to multi-line': 'Single String zu Multi-Line',
    'single string comma delimited': 'Komma mit Trennzeichen für eine Zeichenfolge',
    'single string space delimited': 'Einzelzeichenfolgenabstand durch Trennzeichen',
    'single-line space delimited': 'einzeiliger Abstand durch Trennzeichen',
  },
};

// Türkçe

export default {
  'commands': {
    'lint-file': {
      'name': 'Geçerli dosyayı lintle',
      'error-message': 'Dosyada Lintleme Hatası',
    },
    'lint-file-unless-ignored': {
      'name': 'Yoksayılmadıkça geçerli dosyayı lintle',
    },
    'lint-all-files': {
      'name': 'Kasadaki tüm dosyaları lintle',
      'error-message': 'Dosyada Tüm Dosyaları Lintleme Hatası',
      'success-message': 'Tüm dosyalar lintlendi',
      'errors-message-singular': 'Tüm dosyalar lintlendi ve 1 hata vardı.',
      'errors-message-plural': 'Tüm dosyalar lintlendi ve {NUM} hata vardı.',
      'start-message': 'Bu, tüm dosyalarınızı düzenler ve hatalara yol açabilir.',
      'submit-button-text': 'Tümünü Lintle',
      'submit-button-notice-text': 'Tüm dosyalar lintleniyor...',
    },
    'lint-all-files-in-folder': {
      'name': 'Geçerli klasördeki tüm dosyaları lintle',
      'start-message': 'Bu, {FOLDER_NAME} dahilindeki tüm dosyalarınızı ve alt klasörlerini düzenler ve hatalara yol açabilir.',
      'submit-button-text': '{FOLDER_NAME} içindeki Tüm Dosyaları Lintle',
      'submit-button-notice-text': '{FOLDER_NAME} içindeki tüm dosyalar lintleniyor...',
      'error-message': 'Klasördeki Tüm Dosyaları Lintleme Hatası Dosyada',
      'success-message': '{FOLDER_NAME} içindeki tüm {NUM} dosya lintlendi.',
      'message-singular': '{FOLDER_NAME} içindeki tüm {NUM} dosya lintlendi ve 1 hata vardı.',
      'message-plural': '{FOLDER_NAME} içindeki tüm {FILE_COUNT} dosya lintlendi ve {ERROR_COUNT} hata vardı.',
    },
    'paste-as-plain-text': {
      'name': 'Düz Metin Olarak & Modifikasyonsuz Yapıştır',
    },
    'lint-file-pop-up-menu-text': {
      'name': 'Dosyayı lintle',
    },
    'lint-folder-pop-up-menu-text': {
      'name': 'Klasörü lintle',
    },
  },

  'logs': {
    'plugin-load': 'Eklenti yükleniyor',
    'plugin-unload': 'Eklenti kaldırılıyor',
    'folder-lint': 'Klasör lintleniyor ',
    'linter-run': 'Lintleme çalıştırılıyor',
    'paste-link-warning': 'pano içeriği bir link olduğu ve yapıştırmayı değiştiren diğer eklentilerle çakışmayı önlemek için lintleme yapıştırması iptal edildi.',
    'see-console': 'Daha fazla detay için konsolu kontrol edin.',
    'unknown-error': 'Lintleme sırasında bilinmeyen bir hata oluştu.',
    'moment-locale-not-found': 'Moment.js yerelini {MOMENT_LOCALE} olarak değiştirmeye çalışıyor, elde edilen {CURRENT_LOCALE}',
    'file-change-lint-message-start': 'Lintlendi',

    // rules-runner.ts
    'pre-rules': 'normal kurallardan önceki kurallar',
    'post-rules': 'normal kurallardan sonraki kurallar',
    'rule-running': 'kurallar çalıştırılıyor',
    'custom-regex': 'özel regex kuralları',
    'running-custom-regex': 'Özel Regex Çalıştırılıyor',
    'running-custom-lint-command': 'Özel Lint Komutları Çalıştırılıyor',
    'custom-lint-duplicate-warning': 'Aynı komutu ("{COMMAND_NAME}") özel bir lint kuralı olarak iki kez çalıştıramazsınız.',
    'custom-lint-error-message': 'Özel Lint Komutu Hatası',

    // rules-runner.ts and rule-builder.ts
    'disabled-text': 'devre dışı',

    // rule-builder.ts
    'run-rule-text': 'Çalıştırılıyor',

    // logger.ts
    'timing-key-not-found': '\'{TIMING_KEY}\' zamanlama anahtarı zamanlama bilgisi listesinde bulunamadı, bu yüzden yoksayıldı',
    'milliseconds-abbreviation': 'ms',

    'invalid-date-format-error': `Oluşturulan tarih formatı '{DATE}' ayrıştırılamadı veya belirlenemedi, bu yüzden '{FILE_NAME}' dosyasındaki oluşturulan tarih aynı bırakıldı`,

    // yaml.ts
    'invalid-delimiter-error-message': 'ayraç sadece tek bir karakter olabilir',

    // mdast.ts
    'missing-footnote-error-message': `'{FOOTNOTE}' dipnotunun içeriğinden önce karşılık gelen bir dipnot referansı yok ve işlenemez. Lütfen tüm dipnotların, dipnot içeriğinden önce karşılık gelen bir referansı olduğundan emin olun.`,
    'too-many-footnotes-error-message': `'{FOOTNOTE_KEY}' dipnot anahtarı birden fazla dipnota atıfta bulunuyor. Lütfen dipnotları güncelleyin, böylece her dipnot anahtarı için yalnızca bir dipnot olur.`,

    // rules.ts
    'wrapper-yaml-error': 'YAML\'da hata: {ERROR_MESSAGE}',
    'wrapper-unknown-error': 'bilinmeyen hata: {ERROR_MESSAGE}',

    // quote-style.ts
    'uneven-amount-of-quotes': 'Dosyadaki `{QUOTE}` alıntısının sayısı çift değil, bu yüzden düz alıntıları akıllı alıntılara dönüştüremeyiz',
  },

  'notice-text': {
    'empty-clipboard': 'Panoda içerik yok.',
    'characters-added': 'karakterler eklendi',
    'characters-removed': 'karakterler kaldırıldı',
  },

  // rule-alias-suggester.ts
  'all-rules-option': 'Tümü',

  // settings.ts
  'linter-title': 'Linter',
  'empty-search-results-text': 'Arama ile eşleşen ayar bulunamadı',

  // lint-confirmation-modal.ts
  'warning-text': 'Uyarı',
  'file-backup-text': 'Dosyalarınızın yedeğini aldığınızdan emin olun.',

  'tabs': {
    'names': {
      // tab.ts
      'general': 'Genel',
      'custom': 'Özel',
      'yaml': 'YAML',
      'heading': 'Başlık',
      'content': 'İçerik',
      'footnote': 'Dipnot',
      'spacing': 'Boşluk',
      'paste': 'Yapıştır',
      'debug': 'Hata ayıkla',
    },
    // tab-searcher.ts
    'default-search-bar-text': 'Tüm ayarları ara',
    'general': {
      // general-tab.ts
      'lint-on-save': {
        'name': 'Kaydederken düzelt',
        'description': 'Manuel kaydetme (Ctrl + S tuşuna basıldığında veya vim tuş bağlamalarını kullanırken :w komutu çalıştırıldığında) dosyayı düzeltir',
      },
      'display-message': {
        'name': 'Düzeltme sonrası mesajı göster',
        'description': 'Düzeltme sonrası değişen karakter sayısını gösterir',
      },
      'lint-on-file-change': {
        'name': 'Dosya Değişikliğinde Düzeltme',
        'description': 'Bir dosya kapatıldığında veya yeni bir dosya açıldığında, önceki dosya düzeltilir.',
      },
      'display-lint-on-file-change-message': {
        'name': 'Dosya Değişikliğinde Düzeltme Mesajını Göster',
        'description': '`Dosya Değişikliğinde Düzeltme` olduğunda bir mesaj gösterir',
      },
      'folders-to-ignore': {
        'name': 'Yoksayılacak klasörler',
        'description': 'Tüm dosyaları düzeltirken veya kaydederken düzeltme işleminin yoksayılacağı klasörler. Klasör yollarını yeni satırlarla ayırarak girin',
      },
      'override-locale': {
        'name': 'Yerel ayarların üzerine yaz',
        'description': 'Varsayılanın dışında bir yerel ayar kullanmak istiyorsanız bunu ayarlayın',
      },
      'same-as-system-locale': 'Sistemle aynı ({SYS_LOCALE})',
      'yaml-aliases-section-style': {
        'name': 'YAML takma adları bölümü stili',
        'description': 'YAML takma adları bölümünün stili',
      },
      'yaml-tags-section-style': {
        'name': 'YAML etiketleri bölümü stili',
        'description': 'YAML etiketleri bölümünün stili',
      },
      'default-escape-character': {
        'name': 'Varsayılan Kaçış Karakteri',
        'description': 'Tek tırnak ve çift tırnak bulunmayan YAML değerlerinden kaçmak için kullanılacak varsayılan karakter.',
      },
      'remove-unnecessary-escape-chars-in-multi-line-arrays': {
        'name': 'Çok Satırlı Dizi Formatındayken Gereksiz Kaçış Karakterlerini Kaldır',
        'description': 'Çok satırlı YAML dizileri için kaçış karakterleri tek satırlı dizilere göre aynı kaçışa ihtiyaç duymaz, bu yüzden çok satırlı format içerisinde gerekli olmayan ekstra kaçışları kaldırır',
      },
      'number-of-dollar-signs-to-indicate-math-block': {
        'name': 'Matematiksel Bloğu Belirtmek İçin Dolar İşareti Sayısı',
        'description': 'Matematik içeriğinin bir matematiksel blok yerine inline matematik olup olmadığını belirlemek için kullanılacak dolar işareti sayısı',
      },
    },
    'debug': {
    // debug-tab.ts
      'log-level': {
        'name': 'Log Düzeyi',
        'description': 'Hizmetin loglamaya izin verdiği log türleri. Varsayılan ERROR\'dur.',
      },
      'linter-config': {
        'name': 'Linter Yapılandırması',
        'description': 'Ayar sayfasının yüklenmesi sırasında Linter için data.json içeriği',
      },
      'log-collection': {
        'name': 'Kaydetme düzeltmesi ve mevcut dosyanın düzeltilmesi sırasında logları topla',
        'description': '`Kaydetme düzeltmesi` yaptığınızda ve mevcut dosyayı düzeltirken logları toplar. Bu loglar hata ayıklama ve hata raporları oluşturma için yardımcı olabilir.',
      },
      'linter-logs': {
        'name': 'Linter Logları',
        'description': 'Son `Kaydetme düzeltmesi` veya son mevcut dosya çalıştırmasından elde edilen loglar (eğer etkinleştirilmişse).',
      },
    },
  },

  'options': {
    'custom-command': {
      // custom-command-option.ts
      'name': 'Özel Komutlar',
      'description': 'Özel komutlar, linter normal kurallarını çalıştırmayı bitirdikten sonra çalıştırılan Obsidyen komutlardır. Bu, YAML zaman damgası mantığı çalışmadan önce çalışmadıkları anlamına gelir, dolayısıyla linterin bir sonraki çalışmasında YAML zaman damgasının tetiklenmesine neden olabilirler. Bir Obsidyen komutunu yalnızca bir kez seçebilirsiniz. **_Bunun şu anda yalnızca geçerli dosyaya satır dizilirken çalıştığını unutmayın._**',
      'warning': 'Bir seçeneği seçerken, seçeneği fareyi kullanarak veya enter tuşuna basarak seçtiğinizden emin olun. Diğer seçim yöntemleri çalışmayabilir ve yalnızca gerçek bir Obsidian komutunun veya boş bir dizinin seçimleri kaydedilir.',

      'add-input-button-text': 'Yeni komut ekle',
      'command-search-placeholder-text': 'Obsidian komutu',
      'move-up-tooltip': 'Yukarı',
      'move-down-tooltip': 'Aşağı',
      'delete-tooltip': 'Sil',
    },
    'custom-replace': {
      // custom-replace-option.ts
      'name': 'Özel Regex Değiştirme',
      'description': 'Özel regex değiştirme, bulunan regex ile eşleşen her şeyi değiştirme değeri ile değiştirmek için kullanılabilir. Değiştirme ve bulma değerleri geçerli regex değerleri olmalıdır.',
      'warning': 'Regex hakkında bilginiz yoksa dikkatli kullanın. Ayrıca, lütle iOS mobil platformunda regexinizde geriye dönük aramaları kullanmayın çünkü bu, o platformda desteklenmediği için lint işleminin başarısız olmasına neden olur.',
      'add-input-button-text': 'Yeni regex değiştirme ekle',
      'regex-to-find-placeholder-text': 'bulunacak regex',
      'flags-placeholder-text': 'bayraklar',
      'regex-to-replace-placeholder-text': 'değiştirilecek regex',
      'label-placeholder-text': 'etiket',
      'move-up-tooltip': 'Yukarı taşı',
      'move-down-tooltip': 'Aşağı taşı',
      'delete-tooltip': 'Sil',
    },
  },

  // rules
  'rules': {
    // auto-correct-common-misspellings.ts
    'auto-correct-common-misspellings': {
    'name': 'Yaygın Yanlış Yazımları Otomatik Düzelt',
    'description': 'Yaygın yanlış yazımların sözlüğünü kullanarak bunları doğru yazımlarına otomatik olarak dönüştürür. Otomatik düzeltilen kelimelerin tam listesi için [otomatik-düzeltme haritasına](https://github.com/platers/obsidian-linter/tree/master/src/utils/auto-correct-misspellings.ts) bakın.',
    'ignore-words': {
      'name': 'Kelimeleri Yoksay',
      'description': 'Otomatik düzeltme sırasında yoksayılacak küçük harfli kelimelerin virgülle ayrılmış listesi',
      },
    },
    // blockquotify-on-paste.ts
    'add-blockquote-indentation-on-paste': {
      'name': 'Yapıştırma Sırasında Blok Alıntı Girintisini Ekle',
      'description': 'İmleç bir blok alıntı/callout satırında olduğunda, tüm satırlara, ilk satır hariç, blok alıntılar ekler',
    },
    // blockquote-style.ts
    'blockquote-style': {
      'name': 'Blok Alıntı Stili',
      'description': 'Blok alıntı stili tutarlı olmalıdır.',
      'style': {
        'name': 'Stil',
        'description': 'Blok alıntı göstergelerinde kullanılan stil',
      },
    },
    // capitalize-headings.ts
    'capitalize-headings': {
      'name': 'Büyük Harfli Başlıklar',
      'description': 'Başlıklar büyük harfle biçimlendirilmelidir',
      'style': {
        'name': 'Stil',
        'description': 'Kullanılacak büyük harfle başlatma stili',
      },
      'ignore-case-words': {
        'name': 'Durum Sözcüklerini Yoksay',
        'description': 'Başlık durum stilini sadece tüm küçük harfli sözcüklere uygula',
      },
      'ignore-words': {
        'name': 'Sözcükleri Yoksay',
        'description': 'Büyük harfle başlatırken yoksayılacak sözcüklerin virgülle ayrılmış listesi',
      },
      'lowercase-words': {
        'name': 'Küçük Harfli Sözcükler',
        'description': 'Küçük harfli tutulacak sözcüklerin virgülle ayrılmış listesi',
      },
    },
    // compact-yaml.ts
    'compact-yaml': {
      'name': 'Sıkıştırılmış YAML',
      'description': 'YAML ön bilgisindeki baştaki ve sondaki boş satırları kaldırır.',
      'inner-new-lines': {
        'name': 'İç Yeni Satırlar',
        'description': 'YAML\'ın başında veya sonunda olmayan yeni satırları kaldırır.',
      },
    },
    // consecutive-blank-lines.ts
    'consecutive-blank-lines': {
      'name': 'Ardışık boş satırlar',
      'description': 'En fazla bir ardışık boş satır olmalıdır.',
    },
    // convert-bullet-list-markers.ts
    'convert-bullet-list-markers': {
      'name': 'Bullet List Markerlarını Dönüştür',
      'description': 'Bullet list marker sembollerini markdown list markerlarına dönüştürür.',
    },
    // convert-spaces-to-tabs.ts
    'convert-spaces-to-tabs': {
      'name': 'Boşlukları Sekmeye Dönüştür',
      'description': 'Baştaki boşlukları sekmeye dönüştürür.',
      'tabsize': {
        'name': 'Sekme Boyutu',
        'description': 'Bir sekme haline dönüştürülecek boşluk sayısı',
      },
    },
    // emphasis-style.ts
    'emphasis-style': {
      'name': 'Emphasis Style',
      'description': 'Makes sure the emphasis style is consistent.',
      'style': {
        'name': 'Style',
        'description': 'The style used to denote emphasized content',
      },
    },
    // empty-line-around-blockquotes.ts
    'empty-line-around-blockquotes': {
      'name': 'Empty Line Around Blockquotes',
      'description': 'Ensures that there is an empty line around blockquotes unless they start or end a document. **Note: an empty line is either one less level of nesting for blockquotes or a newline character.**',
    },
    // empty-line-around-code-fences.ts
    'empty-line-around-code-fences': {
      'name': 'Empty Line Around Code Fences',
      'description': 'Ensures that there is an empty line around code fences unless they start or end a document.',
    },
    // empty-line-around-math-block.ts
    'empty-line-around-math-blocks': {
      'name': 'Empty Line Around Math Blocks',
      'description': 'Ensures that there is an empty line around math blocks using `Number of Dollar Signs to Indicate a Math Block` to determine how many dollar signs indicates a math block for single-line math.',
    },
    // empty-line-around-tables.ts
    'empty-line-around-tables': {
      'name': 'Empty Line Around Tables',
      'description': 'Ensures that there is an empty line around github flavored tables unless they start or end a document.',
    },
    // escape-yaml-special-characters.ts
    'escape-yaml-special-characters': {
      'name': 'Escape YAML Special Characters',
      'description': 'Escapes colons with a space after them (: ), single quotes (\'), and double quotes (") in YAML.',
      'try-to-escape-single-line-arrays': {
        'name': 'Try to Escape Single Line Arrays',
        'description': 'Tries to escape array values assuming that an array starts with "[", ends with "]", and has items that are delimited by ",".',
      },
    },
    // file-name-heading.ts
    'file-name-heading': {
      'name': 'File Name Heading',
      'description': 'Inserts the file name as a H1 heading if no H1 heading exists.',
    },
    // footnote-after-punctuation.ts
    'footnote-after-punctuation': {
      'name': 'Footnote after Punctuation',
      'description': 'Ensures that footnote references are placed after punctuation, not before.',
    },
    // force-yaml-escape.ts
    'force-yaml-escape': {
      'name': 'Force YAML Escape',
      'description': 'Escapes the values for the specified YAML keys.',
      'force-yaml-escape-keys': {
        'name': 'Force YAML Escape on Keys',
        'description': 'Uses the YAML escape character on the specified YAML keys separated by a new line character if it is not already escaped. Do not use on YAML arrays.',
      },
    },
    // format-tags-in-yaml.ts
    'format-tags-in-yaml': {
      'name': 'Format Tags in YAML',
      'description': 'Remove Hashtags from tags in the YAML frontmatter, as they make the tags there invalid.',
    },
    // format-yaml-array.ts
    'format-yaml-array': {
      'name': 'Format YAML Array',
      'description': 'Allows for the formatting of regular YAML arrays as either multi-line or single-line and `tags` and `aliases` are allowed to have some Obsidian specific YAML formats. **Note: that single string to single-line goes from a single string entry to a single-line array if more than 1 entry is present. The same is true for single string to multi-line except it becomes a multi-line array.**',
      'alias-key': {
        'name': 'Format YAML aliases section',
        'description': 'Turns on formatting for the YAML aliases section. You should not enable this option alongside the rule `YAML Title Alias` as they may not work well together or they may have different format styles selected causing unexpected results.',
      },
      'tag-key': {
        'name': 'Format YAML tags section',
        'description': 'Turns on formatting for the YAML tags section.',
      },
      'default-array-style': {
        'name': 'Default YAML array section style',
        'description': 'The style of other YAML arrays that are not `tags`, `aliases` or  in `Force key values to be single-line arrays` and `Force key values to be multi-line arrays`',
      },
      'default-array-keys': {
        'name': 'Format YAML array sections',
        'description': 'Turns on formatting for regular YAML arrays',
      },
      'force-single-line-array-style': {
        'name': 'Force key values to be single-line arrays',
        'description': 'Forces the YAML array for the new line separated keys to be in single-line format (leave empty to disable this option)',
      },
      'force-multi-line-array-style': {
        'name': 'Force key values to be multi-line arrays',
        'description': 'Forces the YAML array for the new line separated keys to be in multi-line format (leave empty to disable this option)',
      },
    },
    // header-increment.ts
    'header-increment': {
      'name': 'Header Increment',
      'description': 'Heading levels should only increment by one level at a time',
      'start-at-h2': {
        'name': 'Start Header Increment at Heading Level 2',
        'description': 'Makes heading level 2 the minimum heading level in a file for header increment and shifts all headings accordingly so they increment starting with a level 2 heading.',
      },
    },
    // heading-blank-lines.ts
    'heading-blank-lines': {
      'name': 'Heading blank lines',
      'description': 'All headings have a blank line both before and after (except where the heading is at the beginning or end of the document).',
      'bottom': {
        'name': 'Bottom',
        'description': 'Insert a blank line after headings',
      },
      'empty-line-after-yaml': {
        'name': 'Empty Line Between YAML and Header',
        'description': 'Keep the empty line between the YAML frontmatter and header',
      },
    },
    // headings-start-line.ts
    'headings-start-line': {
      'name': 'Headings Start Line',
      'description': 'Headings that do not start a line will have their preceding whitespace removed to make sure they get recognized as headers.',
    },
    // insert-yaml-attributes.ts
    'insert-yaml-attributes': {
      'name': 'Insert YAML attributes',
      'description': 'Inserts the given YAML attributes into the YAML frontmatter. Put each attribute on a single line.',
      'text-to-insert': {
        'name': 'Text to insert',
        'description': 'Text to insert into the YAML frontmatter',
      },
    },
    // line-break-at-document-end.ts
    'line-break-at-document-end': {
      'name': 'Line Break at Document End',
      'description': 'Ensures that there is exactly one line break at the end of a document.',
    },
    // move-footnotes-to-the-bottom.ts
    'move-footnotes-to-the-bottom': {
      'name': 'Move Footnotes to the bottom',
      'description': 'Move all footnotes to the bottom of the document.',
    },
    // move-math-block-indicators-to-their-own-line.ts
    'move-math-block-indicators-to-their-own-line': {
      'name': 'Move Math Block Indicators to Their Own Line',
      'description': 'Move all starting and ending math block indicators to their own lines using `Number of Dollar Signs to Indicate a Math Block` to determine how many dollar signs indicates a math block for single-line math.',
    },
    // move-tags-to-yaml.ts
    'move-tags-to-yaml': {
      'name': 'Move Tags to YAML',
      'description': 'Move all tags to YAML frontmatter of the document.',
      'how-to-handle-existing-tags': {
        'name': 'Body tag operation',
        'description': 'What to do with non-ignored tags in the body of the file once they have been moved to the frontmatter',
      },
      'tags-to-ignore': {
        'name': 'Tags to ignore',
        'description': 'The tags that will not be moved to the tags array or removed from the body content if `Remove the hashtag from tags in content body` is enabled. Each tag should be on a new line and without the `#`. **Make sure not to include the hashtag in the tag name.**',
      },
    },
    // no-bare-urls.ts
    'no-bare-urls': {
      'name': 'No Bare URLs',
      'description': 'Encloses bare URLs with angle brackets except when enclosed in back ticks, square braces, or single or double quotes.',
    },
    // ordered-list-style.ts
    'ordered-list-style': {
      'name': 'Ordered List Style',
      'description': 'Makes sure that ordered lists follow the style specified. **Note: that 2 spaces or 1 tab is considered to be an indentation level.**',
      'number-style': {
        'name': 'Number Style',
        'description': 'The number style used in ordered list indicators',
      },
      'list-end-style': {
        'name': 'Ordered List Indicator End Style',
        'description': 'The ending character of an ordered list indicator',
      },
    },
    // paragraph-blank-lines.ts
    'paragraph-blank-lines': {
      'name': 'Paragraph blank lines',
      'description': 'All paragraphs should have exactly one blank line both before and after.',
    },
    // prevent-double-checklist-indicator-on-paste.ts
    'prevent-double-checklist-indicator-on-paste': {
      'name': 'Prevent Double Checklist Indicator on Paste',
      'description': 'Removes starting checklist indicator from the text to paste if the line the cursor is on in the file has a checklist indicator',
    },
    // prevent-double-list-item-indicator-on-paste.ts
    'prevent-double-list-item-indicator-on-paste': {
      'name': 'Prevent Double List Item Indicator on Paste',
      'description': 'Removes starting list indicator from the text to paste if the line the cursor is on in the file has a list indicator',
    },
    // proper-ellipsis-on-paste.ts
    'proper-ellipsis-on-paste': {
      'name': 'Proper Ellipsis on Paste',
      'description': 'Replaces three consecutive dots with an ellipsis even if they have a space between them in the text to paste',
    },
    // proper-ellipsis.ts
    'proper-ellipsis': {
      'name': 'Proper Ellipsis',
      'description': 'Replaces three consecutive dots with an ellipsis.',
    },
    // quote-style.ts
    'quote-style': {
      'name': 'Quote Style',
      'description': 'Updates the quotes in the body content to be updated to the specified single and double quote styles.',
      'single-quote-enabled': {
        'name': 'Enable `Single Quote Style`',
        'description': 'Specifies that the selected single quote style should be used.',
      },
      'single-quote-style': {
        'name': 'Single Quote Style',
        'description': 'The style of single quotes to use.',
      },
      'double-quote-enabled': {
        'name': 'Enable `Double Quote Style`',
        'description': 'Specifies that the selected double quote style should be used.',
      },
      'double-quote-style': {
        'name': 'Double Quote Style',
        'description': 'The style of double quotes to use.',
      },
    },
    // re-index-footnotes.ts
    're-index-footnotes': {
      'name': 'Re-Index Footnotes',
      'description': 'Re-indexes footnote keys and footnote, based on the order of occurrence. **Note: This rule does _not_ work if there is more than one footnote for a key.**',
    },
    // remove-consecutive-list-markers.ts
    'remove-consecutive-list-markers': {
      'name': 'Remove Consecutive List Markers',
      'description': 'Removes consecutive list markers. Useful when copy-pasting list items.',
    },
    // remove-empty-lines-between-list-markers-and-checklists.ts
    'remove-empty-lines-between-list-markers-and-checklists': {
      'name': 'Remove Empty Lines Between List Markers and Checklists',
      'description': 'There should not be any empty lines between list markers and checklists.',
    },
    // remove-empty-list-markers.ts
    'remove-empty-list-markers': {
      'name': 'Remove Empty List Markers',
      'description': 'Removes empty list markers, i.e. list items without content.',
    },
    // remove-hyphenated-line-breaks.ts
    'remove-hyphenated-line-breaks': {
      'name': 'Remove Hyphenated Line Breaks',
      'description': 'Removes hyphenated line breaks. Useful when pasting text from textbooks.',
    },
    // remove-hyphens-on-paste.ts
    'remove-hyphens-on-paste': {
      'name': 'Remove Hyphens on Paste',
      'description': 'Removes hyphens from the text to paste',
    },
    // remove-leading-or-trailing-whitespace-on-paste.ts
    'remove-leading-or-trailing-whitespace-on-paste': {
      'name': 'Remove Leading or Trailing Whitespace on Paste',
      'description': 'Removes any leading non-tab whitespace and all trailing whitespace for the text to paste',
    },
    // remove-leftover-footnotes-from-quote-on-paste.ts
    'remove-leftover-footnotes-from-quote-on-paste': {
      'name': 'Remove Leftover Footnotes from Quote on Paste',
      'description': 'Removes any leftover footnote references for the text to paste',
    },
    // remove-link-spacing.ts
    'remove-link-spacing': {
      'name': 'Remove link spacing',
      'description': 'Removes spacing around link text.',
    },
    // remove-multiple-blank-lines-on-paste.ts
    'remove-multiple-blank-lines-on-paste': {
      'name': 'Remove Multiple Blank Lines on Paste',
      'description': 'Condenses multiple blank lines down into one blank line for the text to paste',
    },
    // remove-multiple-spaces.ts
    'remove-multiple-spaces': {
      'name': 'Remove Multiple Spaces',
      'description': 'Removes two or more consecutive spaces. Ignores spaces at the beginning and ending of the line. ',
    },
    // remove-space-around-characters.ts
    'remove-space-around-characters': {
      'name': 'Remove Space around Characters',
      'description': 'Ensures that certain characters are not surrounded by whitespace (either single spaces or a tab). **Note: this may causes issues with markdown format in some cases.**',
      'include-fullwidth-forms': {
        'name': 'Include Fullwidth Forms',
        'description': 'Include <a href="https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)">Fullwidth Forms Unicode block</a>',
      },
      'include-cjk-symbols-and-punctuation': {
        'name': 'Include CJK Symbols and Punctuation',
        'description': 'Include <a href="https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation">CJK Symbols and Punctuation Unicode block</a>',
      },
      'include-dashes': {
        'name': 'Include Dashes',
        'description': 'Include en dash (–) and em dash (—)',
      },
      'other-symbols': {
        'name': 'Other symbols',
        'description': 'Other symbols to include',
      },
    },
    // remove-space-before-or-after-characters.ts
    'remove-space-before-or-after-characters': {
      'name': 'Remove Space Before or After Characters',
      'description': 'Removes space before the specified characters and after the specified characters. **Note: this may causes issues with markdown format in some cases.**',
      'characters-to-remove-space-before': {
        'name': 'Remove Space Before Characters',
        'description': 'Removes space before the specified characters. **Note: using `{` or `}` in the list of characters will unexpectedly affect files as it is used in the ignore syntax behind the scenes.**',
      },
      'characters-to-remove-space-after': {
        'name': 'Remove Space After Characters',
        'description': 'Removes space after the specified characters. **Note: using `{` or `}` in the list of characters will unexpectedly affect files as it is used in the ignore syntax behind the scenes.**',
      },
    },
    // remove-trailing-punctuation-in-heading.ts
    'remove-trailing-punctuation-in-heading': {
      'name': 'Remove Trailing Punctuation in Heading',
      'description': 'Removes the specified punctuation from the end of headings making sure to ignore the semicolon at the end of [HTML entity references](https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references).',
      'punctuation-to-remove': {
        'name': 'Trailing Punctuation',
        'description': 'The trailing punctuation to remove from the headings in the file.',
      },
    },
    // remove-yaml-keys.ts
    'remove-yaml-keys': {
      'name': 'Remove YAML Keys',
      'description': 'Removes the YAML keys specified',
      'yaml-keys-to-remove': {
        'name': 'YAML Keys to Remove',
        'description': 'The YAML keys to remove from the YAML frontmatter with or without colons',
      },
    },
    // space-after-list-markers.ts
    'space-after-list-markers': {
      'name': 'Space after list markers',
      'description': 'There should be a single space after list markers and checkboxes.',
    },
    // space-between-chinese-japanese-or-korean-and-english-or-numbers.ts
    'space-between-chinese-japanese-or-korean-and-english-or-numbers': {
      'name': 'Space between Chinese Japanese or Korean and English or numbers',
      'description': 'Ensures that Chinese, Japanese, or Korean and English or numbers are separated by a single space. Follows these [guidelines](https://github.com/sparanoid/chinese-copywriting-guidelines)',
    },
    // strong-style.ts
    'strong-style': {
      'name': 'Strong Style',
      'description': 'Makes sure the strong style is consistent.',
      'style': {
        'name': 'Style',
        'description': 'The style used to denote strong/bolded content',
      },
    },
    // trailing-spaces.ts
    'trailing-spaces': {
      'name': 'Trailing spaces',
      'description': 'Removes extra spaces after every line.',
      'twp-space-line-break': {
        'name': 'Two Space Linebreak',
        'description': 'Ignore two spaces followed by a line break ("Two Space Rule").',
      },
    },
    // two-spaces-between-lines-with-content.ts
    'two-spaces-between-lines-with-content': {
      'name': 'Two Spaces Between Lines with Content',
      'description': 'Makes sure that two spaces are added to the ends of lines with content continued on the next line for paragraphs, blockquotes, and list items',
    },
    // unordered-list-style.ts
    'unordered-list-style': {
      'name': 'Unordered List Style',
      'description': 'Makes sure that unordered lists follow the style specified.',
      'list-style': {
        'name': 'List item style',
        'description': 'The list item style to use in unordered lists',
      },
    },
    // yaml-key-sort.ts
    'yaml-key-sort': {
      'name': 'YAML Key Sort',
      'description': 'Sorts the YAML keys based on the order and priority specified. **Note: may remove blank lines as well.**',
      'yaml-key-priority-sort-order': {
        'name': 'YAML Key Priority Sort Order',
        'description': 'The order in which to sort keys with one on each line where it sorts in the order found in the list',
      },
      'priority-keys-at-start-of-yaml': {
        'name': 'Priority Keys at Start of YAML',
        'description': 'YAML Key Priority Sort Order is placed at the start of the YAML frontmatter',
      },
      'yaml-sort-order-for-other-keys': {
        'name': 'YAML Sort Order for Other Keys',
        'description': 'The way in which to sort the keys that are not found in the YAML Key Priority Sort Order text area',
      },
    },
    // yaml-timestamp.ts
    'yaml-timestamp': {
      'name': 'YAML Timestamp',
      'description': 'Keep track of the date the file was last edited in the YAML front matter. Gets dates from file metadata.',
      'date-created': {
        'name': 'Date Created',
        'description': 'Insert the file creation date',
      },
      'date-created-key': {
        'name': 'Date Created Key',
        'description': 'Which YAML key to use for creation date',
      },
      'force-retention-of-create-value': {
        'name': 'Force Date Created Key Value Retention',
        'description': 'Reuses the value in the YAML frontmatter for date created instead of the file metadata which is useful for preventing file metadata changes from causing the value to change to a different value.',
      },
      'date-modified': {
        'name': 'Date Modified',
        'description': 'Insert the date the file was last modified',
      },
      'date-modified-key': {
        'name': 'Date Modified Key',
        'description': 'Which YAML key to use for modification date',
      },
      'format': {
        'name': 'Format',
        'description': 'Moment date format to use (see [Moment format options](https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/))',
      },
    },
    // yaml-title-alias.ts
    'yaml-title-alias': {
      'name': 'YAML Title Alias',
      'description': 'Inserts the title of the file into the YAML frontmatter\'s aliases section. Gets the title from the first H1 or filename.',
      'preserve-existing-alias-section-style': {
        'name': 'Preserve existing aliases section style',
        'description': 'If set, the `YAML aliases section style` setting applies only to the newly created sections',
      },
      'keep-alias-that-matches-the-filename': {
        'name': 'Keep alias that matches the filename',
        'description': 'Such aliases are usually redundant',
      },
      'use-yaml-key-to-keep-track-of-old-filename-or-heading': {
        'name': 'Use the YAML key `linter-yaml-title-alias` to help with filename and heading changes',
        'description': 'If set, when the first H1 heading changes or filename if first H1 is not present changes, then the old alias stored in this key will be replaced with the new value instead of just inserting a new entry in the aliases array',
      },
    },
    // yaml-title.ts
    'yaml-title': {
      'name': 'YAML Title',
      'description': 'Inserts the title of the file into the YAML frontmatter. Gets the title based on the selected mode.',
      'title-key': {
        'name': 'Title Key',
        'description': 'Which YAML key to use for title',
      },
      'mode': {
        'name': 'Mode',
        'description': 'The method to use to get the title',
      },
    },
  },

  // These are the string values in the UI for enum values and thus they do not follow the key format as used above
  'enums': {
    'Title Case': 'Title Case',
    'ALL CAPS': 'ALL CAPS',
    'First letter': 'First letter',
    '.': '.', // leave as is
    ')': ')', // leave as is
    'ERROR': 'error',
    'TRACE': 'trace',
    'DEBUG': 'debug',
    'INFO': 'info',
    'WARN': 'warn',
    'SILENT': 'silent',
    'ascending': 'ascending',
    'lazy': 'lazy',
    'Nothing': 'Nothing',
    'Remove hashtag': 'Remove hashtag',
    'Remove whole tag': 'Remove whole tag',
    'asterisk': 'asterisk',
    'underscore': 'underscore',
    'consistent': 'consistent',
    '-': '-', // leave as is
    '*': '*', // leave as is
    '+': '+', // leave as is
    'space': 'space',
    'no space': 'no space',
    'None': 'None',
    'Ascending Alphabetical': 'Ascending Alphabetical',
    'Descending Alphabetical': 'Descending Alphabetical',
    // yaml.ts
    'multi-line': 'multi-line',
    'single-line': 'single-line',
    'single string to single-line': 'single string to single-line',
    'single string to multi-line': 'single string to multi-line',
    'single string comma delimited': 'single string comma delimited',
    'single string space delimited': 'single string space delimited',
    'single-line space delimited': 'single-line space delimited',
    // yaml-title.ts
    'first-h1': 'First H1',
    'first-h1-or-filename-if-h1-missing': 'First H1 or Filename if H1 is Missing',
    'filename': 'Filename',
    // quote-style.ts
    '\'\'': '\'\'', // leave as is
    '‘’': '‘’', // leave as is
    '""': '""', // leave as is
    '“”': '“”', // leave as is
  },
};

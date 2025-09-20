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
      'suppress-message-when-no-change': {
        'name': 'Değişiklik Olmadığında Mesajı Bastır',
        'description': 'Etkinleştirildiğinde, gerçek değişiklikler olmadığında mesaj gösterilmez.',
      },
      'lint-on-file-change': {
        'name': 'Dosya Değişikliğinde Düzeltme',
        'description': 'Bir dosya kapatıldığında veya yeni bir dosya açıldığında, önceki dosya düzeltilir.',
      },
      'display-lint-on-file-change-message': {
        'name': 'Dosya Değişikliğinde Düzeltme Mesajını Göster',
        'description': '<code>Dosya Değişikliğinde Düzeltme</code> olduğunda bir mesaj gösterir',
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
        'description': '<code>Kaydetme düzeltmesi</code> yaptığınızda ve mevcut dosyayı düzeltirken logları toplar. Bu loglar hata ayıklama ve hata raporları oluşturma için yardımcı olabilir.',
      },
      'linter-logs': {
        'name': 'Linter Logları',
        'description': 'Son <code>Kaydetme düzeltmesi</code> veya son mevcut dosya çalıştırmasından elde edilen loglar (eğer etkinleştirilmişse).',
      },
    },
  },

  'options': {
    'custom-command': {
      // custom-command-option.ts
      'name': 'Özel Komutlar',
      'description': 'Özel komutlar, linter normal kurallarını çalıştırmayı bitirdikten sonra çalıştırılan Obsidyen komutlardır. Bu, YAML zaman damgası mantığı çalışmadan önce çalışmadıkları anlamına gelir, dolayısıyla linterin bir sonraki çalışmasında YAML zaman damgasının tetiklenmesine neden olabilirler. Bir Obsidyen komutunu yalnızca bir kez seçebilirsiniz.',
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
      'description': 'Yaygın yanlış yazımların sözlüğünü kullanarak bunları doğru yazımlarına otomatik olarak dönüştürür. Otomatik düzeltilen kelimelerin tam listesi için <a href="https://github.com/platers/obsidian-linter/tree/master/src/utils/default-misspellings.md">otomatik-düzeltme haritasına</a> bakın.',
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
      'name': 'Vurgu Stili',
      'description': 'Vurgu stilinin tutarlı olmasını sağlar.',
      'style': {
        'name': 'Stil',
        'description': 'Vurgulanan içeriği belirtmek için kullanılan stil',
      },
    },
    // empty-line-around-blockquotes.ts
    'empty-line-around-blockquotes': {
      'name': 'Alıntı Bloklarının Etrafında Boş Satır',
      'description': 'Bir belgenin başını veya sonunu başlatmayan alıntı blokların etrafında boş bir satır olmalıdır.<b>Not: boş bir satır ya alıntı bloklar için bir seviye daha az girinti veya yeni bir satır karakteri demektir.</b>',
    },
    // empty-line-around-code-fences.ts
    'empty-line-around-code-fences': {
      'name': 'Kod Çitlerinin Etrafında Boş Satır',
      'description': 'Bir belgenin başını veya sonunu başlatmayan kod çitlerinin etrafında boş bir satır olmalıdır.',
    },
    // empty-line-around-math-block.ts
    'empty-line-around-math-blocks': {
      'name': 'Matematik Bloklarının Etrafında Boş Satır',
      'description': 'Tek satırlık matematik için bir matematik bloğunu belirtmek için kaç dolar işareti olduğunu belirleyen <code>Dolar İşaretlerinin Sayısıyla Matematik Bloğunu Belirt</code> kullanılarak matematik bloklarının etrafında boş bir satır olmalıdır.',
    },
    // empty-line-around-tables.ts
    'empty-line-around-tables': {
      'name': 'Tabloların Etrafında Boş Satır',
      'description': 'Bir belgenin başını veya sonunu başlatmayan github flavored tabloların etrafında boş bir satır olmalıdır.',
    },
    // escape-yaml-special-characters.ts
    'escape-yaml-special-characters': {
      'name': 'YAML Özel Karakterlerine Kaçış İşlemi Yap',
      'description': 'YAML içindeki boşlukla beraber gelen iki nokta üst üste (:), tek tırnak (\') ve çift tırnak (") karakterlerini kaçış işlemine tabi tutar.',
      'try-to-escape-single-line-arrays': {
        'name': 'Tek Satırlık Listeleri Kaçış Denemesi',
        'description': 'Bir dizinin "[" ile başladığını, "]" ile bittiğini ve öğelerin "," ile ayrıldığını varsayarak dizi değerlerini kaçış işlemine tabi tutmaya çalışır.',
      },
    },
    // file-name-heading.ts
    'file-name-heading': {
      'name': 'Dosya Adı Başlığı',
      'description': 'Eğer hiç H1 başlığı yoksa dosya adını H1 başlığı olarak ekler.',
    },
    // footnote-after-punctuation.ts
    'footnote-after-punctuation': {
      'name': 'Noktalama İşaretinden Sonra Dipnot',
      'description': 'Dipnot referanslarının noktalama işaretinden önce değil, sonra yerleştirildiğinden emin olur.',
    },
    // force-yaml-escape.ts
    'force-yaml-escape': {
      'name': 'YAML Kaçışını Zorla',
      'description': 'Belirtilen YAML anahtarları için kaçış değerleri.',
      'force-yaml-escape-keys': {
        'name': 'Anahtarlarda YAML Kaçışını Zorla',
        'description': 'Yeni bir satır karakteri ile ayrılmış belirtilen YAML anahtarlarında YAML kaçış karakterini kullanır, eğer zaten kaçış yapılmamışsa. YAML dizilerinde kullanmayın',
      },
    },
    // format-tags-in-yaml.ts
    'format-tags-in-yaml': {
      'name': 'YAML Etiketlerini Biçimlendir',
      'description': 'YAML ön madde içindeki etiketlerden hashtagleri kaldırır, çünkü bunlar etiketleri geçersiz kılar.',
    },
    // format-yaml-array.ts
    'format-yaml-array': {
      'name': 'YAML Dizisini Biçimlendir',
      'description': 'Normal YAML dizilerinin çok satırlı veya tek satırlı olarak biçimlendirilmesine izin verir ve <code>tags</code> ve <code>aliases</code> bazı Obsidian özgü özelliklerine sahip YAML formatlarında bulunabilir.<b>Not: Tek girişli bir diziden birden fazla girişi olan tek satırlı bir diziye geçmek aynıdır, tek fark çok satırlı bir dizi olmasıdır.</b>',
      'alias-key': {
        'name': 'YAML takma adları bölümünü biçimlendir',
        'description': 'YAML takma adları bölümü için biçimlendirmeyi açar. Bu seçeneği <code>YAML Title Alias</code> kuralıyla birlikte kullanmamanız önerilir çünkü birlikte düzgün çalışmayabilir veya farklı biçimlendirme stilleri seçilmiş olabilir, bu beklenmeyen sonuçlara yol açabilir.',
      },
      'tag-key': {
        'name': 'YAML etiketleri bölümünü biçimlendir',
        'description': 'YAML etiketleri bölümü için biçimlendirmeyi açar.',
      },
      'default-array-style': {
        'name': 'Varsayılan YAML dizi bölümü stili',
        'description': '<code>tags</code>, <code>aliases</code> veya <code>Force key values to be single-line arrays</code> ve <code>Force key values to be multi-line arrays</code> olmayan diğer YAML dizilerinin stili',
      },
      'default-array-keys': {
        'name': 'YAML dizi bölümlerini biçimlendir',
        'description': 'Normal YAML dizileri için biçimlendirmeyi açar',
      },
      'force-single-line-array-style': {
        'name': 'Anahtar değerlerini tek satırlı dizilere zorla',
        'description': 'Yeni satır ile ayrılan anahtarlar için YAML dizisini tek satırlı formatta olmaya zorlar (bu seçeneği devre dışı bırakmak için boş bırakın)',
      },
      'force-multi-line-array-style': {
        'name': 'Anahtar değerlerini çok satırlı dizilere zorla',
        'description': 'Yeni satır ile ayrılan anahtarlar için YAML dizisini çok satırlı formatta olmaya zorlar (bu seçeneği devre dışı bırakmak için boş bırakın)',
      },
    },
    // header-increment.ts
    'header-increment': {
      'name': 'Başlık Artırımı',
      'description': 'Başlık seviyeleri bir seferde sadece bir seviye artmalıdır',
      'start-at-h2': {
        'name': 'Başlık Artırımını Başlık Seviyesi 2’de Başlat',
        'description': 'Bir dosyadaki minimum başlık seviyesini başlık seviyesi 2 yapar ve buna göre tüm başlıkları kaydırır, böylece başlık artışı seviye 2 başlığı ile başlar.',
      },
    },
    // heading-blank-lines.ts
    'heading-blank-lines': {
      'name': 'Başlık Boş Satırları',
      'description': 'Tüm başlıkların hem öncesinde hem de sonrasında birer boş satır olmalıdır (başlık belgenin başında veya sonunda olduğunda bu durum geçerli değildir).',
      'bottom': {
        'name': 'Alt',
        'description': 'Başlıkların sonrasına boş satır ekler',
      },
      'empty-line-after-yaml': {
        'name': 'YAML ve Başlık Arasında Boş Satır',
        'description': 'YAML ön madde ve başlık arasındaki boş satırı korur',
      },
    },
    // headings-start-line.ts
    'headings-start-line': {
      'name': 'Başlıklar Satırı Başlatır',
      'description': 'Bir satırı başlatmayan başlıkların öncesi boşlukları kaldırılır ki başlıklar başlık olarak tanınabilsin.',
    },
    // insert-yaml-attributes.ts
    'insert-yaml-attributes': {
      'name': 'YAML Özniteliklerini Ekle',
      'description': 'Verilen YAML özniteliklerini YAML ön maddesine ekler. Her özniteliği tek bir satıra koyun.',
      'text-to-insert': {
        'name': 'Eklenecek metin',
        'description': 'YAML ön maddesine eklenen metin',
      },
    },
    // line-break-at-document-end.ts
    'line-break-at-document-end': {
      'name': 'Belge Sonunda Satır Sonu',
      'description': 'Bir belgenin sonunda tam olarak bir satır sonu olduğunu garanti eder.',
    },
    // move-footnotes-to-the-bottom.ts
    'move-footnotes-to-the-bottom': {
      'name': 'Dipnotları Altbilgiye Taşı',
      'description': 'Tüm dipnotları belgenin altına taşır.',
    },
    // move-math-block-indicators-to-their-own-line.ts
    'move-math-block-indicators-to-their-own-line': {
      'name': 'Matematik Blok Göstergelerini Kendi Satırlarına Taşı',
      'description': 'Tek satırlı matematik için kaç dolar işaretinin bir matematik bloğunu gösterdiğini belirlemek için "Bir Matematik Bloğu Göstermek İçin Dolar İşareti Sayısı"nı kullanarak tüm başlangıç ve bitiş matematik bloğu göstergelerini kendi satırlarına taşıyın.',
    },
    // move-tags-to-yaml.ts
    'move-tags-to-yaml': {
      'name': 'Etiketleri YAML\'a Taşı',
      'description': 'Tüm etiketleri belgenin YAML ön maddesine taşır.',
      'how-to-handle-existing-tags': {
        'name': 'Metin içindeki etiket işlemi',
        'description': 'Ön maddeye taşındıktan sonra dosyanın içeriğinde bulunan ve yoksayılmayan etiketlerle ne yapılacağı',
      },
      'tags-to-ignore': {
        'name': 'Yoksayılacak etiketler',
        'description': 'İçerik gövdesindeki hashtag\'lerden kaldırma etkinleştirilmişse, etiketler dizisine taşınmayacak veya içerik gövdesinden kaldırılmayacak etiketler. Her etiket yeni bir satırda ve <code>#</code> olmadan olmalıdır.<b>Etiket adında hashtag içermediğinizden emin olun.</b>',
      },
    },
    // no-bare-urls.ts
    'no-bare-urls': {
      'name': 'Yalın URL\'ler Olmasın',
      'description': 'Yalın URL\'leri açılı ayraçlar ile kuşatır, tek veya çift tırnak, köşeli parantez veya eğik kesme işareti içinde değilse.',
    },
    // ordered-list-style.ts
    'ordered-list-style': {
      'name': 'Sıralı Liste Stili',
      'description': 'Sıralı listelerin belirtilen stili izlemesini sağlar.<b>Not: 2 boşluk veya 1 sekme bir girinti seviyesi olarak kabul edilir.</b>',
      'number-style': {
        'name': 'Numara Stili',
        'description': 'Sıralı liste göstergelerinde kullanılan numara stili',
      },
      'list-end-style': {
        'name': 'Sıralı Liste Gösterge Sonu Stili',
        'description': 'Bir sıralı liste göstergesinin bitiş karakteri',
      },
    },
    // paragraph-blank-lines.ts
    'paragraph-blank-lines': {
      'name': 'Paragraf Boş Satırları',
      'description': 'Tüm paragrafların hem önce hem sonra tam olarak bir boş satırı olmalıdır.',
    },
    // prevent-double-checklist-indicator-on-paste.ts
    'prevent-double-checklist-indicator-on-paste': {
      'name': 'Yapıştırmada Çift Kontrol Listesi Göstergesini Önle',
      'description': 'Kursörün dosyadaki satırda bir kontrol listesi göstergesi varsa, yapıştırılacak metinden başlangıç kontrol listesi göstergesini kaldırır',
    },
    // prevent-double-list-item-indicator-on-paste.ts
    'prevent-double-list-item-indicator-on-paste': {
      'name': 'Yapıştırmada Çift Liste Öğesi Göstergesini Önle',
      'description': 'Kursörün dosyadaki satırda bir liste göstergesi varsa, yapıştırılacak metinden başlangıç listesi göstergesini kaldırır',
    },
    // proper-ellipsis-on-paste.ts
    'proper-ellipsis-on-paste': {
      'name': 'Yapıştırmada Uygun Üç Nokta',
      'description': 'Yapıştırılacak metinde aralarında boşluk olsa bile ardışık üç noktayı, üç nokta karakteriyle ile değiştirir',
    },
    // proper-ellipsis.ts
    'proper-ellipsis': {
      'name': 'Uygun Üç Nokta',
      'description': 'Ardışık üç tane noktayı, üç nokta karakteriyle değiştirir.',
    },
    // quote-style.ts
    'quote-style': {
      'name': 'üç nokta karakteriyle',
      'description': 'Gövde içeriğindeki alıntıları belirtilen tek ve çift alıntı stillerine günceller.',
      'single-quote-enabled': {
        'name': '<code>Tek Alıntı Stili</code> Kullanımı',
        'description': 'Seçilen tek alıntı stilinin kullanılacağını belirtir.',
      },
      'single-quote-style': {
        'name': 'Tek Alıntı Stili',
        'description': 'Kullanılacak tek alıntı stilidir.',
      },
      'double-quote-enabled': {
        'name': '<code>Çift Alıntı Stili</code> Kullanımı',
        'description': 'Seçilen çift alıntı stilinin kullanılacağını belirtir.',
      },
      'double-quote-style': {
        'name': 'Çift Alıntı Stili',
        'description': 'Kullanılacak çift alıntı stilidir.',
      },
    },
    // re-index-footnotes.ts
    're-index-footnotes': {
      'name': 'Dipnotları Yeniden İndeksle',
      'description': 'Dipnot anahtarlarını ve dipnotları, oluşum sırasına göre yeniden indeksler.<b>Not: Bir anahtar için birden fazla dipnot varsa, bu kural çalışmaz.</b>',
    },
    // remove-consecutive-list-markers.ts
    'remove-consecutive-list-markers': {
      'name': 'Ardışık Liste İşaretlerini Kaldır',
      'description': 'Ardışık liste işaretlerini kaldırır. Liste öğelerini kopyala-yapıştır yaparken kullanışlıdır.',
    },
    // remove-empty-lines-between-list-markers-and-checklists.ts
    'remove-empty-lines-between-list-markers-and-checklists': {
      'name': 'Liste İşaretleri ve Kontrol Listeleri Arasındaki Boş Satırları Kaldır',
      'description': 'Liste işaretleri ve kontrol listeleri arasında boş satır olmamalıdır.',
    },
    // remove-empty-list-markers.ts
    'remove-empty-list-markers': {
      'name': 'Boş Liste İşaretçilerini Kaldır',
      'description': 'Boş liste işaretçilerini, yani içeriksiz liste öğelerini kaldırır.',
    },
    // remove-hyphenated-line-breaks.ts
    'remove-hyphenated-line-breaks': {
      'name': 'Tireli Satır Sonlarını Kaldır',
      'description': 'Removes hyphenated line breaks. Useful when pasting text from textbooks.',
    },
    // remove-hyphens-on-paste.ts
    'remove-hyphens-on-paste': {
      'name': 'Yapıştırırken Tireleri Kaldır',
      'description': 'Yapıştırılacak metindeki tireleri kaldırır',
    },
    // remove-leading-or-trailing-whitespace-on-paste.ts
    'remove-leading-or-trailing-whitespace-on-paste': {
      'name': 'Yapıştırda Öndeki veya Sondaki Boşlukları Kaldır',
      'description': 'Yapıştırılacak metnin başındaki sekme olmayan boşlukları ve sonundaki tüm boşlukları kaldırır',
    },
    // remove-leftover-footnotes-from-quote-on-paste.ts
    'remove-leftover-footnotes-from-quote-on-paste': {
      'name': 'Yapıştırmada Alıntıdan Kalan Dipnotları Kaldır',
      'description': 'Yapıştırılacak metinden herhangi bir kalıntı dipnot referanslarını kaldırır',
    },
    // remove-link-spacing.ts
    'remove-link-spacing': {
      'name': 'Link Aralığını Kaldır',
      'description': 'Link metninin etrafındaki boşlukları kaldırır.',
    },
    // remove-multiple-blank-lines-on-paste.ts
    'remove-multiple-blank-lines-on-paste': {
      'name': 'Yapıştırırken Birden Fazla Boş Satırı Kaldır',
      'description': 'Metnin yapıştırılması için birden çok boş satırı tek bir boş satıra sıkıştırır',
    },
    // remove-multiple-spaces.ts
    'remove-multiple-spaces': {
      'name': 'Birden Fazla Boşluğu Kaldır',
      'description': 'İki veya daha fazla ardışık boşluğu kaldırır. Satırın başındaki ve sonundaki boşlukları görmezden gelir. ',
    },
    // remove-space-around-characters.ts
    'remove-space-around-characters': {
      'name': 'Karakterler Etrafındaki Boşluğu Kaldır',
      'description': 'Belirli karakterlerin boşluklarla (tek boşluk veya sekme) çevrelenmemesini sağlar.<b>Not: Bu, bazı durumlarda indirim biçimiyle ilgili sorunlara neden olabilir.</b>',
      'include-fullwidth-forms': {
        'name': 'Tam Genişlikte Formları Dahil Et',
        'description': '<a href="https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)">Tam Genişlikte Formlar Unicode bloğunu</a> dahil eder',
      },
      'include-cjk-symbols-and-punctuation': {
        'name': 'CJK Sembol ve Noktalama İşaretlerini Dahil Et',
        'description': '<a href="https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation">CJK Sembol ve Noktalama Unicode bloğunu</a> dahil eder',
      },
      'include-dashes': {
        'name': 'Tireleri Dahil Et',
        'description': 'En tire (–) ve em tireyi (—) dahil eder',
      },
      'other-symbols': {
        'name': 'Diğer Semboller',
        'description': 'Dahil edilecek diğer semboller',
      },
    },
    // remove-space-before-or-after-characters.ts
    'remove-space-before-or-after-characters': {
      'name': 'Karakterlerden Önce veya Sonra Boşluğu Kaldır',
      'description': 'Belirtilen karakterlerden önceki ve sonraki boşluğu kaldırır.<b>Not: bu durum bazı durumlarda markdown formatında sorunlara neden olabilir.</b>',
      'characters-to-remove-space-before': {
        'name': 'Önceki Boşluğu Kaldırılacak Karakterler',
        'description': 'Belirtilen karakterlerden önceki boşluğu kaldırır.<b>Not: karakter listesinde <code>{</code> veya <code>}</code> kullanmak, sahne arkasında yoksayma sözdizimi kullanıldığı için dosyaları beklenmedik şekilde etkiler.</b>',
      },
      'characters-to-remove-space-after': {
        'name': 'Sonraki Boşluğu Kaldırılacak Karakterler',
        'description': 'Belirtilen karakterlerden sonraki boşluğu kaldırır.<b>Not: karakter listesinde <code>{</code> veya <code>}</code> kullanmak, sahne arkasında yoksayma sözdizimi kullanıldığı için dosyaları beklenmedik şekilde etkiler.</b>',
      },
    },
    // remove-trailing-punctuation-in-heading.ts
    'remove-trailing-punctuation-in-heading': {
      'name': 'Başlıklardaki Son Noktalama İşaretlerini Kaldır',
      'description': 'Belirtilen noktalama işaretlerini başlıkların sonundan kaldırır ve <a href="https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references">HTML varlık referanslarının</a> sonundaki noktalı virgülü yoksayar.',
      'punctuation-to-remove': {
        'name': 'Sondaki Noktalama',
        'description': 'Dosyadaki başlıklardan kaldırılacak noktalama işaretleri.',
      },
    },
    // remove-yaml-keys.ts
    'remove-yaml-keys': {
      'name': 'YAML Anahtarlarını Kaldır',
      'description': 'Belirtilen YAML anahtarlarını kaldırır',
      'yaml-keys-to-remove': {
        'name': 'Kaldırılacak YAML Anahtarları',
        'description': 'YAML ön maddesinden iki nokta üst üste ile veya olmadan kaldırılacak YAML anahtarları',
      },
    },
    // space-after-list-markers.ts
    'space-after-list-markers': {
      'name': 'Liste İşaretlerinden Sonra Boşluk',
      'description': 'Liste işaretleri ve onay kutularından sonra tek bir boşluk olmalıdır',
    },
    // space-between-chinese-japanese-or-korean-and-english-or-numbers.ts
    'space-between-chinese-japanese-or-korean-and-english-or-numbers': {
      'name': 'Çince, Japonca veya Korece ve İngilizce veya Sayılar Arasında Boşluk',
      'description': 'Çince, Japonca veya Korece ve İngilizce veya sayılar arasında tek bir boşluk olması gerektiğini sağlar. Bu <a href="https://github.com/sparanoid/chinese-copywriting-guidelines">kuralları</a> takip eder',
    },
    // strong-style.ts
    'strong-style': {
      'name': 'Kalın Stil',
      'description': 'Kalın stilin tutarlı olduğunu garanti eder.',
      'style': {
        'name': 'Stil',
        'description': 'Kalın/yoğun içeriği belirtmek için kullanılan stil',
      },
    },
    // trailing-spaces.ts
    'trailing-spaces': {
      'name': 'Sondaki boşluklar',
      'description': 'Her satırın sonundaki fazladan boşlukları kaldırır.',
      'two-space-line-break': {
        'name': 'İki Boşluklu Satır Sonu',
        'description': 'Bir satır sonunu takiben iki boşluğu göz ardı et ("İki Boşluk Kuralı").',
      },
    },
    // two-spaces-between-lines-with-content.ts
    'two-spaces-between-lines-with-content': {
      'name': 'İçeriği Olan Satırlar Arasında İki Boşluk',
      'description': 'İçeriği devam eden satırların sonuna paragraflar, blok alıntıları ve liste öğeleri için iki boşluk eklenmesini sağlar',
    },
    // unordered-list-style.ts
    'unordered-list-style': {
      'name': 'Sırasız Liste Stili',
      'description': 'Sırasız listelerin belirtilen stili takip ettiğinden emin olur.',
      'list-style': {
        'name': 'Liste öğesi stili',
        'description': 'Sırasız listelerde kullanılacak liste öğesi stili',
      },
    },
    // yaml-key-sort.ts
    'yaml-key-sort': {
      'name': 'YAML Anahtar Sıralaması',
      'description': 'YAML anahtarlarını belirtilen sıra ve önceliğe göre sıralar.<b>Not: boş satırları da kaldırabilir.</b>',
      'yaml-key-priority-sort-order': {
        'name': 'YAML Anahtar Öncelik Sıralama Düzeni',
        'description': 'Her satırda bir tane olacak şekilde anahtarların hangi sırayla sıralanacağı',
      },
      'priority-keys-at-start-of-yaml': {
        'name': 'Öncelikli Anahtarlar YAML\'ın Başında',
        'description': 'YAML Anahtar Öncelik Sıralama Düzeni, YAML ön maddesinin başında yer alır',
      },
      'yaml-sort-order-for-other-keys': {
        'name': 'Diğer Anahtarlar İçin YAML Sıralama Düzeni',
        'description': 'YAML Anahtar Öncelik Sıralama Düzeni metin alanında bulunmayan anahtarları nasıl sıralayacağı',
      },
    },
    // yaml-timestamp.ts
    'yaml-timestamp': {
      'name': 'YAML Zaman Damgası',
      'description': 'Dosyanın son düzenlendiği tarihi YAML ön maddesinde takip eder. Tarihler dosya metadatasından alınır.',
      'date-created': {
        'name': 'Oluşturma Tarihi',
        'description': 'Dosyanın oluşturma tarihini ekler',
      },
      'date-created-key': {
        'name': 'Oluşturma Tarihi Anahtarı',
        'description': 'Oluşturma tarihi için hangi YAML anahtarını kullanacağı',
      },
      'date-modified': {
        'name': 'Değiştirme Tarihi',
        'description': 'Dosyanın son değiştirildiği tarihi ekler',
      },
      'date-modified-key': {
        'name': 'Değiştirme Tarihi Anahtarı',
        'description': 'Değiştirme tarihi için hangi YAML anahtarını kullanacağı',
      },
      'format': {
        'name': 'Format',
        'description': 'Kullanılacak Zaman formatı (bakınız <a href="https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/">Moment format options</a>)',
      },
    },
    // yaml-title-alias.ts
    'yaml-title-alias': {
      'name': 'YAML Başlık Takma Adı',
      'description': 'Dosyanın başlığını YAML ön maddesinin takma adları bölümüne ekler. Başlığı ilk H1 veya dosya adından alır.',
      'preserve-existing-alias-section-style': {
        'name': 'Mevcut takma adlar bölüm stilini koru',
        'description': 'Ayarlanırsa, <code>YAML takma adlar bölümü stili</code> ayarı yalnızca yeni oluşturulan bölümlere uygulanır',
      },
      'keep-alias-that-matches-the-filename': {
        'name': 'Dosya adına uyan takma adı koru',
        'description': 'Bu tür takma adlar genellikle gereksizdir',
      },
      'use-yaml-key-to-keep-track-of-old-filename-or-heading': {
        'name': '<code>linter-yaml-title-alias</code> YAML anahtarını kullanarak eski dosya adı ve başlık değişikliklerini takip et',
        'description': 'Ayarlanırsa, ilk H1 başlığı değiştiğinde veya ilk H1 yoksa dosya adı değiştiğinde, bu anahtarda saklanan eski takma ad, takma adlar dizisine yeni bir giriş eklemek yerine yeni değerle değiştirilir',
      },
    },
    // yaml-title.ts
    'yaml-title': {
      'name': 'YAML Başlık',
      'description': 'Dosyanın başlığını YAML ön maddesine ekler. Başlık seçilen moda göre alınır.',
      'title-key': {
        'name': 'Başlık Anahtarı',
        'description': 'Başlık için hangi YAML anahtarını kullanacağı',
      },
      'mode': {
        'name': 'Mod',
        'description': 'Başlığı almak için kullanılacak yöntem',
      },
    },
  },

  // These are the string values in the UI for enum values and thus they do not follow the key format as used above
  'enums': {
    'Title Case': 'Baş Harfleri Büyük',
    'ALL CAPS': 'TÜMÜ BÜYÜK HARF',
    'First letter': 'İlk Harf',
    '.': '.', // leave as is
    ')': ')', // leave as is
    'ERROR': 'hata',
    'TRACE': 'işaret',
    'DEBUG': 'hata ayıklama',
    'INFO': 'bilgi',
    'WARN': 'uyarı',
    'SILENT': 'sessiz',
    'ascending': 'artan',
    'lazy': 'tembel',
    'Nothing': 'Hiçbiri',
    'Remove hashtag': 'Hashtagi Kaldır',
    'Remove whole tag': 'Tüm Etiketi Kaldır',
    'asterisk': 'yıldız',
    'underscore': 'alt çizgi',
    'consistent': 'tutarlı',
    '-': '-', // leave as is
    '*': '*', // leave as is
    '+': '+', // leave as is
    'space': 'boşluk',
    'no space': 'boşluk yok',
    'None': 'Yok',
    'Ascending Alphabetical': 'Artan Alfabetik',
    'Descending Alphabetical': 'Azalan Alfabetik',
    // yaml.ts
    'multi-line': 'çoklu-satır',
    'single-line': 'tek-satır',
    'single string to single-line': 'tek dizeden tek satıra',
    'single string to multi-line': 'tek dizeden çok satıra',
    'single string comma delimited': 'virgülle ayrılmış tek dize',
    'single string space delimited': 'boşlukla ayrılmış tek dize',
    'single-line space delimited': 'boşlukla ayrılmış tek satır',
    // yaml-title.ts
    'first-h1': 'İlk H1',
    'first-h1-or-filename-if-h1-missing': 'İlk H1 veya H1 Eksikse Dosya Adı',
    'filename': 'Dosya Adı',
    // quote-style.ts
    '\'\'': '\'\'', // leave as is
    '‘’': '‘’', // leave as is
    '""': '""', // leave as is
    '“”': '“”', // leave as is
    // yaml.ts
    '\\': '\\', // leave as is
    '<br>': '<br>', // leave as is
    '  ': '  ', // leave as is
    '<br/>': '<br/>', // leave as is
  },
};

// Turkish

export default {
  'commands': {
    'lint-file': {
      'name': 'Mevcut dosyayı lint et',
      'error-message': 'Dosyada Lint Hatası',
    },
    'lint-file-unless-ignored': {
      'name': 'Yoksayılmadıysa mevcut dosyayı lint et',
    },
    'lint-all-files': {
      'name': 'Vault\'taki tüm dosyaları lint et',
      'error-message': 'Tüm dosyalar lint edilirken dosyada hata oluştu',
      'success-message': 'Tüm dosyalar lint edildi',
      'errors-message-singular': 'Tüm dosyalar lint edildi ve 1 hata oluştu.',
      'errors-message-plural': 'Tüm dosyalar lint edildi ve {NUM} hata oluştu.',
      'start-message': 'Bu işlem tüm dosyalarınızı düzenleyecektir ve hatalara yol açabilir.',
      'submit-button-text': 'Tümünü Lint Et',
      'submit-button-notice-text': 'Tüm dosyalar lint ediliyor...',
    },
    'lint-all-files-in-folder': {
      'name': 'Mevcut klasördeki tüm dosyaları lint et',
      'start-message': 'Bu işlem {FOLDER_NAME} klasöründeki ve alt klasörlerindeki tüm dosyaları düzenleyecektir; bu durum hatalara yolabilir.',
      'submit-button-text': '{FOLDER_NAME} Klasöründeki Tüm Dosyaları Lint Et',
      'submit-button-notice-text': '{FOLDER_NAME} klasöründeki tüm dosyalar lint ediliyor...',
      'error-message': 'Klasördeki tüm dosyalar lint edilirken dosyada hata oluştu',
      'success-message': '{FOLDER_NAME} klasöründeki {NUM} dosyanın tümü lint edildi.',
      'message-singular': '{FOLDER_NAME} klasöründeki {NUM} dosyanın tümü lint edildi ve 1 hata oluştu.',
      'message-plural': '{FOLDER_NAME} klasöründeki {FILE_COUNT} dosyanın tümü lint edildi ve {ERROR_COUNT} hata oluştu.',
    },
    'paste-as-plain-text': {
      'name': 'Düz Metin Olarak ve Değişiklik Yapmadan Yapıştır',
    },
    'ignore-folder': {
      'name': 'Klasörü yoksay',
    },
    'ignore-file': {
      'name': 'Dosyayı yoksay',
    },
    'lint-file-pop-up-menu-text': {
      'name': 'Dosyayı lint et',
    },
    'lint-folder-pop-up-menu-text': {
      'name': 'Klasörü lint et',
    },
    'ignore-file-pop-up-menu-text': {
      'name': 'Linter\'da dosyayı yoksay',
    },
    'ignore-folder-pop-up-menu-text': {
      'name': 'Linter\'da klasörü yoksay',
    },
  },

  'logs': {
    'plugin-load': 'Eklenti yükleniyor',
    'plugin-unload': 'Eklenti kaldırılıyor',
    'folder-lint': 'Klasör lint ediliyor: ',
    'linter-run': 'Linter çalıştırılıyor',
    'file-change-yaml-lint-run': 'Editör içerik değişimi için YAML lint işlemi çalıştırılıyor',
    'file-change-yaml-lint-skipped': 'Dosya değişimi algılanmadı, YAML lint işlemi atlandı',
    'file-change-yaml-lint-warning': 'Dosya bilgisi mevcut değil ancak debounce çalıştı. Bir yerde bir sorun oluştu.',
    'paste-link-warning': 'Pano içeriği bir bağlantı olduğu için yapıştırma lint işlemi iptal edildi; böylece yapıştırma davranışını değiştiren diğer eklentilerle çakışma önlenir.',
    'see-console': 'Daha fazla ayrıntı için konsola bakın.',
    'unknown-error': 'Lint işlemi sırasında bilinmeyen bir hata oluştu.',
    'moment-locale-not-found': 'Moment.js dili {MOMENT_LOCALE} olarak değiştirilmeye çalışılıyor, mevcut dil: {CURRENT_LOCALE}',
    'file-change-lint-message-start': 'Lint edildi',
    'custom-command-callback-warning': 'Lütfen özel komut geri çağrısını (callback) yalnızca entegrasyon testleri için ayarlayın.',

    // rules-runner.ts
    'pre-rules': 'normal kurallardan önceki kurallar',
    'post-rules': 'normal kurallardan sonraki kurallar',
    'rule-running': 'çalışan kurallar',
    'custom-regex': 'özel regex kuralları',
    'running-custom-regex': 'Özel Regex Çalıştırılıyor',
    'running-custom-lint-command': 'Özel Lint Komutları Çalıştırılıyor',
    'custom-lint-duplicate-warning': 'Aynı komutu ("{COMMAND_NAME}") özel bir lint kuralı olarak iki kez çalıştıramazsınız.',
    'custom-lint-error-message': 'Özel Lint Komutu',

    // rules-runner.ts and rule-builder.ts
    'disabled-text': 'devre dışı',

    // rule-builder.ts
    'run-rule-text': 'Çalıştırılıyor',

    // logger.ts
    'timing-key-not-found': '\'{TIMING_KEY}\' zamanlama anahtarı zamanlama bilgisi listesinde yok, bu yüzden yoksayıldı',
    'milliseconds-abbreviation': 'ms',

    'invalid-date-format-error': `'{FILE_NAME}' dosyasındaki oluşturma tarihi '{DATE}' formatı ayrıştırılamadı veya belirlenemedi, bu yüzden oluşturma tarihi değiştirilmedi.`,

    // yaml.ts
    'invalid-delimiter-error-message': 'ayırıcı (delimiter) yalnızca tek bir karakter olabilir',

    // mdast.ts
    'missing-footnote-error-message': `'{FOOTNOTE}' dipnotunun, dipnot içeriğinden önce gelen bir referansı yok ve işlenemiyor. Lütfen tüm dipnotların içerikten önce ilgili bir referansa sahip olduğundan emin olun.`,
    'too-many-footnotes-error-message': `'{FOOTNOTE_KEY}' dipnot anahtarına başvuran birden fazla dipnot var. Lütfen her dipnot anahtarına yalnızca bir dipnot düşecek şekilde dipnotları güncelleyin.`,

    // rules.ts
    'wrapper-yaml-error': 'YAML hatası: {ERROR_MESSAGE}',
    'wrapper-unknown-error': 'bilinmeyen hata: {ERROR_MESSAGE}',
  },

  'notice-text': {
    'empty-clipboard': 'Panoda herhangi bir içerik yok.',
    'characters-added': 'karakter eklendi',
    'characters-removed': 'karakter silindi',
    'copy-to-clipboard-failed': 'Metin panoya kopyalanamadı: ',
  },

  // rule-alias-suggester.ts
  'all-rules-option': 'Tümü',

  // settings.ts
  'linter-title': 'Linter',
  'empty-search-results-text': 'Arama ile eşleşen ayar bulunamadı',

  // lint-confirmation-modal.ts
  'warning-text': 'Uyarı',
  'file-backup-text': 'Dosyalarınızı yedeklediğinizden emin olun.',
  'custom-command-warning': 'Özel komutlar etkinken birden fazla dosyayı lint etmek, yan panelde sekmeler açmayı gerektiren yavaş bir işlemdir. Özel komutlar olmadan çalıştırmaya kıyasla fark edilir derecede daha yavaştır. Lütfen dikkatli ilerleyin.',
  'cancel-button-text': 'İptal',
  'do-not-show-again': 'Bu onayı tekrar gösterme',

  'copy-aria-label': 'Kopyala',

  'disabled-other-rule-notice': '<code>{NAME_1}</code> kuralını etkinleştirmek, <code>{NAME_2}</code> kuralını devre dışı bırakacaktır. Devam etmek istiyor musunuz?',
  'disabled-conflicting-rule-notice': '{NAME_1} kuralı {NAME_2} kuralı ile çakıştığı için kapatıldı. Hangi ayarın kapatılacağını ayarlar sekmesinden değiştirebilirsiniz.',

  // confirm-rule-disable-modal.ts
  'ok': 'Tamam',

  // parse-results-modal.ts
  'parse-results-heading-text': 'Özel Ayrıştırma Değerleri',
  'file-parse-description-text': 'Aşağıda, {FILE} dosyasında bulunan özel değişikliklerin (replacements) listesi yer almaktadır.',
  'no-parsed-values-found-text': '{FILE} dosyasında özel değişiklik bulunamadı. Lütfen {FILE} içindeki özel değişiklikleri içeren tüm tabloların yalnızca iki sütuna sahip olduğundan ve tüm satırların dikey çizgi (örn. |) ile başlayıp bittiğinden emin olun.',
  'find-header-text': 'Aranacak Kelime',
  'replace-header-text': 'Yeni Kelime',
  'close-button-text': 'Kapat',

  'tabs': {
    'names': {
      // tab.ts
      'general': 'Genel',
      'custom': 'Özel',
      'yaml': 'YAML',
      'heading': 'Başlık',
      'content': 'İçerik',
      'footnote': 'Dipnot',
      'spacing': 'Boşluklar',
      'paste': 'Yapıştır',
      'debug': 'Hata Ayıklama',
    },
    // tab-searcher.ts
    'default-search-bar-text': 'Tüm ayarlarda ara',
    'general': {
      // general-tab.ts
      'lint-on-save': {
        'name': 'Kaydederken lint et',
        'description': 'Dosyayı manuel kaydettiğinizde lint eder (<code>Ctrl + S</code> tuşlarına basıldığında veya vim tuş kombinasyonları kullanılırken <code>:w</code> çalıştırıldığında)',
      },
      'display-message': {
        'name': 'Lint işleminde mesaj göster',
        'description': 'Lint işleminden sonra değişen karakter sayısını gösterir',
      },
      'suppress-message-when-no-change': {
        'name': 'Değişiklik yoksa mesajı gizle',
        'description': 'Etkinleştirildiğinde, herhangi bir gerçek değişiklik gerçekleşmezse mesaj gösterilmez.',
      },
      'lint-on-file-change': {
        'name': 'Odaklanan dosya değiştiğinde lint et',
        'description': 'Bir dosya kapatıldığında veya yeni bir dosyaya geçiş yapıldığında, önceki dosya lint edilir.',
      },
      'display-lint-on-file-change-message': {
        'name': 'Dosya değişiminde lint mesajını göster',
        'description': '<code>Odaklanan dosya değiştiğinde lint et</code> işlemi gerçekleştiğinde bir mesaj gösterir',
      },
      'folders-to-ignore': {
        'name': 'Yoksayılacak klasörler',
        'description': 'Tüm dosyalar lint edilirken veya kaydetme esnasında lint edilirken yoksayılacak klasörler.',
        'folder-search-placeholder-text': 'Klasör adı',
        'add-input-button-text': 'Yoksayılacak başka bir klasör ekle',
        'delete-tooltip': 'Sil',
      },
      'files-to-ignore': {
        'name': 'Yoksayılacak dosyalar',
        'description': 'Tüm dosyalar lint edilirken veya kaydetme esnasında lint edilirken yoksayılacak dosyalar.',
        'file-search-placeholder-text': 'Yoksayılacak dosya için regex',
        'add-input-button-text': 'Yoksayılacak yeni bir dosya regex\'i ekle',
        'delete-tooltip': 'Sil',
        'label-placeholder-text': 'etiket',
        'flags-placeholder-text': 'flags',
        'warning': 'Regex bilmiyorsanız bunu dikkatli kullanın. Ayrıca, iOS mobil cihazlarda regex içinde lookbehind kullanıyorsanız, bunun desteklendiği bir iOS sürümünde olduğunuzdan emin olun.',
      },
      'additional-file-extensions': {
        'name': 'Ek dosya uzantıları',
        'description': 'md uzantısına ek olarak lint edilecek dosya uzantıları. Örneğin; mdx veya svx. Baştaki noktayı dahil etmeyin. <b>Not: Eklenen uzantılardan bağımsız olarak, yalnızca Obsidian\'ın (yerel olarak veya diğer eklentiler aracılığıyla) markdown olarak gördüğü dosyalar lint edilecektir.</b>',
        'extension-placeholder': 'Örn. mdx',
        'add-input-button-text': 'Başka bir uzantı ekle',
        'delete-tooltip': 'Sil',
      },
      'override-locale': {
        'name': 'Dili geçersiz kıl',
        'description': 'Varsayılan dilden farklı bir yerel ayar (locale) kullanmak istiyorsanız bunu ayarlayın',
      },
      'same-as-system-locale': 'Sistem dili ile aynı ({SYS_LOCALE})',
      'yaml-aliases-section-style': {
        'name': 'YAML aliases bölüm stili',
        'description': 'YAML aliases (takma adlar) bölümünün stili',
      },
      'yaml-tags-section-style': {
        'name': 'YAML tags bölüm stili',
        'description': 'YAML tags (etiketler) bölümünün stili',
      },
      'default-escape-character': {
        'name': 'Varsayılan kaçış karakteri',
        'description': 'Tek tırnak ve çift tırnak bulunmadığında, YAML değerlerinden kaçış (escape) için kullanılacak varsayılan karakter.',
      },
      'remove-unnecessary-escape-chars-in-multi-line-arrays': {
        'name': 'Çok satırlı dizi formatında gereksiz kaçış karakterlerini kaldır',
        'description': 'Çok satırlı YAML dizilerindeki (arrays) kaçış karakterleri, tek satırlı dizilerle aynı kaçış ihtiyacına sahip değildir; bu nedenle çok satırlı formatta gereksiz olan fazladan kaçış karakterlerini kaldırır',
      },
      'number-of-dollar-signs-to-indicate-math-block': {
        'name': 'Matematik bloğunu belirten dolar işareti sayısı',
        'description': 'Matematik içeriğinin satır içi (inline math) yerine bir matematik bloğu (math block) olarak kabul edilmesi için gereken dolar işareti miktarı',
      },
    },
    'debug': {
      // debug-tab.ts
      'log-level': {
        'name': 'Log seviyesi',
        'description': 'Servis tarafından günlüklenmesine (log) izin verilecek log türleri. Varsayılan ERROR seviyesidir.',
      },
      'linter-config': {
        'name': 'Linter yapılandırması',
        'description': 'Ayarlar sayfası yüklendiği andaki Linter data.json içeriği',
      },
      'log-collection': {
        'name': 'Kaydederken ve mevcut dosyayı lint ederken logları topla',
        'description': '<code>Kaydederken lint et</code> ve mevcut dosyayı lint et komutları çalıştırıldığında logları toplar. Bu loglar hata ayıklama ve hata raporu oluşturma süreçlerinde yardımcı olabilir.',
      },
      'linter-logs': {
        'name': 'Linter logları',
        'description': 'Eğer etkinse, son <code>Kaydederken lint et</code> veya son mevcut dosyayı lint et işlemine ait loglar.',
      },
    },
  },
  'options': {
    'custom-command': {
      // custom-command-option.ts
      'name': 'Özel komutlar',
      'description': 'Özel komutlar, linter normal kurallarını çalıştırmayı bitirdikten sonra çalıştırılan Obsidian komutlarıdır. Bu komutlar YAML zaman damgası (timestamp) mantığından önce çalışmaz; bu nedenle bir sonraki linter çalışmasında YAML zaman damgasının tetiklenmesine neden olabilirler. Bir Obsidian komutunu yalnızca bir kez seçebilirsiniz.',
      'warning': 'Bir seçenek belirlerken, seçimi fareyle tıklayarak veya Enter tuşuna basarak yaptığınızdan emin olun. Diğer seçim yöntemleri çalışmayabilir; yalnızca gerçek bir Obsidian komutu veya boş bir metin seçildiğinde kaydedilecektir.',

      'add-input-button-text': 'Yeni komut ekle',
      'command-search-placeholder-text': 'Obsidian komutu',
      'move-up-tooltip': 'Yukarı taşı',
      'move-down-tooltip': 'Aşağı taşı',
      'delete-tooltip': 'Sil',
    },
    'custom-replace': {
      // custom-replace-option.ts
      'name': 'Özel regex değişikliği',
      'description': 'Özel regex değişikliği, arama regex\'i ile eşleşen herhangi bir içeriği yeni değerle değiştirmek için kullanılır. Arama ve değiştirme değerlerinin geçerli regex ifadeleri olması gerekir.',
      'warning': 'Regex bilmiyorsanız bunu dikkatli kullanın. Ayrıca, iOS mobil cihazlarda regex içinde lookbehind kullanıyorsanız, bunun desteklendiği bir iOS sürümünde olduğunuzdan emin olun.',
      'add-input-button-text': 'Yeni regex değişikliği ekle',
      'regex-to-find-placeholder-text': 'aranacak regex',
      'flags-placeholder-text': 'flags (bayraklar)',
      'regex-to-replace-placeholder-text': 'değiştirilecek regex',
      'label-placeholder-text': 'etiket',
      'move-up-tooltip': 'Yukarı taşı',
      'move-down-tooltip': 'Aşağı taşı',
      'delete-tooltip': 'Sil',
    },
    'custom-auto-correct': {
      'delete-tooltip': 'Sil',
      'show-parsed-contents-tooltip': 'Ayrıştırılan değişiklikleri görüntüle',
      'custom-row-parse-warning': '"{ROW}" özel değişiklikler için geçerli bir satır değil. Yalnızca 2 sütuna sahip olmalıdır.',
      'file-search-placeholder-text': 'Dosya adı',
      'add-new-replacement-file-tooltip': 'Başka bir özel dosya ekle',
      'warning-text': 'Seçilen dosyalarda {NAME} otomatik olarak devre dışı bırakılacaktır.',
      'refresh-tooltip-text': 'Özel değişiklikleri yeniden yükle',
    },
  },

  // rules
  'rules': {
    // auto-correct-common-misspellings.ts
    'auto-correct-common-misspellings': {
      'name': 'Sık yapılan yazım hatalarını otomatik düzelt',
      'description': 'Sık yapılan yazım hatalarını içeren bir sözlük kullanarak bunları otomatik olarak doğru yazımlarına dönüştürür. Otomatik düzeltilen kelimelerin tam listesi için <a href="https://github.com/platers/obsidian-linter/tree/master/src/utils/default-misspellings.md">auto-correct map</a> sayfasına bakın. <b>Not: Bu liste birden fazla dildeki metinler üzerinde çalışabilir ancak mevcut dilden bağımsız olarak liste her zaman aynıdır.</b>',
      'ignore-words': {
        'name': 'Yoksayılacak kelimeler',
        'description': 'Otomatik düzeltme sırasında yoksayılacak, virgülle ayrılmış küçük harfli kelimeler listesi',
      },
      'extra-auto-correct-files': {
        'name': 'Ek otomatik düzeltme kaynak dosyaları',
        'description': 'İçinde hatalı kelimeyi ve düzeltilecek halini barındıran bir markdown tablosu içeren dosyalardır (bu düzeltmeler büyük/küçük harfe duyarlı değildir). <b>Not: Kullanılan tabloların her satırında başlangıç ve bitiş <code>|</code> işaretleri bulunmalıdır.</b>',
      },
      'skip-words-with-multiple-capitals': {
        'name': 'Birden fazla büyük harf içeren kelimeleri atla',
        'description': 'Kelimenin ilk harfi dışındaki yerlerde büyük harf içeren kelimeleri atlar. Kısaltmalar ve bazı kelimeler bu durumdan yararlanabilir. Özel isimlerin düzgün şekilde düzeltilmesinde sorunlara yol açabilir.',
      },
      'default-install': 'Sık Yapılan Yazım Hatalarını Otomatik Düzelt özelliğini kullanıyorsunuz. Bunu yapabilmek için varsayılan yazım hataları listesi indirilecektir. Bu işlem yalnızca bir kez gerçekleşir. Lütfen bekleyin...',
      'default-install-failed': '{URL} indirilemedi. Sık Yapılan Yazım Hatalarını Otomatik Düzelt özelliği devre dışı bırakılıyor.',
      'defaults-missing': 'Varsayılan genel otomatik düzeltme dosyası bulunamadı: {FILE}.',
    },
    // add-blank-line-after-yaml.ts
    'add-blank-line-after-yaml': {
      'name': 'YAML sonrasına boş satır ekle',
      'description': 'YAML bloğundan sonra, eğer mevcut dosyanın sonu değilse veya zaten ardından en az 1 boş satır gelmiyorsa, bir boş satır ekler',
    },
    // blockquotify-on-paste.ts
    'add-blockquote-indentation-on-paste': {
      'name': 'Yapıştırırken alıntı (blockquote) girintisi ekle',
      'description': 'Yapıştırma esnasında imleç bir alıntı (blockquote) veya çağrı (callout) satırındaysa, ilk satır hariç tüm satırlara alıntı işareti ekler',
    },
    // blockquote-style.ts
    'blockquote-style': {
      'name': 'Alıntı (blockquote) stili',
      'description': 'Alıntı stilinin tutarlı olmasını sağlar.',
      'style': {
        'name': 'Stil',
        'description': 'Alıntı göstergelerinde kullanılan stil',
      },
    },
    // capitalize-headings.ts
    'capitalize-headings': {
      'name': 'Başlıkları büyük harfle başlat',
      'description': 'Başlıklar büyük harf düzeniyle biçimlendirilmelidir',
      'style': {
        'name': 'Stil',
        'description': 'Kullanılacak büyük harf stili',
      },
      'ignore-case-words': {
        'name': 'Büyük/küçük harfli kelimeleri yoksay',
        'description': 'Başlık stili (title case) düzenini yalnızca tamamen küçük harften oluşan kelimelere uygular',
      },
      'ignore-words': {
        'name': 'Yoksayılacak kelimeler',
        'description': 'Büyük harfe dönüştürülürken yoksayılacak kelimelerin virgülle ayrılmış listesi',
      },
      'lowercase-words': {
        'name': 'Küçük harf kalacak kelimeler',
        'description': 'Küçük harf olarak korunacak kelimelerin virgülle ayrılmış listesi',
      },
      'starting-word-ignore-characters': {
        'name': 'Olası kelimelerin başında yoksayılacak karakterler',
        'description': 'Tek başlarına bir veya daha fazla harf, tek tırnak ve/veya tire işaretinden önce gelebilen ve bir kelime olarak kabul edilmesini sağlayan karakterler',
      },
      'ending-word-ignore-characters': {
        'name': 'Olası kelimelerin sonunda yoksayılacak karakterler',
        'description': 'Bir veya daha fazla harf, tek tırnak ve/veya tire işaretini takip edebilen ve bir kelime olarak kabul edilmesini sağlayan karakterler',
      },
    },
    // compact-yaml.ts
    'compact-yaml': {
      'name': 'Kompakt YAML',
      'description': 'YAML front matter kısmının başındaki ve sonundaki boş saturları kaldırır.',
      'inner-new-lines': {
        'name': 'İç boş satırlar',
        'description': 'YAML başlangıcında veya sonunda olmayan iç boş satırları kaldırır',
      },
    },
    // consecutive-blank-lines.ts
    'consecutive-blank-lines': {
      'name': 'Art arda gelen boş satırlar',
      'description': 'En fazla bir adet üst üste boş satır bulunmalıdır.',
    },
    // convert-bullet-list-markers.ts
    'convert-bullet-list-markers': {
      'name': 'Madde imlerini dönüştür',
      'description': 'Yaygın madde imi sembollerini standart markdown liste imlerine dönüştürür.',
    },
    // convert-spaces-to-tabs.ts
    'convert-spaces-to-tabs': {
      'name': 'Boşlukları sekmelere (tab) dönüştür',
      'description': 'Satır başındaki boşlukları sekmelere (tab) dönüştürür.',
      'tabsize': {
        'name': 'Sekme boyutu (tabsize)',
        'description': 'Bir sekmeye (tab) dönüştürülecek boşluk sayısı',
      },
    },

    // dedupe-yaml-array-values.ts
    'dedupe-yaml-array-values': {
      'name': 'YAML dizi değerlerini tekilleştir',
      'description': 'Büyük/küçük harfe duyarlı olarak yinelenen dizi değerlerini kaldırır.',
      'dedupe-alias-key': {
        'name': 'YAML aliases bölümünü tekilleştir',
        'description': 'Yinelenen takma adların (aliases) kaldırılmasını etkinleştirir.',
      },
      'dedupe-tag-key': {
        'name': 'YAML tags bölümünü tekilleştir',
        'description': 'Yinelenen etiketlerin (tags) kaldırılmasını etkinleştirir.',
      },
      'dedupe-array-keys': {
        'name': 'YAML dizi bölümlerini tekilleştir',
        'description': 'Normal YAML dizilerindeki yinelenen değerlerin kaldırılmasını etkinleştirir.',
      },
      'ignore-keys': {
        'name': 'Yoksayılacak YAML anahtarları',
        'description': 'Yinelenen değerlerinin kaldırılması istenmeyen, sonlarında iki nokta üst üste olmadan her satıra bir tane gelecek şekilde yazılmış YAML anahtarları listesi.',
      },
    },
    // default-language-for-code-fences.ts
    'default-language-for-code-fences': {
      'name': 'Code fence\'ler için varsayılan dil',
      'description': 'Dil belirtilmemiş kod bloklarına (code fences) varsayılan bir dil ekler.',
      'default-language': {
        'name': 'Programlama dili',
        'description': 'Hiçbir şey yapmamak için boş bırakın. Dil etiketleri <a href="https://prismjs.com/#supported-languages">burada</a> bulunabilir.',
      },
    },
    // emphasis-style.ts
    'emphasis-style': {
      'name': 'Vurgu stili',
      'description': 'Vurgu (emphasis) stilinin tutarlı olmasını sağlar.',
      'style': {
        'name': 'Stil',
        'description': 'Vurgulanan içeriği belirtmek için kullanılan stil',
      },
    },
    // empty-line-around-blockquotes.ts
    'empty-line-around-blockquotes': {
      'name': 'Alıntıların etrafına boş satır',
      'description': 'Belge başında veya sonunda olmadıkları sürece alıntıların (blockquotes) etrafında boş bir satır olmasını sağlar. <b>Not: Boş satır, alıntılar için bir alt iç içe geçme seviyesi veya yeni bir satır karakteridir.</b>',
    },
    // empty-line-around-code-fences.ts
    'empty-line-around-code-fences': {
      'name': 'Kod bloklarının etrafına boş satır',
      'description': 'Belge başında veya sonunda olmadıkları sürece kod bloklarının (code fences) etrafında boş bir satır olmasını sağlar.',
    },
    // empty-line-around-math-block.ts
    'empty-line-around-math-blocks': {
      'name': 'Matematik bloklarının etrafına boş satır',
      'description': 'Tek satırlı matematik ifadeleri için kaç dolar işaretinin matematik bloğu sayılacağını belirlemek adına <code>Matematik bloğunu belirten dolar işareti sayısı</code> ayarını kullanarak matematik bloklarının etrafında boş satır olmasını sağlar.',
    },
    // empty-line-around-tables.ts
    'empty-line-around-tables': {
      'name': 'Tabloların etrafına boş satır',
      'description': 'Belge başında veya sonunda olmadıkları sürece GitHub tarzı (GFM) tabloların etrafında boş bir satır olmasını sağlar.',
    },
    // escape-yaml-special-characters.ts
    'escape-yaml-special-characters': {
      'name': 'YAML özel karakterlerinden kaçış',
      'description': 'YAML içindeki peşinden boşluk gelen iki nokta üst üste (: ), tek tırnak (\') ve çift tırnak (") karakterlerinden kaçış (escape) sağlar.',
      'try-to-escape-single-line-arrays': {
        'name': 'Tek satırlı dizilerden kaçmayı dene',
        'description': 'Bir dizinin "[" ile başlayıp "]" ile bittiğini ve öğelerinin "," ile ayrıldığını varsayarak dizi değerlerinden kaçış sağlamayı dener.',
      },
    },
    // file-name-heading.ts
    'file-name-heading': {
      'name': 'Dosya adı başlığı',
      'description': 'Eğer dosyada hiç H1 başlığı yoksa, dosya adını H1 başlığı olarak ekler.',
    },
    // footnote-after-punctuation.ts
    'footnote-after-punctuation': {
      'name': 'Noktalama işaretinden sonra dipnot',
      'description': 'Dipnot referanslarının noktalama işaretinden önce değil, sonra yerleştirilmesini sağlar.',
    },
    // force-yaml-escape.ts
    'force-yaml-escape': {
      'name': 'YAML kaçışını zorunlu kıl',
      'description': 'Belirtilen YAML anahtarlarının değerlerinden kaçış (escape) sağlar.',
      'force-yaml-escape-keys': {
        'name': 'Anahtarlarda YAML kaçışını zorunlu kıl',
        'description': 'Henüz kaçış karakteri kullanılmamışsa, her satıra bir tane gelecek şekilde yazılan belirtilen YAML anahtarlarında YAML kaçış karakterini kullanır. YAML dizilerinde (arrays) kullanmayın.',
      },
    },
    // format-tags-in-yaml.ts
    'format-tags-in-yaml': {
      'name': 'YAML içindeki etiketleri formatla',
      'description': 'YAML frontmatter içindeki etiketlerden diyez (#) işaretlerini kaldırır, çünkü bunlar oradaki etiketleri geçersiz kılar.',
    },
    // format-yaml-array.ts
    'format-yaml-array': {
      'name': 'YAML dizilerini formatla',
      'description': 'Normal YAML dizilerinin tek satırlı veya çok satırlı olarak formatlanmasını sağlar; ayrıca <code>tags</code> ve <code>aliases</code> bölümlerinin Obsidian\'a özgü bazı YAML formatlarına sahip olmasına izin verir. <b>Not: Birden fazla girdi mevcutsa, tek dizeden tek satıra seçeneği tek bir dize girdisini tek satırlı bir diziye dönüştürür. Aynısı tek dizeden çok satıra seçeneği için de geçerlidir, ancak çok satırlı bir diziye dönüşür.</b>',
      'alias-key': {
        'name': 'YAML aliases bölümünü formatla',
        'description': 'YAML aliases (takma adlar) bölümünün formatlanmasını etkinleştirir. Bu seçeneği <code>YAML başlık takma adı</code> kuralıyla birlikte etkinleştirmemelisiniz; çünkü birlikte iyi çalışmayabilirler veya farklı format stilleri seçilerek beklenmedik sonuçlara yol açabilirler.',
      },
      'tag-key': {
        'name': 'YAML tags bölümünü formatla',
        'description': 'YAML tags (etiketler) bölümünün formatlanmasını etkinleştirir.',
      },
      'default-array-style': {
        'name': 'Varsayılan YAML dizi bölümü stili',
        'description': '<code>tags</code>, <code>aliases</code> veya <code>Değerleri tek satırlı dizi olmaya zorlanacak anahtarlar</code> ile <code>Değerleri çok satırlı dizi olmaya zorlanacak anahtarlar</code> listelerinde yer almayan diğer YAML dizilerinin stili.',
      },
      'default-array-keys': {
        'name': 'YAML dizi bölümlerini formatla',
        'description': 'Normal YAML dizilerinin formatlanmasını etkinleştirir.',
      },
      'force-single-line-array-style': {
        'name': 'Değerleri tek satırlı dizi olmaya zorlanacak anahtarlar',
        'description': 'Yeni satırla ayrılmış anahtarların YAML dizisini tek satırlı formatta olmaya zorlar (bu seçeneği devre dışı bırakmak için boş bırakın)',
      },
      'force-multi-line-array-style': {
        'name': 'Değerleri çok satırlı dizi olmaya zorlanacak anahtarlar',
        'description': 'Yeni satırla ayrılmış anahtarların YAML dizisini çok satırlı formatta olmaya zorlar (bu seçeneği devre dışı bırakmak için boş bırakın)',
      },
    },
    // header-increment.ts
    'header-increment': {
      'name': 'Başlık artış düzeni',
      'description': 'Başlık seviyeleri her seferinde yalnızca birer seviye artmalıdır.',
      'start-at-h2': {
        'name': 'Başlık artışını H2 seviyesinden başlat',
        'description': 'Bir dosyadaki başlık artışı için minimum başlık seviyesini H2 yapar ve tüm başlıkları buna göre kaydırarak H2 başlığından itibaren artmalarını sağlar.',
      },
    },
    // heading-blank-lines.ts
    'heading-blank-lines': {
      'name': 'Başlık boş satırları',
      'description': 'Tüm başlıkların hem öncesinde hem de sonrasında tam bir boş satır olmasını sağlar (başlığın belgenin başında veya sonunda olduğu durumlar hariç).',
      'bottom': {
        'name': 'Alt kısım',
        'description': 'Başlıklardan sonra bir boş satır olmasını sağlar (devre dışı bırakıldığında başlıklardan sonraki boş satırları kaldırmaz)',
      },
      'empty-line-after-yaml': {
        'name': 'YAML ve başlık arası boş satır',
        'description': 'YAML frontmatter ile başlık arasındaki boş satırı korur',
      },
    },
    // headings-start-line.ts
    'headings-start-line': {
      'name': 'Başlık satır başı düzeni',
      'description': 'Satır başında yer almayan başlıkların önündeki boşlukları kaldırarak başlık olarak tanınmalarını sağlar.',
    },
    // insert-yaml-attributes.ts
    'insert-yaml-attributes': {
      'name': 'YAML öznitelikleri ekle',
      'description': 'Verilen YAML özniteliklerini (attributes) YAML frontmatter içine ekler. Her özniteliği tek bir satıra yazın.',
      'text-to-insert': {
        'name': 'Eklenecek metin',
        'description': 'YAML frontmatter içine eklenecek metin',
      },
    },
    // line-break-at-document-end.ts
    'line-break-at-document-end': {
      'name': 'Belge sonunda satır sonu',
      'description': 'Not boş değilse, belgenin sonunda tam olarak bir satır sonu (line break) olmasını sağlar.',
    },
    // move-footnotes-to-the-bottom.ts
    'move-footnotes-to-the-bottom': {
      'name': 'Dipnotları en alta taşı',
      'description': 'Tüm dipnotları belgenin en altına taşır ve dosya gövdesinde referans verilme sıralarına göre sıralanmalarını sağlar.',
      'include-blank-line-between-footnotes': {
        'name': 'Dipnotlar arasına boş satır ekle',
        'description': 'Etkinleştirildiğinde dipnotların arasına boş bir satır ekler.',
      },
    },
    // move-math-block-indicators-to-their-own-line.ts
    'move-math-block-indicators-to-their-own-line': {
      'name': 'Matematik bloğu işaretçilerini kendi satırına taşı',
      'description': 'Tek satırlı matematik ifadeleri için kaç dolar işaretinin bir matematik bloğu sayılacağını belirlemek adına <code>Matematik bloğunu belirten dolar işareti sayısı</code> ayarını kullanarak, tüm başlangıç ve bitiş matematik bloğu işaretçilerini kendi satırlarına taşır.',
    },
    // move-tags-to-yaml.ts
    'move-tags-to-yaml': {
      'name': 'Etiketleri YAML\'a taşı',
      'description': 'Tüm etiketleri belgenin YAML frontmatter bölümüne taşır.',
      'how-to-handle-existing-tags': {
        'name': 'Gövdedeki etiket işlemi',
        'description': 'Yoksayılmayan etiketler frontmatter bölümüne taşındıktan sonra dosya gövdesinde kalan etiketlere ne yapılacağı',
      },
      'tags-to-ignore': {
        'name': 'Yoksayılacak etiketler',
        'description': '<code>Remove the hashtag from tags in content body</code> ayarı etkinleştirildiğinde, etiket dizisine taşınmayacak veya gövde içeriğinden kaldırılmayacak etiketler. Her etiket yeni bir satırda ve <code>#</code> işareti olmadan yazılmalıdır. <b>Etiket adına diyez (#) işaretini dahil etmediğinizden emin olun.</b>',
      },
    },
    // no-bare-urls.ts
    'no-bare-urls': {
      'name': 'Yalın URL kullanma',
      'description': 'Ters tırnak (backtick), köşeli parantez, tek veya çift tırnak içinde olanlar hariç, yalın URL\'leri açılı ayraçlar (&lt; &gt;) içine alır.',
      'no-bare-uris': {
        'name': 'Yalın URI kullanma',
        'description': 'Ters tırnak (backtick), köşeli parantez, tek veya çift tırnak içinde olanlar hariç, yalın URI\'leri açılı ayraçlar (&lt; &gt;) içine almaya çalışır.',
      },
    },
    // ordered-list-style.ts
    'ordered-list-style': {
      'name': 'Sıralı liste stili',
      'description': 'Sıralı listelerin belirtilen stile uymasını sağlar. <b>Not: 2 boşluk veya 1 tab bir girinti (indentation) seviyesi olarak kabul edilir.</b>',
      'number-style': {
        'name': 'Sayı stili',
        'description': 'Sıralı liste işaretçilerinde kullanılan sayı stili',
      },
      'list-end-style': {
        'name': 'Sıralı liste işaretçisi bitiş stili',
        'description': 'Sıralı liste işaretçisinin bitiş karakteri',
      },
      'preserve-start': {
        'name': 'Başlangıç numarasını koru',
        'description': 'Sıralı listenin başlangıç numarasının korunup korunmayacağı. Bu, sıralı liste öğeleri arasında başka içeriklerin yer aldığı durumlar için kullanılabilir.',
      },
    },
    // paragraph-blank-lines.ts
    'paragraph-blank-lines': {
      'name': 'Paragraf boş satırları',
      'description': 'Tüm paragrafların hem öncesinde hem de sonrasında tam olarak bir boş satır olmasını sağlar.',
    },
    // prevent-double-checklist-indicator-on-paste.ts
    'prevent-double-checklist-indicator-on-paste': {
      'name': 'Yapıştırırken çift kontrol listesi işaretçisini önle',
      'description': 'Dosyada imlecin bulunduğu satırda zaten bir kontrol listesi işaretçisi (checklist marker) varsa, yapıştırılacak metnin başındaki kontrol listesi işaretçisini kaldırır.',
    },
    // prevent-double-list-item-indicator-on-paste.ts
    'prevent-double-list-item-indicator-on-paste': {
      'name': 'Yapıştırırken çift liste öğesi işaretçisini önle',
      'description': 'Dosyada imlecin bulunduğu satırda zaten bir liste işaretçisi varsa, yapıştırılacak metnin başındaki liste işaretçisini kaldırır.',
    },
    // proper-ellipsis-on-paste.ts
    'proper-ellipsis-on-paste': {
      'name': 'Yapıştırırken düzgün üç nokta',
      'description': 'Yapıştırılacak metnde aralarında boşluk olsa bile arka arkaya gelen üç noktayı tek bir üç nokta karakteriyle (…) değiştirir.',
    },
    // proper-ellipsis.ts
    'proper-ellipsis': {
      'name': 'Düzgün üç nokta',
      'description': 'Arka arkaya gelen üç noktayı tek bir üç nokta karakteriyle (…) değiştirir.',
    },
    // quote-style.ts
    'quote-style': {
      'name': 'Tırnak işareti stili',
      'description': 'Metin gövdesindeki tırnak işaretlerini belirtilen tekli ve çiftli tırnak stillerine göre günceller.',
      'single-quote-enabled': {
        'name': '<code>Tek tırnak stili</code> seçeneğini etkinleştir',
        'description': 'Seçilen tek tırnak stilinin kullanılacağını belirtir.',
      },
      'single-quote-style': {
        'name': 'Tek tırnak stili',
        'description': 'Kullanılacak tek tırnak stili.',
      },
      'double-quote-enabled': {
        'name': '<code>Çift tırnak stili</code> seçeneğini etkinleştir',
        'description': 'Seçilen çift tırnak stilinin kullanılacağını belirtir.',
      },
      'double-quote-style': {
        'name': 'Çift tırnak stili',
        'description': 'Kullanılacak çift tırnak stili.',
      },
    },

    // re-index-footnotes.ts
    're-index-footnotes': {
      'name': 'Dipnotları yeniden indeksle',
      'description': 'Dosyadaki dipnot referanslarının sırasına göre dipnot anahtarlarını ve dipnotları yeniden indeksler. <b>Not: Bu kural, bir anahtar için birden fazla dipnot varsa çalışmaz.</b>',
    },
    // remove-consecutive-list-markers.ts
    'remove-consecutive-list-markers': {
      'name': 'Ardışık liste işaretçilerini kaldır',
      'description': 'Ardışık liste işaretçilerini kaldırır. Liste öğelerini kopyalayıp yapıştırırken kullanışlıdır.',
    },
    // remove-empty-lines-between-list-markers-and-checklists.ts
    'remove-empty-lines-between-list-markers-and-checklists': {
      'name': 'Liste işaretçileri arasındaki boş satırları kaldır',
      'description': 'Liste işaretçileri arasında boş satır olmamalıdır.',
    },
    // remove-empty-list-markers.ts
    'remove-empty-list-markers': {
      'name': 'Boş liste işaretçilerini kaldır',
      'description': 'Boş liste işaretçilerini (yani içeriği olmayan liste öğelerini) kaldırır.',
    },
    // empty-line-around-horizontal-rules.ts
    'empty-line-around-horizontal-rules': {
      'name': 'Yatay çizgilerin etrafına boş satır ekle',
      'description': 'Belgenin başında veya sonunda olmadığı sürece, yatay çizgilerin (horizontal rules) etrafında boş bir satır olmasını sağlar.',
    },
    // remove-hyphenated-line-breaks.ts
    'remove-hyphenated-line-breaks': {
      'name': 'Tireli satır sonlarını kaldır',
      'description': 'Tireyle ayrılmış satır sonlarını kaldırır. Ders kitaplarından metin yapıştırırken kullanışlıdır.',
    },
    // remove-hyphens-on-paste.ts
    'remove-hyphens-on-paste': {
      'name': 'Yapıştırırken tireleri kaldır',
      'description': 'Yapıştırılacak metindeki tireleri kaldırır.',
    },
    // remove-leading-or-trailing-whitespace-on-paste.ts
    'remove-leading-or-trailing-whitespace-on-paste': {
      'name': 'Yapıştırırken baştaki veya sondaki boşlukları kaldır',
      'description': 'Yapıştırılacak metnin başındaki sekme (tab) harici boşlukları ve sondaki tüm boşlukları kaldırır.',
    },
    // remove-leftover-footnotes-from-quote-on-paste.ts
    'remove-leftover-footnotes-from-quote-on-paste': {
      'name': 'Yapıştırırken alıntılardaki kalan dipnotları kaldır',
      'description': 'Yapıştırılacak metindeki kalıntı dipnot referanslarını kaldırır.',
    },
    // remove-link-spacing.ts
    'remove-link-spacing': {
      'name': 'Bağlantı boşluklarını kaldır',
      'description': 'Bağlantı metninin etrafındaki boşlukları kaldırır.',
    },
    // remove-multiple-blank-lines-on-paste.ts
    'remove-multiple-blank-lines-on-paste': {
      'name': 'Yapıştırırken ardışık boş satırları kaldır',
      'description': 'Yapıştırılacak metindeki birden fazla boş satırı tek bir boş satıra indirger.',
    },
    // remove-multiple-spaces.ts
    'remove-multiple-spaces': {
      'name': 'Ardışık boşlukları kaldır',
      'description': 'İki veya daha fazla ardışık boşluğu kaldırır. Satırın başındaki ve sonundaki boşlukları yoksayar.',
    },
    // remove-space-around-characters.ts
    'remove-space-around-characters': {
      'name': 'Karakterlerin etrafındaki boşlukları kaldır',
      'description': 'Belirli karakterlerin etrafında boşluk (tek boşluk veya sekme) olmamasını sağlar. <b>Not: Bu durum bazı durumlarda markdown formatında sorunlara yol açabilir.</b>',
      'include-fullwidth-forms': {
        'name': 'Tam genişlikli formları (Fullwidth Forms) dahil et',
        'description': '<a href="https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)">Fullwidth Forms Unicode bloğunu</a> dahil eder.',
      },
      'include-cjk-symbols-and-punctuation': {
        'name': 'CJK sembol ve noktalama işaretlerini dahil et',
        'description': '<a href="https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation">CJK Sembol ve Noktalama İşaretleri Unicode bloğunu</a> dahil eder.',
      },
      'include-dashes': {
        'name': 'Tireleri dahil et',
        'description': 'En dash (–) ve em dash (—) işaretlerini dahil eder.',
      },
      'other-symbols': {
        'name': 'Diğer semboller',
        'description': 'Dahil edilecek diğer semboller.',
      },
    },
    // remove-space-before-or-after-characters.ts
    'remove-space-before-or-after-characters': {
      'name': 'Karakterlerin öncesindeki veya sonrasındaki boşlukları kaldır',
      'description': 'Belirtilen karakterlerin öncesindeki ve sonrasındaki boşlukları kaldırır. <b>Not: Bu durum bazı durumlarda markdown formatında sorunlara yol açabilir.</b>',
      'characters-to-remove-space-before': {
        'name': 'Karakterlerden önceki boşlukları kaldır',
        'description': 'Belirtilen karakterlerden önceki boşlukları kaldırır. <b>Not: Karakter listesinde <code>{</code> veya <code>}</code> kullanmak, arka planda yoksayma (ignore) sözdiziminde kullanıldığı için dosyaları beklenmedik şekilde etkileyecektir.</b>',
      },
      'characters-to-remove-space-after': {
        'name': 'Karakterlerden sonraki boşlukları kaldır',
        'description': 'Belirtilen karakterlerden sonraki boşlukları kaldırır. <b>Not: Karakter listesinde <code>{</code> veya <code>}</code> kullanmak, arka planda yoksayma (ignore) sözdiziminde kullanıldığı için dosyaları beklenmedik şekilde etkileyecektir.</b>',
      },
    },
    // remove-trailing-punctuation-in-heading.ts
    'remove-trailing-punctuation-in-heading': {
      'name': 'Başlıktaki sondan gelen noktalama işaretlerini kaldır',
      'description': 'Başlıkların sonundaki belirtilen noktalama işaretlerini kaldırır; <a href="https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references">HTML varlık referanslarının (entity references)</a> sonundaki noktalı virgülü yoksaydığından emin olur.',
      'punctuation-to-remove': {
        'name': 'Sondaki noktalama işaretleri',
        'description': 'Dosyadaki başlıklardan kaldırılacak sondaki noktalama işaretleri.',
      },
    },
    // remove-yaml-keys.ts
    'remove-yaml-keys': {
      'name': 'YAML anahtarlarını kaldır',
      'description': 'Belirtilen YAML anahtarlarını kaldırır.',
      'yaml-keys-to-remove': {
        'name': 'Kaldırılacak YAML anahtarları',
        'description': 'YAML frontmatter\'ından iki nokta üst üste ile veya iki nokta üst üste olmadan kaldırılacak YAML anahtarları.',
      },
    },
    // sort-yaml-array-values.ts
    'sort-yaml-array-values': {
      'name': 'YAML dizi değerlerini sırala',
      'description': 'YAML dizi (array) değerlerini belirtilen sıralama düzenine göre sıralar.',
      'sort-alias-key': {
        'name': 'YAML aliases bölümünü sırala',
        'description': 'Takma adların (aliases) sıralanmasını etkinleştirir.',
      },
      'sort-tag-key': {
        'name': 'YAML tags bölümünü sırala',
        'description': 'Etiketlerin (tags) sıralanmasını etkinleştirir.',
      },
      'sort-array-keys': {
        'name': 'YAML dizi bölümlerini sırala',
        'description': 'Normal YAML dizileri için değerlerin sıralanmasını etkinleştirir.',
      },
      'ignore-keys': {
        'name': 'Yoksayılacak YAML anahtarları',
        'description': 'Kendi satırlarında, sonlarında iki nokta üst üste olmadan listelenen ve değerlerinin sıralanması istenmeyen YAML anahtarları.',
      },
      'sort-order': {
        'name': 'Sıralama düzeni',
        'description': 'YAML dizi değerlerinin sıralanma şekli.',
      },
    },
    // space-after-list-markers.ts
    'space-after-list-markers': {
      'name': 'Liste işaretçilerinden sonra boşluk bırak',
      'description': 'Liste işaretçilerinden ve onay kutularından (checkbox) sonra tek bir boşluk olmalıdır.',
    },
    // space-between-chinese-japanese-or-korean-and-english-or-numbers.ts
    'space-between-chinese-japanese-or-korean-and-english-or-numbers': {
      'name': 'Çice Japonca veya Korece ile İngilizce veya sayılar arasında boşluk bırak',
      'description': 'Çince, Japonca veya Korece karakterler ile İngilizce kelimeler veya sayıların tek bir boşlukla ayrılmasını sağlar. Bu <a href="https://github.com/sparanoid/chinese-copywriting-guidelines">kılavuzları</a> takip eder.',
      'english-symbols-punctuation-before': {
        'name': 'CJK öncesindeki İngilizce noktalama ve semboller',
        'description': 'Çince, Japonca veya Korece karakterlerden önce bulunduğunda İngilizceye ait kabul edilecek harf dışı noktalama ve sembollerin listesi. <b>Not: "*" her zaman İngilizce olarak kabul edilir ve bazı markdown sözdizimlerinin düzgün işlenmesi için gereklidir.</b>',
      },
      'english-symbols-punctuation-after': {
        'name': 'CJK sonrasındaki İngilizce noktalama ve semboller',
        'description': 'Çince, Japonca veya Korece karakterlerden sonra bulunduğunda İngilizceye ait kabul edilecek harf dışı noktalama ve sembollerin listesi. <b>Not: "*" her zaman İngilizce olarak kabul edilir ve bazı markdown sözdizimlerinin düzgün işlenmesi için gereklidir.</b>',
      },
    },
    // strong-style.ts
    'strong-style': {
      'name': 'Kalın yazı (Strong) stili',
      'description': 'Kalın yazı (strong/bold) stilinin tutarlı olmasını sağlar.',
      'style': {
        'name': 'Stil',
        'description': 'Kalın/vurgulanmış içeriği belirtmek için kullanılan stil.',
      },
    },
    // trailing-spaces.ts
    'trailing-spaces': {
      'name': 'Satır sonu boşlukları',
      'description': 'Her satırın sonundaki fazladan boşlukları kaldırır.',
      'two-space-line-break': {
        'name': 'İki boşluklu satır sonu',
        'description': 'Satır sonu ile biten iki boşluğu yoksayar ("İki Boşluk Kuralı").',
      },
    },
    // two-spaces-between-lines-with-content.ts
    'two-spaces-between-lines-with-content': {
      'name': 'İçeriğe sahip satırlar arasına satır sonu ekle',
      'description': 'Paragraflar, alıntılar (blockquotes) ve liste öğeleri için içeriği bir sonraki satırda devam eden satırların sonuna belirtilen satır sonu işaretinin (line break) eklenmesini sağlar.',
      'line-break-indicator': {
        'name': 'Satır sonu göstergesi',
        'description': 'Kullanılacak satır sonu göstergesi.',
      },
    },
    // unordered-list-style.ts
    'unordered-list-style': {
      'name': 'Sırasız liste stili',
      'description': 'Sırasız listelerin belirtilen stili takip etmesini sağlar.',
      'list-style': {
        'name': 'Liste öğesi stili',
        'description': 'Sırasız listelerde kullanılacak liste öğesi stili.',
      },
    },
    // yaml-key-sort.ts
    'yaml-key-sort': {
      'name': 'YAML anahtar sıralaması',
      'description': 'YAML anahtarlarını belirtilen sıra ve önceliğe göre sıralar. <b>Not: Boş satırları da kaldırabilir. Yalnızca iç içe geçmemiş (non-nested) anahtarlarda çalışır.</b>',
      'yaml-key-priority-sort-order': {
        'name': 'YAML anahtarı öncelikli sıralama düzeni',
        'description': 'Her satırda bir tane olacak şekilde anahtarların sıralanacağı düzen; listede bulunma sırasına göre sıralama yapar.',
      },
      'priority-keys-at-start-of-yaml': {
        'name': 'Öncelikli anahtarları YAML başlangıcına koy',
        'description': 'Öncelikli sıralama düzenindeki YAML anahtarları, YAML frontmatter\'ının en başına yerleştirilir.',
      },
      'yaml-sort-order-for-other-keys': {
        'name': 'Diğer anahtarlar için YAML sıralama düzeni',
        'description': 'Öncelikli sıralama düzeni metin alanında bulunmayan diğer anahtarların sıralanma şekli.',
      },
    },
    // yaml-timestamp.ts
    'yaml-timestamp': {
      'name': 'YAML zaman damgası',
      'description': 'Dosyanın son düzenlenme tarihini YAML frontmatter içinde takip eder. Tarihleri dosya meta verilerinden alır.',
      'date-created': {
        'name': 'Oluşturulma tarihi',
        'description': 'Dosya oluşturulma tarihini ekler',
      },
      'date-created-key': {
        'name': 'Oluşturulma tarihi anahtarı',
        'description': 'Oluşturulma tarihi için hangi YAML anahtarının kullanılacağı',
      },
      'date-created-source-of-truth': {
        'name': 'Oluşturulma tarihi doğruluk kaynağı',
        'description': 'Eğer frontmatter içinde zaten mevcutsa, oluşturulma tarihi değerinin nereden alınacağını belirtir.',
      },
      'date-modified-source-of-truth': {
        'name': 'Değiştirilme tarihi doğruluk kaynağı',
        'description': 'Eğer frontmatter içinde zaten mevcutsa, değiştirilme tarihinin ne zaman güncelleneceğini belirlemek için hangi yöntemin kullanılacağını belirtir.',
      },
      'date-modified': {
        'name': 'Değiştirilme tarihi',
        'description': 'Dosyanın son değiştirilme tarihini ekler',
      },
      'date-modified-key': {
        'name': 'Değiştirilme tarihi anahtarı',
        'description': 'Değiştirilme tarihi için hangi YAML anahtarının kullanılacağı',
      },
      'format': {
        'name': 'Format',
        'description': 'Kullanılacak Moment tarih formatı (bkz. <a href="https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/">Moment format seçenekleri</a>)',
      },
      'convert-to-utc': {
        'name': 'Yerel saeti UTC\'ye dönüştür',
        'description': 'Kaydedilen tarihler için yerel saat yerine UTC karşılığını kullanır',
      },
      'update-on-file-contents-updated': {
        'name': 'Dosya içeriği güncellendiğinde YAML zaman damgasını güncelle',
        'description': 'Mevcut aktif not değiştirildiğinde, not üzerinde <code>YAML zaman damgası</code> kuralı çalıştırılır. Mevcut değerden 5 saniyeden fazla bir sapma varsa, değiştirilme zaman damgasını güncellemelidir.',
      },
    },
    // yaml-title-alias.ts
    'yaml-title-alias': {
      'name': 'YAML başlık takma adı (alias)',
      'description': 'Dosyanın başlığını YAML frontmatter\'ın aliases (takma adlar) bölümüne ekler veya günceller. Başlığı ilk H1 başlığından veya dosya adından alır.',
      'preserve-existing-alias-section-style': {
        'name': 'Mevcut aliases bölüm stilini koru',
        'description': 'Etkinleştirilirse, <code>YAML aliases bölüm stili</code> ayarı yalnızca yeni oluşturulan bölümlere uygulanır',
      },
      'keep-alias-that-matches-the-filename': {
        'name': 'Dosya adı ile eşleşen takma adı koru',
        'description': 'Bu tür takma adlar genellikle gereksizdir.',
      },
      'use-yaml-key-to-keep-track-of-old-filename-or-heading': {
        'name': 'Dosya adı ve başlık değişikliklerine yardımcı olması için <code>Alias yardımcısı anahtarı</code> tarafından belirtilen YAML anahtarını kullan',
        'description': 'Etkinleştirilirse, ilk H1 başlığı değiştiğinde (veya ilk H1 yoksa dosya adı değiştiğinde), aliases dizisine yeni bir girdi eklemek yerine bu anahtarda saklanan eski takma ad yeni değerle değiştirilir',
      },
      'alias-helper-key': {
        'name': 'Alias yardımcısı anahtarı',
        'description': 'Bu kural tarafından frontmatter içinde saklanan son dosya adının veya başlığın ne olduğunu takip etmeye yardımcı olacak anahtar.',
      },
    },
    // yaml-title.ts
    'yaml-title': {
      'name': 'YAML başlığı',
      'description': 'Dosyanın başlığını YAML frontmatter içine ekler. Başlığı seçilen moda göre alır.',
      'title-key': {
        'name': 'Başlık anahtarı',
        'description': 'Başlık için hangi YAML anahtarının kullanılacağı',
      },
      'mode': {
        'name': 'Mod',
        'description': 'Başlığı almak için kullanılacak yöntem',
      },
    },
  },

  // These are the string values in the UI for enum values and thus they do not follow the key format as used above
  'enums': {
    'Title Case': 'Başlık Düzeni (Title Case)',
    'ALL CAPS': 'HEPSİ BÜYÜK HARF',
    'First letter': 'Sadece ilk harf büyük',
    '.': '.',
    ')': ')',
    'ERROR': 'error',
    'TRACE': 'trace',
    'DEBUG': 'debug',
    'INFO': 'info',
    'WARN': 'warn',
    'SILENT': 'silent',
    'ascending': 'Artan',
    'lazy': 'Gecikmeli (lazy)',
    'preserve': 'Mevcut haliyle bırak',
    'Nothing': 'Hiçbir şey',
    'Remove hashtag': 'Hashtag\'i kaldır',
    'Remove whole tag': 'Tüm etiketi kaldır',
    'asterisk': 'Yıldız (*)',
    'underscore': 'Alt çizgi (_)',
    'consistent': 'Tutarlı',
    '-': '-',
    '*': '*',
    '+': '+',
    'space': 'Boşluk',
    'no space': 'Boşluksuz',
    'None': 'Yok',
    'Ascending Alphabetical': 'A-Z (Alfabetik Artan)',
    'Descending Alphabetical': 'Z-A (Alfabetik Azalan)',
    // yaml.ts
    'multi-line': 'Çok satırlı',
    'single-line': 'Tek satırlı',
    'single string to single-line': 'Tek metinden tek satıra',
    'single string to multi-line': 'Tek metinden çok satırlıya',
    'single string comma delimited': 'Virgülle ayrılmış tek metin',
    'single string space delimited': 'Boşlukla ayrılmış tek metin',
    'single-line space delimited': 'Boşlukla ayrılmış tek satır',
    // yaml-title.ts
    'first-h1': 'İlk H1 Başlığı',
    'first-h1-or-filename-if-h1-missing': 'İlk H1 (H1 Yoksa Dosya Adı)',
    'filename': 'Dosya Adı',
    // settings-data.ts
    'never': 'Asla',
    'after 5 seconds': '5 saniye sonra',
    'after 10 seconds': '10 saniye sonra',
    'after 15 seconds': '15 saniye sonra',
    'after 30 seconds': '30 saniye sonra',
    'after 1 minute': '1 dakika sonra',
    // yaml-timestamp.ts
    'file system': 'Dosya sistemi',
    'frontmatter': 'YAML frontmatter',
    'user or Linter edits': 'Obsidian\'daki değişiklikler',
    // quote-style.ts
    '\'\'': '\'\'',
    '‘’': '‘’',
    '""': '""',
    '“”': '“”',
    // yaml.ts
    '\\': '\\',
    '<br>': '<br>',
    '  ': '  ',
    '<br/>': '<br/>',
  },
};

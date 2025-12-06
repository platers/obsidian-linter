// 日本語

export default {
  'commands': {
    'lint-file': {
      'name': '現在のファイルをLintする',
      'error-message': 'このファイルのLintエラー',
    },
    'lint-file-unless-ignored': {
      'name': '除外されていなければ、現在のファイルをLintする',
    },
    'lint-all-files': {
      'name': 'Vault内のすべてのファイルをLintする',
      'error-message': 'ファイル内のすべてのファイルのLintエラー',
      'success-message': 'すべてのファイルをLintしました',
      'errors-message-singular': 'すべてのファイルをLintし、1つのエラーがありました。',
      'errors-message-plural': 'すべてのファイルをLintし、{NUM}個のエラーがありました。',
      'start-message': 'これにより、すべてのファイルが編集され、エラーが発生する可能性があります。',
      'submit-button-text': 'すべてLintする',
      'submit-button-notice-text': 'すべてのファイルをLintしています...',
    },
    'lint-all-files-in-folder': {
      'name': '現在のフォルダ内のすべてのファイルをLintする',
      'start-message': 'これにより、{FOLDER_NAME}内のすべてのファイル（サブフォルダ内のファイルも含む）が編集され、エラーが発生する可能性があります。',
      'submit-button-text': '{FOLDER_NAME}内のすべてのファイルをLintする',
      'submit-button-notice-text': '{FOLDER_NAME}内のすべてのファイルをLintしています...',
      'error-message': '{FOLDER_NAME}内のすべてのファイルのLintエラー',
      'success-message': '{FOLDER_NAME}内の{NUM}個のファイルをLintしました。',
      'message-singular': '{FOLDER_NAME}内の{NUM}個のファイルをLintし、1つのエラーがありました。',
      'message-plural': '{FOLDER_NAME}内の{FILE_COUNT}個のファイルをLintし、{ERROR_COUNT}個のエラーがありました。',
    },
    'paste-as-plain-text': {
      'name': 'プレーンテキストとして貼り付ける（変更なし）',
    },
    'ignore-folder': {
      'name': 'フォルダを無視する',
    },
    'ignore-file': {
      'name': 'ファイルを無視する',
    },
    'lint-file-pop-up-menu-text': {
      'name': 'ファイルをLintする',
    },
    'lint-folder-pop-up-menu-text': {
      'name': 'フォルダをLintする',
    },
    'ignore-file-pop-up-menu-text': {
      'name': 'ファイルをLintから無視する',
    },
    'ignore-folder-pop-up-menu-text': {
      'name': 'フォルダをLintから無視する',
    },
  },

  'logs': {
    'plugin-load': 'プラグインを読み込み中',
    'plugin-unload': 'プラグインをアンロード中',
    'folder-lint': 'フォルダをLint中 ',
    'linter-run': 'Linterを実行中',
    'file-change-yaml-lint-run': 'エディタの内容変更によるYAMLのLintを実行中',
    'file-change-yaml-lint-skipped': 'ファイルの変更が検出されなかったため、YAMLのLintをスキップしました。',
    'file-change-yaml-lint-warning': 'ファイル情報が存在しませんが、デバウンスが実行されました。どこかで問題が発生しました。',
    'paste-link-warning': 'クリップボードの内容がリンクであるため、貼り付けのLintを中止しました。これにより、貼り付けを変更する他のプラグインとの競合を回避します。',
    'see-console': '詳細はコンソールを参照してください。',
    'unknown-error': 'Lint中に不明なエラーが発生しました。',
    'moment-locale-not-found': 'Moment.jsのロケールを {MOMENT_LOCALE} に切り替えようとしましたが、現在のロケールは {CURRENT_LOCALE} です。',
    'file-change-lint-message-start': 'Lintされました',
    'custom-command-callback-warning': '統合テストのためにのみカスタムコマンドコールバックを設定してください。',

    // rules-runner.ts
    'pre-rules': '基本ルールの前のルール',
    'post-rules': '基本ルールの後のルール',
    'rule-running': 'ルールを実行中',
    'custom-regex': 'カスタム正規表現ルール',
    'running-custom-regex': 'カスタム正規表現を実行中',
    'running-custom-lint-command': 'カスタムLintコマンドを実行中',
    'custom-lint-duplicate-warning': '同じコマンド（"{COMMAND_NAME}"）をカスタムLintルールとして2回実行することはできません。',
    'custom-lint-error-message': 'カスタムLintコマンド',

    // rules-runner.ts and rule-builder.ts
    'disabled-text': 'は無効です',

    // rule-builder.ts
    'run-rule-text': '実行中',

    // logger.ts
    'timing-key-not-found': 'タイミングキー \'{TIMING_KEY}\' はタイミング情報リストに存在しないため、無視されました',
    'milliseconds-abbreviation': 'ms',

    'invalid-date-format-error': `作成日付の形式 '{DATE}' を解析または判別できなかったため、作成日付は '{FILE_NAME}' にそのまま残されました`,

    // yaml.ts
    'invalid-delimiter-error-message': '区切り文字は 1文字のみ許可されています',

    // mdast.ts
    'missing-footnote-error-message': `脚注 '{FOOTNOTE}' には対応する脚注参照が脚注内容の前に存在しないため、処理できません。すべての脚注に脚注内容の前に対応する参照があることを確認してください。`,
    'too-many-footnotes-error-message': `脚注キー '{FOOTNOTE_KEY}' に複数の脚注が参照されています。脚注を更新して、脚注キーごとに 1つの脚注のみが存在するようにしてください。`,

    // rules.ts
    'wrapper-yaml-error': 'YAMLエラー: {ERROR_MESSAGE}',
    'wrapper-unknown-error': '不明なエラー: {ERROR_MESSAGE}',
  },

  'notice-text': {
    'empty-clipboard': 'クリップボードに内容がありません。',
    'characters-added': '文字が追加されました',
    'characters-removed': '文字が削除されました',
    'copy-to-clipboard-failed': 'クリップボードへのテキストのコピーに失敗しました: ',
  },

  // rule-alias-suggester.ts
  'all-rules-option': 'すべて',

  // settings.ts
  'linter-title': 'Linter',
  'empty-search-results-text': '検索に一致する設定がありません',

  // lint-confirmation-modal.ts
  'warning-text': '警告',
  'file-backup-text': 'ファイルのバックアップを取っていることを確認してください。',
  'custom-command-warning': 'カスタムコマンドが有効になっている状態で複数のファイルをLintするのは、サイドパネルでペインを開く能力が必要な遅いプロセスです。カスタムコマンドが無効な状態で実行するよりも明らかに遅くなります。注意して進めてください。',
  'cancel-button-text': 'キャンセル',

  'copy-aria-label': 'コピー',

  'disabled-other-rule-notice': '<code>{NAME_1}</code>を有効にすると、<code>{NAME_2}</code>が無効になります。続行しますか？',
  'disabled-conflicting-rule-notice': '{NAME_1}は{NAME_2}と競合しているため、無効になりました。設定タブでどの設定をオフにするかを切り替えることができます。',

  // confirm-rule-disable-modal.ts
  'ok': 'Ok',

  // parse-results-modal.ts
  'parse-results-heading-text': 'カスタム解析値',
  'file-parse-description-text': '{FILE}で見つかったカスタム置換のリストは以下の通りです。',
  'no-parsed-values-found-text': '{FILE}にカスタム置換は見つかりませんでした。{FILE}内のカスタム置換を含むすべてのテーブルが2列のみで、すべての行がパイプ（例：|）で始まり、終わっていることを確認してください。',
  'find-header-text': '検索する単語',
  'replace-header-text': '置換する単語',
  'close-button-text': '閉じる',

  'tabs': {
    'names': {
      // tab.ts
      'general': '一般',
      'custom': 'カスタム',
      'yaml': 'YAML',
      'heading': '見出し',
      'content': '内容',
      'footnote': '脚注',
      'spacing': 'スペース',
      'paste': '貼り付け',
      'debug': 'デバッグ',
    },
    // tab-searcher.ts
    'default-search-bar-text': 'すべての設定から検索',
    'general': {
      // general-tab.ts
      'lint-on-save': {
        'name': '保存時にLint実行',
        'description': '手動で保存したときにファイルをLintする（<code>Ctrl + S</code>が押されたときや、vimキーバインドを使用しているときに<code>:w</code>が実行されたとき）',
      },
      'display-message': {
        'name': 'Lint時にメッセージを表示',
        'description': 'Lint後に変更された文字数を表示する',
      },
      'suppress-message-when-no-change': {
        'name': '変更がない場合はメッセージを抑制',
        'description': '有効にすると、実際に変更がない場合はメッセージが表示されません。',
      },
      'lint-on-file-change': {
        'name': 'フォーカスされたファイルの変更時にLintする',
        'description': 'ファイルが閉じられたり、新しいファイルに切り替えられたりしたときに、前のファイルがLintされます。',
      },
      'display-lint-on-file-change-message': {
        'name': 'フォーカスされたファイルの変更時にLintメッセージを表示',
        'description': '"フォーカスされたファイルの変更時にLintした"ときにメッセージを表示します',
      },
      'folders-to-ignore': {
        'name': '無視するフォルダ',
        'description': 'すべてのファイルをLintするときや、保存時にLintするときに無視するフォルダ。',
        'folder-search-placeholder-text': 'フォルダ名',
        'add-input-button-text': '無視するフォルダを追加',
        'delete-tooltip': '削除',
      },
      'files-to-ignore': {
        'name': '無視するファイル',
        'description': 'すべてのファイルをLintするときや、保存時にLintするときに無視するファイル。',
        'file-search-placeholder-text': '無視するファイルの正規表現',
        'add-input-button-text': '無視するファイルの正規表現を追加',
        'delete-tooltip': '削除',
        'label-placeholder-text': 'ラベル',
        'flags-placeholder-text': 'フラグ',
        'warning': '正規表現を知らない場合は注意して使用してください。また、iOSモバイルで正規表現の後読みを使用する場合は、それをサポートするバージョンであることを確認してください。',
      },
      'override-locale': {
        'name': 'ロケールを上書きする',
        'description': 'デフォルトとは異なるロケールを使用したい場合に設定します',
      },
      'same-as-system-locale': 'システムと同じ ({SYS_LOCALE})',
      'yaml-aliases-section-style': {
        'name': 'YAMLエイリアスセクションのスタイル',
        'description': 'YAMLエイリアスセクションのスタイル',
      },
      'yaml-tags-section-style': {
        'name': 'YAMLタグセクションのスタイル',
        'description': 'YAMLタグセクションのスタイル',
      },
      'default-escape-character': {
        'name': 'デフォルトのエスケープ文字',
        'description': 'シングルクォートとダブルクォートが存在しない場合に、YAMLの値をエスケープするために使用するデフォルトの文字。',
      },
      'remove-unnecessary-escape-chars-in-multi-line-arrays': {
        'name': '複数行配列形式で不要なエスケープ文字を削除',
        'description': '複数行のYAML配列では、単一行の配列と同じエスケープは必要ないため、複数行形式の場合は不要なエスケープを削除します。',
      },
      'number-of-dollar-signs-to-indicate-math-block': {
        'name': '数学ブロックを示すドル記号の数',
        'description': '数学コンテンツをインライン数学ではなく数学ブロックと見なすためのドル記号の数',
      },
    },
    'debug': {
      // debug-tab.ts
      'log-level': {
        'name': 'ログレベル',
        'description': 'サービスによってログに記録されることが許可されるログの種類。デフォルトは ERROR です。',
      },
      'linter-config': {
        'name': 'Linterの設定',
        'description': '設定ページの読み込み時点でのLinterの data.json の内容',
      },
      'log-collection': {
        'name': '保存時のLint実行および現在のファイルのLint実行時に、ログを収集',
        'description': '"保存時にLint実行"および現在のファイルのLint実行時にログを収集します。これらのログはデバッグやバグ報告の作成に役立ちます。',
      },
      'linter-logs': {
        'name': 'Linterログ',
        'description': '最後の"保存時にLint実行"、または、最後の"現在のファイル" に実行したLintのログ（有効な場合）',
      },
    },
  },

  'options': {
    'custom-command': {
      // custom-command-option.ts
      'name': 'カスタムコマンド',
      'description': 'カスタムコマンドは、Linterが通常のルールを実行した後に実行されるObsidianコマンドです。これは、YAMLタイムスタンプロジックが実行される前に実行されないことを意味し、Linterの次の実行でYAMLタイムスタンプがトリガーされる可能性があります。1つのObsidianコマンドのみを選択できます。',
      'warning': 'オプションを選択する際は、マウスを使用するか、Enterキーを押して選択してください。他の選択方法は機能しない場合があり、実際のObsidianコマンドまたは空の文字列の選択のみが保存されます。',

      'add-input-button-text': '新しいコマンドを追加',
      'command-search-placeholder-text': 'Obsidianコマンド',
      'move-up-tooltip': '上に移動',
      'move-down-tooltip': '下に移動',
      'delete-tooltip': '削除',
    },
    'custom-replace': {
      // custom-replace-option.ts
      'name': 'カスタム正規表現置換',
      'description': 'カスタム正規表現置換は、"検索する正規表現に一致するもの"を、"置換する値"に置き換えるために使用できます。"置換する値"と"検索する値"は有効な正規表現である必要があります。',
      'warning': '正規表現を知らない場合は注意して使用してください。また、iOSモバイルで正規表現の後読みを使用する場合は、それをサポートするバージョンであることを確認してください。',
      'add-input-button-text': '新しい正規表現置換を追加',
      'regex-to-find-placeholder-text': '検索する正規表現',
      'flags-placeholder-text': 'フラグ',
      'regex-to-replace-placeholder-text': '置換する正規表現',
      'label-placeholder-text': 'ラベル',
      'move-up-tooltip': '上に移動',
      'move-down-tooltip': '下に移動',
      'delete-tooltip': '削除',
    },
    'custom-auto-correct': {
      'delete-tooltip': '削除',
      'show-parsed-contents-tooltip': '解析された置換を表示',
      'custom-row-parse-warning': '"{ROW}" は、カスタム置換の有効な行ではありません。2列のみである必要があります。',
      'file-search-placeholder-text': 'ファイル名',
      'add-new-replacement-file-tooltip': '別のカスタムファイルを追加',
      'warning-text': '選択したファイルは自動的に {NAME} が無効になります。',
      'refresh-tooltip-text': 'カスタム置換をリロード',
    },
  },

  // rules
  'rules': {
    // auto-correct-common-misspellings.ts
    'auto-correct-common-misspellings': {
      'name': '一般的な誤字の自動修正',
      'description': '一般的な誤字を自動的に正しい綴りに変換するための辞書を使用します。完全な自動修正単語のリストについては、<a href="https://github.com/platers/obsidian-linter/tree/master/src/utils/default-misspellings.md">自動修正マップ</a>を参照してください。<b>注：このリストは複数の言語のテキストで機能することがありますが、現在使用されている言語に関係なく同じリストが使用されます。</b>',
      'ignore-words': {
        'name': '除外する語',
        'description': 'コンマ区切りの小文字の単語のリストで、自動修正時に無視されます。',
      },
      'extra-auto-correct-files': {
        'name': '追加の自動修正ソースファイル',
        'description': 'これらは、最初の単語と修正する単語を含むマークダウンテーブルがあるファイルです（これらは大文字と小文字を区別しない修正です）。<b>注：使用されるテーブルは、各行に開始および終了の<code>|</code>インジケーターが存在する必要があります。</b>',
      },
      'skip-words-with-multiple-capitals': {
        'name': '複数の大文字を含む語をスキップ',
        'description': '単語の最初の文字以外に大文字を含むファイルはスキップされます。頭字語やその他の単語に役立ちますが、固有名詞の修正に問題を引き起こす可能性があります。',
      },
      'default-install': '一般的な誤字の自動修正を使用しています。これを行うために、デフォルトの誤字訂正がダウンロードされます。これは一度だけ行われるはずです。しばらくお待ちください...',
      'default-install-failed': '{URL} のダウンロードに失敗しました。一般的な誤字の自動修正を無効にします。',
      'defaults-missing': 'デフォルトの一般的な自動修正ファイルが見つかりませんでした。: {FILE}',
    },
    // add-blank-line-after-yaml.ts
    'add-blank-line-after-yaml': {
      'name': 'YAMLの後に空行を追加',
      'description': 'YAMLブロックの後に空行を追加します。現在のファイルの終わりでない場合、またはすでに少なくとも1つの空行が続いていない場合に適用されます。',
    },
    // blockquotify-on-paste.ts
    'add-blockquote-indentation-on-paste': {
      'name': '貼り付け時にブロック引用のインデントを追加',
      'description': '貼り付け時にカーソルがブロック引用/コールアウト行にある場合、最初の行を除くすべての行にブロック引用を追加します。',
    },
    // blockquote-style.ts
    'blockquote-style': {
      'name': 'ブロック引用のスタイル',
      'description': 'ブロック引用のスタイルが一貫していることを確認します。',
      'style': {
        'name': 'スタイル',
        'description': 'ブロック引用インジケーターに使用されるスタイル',
      },
    },
    // capitalize-headings.ts
    'capitalize-headings': {
      'name': '見出しの大文字化',
      'description': '見出しは大文字でフォーマットする必要があります',
      'style': {
        'name': 'スタイル',
        'description': '使用する大文字化のスタイル',
      },
      'ignore-case-words': {
        'name': '大文字を無視する語',
        'description': 'すべて小文字の単語にのみタイトルケースのスタイルを適用します',
      },
      'ignore-words': {
        'name': '無視する語',
        'description': '大文字化時に無視する単語のコンマ区切りリスト',
      },
      'lowercase-words': {
        'name': '小文字の単語',
        'description': '小文字のままにする単語のコンマ区切りリスト',
      },
    },
    // compact-yaml.ts
    'compact-yaml': {
      'name': 'コンパクトYAML',
      'description': 'YAML front-matter の先頭と末尾の空行を削除します。',
      'inner-new-lines': {
        'name': '内部の改行',
        'description': 'YAMLの先頭や末尾ではない改行を削除します。',
      },
    },
    // consecutive-blank-lines.ts
    'consecutive-blank-lines': {
      'name': '連続する空行',
      'description': '連続する空行は最大で1行までにしてください。',
    },
    // convert-bullet-list-markers.ts
    'convert-bullet-list-markers': {
      'name': '箇条書きリストマーカーの変換',
      'description': '一般的な箇条書きリストマーカー記号をマークダウンリストマーカーに変換します。',
    },
    // convert-spaces-to-tabs.ts
    'convert-spaces-to-tabs': {
      'name': 'スペースをタブに変換',
      'description': '先頭のスペースをタブに変換します。',
      'tabsize': {
        'name': 'タブサイズ',
        'description': 'タブに変換されるスペースの数',
      },
    },
    // dedupe-yaml-array-values.ts
    'dedupe-yaml-array-values': {
      'name': 'YAML配列値の重複排除',
      'description': '大文字と小文字を区別して重複する配列値を削除します。',
      'dedupe-alias-key': {
        'name': 'YAMLエイリアスセクションの重複排除',
        'description': '重複するエイリアスの削除を有効にします。',
      },
      'dedupe-tag-key': {
        'name': 'YAMLタグセクションの重複排除',
        'description': '重複するタグの削除を有効にします。',
      },
      'dedupe-array-keys': {
        'name': 'YAML配列セクションの重複排除',
        'description': '通常のYAML配列の重複する値の削除を有効にします。',
      },
      'ignore-keys': {
        'name': '無視するYAMLキー',
        'description': '重複する値を削除しないYAMLキーのリスト（末尾のコロンなし）です。',
      },
    },
    // default-language-for-code-fences.ts
    'default-language-for-code-fences': {
      'name': 'コードフェンスのデフォルト言語',
      'description': '言語指定のないコードフェンスにデフォルトの言語を追加します。',
      'default-language': {
        'name': 'プログラミング言語',
        'description': '何もしない場合は空のままにします。言語タグは<a href="https://prismjs.com/#supported-languages">こちら</a>で確認できます。',
      },
    },
    // emphasis-style.ts
    'emphasis-style': {
      'name': '強調スタイル',
      'description': '強調スタイルが一貫していることを確認します。',
      'style': {
        'name': 'スタイル',
        'description': '強調されたコンテンツを示すために使用されるスタイル',
      },
    },
    // empty-line-around-blockquotes.ts
    'empty-line-around-blockquotes': {
      'name': '引用ブロックの周りの空行',
      'description': '引用ブロックの周りに空行があることを確認します。ただし、ドキュメントの開始または終了時は除きます。<b>注：空行は引用ブロックのネストレベルが1つ少ないか、改行文字のいずれかです。</b>',
    },
    // empty-line-around-code-fences.ts
    'empty-line-around-code-fences': {
      'name': 'コードフェンスの周りの空行',
      'description': 'コードフェンスの周りに空行があることを確認します。ただし、ドキュメントの開始または終了時は除きます。',
    },
    // empty-line-around-math-block.ts
    'empty-line-around-math-blocks': {
      'name': '数式ブロックの周りの空行',
      'description': '"数式ブロックを示すドル記号の数"を使用して、単一行の数式の数式ブロックの周りに空行があることを確認します。',
    },
    // empty-line-around-tables.ts
    'empty-line-around-tables': {
      'name': 'テーブルの周りの空行',
      'description': 'GitHub風のテーブルの周りに空行があることを確認します。ただし、ドキュメントの開始または終了時は除きます。',
    },
    // escape-yaml-special-characters.ts
    'escape-yaml-special-characters': {
      'name': 'YAML特殊文字のエスケープ',
      'description': 'YAML内のコロンの後にスペースを追加する(:)、シングルクォート(\')、ダブルクォート(")をエスケープします。',
      'try-to-escape-single-line-arrays': {
        'name': '単一行配列のエスケープを試みる',
        'description': '配列が "[" で始まり "]" で終わり、項目が "," で区切られていると仮定して、配列値のエスケープを試みます。',
      },
    },
    // file-name-heading.ts
    'file-name-heading': {
      'name': 'ファイル名見出し',
      'description': 'H1見出しが存在しない場合に、ファイル名をH1見出しとして挿入します。',
    },
    // footnote-after-punctuation.ts
    'footnote-after-punctuation': {
      'name': '句読点の後の脚注',
      'description': '脚注の参照が句読点の後に配置されていることを確認します。句読点の前ではありません。',
    },
    // force-yaml-escape.ts
    'force-yaml-escape': {
      'name': 'YAMLの強制エスケープ',
      'description': '指定されたYAMLキーの値をエスケープします。',
      'force-yaml-escape-keys': {
        'name': 'YAMLキーの強制エスケープ',
        'description': '指定されたYAMLキーに対して、まだエスケープされていない場合にYAMLのエスケープ文字を使用します。YAML配列には使用しないでください。',
      },
    },
    // format-tags-in-yaml.ts
    'format-tags-in-yaml': {
      'name': 'YAML内のタグのフォーマット',
      'description': 'YAML front-matter 内のタグから、ハッシュタグを削除します。これにより、タグが無効になるのを防ぎます。',
    },
    // format-yaml-array.ts
    'format-yaml-array': {
      'name': 'YAML配列のフォーマット',
      'description': '通常のYAML配列を複数行または単一行としてフォーマットできるようにし、<code>tags</code>および<code>aliases</code>は、Obsidian固有のYAMLフォーマットを持つことが許可されています。<b>注意：単一文字列から単一行への変換は、1つ以上のエントリが存在する場合に単一文字列のエントリから単一行配列に変わります。同様に、単一文字列から複数行への変換は複数行配列になります。</b>',
      'alias-key': {
        'name': 'YAMLエイリアスセクションのフォーマット',
        'description': 'YAMLエイリアスセクションのフォーマットを有効にします。ルール<code>YAMLタイトルエイリアス</code>と一緒にこのオプションを有効にしないでください。これらはうまく機能しないか、異なるフォーマットスタイルが選択されて予期しない結果を招く可能性があります。',
      },
      'tag-key': {
        'name': 'YAMLタグセクションのフォーマット',
        'description': 'YAMLタグセクションのフォーマットを有効にします。',
      },
      'default-array-style': {
        'name': 'デフォルトのYAML配列セクションスタイル',
        'description': 'YAML配列のスタイル（"タグ"、"エイリアス"、および"単一行配列に強制するキーの値"や"複数行配列に強制するキーの値"に含まれないもの）',
      },
      'default-array-keys': {
        'name': 'YAML配列セクションのフォーマット',
        'description': '通常のYAML配列のフォーマットを有効にします。',
      },
      'force-single-line-array-style': {
        'name': '単一行配列に強制するキーの値',
        'description': '改行で区切られたキーの値のYAML配列を単一行形式に強制します（このオプションを無効にするには、空のままにしてください）',
      },
      'force-multi-line-array-style': {
        'name': '複数行配列に強制するキーの値',
        'description': '改行で区切られたキーの値のYAML配列を複数行形式に強制します（このオプションを無効にするには、空のままにしてください）',
      },
    },
    // header-increment.ts
    'header-increment': {
      'name': 'ヘッダーのインクリメント',
      'description': '見出しレベルは一度に1レベルずつしか増加しないようにします',
      'start-at-h2': {
        'name': '見出しレベル2でヘッダーのインクリメントを開始',
        'description': 'ファイル内の最小見出しレベルを2にし、すべての見出しをそれに応じてシフトして、レベル2の見出しから始まるようにします。',
      },
    },
    // heading-blank-lines.ts
    'heading-blank-lines': {
      'name': '見出しの空白行',
      'description': 'すべての見出しの前後に、1行の空白行を入れます（見出しが文書の先頭または末尾にある場合を除く）。',
      'bottom': {
        'name': '下部',
        'description': '見出しの後に、1行の空白行を確保します',
      },
      'empty-line-after-yaml': {
        'name': 'YAMLと見出しの間の空行',
        'description': 'YAML front-matter と、見出しの間の空行を保持します',
      },
    },
    // headings-start-line.ts
    'headings-start-line': {
      'name': '見出しの開始行',
      'description': '行の先頭で始まらない見出しは、前の空白が削除されて見出しとして認識されるようにします。',
    },
    // insert-yaml-attributes.ts
    'insert-yaml-attributes': {
      'name': 'YAML属性の挿入',
      'description': '指定されたYAML属性を YAML front-matter に挿入します。各属性は単一行にしてください。',
      'text-to-insert': {
        'name': '挿入するテキスト',
        'description': 'YAML front-matter に挿入するテキスト',
      },
    },
    // line-break-at-document-end.ts
    'line-break-at-document-end': {
      'name': '文書末尾の改行',
      'description': 'ノートが空でない場合、文書の末尾に正確に1つの改行があることを保証します。',
    },
    // move-footnotes-to-the-bottom.ts
    'move-footnotes-to-the-bottom': {
      'name': '脚注を末尾に移動',
      'description': 'すべての脚注を文書の末尾に移動し、ファイル本文で参照される順序に基づいて並べ替えられていることを確認します。',
      'include-blank-line-between-footnotes': {
        'name': '脚注間の空行を含める',
        'description': '有効にすると、脚注間に空行を含めます。',
      },
    },
    // move-math-block-indicators-to-their-own-line.ts
    'move-math-block-indicators-to-their-own-line': {
      'name': '数式ブロックのインジケーターを独自の行に移動',
      'description': '単一行の数式に対して数式ブロックを示すドル記号の数を決定するために"数式ブロックを示すドル記号の数"を使用して、すべての開始および終了の数式ブロックインジケーターを独自の行に移動します。',
    },
    // move-tags-to-yaml.ts
    'move-tags-to-yaml': {
      'name': 'タグを YAML に移動',
      'description': 'すべてのタグを文書の YAML front-matter に移動します。',
      'how-to-handle-existing-tags': {
        'name': '本文のタグ操作',
        'description': 'タグが YAML front-matter に移動された後、ファイル本文内の無視されていないタグに対して何をするか',
      },
      'tags-to-ignore': {
        'name': '無視するタグ',
        'description': '"YAML内のタグのフォーマット"が有効になっている場合に、タグ配列に移動されないか、本文から削除されないタグです。各タグは新しい行に記述し、<code>#</code>を含めないでください。<b>タグ名にハッシュタグを含めないようにしてください。</b>',
      },
    },
    // no-bare-urls.ts
    'no-bare-urls': {
      'name': 'bare URLを許可しない',
      'description': 'バッククォート、角括弧、またはシングルクォートやダブルクォートで囲まれていないbare URLを山括弧(<code>&gt;&lt;</code>)で囲みます。',
      'no-bare-uris': {
        'name': 'bare URIを許可しない',
        'description': 'バッククォート、角括弧、またはシングルクォートやダブルクォートで囲まれていないbare URIを山括弧(<code>&gt;&lt;</code>)で囲もうとします。',
      },
    },
    // ordered-list-style.ts
    'ordered-list-style': {
      'name': '順序付きリストのスタイル',
      'description': '順序付きリストが指定されたスタイルに従っていることを確認します。<b>注：2つのスペースまたは1つのタブはインデントレベルと見なす。</b>',
      'number-style': {
        'name': '数字のスタイル',
        'description': '順序付きリストのインジケーターで使用される数字のスタイル',
      },
      'list-end-style': {
        'name': '順序付きリストインジケーターの終了スタイル',
        'description': '順序付きリストインジケーターの終了文字',
      },
      'preserve-start': {
        'name': '開始番号を保持',
        'description': '順序付きリストの開始番号を保持するかどうか。これにより、順序付きリストの項目間にコンテンツがあるリストを作成できます。',
      },
    },
    // paragraph-blank-lines.ts
    'paragraph-blank-lines': {
      'name': '段落の空行',
      'description': 'すべての段落の前後に、正確に1行の空白行があることを確認します。',
    },
    // prevent-double-checklist-indicator-on-paste.ts
    'prevent-double-checklist-indicator-on-paste': {
      'name': '貼り付け時の二重チェックリストインジケーターを防止',
      'description': 'ファイル内のカーソルがある行にチェックリストインジケーターがある場合、貼り付けるテキストから開始チェックリストインジケーターを削除します。',
    },
    // prevent-double-list-item-indicator-on-paste.ts
    'prevent-double-list-item-indicator-on-paste': {
      'name': '貼り付け時の二重リスト項目インジケーターを防止',
      'description': 'ファイル内のカーソルがある行にリストインジケーターがある場合、貼り付けるテキストから開始リストインジケーターを削除します。',
    },
    // proper-ellipsis-on-paste.ts
    'proper-ellipsis-on-paste': {
      'name': '貼り付け時の適切な省略記号',
      'description': '貼り付けるテキスト内の3つの連続したドットを、省略記号に置き換えます。ドットの間にスペースがあっても置き換えます。',
    },
    // proper-ellipsis.ts
    'proper-ellipsis': {
      'name': '適切な省略記号',
      'description': '3つの連続したドットを省略記号に置き換えます。',
    },
    // quote-style.ts
    'quote-style': {
      'name': '引用符のスタイル',
      'description': '本文の引用符を、指定されたシングルおよびダブル引用符のスタイルに更新します。',
      'single-quote-enabled': {
        'name': 'シングル引用符のスタイルを有効にする',
        'description': '指定されたシングル引用符のスタイルを使用することを指定します。',
      },
      'single-quote-style': {
        'name': 'シングル引用符のスタイル',
        'description': '使用するシングル引用符のスタイルです。',
      },
      'double-quote-enabled': {
        'name': 'ダブル引用符のスタイルを有効にする',
        'description': '指定されたダブル引用符のスタイルを使用することを指定します。',
      },
      'double-quote-style': {
        'name': 'ダブル引用符のスタイル',
        'description': '使用するダブル引用符のスタイルです。',
      },
    },
    // re-index-footnotes.ts
    're-index-footnotes': {
      'name': '脚注の再インデックス化',
      'description': '発生順に基づいて脚注キーと脚注を再インデックス化します。<b>注：このルールは、キーに対して複数の脚注がある場合は、<i>機能しません</i>。</b>',
    },
    // remove-consecutive-list-markers.ts
    'remove-consecutive-list-markers': {
      'name': '連続するリストマーカーの削除',
      'description': '連続するリストマーカーを削除します。リスト項目をコピー＆ペーストする際に便利です。',
    },
    // remove-empty-lines-between-list-markers-and-checklists.ts
    'remove-empty-lines-between-list-markers-and-checklists': {
      'name': 'リストマーカーとチェックリストの間の空行を削除',
      'description': 'リストマーカーとチェックリストの間に空行がないことを確認します。',
    },
    // remove-empty-list-markers.ts
    'remove-empty-list-markers': {
      'name': '空のリストマーカーを削除',
      'description': '内容のないリスト項目、すなわち空のリストマーカーを削除します。',
    },
    // empty-line-around-horizontal-rules.ts
    'empty-line-around-horizontal-rules': {
      'name': '水平ルールの周りの空行',
      'description': 'ドキュメントの開始または終了でない限り、水平ルールの周りに空行があることを確認します。',
    },
    // remove-hyphenated-line-breaks.ts
    'remove-hyphenated-line-breaks': {
      'name': 'ハイフンで区切られた改行を削除',
      'description': '教科書からテキストを貼り付ける際に便利な、ハイフンで区切られた改行を削除します。',
    },
    // remove-hyphens-on-paste.ts
    'remove-hyphens-on-paste': {
      'name': '貼り付け時のハイフンを削除',
      'description': '貼り付けるテキストからハイフンを削除します。',
    },
    // remove-leading-or-trailing-whitespace-on-paste.ts
    'remove-leading-or-trailing-whitespace-on-paste': {
      'name': '貼り付け時の先頭または末尾の空白を削除',
      'description': '貼り付けるテキストの、先頭のタブ以外の空白と、末尾の空白をすべて削除します。',
    },
    // remove-leftover-footnotes-from-quote-on-paste.ts
    'remove-leftover-footnotes-from-quote-on-paste': {
      'name': '引用符の貼り付け時に残った脚注を削除',
      'description': '貼り付けるテキストの残った脚注参照を削除します。',
    },
    // remove-link-spacing.ts
    'remove-link-spacing': {
      'name': 'リンクの間隔を削除',
      'description': 'リンクテキストの周りの空行を削除します。',
    },
    // remove-multiple-blank-lines-on-paste.ts
    'remove-multiple-blank-lines-on-paste': {
      'name': '貼り付け時の複数の空行を削除',
      'description': '貼り付けるテキストの、複数の空行を、1つの空行にまとめます。',
    },
    // remove-multiple-spaces.ts
    'remove-multiple-spaces': {
      'name': '複数のスペースを削除',
      'description': '2つ以上連続するスペースを削除します。行の先頭と末尾のスペースは無視します。',
    },
    // remove-space-around-characters.ts
    'remove-space-around-characters': {
      'name': '文字の周りの空白を削除',
      'description': '特定の文字が空白（単一スペースまたはタブ）で囲まれていないことを確認します。<b>注：これにより、場合によってはマークダウン形式に問題が生じることがあります。</b>',
      'include-fullwidth-forms': {
        'name': '全角文字を含める',
        'description': 'ユニコードブロック<a href="https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)">全角文字（Fullwidth Forms）</a>を含める',
      },
      'include-cjk-symbols-and-punctuation': {
        'name': 'CJK記号および句読点を含める',
        'description': 'ユニコードブロック<a href="https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation">CJK記号および句読点（CJK Symbols and Punctuation）</a>を含める',
      },
      'include-dashes': {
        'name': 'ダッシュを含める',
        'description': 'enダッシュ（–）およびemダッシュ（—）を含める',
      },
      'other-symbols': {
        'name': 'その他の記号',
        'description': 'その他の含める記号のリスト',
      },
    },
    // remove-space-before-or-after-characters.ts
    'remove-space-before-or-after-characters': {
      'name': '文字の前後の空白を削除',
      'description': '指定された文字の前後の空白を削除します。<b>注：これにより、場合によってはマークダウン形式に問題が生じることがあります。</b>',
      'characters-to-remove-space-before': {
        'name': '文字の前の空白を削除',
        'description': '指定された文字の前の空白を削除します。<b>注：リスト内で<code>{</code>または<code>}</code>を使用すると、背後で無視構文に使用されるため、ファイルに予期しない影響を与える可能性があります。</b>',
      },
      'characters-to-remove-space-after': {
        'name': '文字の後の空白を削除',
        'description': '指定された文字の後の空白を削除します。<b>注：リスト内で<code>{</code>または<code>}</code>を使用すると、背後で無視構文に使用されるため、ファイルに予期しない影響を与える可能性があります。</b>',
      },
    },
    // remove-trailing-punctuation-in-heading.ts
    'remove-trailing-punctuation-in-heading': {
      'name': '見出しの末尾の句読点を削除',
      'description': '見出しの末尾から、指定された句読点を削除します。<a href="https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references">HTMLエンティティ参照</a>の末尾のセミコロンは無視されます。',
      'punctuation-to-remove': {
        'name': '末尾の句読点',
        'description': 'ファイル内の見出しから削除する末尾の句読点。',
      },
    },
    // remove-yaml-keys.ts
    'remove-yaml-keys': {
      'name': 'YAMLキーを削除',
      'description': '指定されたYAMLキーを削除します',
      'yaml-keys-to-remove': {
        'name': '削除するYAMLキー',
        'description': 'コロンの有無にかかわらず、YAML front-matter から削除するYAMLキー',
      },
    },
    // sort-yaml-array-values.ts
    'sort-yaml-array-values': {
      'name': 'YAML配列の値をソート',
      'description': '指定されたソート順に基づいて、YAML配列の値をソートします。',
      'sort-alias-key': {
        'name': 'YAMLエイリアスセクションをソート',
        'description': 'エイリアスのソートを有効にします。',
      },
      'sort-tag-key': {
        'name': 'YAMLタグセクションをソート',
        'description': 'タグのソートを有効にします。',
      },
      'sort-array-keys': {
        'name': 'YAML配列セクションをソート',
        'description': '通常のYAML配列の値のソートを有効にします。',
      },
      'ignore-keys': {
        'name': '無視するYAMLキー',
        'description': '値のソートを行わないYAMLキーのリスト。各キーはコロンなしで独立した行に記述します。',
      },
      'sort-order': {
        'name': 'ソート順',
        'description': 'YAML配列の値をソートする方法。',
      },
    },
    // space-after-list-markers.ts
    'space-after-list-markers': {
      'name': 'リストマーカーの後のスペース',
      'description': 'リストマーカーとチェックボックスの後には、単一のスペースが必要です。',
    },
    // space-between-chinese-japanese-or-korean-and-english-or-numbers.ts
    'space-between-chinese-japanese-or-korean-and-english-or-numbers': {
      'name': '中国語、日本語、韓国語と英語または数字の間のスペース',
      'description': '中国語、日本語、韓国語と英語または数字の間に単一のスペースがあることを確認します。これらの<a href="https://github.com/sparanoid/chinese-copywriting-guidelines">ガイドライン</a>に従います。',
      'english-symbols-punctuation-before': {
        'name': 'CJKの前の英語の、句読点と記号',
        'description': '中国語、日本語、韓国語の文字の前にある場合に、英語と見なされる非文字の句読点と記号のリスト。<b>注：「*」は常に英語と見なされ、一部のマークダウン構文を適切に処理するために必要です。</b>',
      },
      'english-symbols-punctuation-after': {
        'name': 'CJKの後の英語の、句読点と記号',
        'description': '中国語、日本語、韓国語の文字の後にある場合に、英語と見なされる非文字の句読点と記号のリスト。<b>注：「*」は常に英語と見なされ、一部のマークダウン構文を適切に処理するために必要です。</b>',
      },
    },
    // strong-style.ts
    'strong-style': {
      'name': '強調スタイル',
      'description': '強調スタイルが一貫していることを確認します。',
      'style': {
        'name': 'スタイル',
        'description': '強調/太字の内容を示すために使用されるスタイル',
      },
    },
    // trailing-spaces.ts
    'trailing-spaces': {
      'name': '行末の空白',
      'description': '各行の余分な空白を削除します。',
      'two-space-line-break': {
        'name': '二重スペースの改行',
        'description': '改行に続く二重スペース（"二重スペースルール"）を無視します。',
      },
    },
    // two-spaces-between-lines-with-content.ts
    'two-spaces-between-lines-with-content': {
      'name': '内容のある行間の改行',
      'description': '段落、引用、リスト項目の次の行に内容が続く行の末尾に、指定された改行が追加されていることを確認します。',
      'line-break-indicator': {
        'name': '改行インジケーター',
        'description': '使用する改行インジケーター。',
      },
    },
    // unordered-list-style.ts
    'unordered-list-style': {
      'name': '箇条書きリストのスタイル',
      'description': '箇条書きリストが指定されたスタイルに従っていることを確認します。',
      'list-style': {
        'name': 'リスト項目のスタイル',
        'description': '箇条書きリストで使用するリスト項目のスタイル',
      },
    },
    // yaml-key-sort.ts
    'yaml-key-sort': {
      'name': 'YAMLキーのソート',
      'description': '指定された順序と優先順位に基づいてYAMLキーをソートします。<b>注：空行も削除する場合があります。ネストされていないキーにのみ機能します。</b>',
      'yaml-key-priority-sort-order': {
        'name': 'YAMLキー優先ソート順',
        'description': 'リストに見つかった順序でソートされる各行に、1つずつキーを並べる順序',
      },
      'priority-keys-at-start-of-yaml': {
        'name': 'YAMLの先頭にある優先キー',
        'description': 'YAMLキー優先ソート順は YAML front-matter の先頭に配置されます',
      },
      'yaml-sort-order-for-other-keys': {
        'name': 'その他のキーのYAMLソート順',
        'description': 'YAMLキー優先ソート順のテキストエリアに見つからないキーをソートする方法',
      },
    },
    // yaml-timestamp.ts
    'yaml-timestamp': {
      'name': 'YAMLタイムスタンプ',
      'description': 'YAML front-matter でファイルが最後に編集された日付を追跡します。ファイルのメタデータから日付を取得します。',
      'date-created': {
        'name': '作成日',
        'description': 'ファイルの作成日を挿入します。',
      },
      'date-created-key': {
        'name': '作成日キー',
        'description': '作成日に使用するYAMLキー',
      },
      'date-created-source-of-truth': {
        'name': '作成日の真実の情報源',
        'description': '作成日がすでに front-matter に存在する場合に、作成日を取得する場所を指定します。',
      },
      'date-modified-source-of-truth': {
        'name': '更新日の真実の情報源',
        'description': '更新日がすでに front-matter に存在する場合に、更新日が更新されるべき時を、どの手段を用いるかを指定します。',
      },
      'date-modified': {
        'name': '更新日',
        'description': 'ファイルの最終更新日を挿入します。',
      },
      'date-modified-key': {
        'name': '更新日キー',
        'description': '更新日に使用するYAMLキー',
      },
      'format': {
        'name': 'フォーマット',
        'description': '使用するmoment dateフォーマット（<a href="https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/">moment dateフォーマットオプション</a>を参照）',
      },
      'convert-to-utc': {
        'name': 'ローカル時間をUTCに変換',
        'description': '保存された日付を、ローカル時間の代わりにUTCのを使用します',
      },
      'update-on-file-contents-updated': {
        'name': 'ファイル内容の更新時にYAMLタイムスタンプを更新',
        'description': '現在アクティブなノートが変更されると、"YAMLタイムスタンプ"で実行されます。これにより、現在の値から5秒以上ずれている場合は、変更されたノートのタイムスタンプが更新されるはずです。',
      },
    },
    // yaml-title-alias.ts
    'yaml-title-alias': {
      'name': 'YAMLタイトルエイリアス',
      'description': 'ファイルのタイトルを YAML front-matter のエイリアスセクションに挿入または更新します。タイトルは最初のH1またはファイル名から取得します。',
      'preserve-existing-alias-section-style': {
        'name': '既存のエイリアスセクションのスタイルを保持',
        'description': '設定されている場合、"YAMLエイリアスセクションスタイル"の設定は、新しく作成されたセクションにのみ適用されます',
      },
      'keep-alias-that-matches-the-filename': {
        'name': 'ファイル名と一致するエイリアスを保持',
        'description': 'そのようなエイリアスは通常冗長です',
      },
      'use-yaml-key-to-keep-track-of-old-filename-or-heading': {
        'name': '<code>Alias Helper Key</code>で指定されたYAMLキーを使用して、ファイル名と見出しの変更を支援します',
        'description': '設定されている場合、最初のH1見出しが変更された場合、または最初のH1が存在しない場合はファイル名が変更された場合に、このキーに保存されている古いエイリアスは、新しい値に置き換えられます。エイリアス配列に新しいエントリを挿入するだけではありません。',
      },
      'alias-helper-key': {
        'name': 'Alias Helper Key',
        'description': 'このルールによって front-matter に保存された最後のファイル名または見出しを追跡するために使用するキー。',
      },
    },
    // yaml-title.ts
    'yaml-title': {
      'name': 'YAMLタイトル',
      'description': 'ファイルのタイトルを YAML front-matter に挿入します。選択したモードに基づいてタイトルを取得します。',
      'title-key': {
        'name': 'タイトルキー',
        'description': 'タイトルに使用するYAMLキー',
      },
      'mode': {
        'name': 'モード',
        'description': 'タイトルを取得するために使用する方法',
      },
    },
  },

  // These are the string values in the UI for enum values and thus they do not follow the key format as used above
  'enums': {
    'Title Case': 'タイトルケース',
    'ALL CAPS': 'すべて大文字',
    'First letter': '最初の文字',
    '.': '.', // leave as is
    ')': ')', // leave as is
    'ERROR': 'エラー',
    'TRACE': 'トレース',
    'DEBUG': 'デバッグ',
    'INFO': '情報',
    'WARN': '警告',
    'SILENT': 'サイレント',
    'ascending': '昇順',
    'lazy': '遅延',
    'preserve': '保持',
    'Nothing': 'なし',
    'Remove hashtag': 'ハッシュタグを削除',
    'Remove whole tag': 'タグ全体を削除',
    'asterisk': 'アスタリスク',
    'underscore': 'アンダースコア',
    'consistent': '一貫性',
    '-': '-', // leave as is
    '*': '*', // leave as is
    '+': '+', // leave as is
    'space': 'スペース',
    'no space': 'スペースなし',
    'None': 'なし',
    'Ascending Alphabetical': 'アルファベットの昇順',
    'Descending Alphabetical': 'アルファベットの降順',
    // yaml.ts
    'multi-line': '複数行',
    'single-line': '単一行',
    'single string to single-line': '単一文字列から単一行へ',
    'single string to multi-line': '単一文字列から複数行へ',
    'single string comma delimited': '単一文字列カンマ区切り',
    'single string space delimited': '単一文字列スペース区切り',
    'single-line space delimited': '単一行スペース区切り',
    // yaml-title.ts
    'first-h1': '最初のH1',
    'first-h1-or-filename-if-h1-missing': '最初のH1 または H1がない場合はファイル名',
    'filename': 'ファイル名',
    // settings-data.ts
    'never': 'なし',
    'after 5 seconds': '5秒後',
    'after 10 seconds': '10秒後',
    'after 15 seconds': '15秒後',
    'after 30 seconds': '30秒後',
    'after 1 minute': '1分後',
    // yaml-timestamp.ts
    'file system': 'ファイルシステム',
    'frontmatter': 'YAML frontmatter',
    'user or Linter edits': 'Obsidianでの変更',
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

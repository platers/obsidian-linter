//  简体中文

export default {
  'commands': {
    'lint-file': {
      'name': '格式化当前文件',
      'error-message': '格式化当前文件时出错',
    },
    'lint-file-unless-ignored': {
      'name': '格式化所有文件（除了被忽略的文件）',
    },
    'lint-all-files': {
      'name': '格式化所有文件',
      'error-message': '格式化所有文件时出错',
      'success-message': '已格式化所有文件',
      'errors-message-singular': '已格式化所有文件，其中有 1 个错误',
      'errors-message-plural': '已格式化所有文件，其中有 {NUM} 个错误',
      'start-message': '这将改动所有文件，包括子文件夹中的文件，可能会引入错误',
      'submit-button-text': '格式化所有文件',
      'submit-button-notice-text': '正在格式化所有文件...',
    },
    'lint-all-files-in-folder': {
      'name': '格式化文件夹中的所有文件',
      'start-message': '这将改动文件夹 {FOLDER_NAME} 中的所有文件，包括子文件夹中的文件，可能会引入错误',
      'submit-button-text': '格式化文件夹 {FOLDER_NAME} 中的所有文件',
      'submit-button-notice-text': '正在格式化文件夹 {FOLDER_NAME} 中的所有文件...',
      'error-message': '格式化文件夹中的所有文件时出错',
      'success-message': '已格式化文件夹 {FOLDER_NAME} 中的所有 {NUM} 个文件',
      'message-singular': '已格式化文件夹 {FOLDER_NAME} 中的所有 {NUM} 个文件，其中有 1 个错误',
      'message-plural': '已格式化文件夹 {FOLDER_NAME} 中的 {FILE_COUNT} 个文件，其中有 {ERROR_COUNT} 个错误.',
    },
    'paste-as-plain-text': {
      'name': '粘贴为纯文本且不提醒',
    },
    'lint-file-pop-up-menu-text': {
      'name': '格式化文件',
    },
    'lint-folder-pop-up-menu-text': {
      'name': '格式化文件夹',
    },
  },

  'logs': {
    'plugin-load': '正在加载插件',
    'plugin-unload': '正在卸载插件',
    'folder-lint': '正在格式化文件夹',
    'linter-run': '正在运行 Linter',
    'file-change-yaml-lint-run': '文件内容变更， 正在格式化 YAML',
    'file-change-yaml-lint-skipped': '没有检测到文件内容变更, 跳过 YAML 格式化',
    'file-change-yaml-lint-warning': '没有检测到文件内容变更, 但是 YAML 格式化被触发，请检查错误',
    'paste-link-warning': '中止粘贴格式化 ，因为剪贴板内容是一个链接，这样做将避免与其他修改粘贴行为的插件发生冲突',
    'see-console': '请查看控制台以获取更多信息',
    'unknown-error': '格式化过程发生未知错误',
    'moment-locale-not-found': '尝试将 Moment.js 的默认地区语言切换到 {MOMENT_LOCALE}, 实际切换到 {CURRENT_LOCALE}',
    'file-change-lint-message-start': '格式化已完成',
    'custom-command-callback-warning': 'Please only set the custom command callback for integration tests.', // not translated

    // rules-runner.ts
    'pre-rules': '比正常规则优先级更高的规则',
    'post-rules': '比正常规则优先级更低的规则',
    'rule-running': '正在运行规则',
    'custom-regex': '自定义正则表达式规则',
    'running-custom-regex': '正在运行自定义正则表达式规则',
    'running-custom-lint-command': '正在运行自定义格式化命令',
    'custom-lint-duplicate-warning': '你不能运行同一个自定义规则 ("{COMMAND_NAME}") 两次',
    'custom-lint-error-message': '自定义格式化命令',

    // rules-runner.ts and rule-builder.ts
    'disabled-text': '已禁用',

    // rule-builder.ts
    'run-rule-text': '运行中',

    // logger.ts
    'timing-key-not-found': '计时键 \'{TIMING_KEY}\' 在计时信息列表中不存在，已忽略',
    'milliseconds-abbreviation': '毫秒',

    'invalid-date-format-error': `无法解析或确定'{FILE_NAME}'中的创建日期'{DATE}'的格式，创建日期未进行修改`,

    // yaml.ts
    'invalid-delimiter-error-message': '分隔符只能为单个字符',

    // mdast.ts
    'missing-footnote-error-message': `脚注 '{FOOTNOTE}' 没有对应的引用，无法处理。请确保所有脚注都有相应的引用。`,
    'too-many-footnotes-error-message': `脚注编号 '{FOOTNOTE_KEY}' 有超过1个脚注在使用，请修改脚注使得一个脚注编号对应一个脚注`,

    // rules.ts
    'wrapper-yaml-error': 'YAML 出现错误: {ERROR_MESSAGE}',
    'wrapper-unknown-error': '未知错误: {ERROR_MESSAGE}',
  },

  'notice-text': {
    'empty-clipboard': '剪贴板为空',
    'characters-added': '个字符被添加',
    'characters-removed': '个字符被移除',
    'copy-to-clipboard-failed': '将内容复制到剪贴板时失败: ',
  },

  // rule-alias-suggester.ts
  'all-rules-option': '全部',

  // settings.ts
  'linter-title': 'Linter',
  'empty-search-results-text': '没有匹配的设置项',

  // lint-confirmation-modal.ts
  'warning-text': '警告',
  'file-backup-text': '请确保你已备份文件',
  'custom-command-warning': '启用自定义命令时格式化多个文件需要启用侧边栏，同时会显著的更加耗时，请保持耐心',
  'cancel-button-text': '取消',

  'copy-aria-label': '复制',

  'disabled-other-rule-notice': '如果启用规则 <code>{NAME_1}</code>，则将禁用规则 <code>{NAME_2}</code>。',
  'disabled-conflicting-rule-notice': '{NAME_1} 因与 {NAME_2} 冲突而禁用。',

  // confirm-rule-disable-modal.ts
  'ok': '确定',

  // parse-results-modal.ts
  'parse-results-heading-text': 'Custom Parse Values',
  'file-parse-description-text': 'The following is the list of custom replacements found in {FILE}.',
  'no-parsed-values-found-text': 'There were no custom replacements found in {FILE}. Please make sure that all tables with custom replacements in {FILE} only have two columns and all rows start and end with a pipe (i.e. |).',
  'find-header-text': 'Word to Find',
  'replace-header-text': 'Replacement Word',
  'close-button-text': 'Close',

  'tabs': {
    'names': {
      // tab.ts
      'general': '基础',
      'custom': '自定义',
      'yaml': 'YAML',
      'heading': '标题',
      'content': '内容',
      'footnote': '脚注',
      'spacing': '空行',
      'paste': '粘贴',
      'debug': 'Debug',
    },
    // tab-searcher.ts
    'default-search-bar-text': '搜索设置项',
    'general': {
      // general-tab.ts
      'lint-on-save': {
        'name': '保存时格式化文件',
        'description': '手动保存时格式化文件（当按 <code>Ctrl + S</code> 时或在 vim 模式中使用 <code>:w</code> 时）',
      },
      'display-message': {
        'name': '格式化后显示消息',
        'description': '格式化后显示修改了多少字符',
      },
      'suppress-message-when-no-change': {
        'name': '无修改时不显示消息',
        'description': '开启后，若无实际改动发生则不显示消息。',
      },
      'lint-on-file-change': {
        'name': '文件修改时格式化',
        'description': '当文件关闭或是切换到新文件时，格式化之前的文件',
      },
      'display-lint-on-file-change-message': {
        'name': '提醒文件修改时格式化',
        'description': '当<code>文件修改时格式化</code>触发时，弹出一条提示信息',
      },
      'folders-to-ignore': {
        'name': '忽略文件夹',
        'description': '需要忽略的文件夹（格式化所有文件或保存时格式化时生效），每行输入一个文件夹路径',
        'folder-search-placeholder-text': '文件夹',
        'add-input-button-text': '添加要忽略的文件夹',
        'delete-tooltip': '删除',
      },
      'files-to-ignore': {
        'name': '忽略文件',
        'description': '需要忽略的文件（格式化所有文件或保存时格式化时生效）',
        'file-search-placeholder-text': '正则表达式',
        'add-input-button-text': '添加正则表达式',
        'delete-tooltip': '删除',
        'label-placeholder-text': '名称',
        'flags-placeholder-text': '修饰符',
        'warning': '如果您不知道正则表达式是什么，请谨慎使用。此外，如果在 iOS 移动设备上使用后行断言，请确保系统版本支持',
      },
      'override-locale': {
        'name': '覆盖默认地区语言',
        'description': '使用不同于默认地区语言时需要设置此项',
      },
      'same-as-system-locale': '默认 ({SYS_LOCALE}) ',
      'yaml-aliases-section-style': {
        'name': 'YAML aliases 样式',
        'description': 'YAML aliases 样式',
      },
      'yaml-tags-section-style': {
        'name': 'YAML tags 样式',
        'description': 'YAML tags 样式',
      },
      'default-escape-character': {
        'name': '默认转义字符',
        'description': '当单引号或双引号不存在时用于转义 YAML 值的默认字符',
      },
      'remove-unnecessary-escape-chars-in-multi-line-arrays': {
        'name': '当使用 YAML 多行数组时删除不必要的转义字符',
        'description': 'YAML 多行数组的转义字符和 YAML 单行数组不同，因此在使用多行数组时，删除不必要的转义字符',
      },
      'number-of-dollar-signs-to-indicate-math-block': {
        'name': 'Latex 块标记符 $ 数量',
        'description': '将 Latex 内容视为 Latex 块而不是行内 Latex 的 $ 符号的数量',
      },
    },
    'debug': {
      // debug-tab.ts
      'log-level': {
        'name': '日志级别',
        'description': '允许输出的日志级别，默认是 ERROR',
      },
      'linter-config': {
        'name': 'Linter 配置',
        'description': '打开设置页面后，Linter 加载的 data.json 中的内容',
      },
      'log-collection': {
        'name': '格式化当前文件时收集日志',
        'description': '在格式化当前文件时收集日志。这些日志有助于调试和创建错误报告',
      },
      'linter-logs': {
        'name': 'Linter 日志',
        'description': '如果开启，则显示最后一次格式化当前文件时生成的日志',
      },
    },
  },

  'options': {
    'custom-command': {
      // custom-command-option.ts
      'name': '自定义命令',
      'description': '自定义命令是在 Linter 完成格式化后运行的 Obsidian 命令。这意味着 Obsidian 命令会在 YAML 时间戳修改之后运行，因此它们可能会导致在下次运行 Linter 时触发 YAML 时间戳修改。一个 Obsidian 命令只能选择一次。',
      'warning': '选择命令时，请确保使用鼠标或按回车键选择该选项，其他选择方法可能不起作用。只有 Obsidian 命令或空字符串会被保存',

      'add-input-button-text': '添加新命令',
      'command-search-placeholder-text': 'Obsidian 命令',
      'move-up-tooltip': '上移',
      'move-down-tooltip': '下移',
      'delete-tooltip': '删除',
    },
    'custom-replace': {
      // custom-replace-option.ts
      'name': '自定义正则表达式替换',
      'description': '自定义正则表达式替换可将任意的正则匹配内容替换为指定值。查找值和替换值必须是有效的正则表达式',
      'warning': '如果您不知道正则表达式是什么，请谨慎使用。此外，如果在 iOS 移动设备上使用后行断言，请确保系统版本支持',
      'add-input-button-text': '添加新的正则替换规则',
      'regex-to-find-placeholder-text': '查找用正则表达式',
      'flags-placeholder-text': '修饰符',
      'regex-to-replace-placeholder-text': '替换用正则表达式',
      'label-placeholder-text': '名称',
      'move-up-tooltip': '上移',
      'move-down-tooltip': '下移',
      'delete-tooltip': '删除',
    },
    'custom-auto-correct': {
      'delete-tooltip': '删除',
      'show-parsed-contents-tooltip': '查看加载的替换文件',
      'custom-row-parse-warning': '"{ROW}" 格式错误，需要至少两列',
      'file-search-placeholder-text': '文件名称',
      'add-new-replacement-file-tooltip': '添加自定义文件',
      'warning-text': '被选中的文件将自动关闭规则 {NAME}',
      'refresh-tooltip-text': '重新加载自定义替换文件',
    },
  },

  // rules
  'rules': {
    // auto-correct-common-misspellings.ts
    'auto-correct-common-misspellings': {
      'name': '自动更正常见的拼写错误',
      'description': '通过常见拼写错误字典自动将错误拼写更正为正确拼写。有关自动更正单词的完整列表，请参阅 <a href="https://github.com/platers/obsidian-linter/tree/master/src/utils/default-misspellings.md">auto-correct map</a>',
      'ignore-words': {
        'name': '忽略单词',
        'description': '以逗号分隔的小写单词列表，在自动更正时会忽略',
      },
      'extra-auto-correct-files': {
        'name': '额外自动更正原始文件',
        'description': '文件中有一个 markdown 表格，其中包含初始单词和要更正的单词（不区分大小写）。 <b>注意：使用的表格应该对每行都有起始和结束的 <code>|</code> 标志</b>',
      },
      'skip-words-with-multiple-capitals': {
        'name': '跳过有多个大写字母的单词',
        'description': '跳过有多个大写字母的单词，首字母缩写词和其他一些单词可能会受益于此。这可能会导致专有名词无法正确修复',
      },
      'default-install': '正在下载默认的拼写错误修正数据，仅在第一次启用时下载，请等待...',
      'default-install-failed': '下载 {URL} 失败。禁用自动更正常见的拼写错误',
      'defaults-missing': '未找到默认的常见自动更正文件: {FILE}',
    },
    // add-blank-line-after-yaml.ts
    'add-blank-line-after-yaml': {
      'name': 'YAML 块后空行',
      'description': '确保 YAML 块后有空行，除非它在文档的结尾',
    },
    // blockquotify-on-paste.ts
    'add-blockquote-indentation-on-paste': {
      'name': '添加引用块缩进',
      'description': '粘贴时，如果光标位于引用行或标注行，则将引用添加到除第一行以外的所有行',
    },
    // blockquote-style.ts
    'blockquote-style': {
      'name': '引用块样式',
      'description': '确保引用块样式一致',
      'style': {
        'name': '样式',
        'description': '引用块标志字符的样式',
      },
    },
    // capitalize-headings.ts
    'capitalize-headings': {
      'name': '大写标题',
      'description': '标题会在格式化后大写',
      'style': {
        'name': '样式',
        'description': '大写的方式',
      },
      'ignore-case-words': {
        'name': '忽略大写单词',
        'description': '在样式设为每词首字母大写时，仅格式化全小写的单词',
      },
      'ignore-words': {
        'name': '忽略单词',
        'description': '不格式化的单词，以逗号分隔',
      },
      'lowercase-words': {
        'name': '小写单词',
        'description': '保持小写的单词，以逗号分隔',
      },
    },
    // compact-yaml.ts
    'compact-yaml': {
      'name': '精简 YAML',
      'description': '移除 YAML Front-matter 开头结尾的空行',
      'inner-new-lines': {
        'name': '内部空行',
        'description': '移除 YAML Front-matter 内部的空行',
      },
    },
    // consecutive-blank-lines.ts
    'consecutive-blank-lines': {
      'name': '连续空行',
      'description': '最多允许一个连续空行',
    },
    // convert-bullet-list-markers.ts
    'convert-bullet-list-markers': {
      'name': '转换无序列表标志',
      'description': '将其他格式无序列表标志转换为 Markdown 格式无序列表标志',
    },
    // convert-spaces-to-tabs.ts
    'convert-spaces-to-tabs': {
      'name': '空格转为制表符',
      'description': '将前导空格转换为制表符',
      'tabsize': {
        'name': '制表符宽度',
        'description': '制表符对应的空格数量',
      },
    },
    // dedupe-yaml-array-values.ts
    'dedupe-yaml-array-values': {
      'name': 'YAML 值去重',
      'description': '去重时区分大小写',
      'dedupe-alias-key': {
        'name': 'YAML aliases 去重',
        'description': '打开以对 YAML aliases 去重',
      },
      'dedupe-tag-key': {
        'name': 'YAML tags 去重',
        'description': '打开以对 YAML tags 去重',
      },
      'dedupe-array-keys': {
        'name': 'YAML array 去重',
        'description': '打开以对普通 YAML 数组中的值去重',
      },
      'ignore-keys': {
        'name': '要忽略的 YAML 键',
        'description': '要忽略的 YAML 键列表，每行一个键',
      },
    },
    // default-language-for-code-fences.ts
    'default-language-for-code-fences': {
      'name': '代码块默认语言',
      'description': '为没有指定语言的代码块添加默认语言。',
      'default-language': {
        'name': '编程语言',
        'description': '留空不进行任何操作。可以在<a href="https://prismjs.com/#supported-languages">这里</a>找到语言标签。',
      },
    },
    // emphasis-style.ts
    'emphasis-style': {
      'name': '突出样式',
      'description': '保持突出样式一致性',
      'style': {
        'name': '样式',
        'description': '用于表示突出内容的样式',
      },
    },
    // empty-line-around-blockquotes.ts
    'empty-line-around-blockquotes': {
      'name': '引用块前后空行',
      'description': '确保引用块前后有空行，除非它在文档的开头或结尾。<b>注意，这里嵌套引用块也会有对应的空行</b>',
    },
    // empty-line-around-code-fences.ts
    'empty-line-around-code-fences': {
      'name': '代码块前后空行',
      'description': '确保代码块前后有空行，除非它在文档的开头或结尾',
    },
    // empty-line-around-math-block.ts
    'empty-line-around-math-blocks': {
      'name': 'Latex 块前后空行',
      'description': '确保 Latex 前后有空行，根据<b> Latex 块标记符 $ 数量</b>来确定单行 Latex 是否被认定为 Latex 块',
    },
    // empty-line-around-tables.ts
    'empty-line-around-tables': {
      'name': '表格前后空行',
      'description': '确保表格前后有空行，除非它在文档的开头或结尾',
    },
    // escape-yaml-special-characters.ts
    'escape-yaml-special-characters': {
      'name': '转义 YAML 特殊字符',
      'description': '转义 YAML 中的冒号(:)，单引号 (\') 和双引号 (")',
      'try-to-escape-single-line-arrays': {
        'name': '尝试转义单行数组',
        'description': '尝试转义数组值，假设数组以 "[" 开头， "]" 结尾，并且由 "," 分隔',
      },
    },
    // file-name-heading.ts
    'file-name-heading': {
      'name': '文件名作为标题',
      'description': '如果没有 H1 标题，则插入文件名作为 H1 标题',
    },
    // footnote-after-punctuation.ts
    'footnote-after-punctuation': {
      'name': '脚注引用移至标点符号后',
      'description': '将脚注引用移至标点符号后',
    },
    // force-yaml-escape.ts
    'force-yaml-escape': {
      'name': '强制 YAML 转义',
      'description': '转义指定 YAML 键的值',
      'force-yaml-escape-keys': {
        'name': '要强制转移的 YAML 键',
        'description': '如果未转义，则使用 YAML 转义字符对指定 YAML 键进行转义，每个键一行。 不要对 YAML 数组使用',
      },
    },
    // format-tags-in-yaml.ts
    'format-tags-in-yaml': {
      'name': '格式化 YAML 中的 tags',
      'description': '把 YAML Front-matter 中 tag 的井号删除，因为井号会使 tag 无效',
    },
    // format-yaml-array.ts
    'format-yaml-array': {
      'name': '格式化 YAML 数组',
      'description': '允许将常规 YAML 数组格式化为多行或单行，并允许部分数组(<code>tags</code>, <code>aliases</code>) 保留 Obsidian 原有的 YAML 格式。请注意，单字符串转换为单行，如果存在多个条目，则会变为单行数组。对于单字符串转换为多行，情况也是如此，只是它变成了多行数组',
      'alias-key': {
        'name': '格式化 YAML aliases',
        'description': '打开 YAML aliases 部分的格式设置。不应与规则<code>YAML 标题别名</code>同时启用，因为它们可能不会很好地协同工作，或者它们可能有不同的格式样式选择，从而导致意外结果',
      },
      'tag-key': {
        'name': '格式化 YAML tags',
        'description': '打开 YAML tags 部分的格式设置',
      },
      'default-array-style': {
        'name': '默认的 YAML 数组格式',
        'description': '除了 tags, aliases 或将键值强制为单行数组和将键值强制为多行数组之外，其他为常规 YAML 数组的样式',
      },
      'default-array-keys': {
        'name': '格式化 YAML 数组',
        'description': '对 YAML 数组进行格式化',
      },
      'force-single-line-array-style': {
        'name': '强制转为单行数组',
        'description': '强制将指定键的 YAML 数组转为单行数组，按行分隔（留空以禁用此选项）',
      },
      'force-multi-line-array-style': {
        'name': '强制转为多行数组',
        'description': '强制将指定键的 YAML 数组转为多行数组，按行分隔（留空以禁用此选项）',
      },
    },
    // header-increment.ts
    'header-increment': {
      'name': '标题级别递增',
      'description': '标题一次仅递增一个级别',
      'start-at-h2': {
        'name': '从 H2 标题开始递增',
        'description': '使 H2 标题成为文件中的最高标题级别，其他级别的标题进行相应的递推',
      },
    },
    // heading-blank-lines.ts
    'heading-blank-lines': {
      'name': '标题前后空行',
      'description': '确保标题前后有一个空行，除非它在文档的开头或结尾',
      'bottom': {
        'name': '标题后空行',
        'description': '在标题后插入一个空行',
      },
      'empty-line-after-yaml': {
        'name': 'YAML 与标题之间的空行',
        'description': '保留 YAML Front-matter 和标题之间的空行',
      },
    },
    // headings-start-line.ts
    'headings-start-line': {
      'name': '标题对齐行首',
      'description': '将标题前的空格删除，使标题能被正确识别',
    },
    // insert-yaml-attributes.ts
    'insert-yaml-attributes': {
      'name': '插入 YAML 属性',
      'description': '把指定的 YAML 键插入到 YAML Front-matter 中。每个键占一行',
      'text-to-insert': {
        'name': '要插入的键',
        'description': '要插入到 YAML Front-matter 中的键',
      },
    },
    // line-break-at-document-end.ts
    'line-break-at-document-end': {
      'name': '文件结尾换行',
      'description': '确保文档结尾有一行空行',
    },
    // move-footnotes-to-the-bottom.ts
    'move-footnotes-to-the-bottom': {
      'name': '脚注移至文档底部',
      'description': '将所有脚注移动到文档底部',
    },
    // move-math-block-indicators-to-their-own-line.ts
    'move-math-block-indicators-to-their-own-line': {
      'name': '格式化 Latex 块标记',
      'description': '将 Latex 块标记移到新行。根据<b> Latex 块标记符 $ 数量</b>来确定单行 Latex 是否被认定为 Latex 块',
    },
    // move-tags-to-yaml.ts
    'move-tags-to-yaml': {
      'name': '将 tags 移至 YAML',
      'description': '将文档内所有的 tags 移动到 YAML Front-matter 内',
      'how-to-handle-existing-tags': {
        'name': '如何处理原有的 tag',
        'description': '对于文档中非被忽略的 tag，移动到 YAML Front-matter 后应该采取何种操作？',
      },
      'tags-to-ignore': {
        'name': '忽略的 tag',
        'description': '这些 tags 不会被移动 YAML Front-matter 中。每个 tag 按行分隔，不要包含<code>#</code>',
      },
    },
    // no-bare-urls.ts
    'no-bare-urls': {
      'name': '禁止原始 URL',
      'description': '用尖括号包围原始 URL，除非 URL 在反引号、方括号或单引号/双引号范围内',
      'no-bare-uris': {
        'name': '禁止原始 URI',
        'description': '用尖括号包围原始 URI，除非 URI 在反引号、方括号或单引号/双引号范围内',
      },
    },
    // ordered-list-style.ts
    'ordered-list-style': {
      'name': '有序列表样式',
      'description': '确保有序列表遵循指定的样式。请注意，2个空格或1个制表符被视为一个缩进级别',
      'number-style': {
        'name': '排序方式',
        'description': '有序列表序号格式化方式',
      },
      'list-end-style': {
        'name': '有序列表标志样式',
        'description': '有序列表标志样式',
      },
      'preserve-start': {
        'name': '保留起始值',
        'description': '是否保留有序列表的起始值',
      },
    },
    // paragraph-blank-lines.ts
    'paragraph-blank-lines': {
      'name': '段落空行',
      'description': '每个段落前后保证有且仅有一行空行',
    },
    // prevent-double-checklist-indicator-on-paste.ts
    'prevent-double-checklist-indicator-on-paste': {
      'name': '防止重复的清单标记',
      'description': '粘贴时，如果光标所在行有清单标记，则从要粘贴的文本中移除清单标记',
    },
    // prevent-double-list-item-indicator-on-paste.ts
    'prevent-double-list-item-indicator-on-paste': {
      'name': '防止重复的列表标记',
      'description': '粘贴时，如果光标所在行有列表标志，则从要粘贴的文本中移除列表标志',
    },
    // proper-ellipsis-on-paste.ts
    'proper-ellipsis-on-paste': {
      'name': '更正省略号',
      'description': '粘贴时，用省略号替换三个连续的点（点之间有空格也会生效）',
    },
    // proper-ellipsis.ts
    'proper-ellipsis': {
      'name': '更正省略号',
      'description': '用省略号替换三个连续的点',
    },
    // quote-style.ts
    'quote-style': {
      'name': '引号样式',
      'description': '格式化正文内容中的引号样式为单引号或双引号',
      'single-quote-enabled': {
        'name': '启用单引号样式',
        'description': '指定应使用选定的单引号样式',
      },
      'single-quote-style': {
        'name': '单引号样式',
        'description': '要使用的单引号样式',
      },
      'double-quote-enabled': {
        'name': '启用双引号样式',
        'description': '指定应使用选定的双引号样式',
      },
      'double-quote-style': {
        'name': '双引号样式',
        'description': '要使用的双引号样式',
      },
    },
    // re-index-footnotes.ts
    're-index-footnotes': {
      'name': '脚注重新索引',
      'description': '基于出现的顺序对脚注重新索引。<b>注意，如果一个引用对应多条脚注，则此规则失效</b>',
    },
    // remove-consecutive-list-markers.ts
    'remove-consecutive-list-markers': {
      'name': '移除重复的列表标志',
      'description': '移除重复的列表标志。复制粘贴列表项时很有用',
    },
    // remove-empty-lines-between-list-markers-and-checklists.ts
    'remove-empty-lines-between-list-markers-and-checklists': {
      'name': '移除列表和 checklist 项目之间的空行',
      'description': '列表和 checklist 项目之间不应有空行',
    },
    // remove-empty-list-markers.ts
    'remove-empty-list-markers': {
      'name': '移除空的列表标志',
      'description': '移除空的列表标志，比如列表后没内容',
    },
    // empty-line-around-horizontal-rules.ts
    'empty-line-around-horizontal-rules': {
      'name': '分隔线前后空行',
      'description': '确保分隔线前后有空行，除非它在文档的开头或结尾',
    },
    // remove-hyphenated-line-breaks.ts
    'remove-hyphenated-line-breaks': {
      'name': '移除连字符',
      'description': '移除中划线连字符。从文章中粘贴时很有用',
    },
    // remove-hyphens-on-paste.ts
    'remove-hyphens-on-paste': {
      'name': '移除连字符',
      'description': '粘贴时，从要粘贴的文本中移除连字符',
    },
    // remove-leading-or-trailing-whitespace-on-paste.ts
    'remove-leading-or-trailing-whitespace-on-paste': {
      'name': '移除前导或尾随空格',
      'description': '粘贴时，从要粘贴的文本中移除任何前导非制表符空格和所有尾随空格',
    },
    // remove-leftover-footnotes-from-quote-on-paste.ts
    'remove-leftover-footnotes-from-quote-on-paste': {
      'name': '移除脚注引用',
      'description': '粘贴时，从要粘贴的文本中移除脚注引用',
    },
    // remove-link-spacing.ts
    'remove-link-spacing': {
      'name': '移除链接空格',
      'description': '移除链接文本首尾的空格',
    },
    // remove-multiple-blank-lines-on-paste.ts
    'remove-multiple-blank-lines-on-paste': {
      'name': '移除重复空行',
      'description': '粘贴时，从要粘贴的文本中将多个空行压缩为一个空行',
    },
    // remove-multiple-spaces.ts
    'remove-multiple-spaces': {
      'name': '移除重复空格',
      'description': '移除两个或更多连续的空格，忽略行首和行尾的空格',
    },
    // remove-space-around-characters.ts
    'remove-space-around-characters': {
      'name': '移除字符周围的空格',
      'description': '确保某些字符周围没有空格（包括单个空格或制表符）。<b>注意，这可能会在某些情况下影响 markdown 格式</b>',
      'include-fullwidth-forms': {
        'name': '包括全角形式',
        'description': '包括<a href="https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)">全角形式Unicode块</a>',
      },
      'include-cjk-symbols-and-punctuation': {
        'name': '包括CJK符号和标点',
        'description': '包括<a href="https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation">CJK符号和标点Unicode块</a>',
      },
      'include-dashes': {
        'name': '包括破折号',
        'description': '包括 en dash (–) 和 em dash (—)',
      },
      'other-symbols': {
        'name': '其他符号',
        'description': '要包括的其他符号',
      },
    },
    // remove-space-before-or-after-characters.ts
    'remove-space-before-or-after-characters': {
      'name': '移除字符前后的空格',
      'description': '移除指定字符之前和指定字符之后的空格。 <b>注意，在某些情况下，这可能会导致 markdown 格式出现问题</b>',
      'characters-to-remove-space-before': {
        'name': '移除字符前的空格',
        'description': '移除指定字符前的空格。 <b>注意，在字符列表中使用<code>{</code>或<code>}</code>会意外影响文件，因为它在程序后台的忽略语法中使用</b>',
      },
      'characters-to-remove-space-after': {
        'name': '移除字符后的空格',
        'description': '移除指定字符后的空格。 <b>注意，在字符列表中使用<code>{</code>或<code>}</code>会意外影响文件，因为它在程序后台的忽略语法中使用</b>',
      },
    },
    // remove-trailing-punctuation-in-heading.ts
    'remove-trailing-punctuation-in-heading': {
      'name': '移除标题中的结尾标点符号',
      'description': '从标题的末尾删除指定的标点符号，不会删除 <a href="https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references">HTML 字符实体</a>末尾的分号',
      'punctuation-to-remove': {
        'name': '要删除的结尾标点符号',
        'description': '要从文件标题结尾中删除的标点符号',
      },
    },
    // remove-yaml-keys.ts
    'remove-yaml-keys': {
      'name': '移除 YAML 键',
      'description': '移除指定的 YAML 键',
      'yaml-keys-to-remove': {
        'name': '需要移除的 YAML 键',
        'description': '要从 YAML Front-matter 中删除的 YAML 键 （可带或不带冒号）',
      },
    },
    // sort-yaml-array-values.ts
    'sort-yaml-array-values': {
      'name': 'YAML 值排序',
      'description': '基于指定规则对 YAML 值排序',
      'sort-alias-key': {
        'name': 'YAML aliases 排序',
        'description': '打开以对 YAML aliases 排序',
      },
      'sort-tag-key': {
        'name': 'YAML tags 排序',
        'description': '打开以对 YAML tags 排序',
      },
      'sort-array-keys': {
        'name': 'YAML array 排序',
        'description': '打开以对普通 YAML 数组中的值排序',
      },
      'ignore-keys': {
        'name': '要忽略的 YAML 键',
        'description': '要忽略的 YAML 键列表，每行一个键',
      },
      'sort-order': {
        'name': '排序方式',
        'description': '排序方式',
      },
    },
    // space-after-list-markers.ts
    'space-after-list-markers': {
      'name': '列表标志空格',
      'description': '列表标志和 checkbox 后应有一个空格',
    },
    // space-between-chinese-japanese-or-korean-and-english-or-numbers.ts
    'space-between-chinese-japanese-or-korean-and-english-or-numbers': {
      'name': '中日韩语与英语或数字之间的空格',
      'description': '确保中日韩文与英文数字之间有一个空格 <a href="https://github.com/sparanoid/chinese-copywriting-guidelines">参考链接</a>',
      'english-symbols-punctuation-before': {
        'name': 'English Punctuations and Symbols Before CJK',
        'description': '被认为是英文的在中日韩文字符之"前"找到的非字母标点符号 <b>注意: "*" 会被认为是英文</b>',
      },
      'english-symbols-punctuation-after': {
        'name': 'English Punctuations and Symbols After CJK',
        'description': '被认为是英文的在中日韩文字符之"后"找到的非字母标点符号 <b>注意: "*" 会被认为是英文</b>',
      },
    },
    // strong-style.ts
    'strong-style': {
      'name': '粗体样式',
      'description': '确保粗体样式一致',
      'style': {
        'name': '样式',
        'description': '用于表示粗体的样式',
      },
    },
    // trailing-spaces.ts
    'trailing-spaces': {
      'name': '末尾空格',
      'description': '移除每行末尾多余的空格',
      'two-space-line-break': {
        'name': '两空格换行',
        'description': '忽略两个空格后接换行符的情况（"两空格规则"）',
      },
    },
    // two-spaces-between-lines-with-content.ts
    'two-spaces-between-lines-with-content': {
      'name': '不同内容间换行',
      'description': '确保在段落、引用和列表项之间，每块内容的末尾有两个空格',
      'line-break-indicator': {
        'name': '换行标记',
        'description': '要使用的换行标记',
      },
    },
    // unordered-list-style.ts
    'unordered-list-style': {
      'name': '无序列表样式',
      'description': '确保无序列表符合指定的样式',
      'list-style': {
        'name': '列表项样式',
        'description': '列表项需要指定的样式',
      },
    },
    // yaml-key-sort.ts
    'yaml-key-sort': {
      'name': 'YAML 键排序',
      'description': '根据指定的顺序和优先级对 YAML 键进行排序。<b>注意，也许也会删除空行</b>',
      'yaml-key-priority-sort-order': {
        'name': 'YAML 键优先级排序顺序',
        'description': '对键进行排序的顺序，每行一个键，按列表中的顺序进行排序',
      },
      'priority-keys-at-start-of-yaml': {
        'name': '排序键放在 YAML 开头',
        'description': '按照 <code>YAML 键优先级排序顺序</code>将键放于 YAML Front-matter 开头',
      },
      'yaml-sort-order-for-other-keys': {
        'name': 'YAML 其它键的排序顺序',
        'description': '对 <code>YAML 键优先级排序顺序</code>中未找到的键进行排序',
      },
    },
    // yaml-timestamp.ts
    'yaml-timestamp': {
      'name': 'YAML 时间戳',
      'description': '在 YAML Front-matter 中记录上次编辑文档的日期。从文档元数据中获取日期数据',
      'date-created': {
        'name': '创建日期',
        'description': '插入文件的创建日期',
      },
      'date-created-key': {
        'name': '创建日期键名',
        'description': '使用哪个 YAML 键来表示创建日期',
      },
      'date-created-source-of-truth': {
        'name': '创建日期数据源',
        'description': '如果 YAML Front-matter 中已经有创建时间，从哪里获取创建时间新值',
      },
      'date-modified-source-of-truth': {
        'name': '修改日期数据源',
        'description': '如果 YAML Front-matter 中已经有修改日期，从哪里获取修改时间新值',
      },
      'date-modified': {
        'name': '修改日期',
        'description': '插入文件的最近一次的修改日期',
      },
      'date-modified-key': {
        'name': '修改日期键名',
        'description': '使用哪个 YAML 键来表示修改日期',
      },
      'format': {
        'name': '格式',
        'description': 'Moment.js 语法格式 <a href="https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/">说明</a>）',
      },
      'convert-to-utc': {
        'name': '本地时间转为 UTC 时间',
        'description': '本地时间转为 UTC 时间',
      },
      'update-on-file-contents-updated': {
        'name': '文件内容变化时更新 YAML 时间戳',
        'description': '当前活动笔记被修改时，<code>修改日期</code>将会实时更新。',
      },
    },
    // yaml-title-alias.ts
    'yaml-title-alias': {
      'name': 'YAML 标题别名',
      'description': '将文档的标题插入 YAML Front-matter 的 aliases 部分。从第一个 H1 标题或文档名中获取值',
      'preserve-existing-alias-section-style': {
        'name': '保留现有别名部分样式',
        'description': '如果设置，此项仅在新创建的别名部分生效',
      },
      'keep-alias-that-matches-the-filename': {
        'name': '确保别名与文件名匹配',
        'description': '这样的别名通常是冗余的',
      },
      'use-yaml-key-to-keep-track-of-old-filename-or-heading': {
        'name': '使用 YAML 键 <code>linter-yaml-title-alias</code> 来保留标题修改记录',
        'description': '如果设置，当第一个 H1 标题更改或文档名更改时，此键中存储的旧 aliases 将替换为新值，而不仅仅是在 aliases 中插入新条目',
      },
      'alias-helper-key': {
        'name': '别名辅助键',
        'description': '此键用于保存标题别名历史',
      },
    },
    // yaml-title.ts
    'yaml-title': {
      'name': 'YAML 标题',
      'description': '根据指定模式，将文件的标题插入到 YAML Front-matter 中',
      'title-key': {
        'name': '标题键',
        'description': '标题使用哪一个 YAML 键',
      },
      'mode': {
        'name': '模式',
        'description': '用于获取标题的方法',
      },
    },
  },

  // These are the string values in the UI for enum values and thus they do not follow the key format as used above
  'enums': {
    'Title Case': '每词首字母大写',
    'ALL CAPS': '全部大写',
    'First letter': '仅首字母大写',
    '.': '.', // leave as is
    ')': ')', // leave as is
    'ERROR': 'ERROR',
    'TRACE': 'TRACE',
    'DEBUG': 'DEBUG',
    'INFO': 'INFO',
    'WARN': 'WARN',
    'SILENT': 'SILENT',
    'ascending': '升序',
    'lazy': '全为1',
    'preserve': '保持原样',
    'Nothing': '无',
    'Remove hashtag': '移除 hashtag',
    'Remove whole tag': '移除整个 tag',
    'asterisk': '星号(*)',
    'underscore': '下划线(_)',
    'consistent': '保持一致',
    '-': '-', // leave as is
    '*': '*', // leave as is
    '+': '+', // leave as is
    'space': '有空格',
    'no space': '无空格',
    'None': '无',
    'Ascending Alphabetical': '按字母顺序升序',
    'Descending Alphabetical': '按字母顺序降序',
    // yaml.ts
    'multi-line': '多行数组',
    'single-line': '单行数组',
    'single string to single-line': '字符串转单行数组',
    'single string to multi-line': '字符串转多行数组',
    'single string comma delimited': '逗号分隔字符串',
    'single string space delimited': '空格分隔字符串',
    'single-line space delimited': '空格分隔单行数组',
    // yaml-title.ts
    'first-h1': '第一个 H1 标题',
    'first-h1-or-filename-if-h1-missing': '第一个 H1 标题或文件名（第一个 H1 标题不存在时）',
    'filename': '文件名',
    // settings-data.ts
    'never': 'Never',
    'after 5 seconds': '5 秒后',
    'after 10 seconds': '10 秒后',
    'after 15 seconds': '15 秒后',
    'after 30 seconds': '30 秒后',
    'after 1 minute': '1 分钟后',
    // yaml-timestamp.ts
    'file system': '系统',
    'frontmatter': 'YAML Front-matter',
    'user or Linter edits': 'Obsidian',
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

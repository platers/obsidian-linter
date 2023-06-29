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
      'errors-message-singular': '已格式化所有文件，但有 1 个错误',
      'errors-message-plural': '已格式化所有文件，但有 {NUM} 个错误',
      'start-message': '这将编辑所有文件，包括子文件夹中的文件，可能会引入错误',
      'submit-button-text': '格式化所有文件',
      'submit-button-notice-text': '正在格式化所有文件...',
    },
    'lint-all-files-in-folder': {
      'name': '格式化文件夹中的所有文件',
      'start-message': '这将编辑 {FOLDER_NAME} 文件夹中的所有文件，包括子文件夹中的文件，可能会引入错误',
      'submit-button-text': '格式化 {FOLDER_NAME} 文件夹中的所有文件',
      'submit-button-notice-text': '正在格式化 {FOLDER_NAME} 文件夹中的所有文件...',
      'error-message': '格式化文件夹中的所有文件时出错',
      'success-message': '已格式化 {FOLDER_NAME} 文件夹中的所有 {NUM} 个文件',
      'message-singular': '已格式化 {FOLDER_NAME} 文件夹中的所有 {NUM} 个文件，但有 1 个错误',
      'message-plural': '已格式化 {FOLDER_NAME} 中的 {FILE_COUNT} 个文件，但有 {ERROR_COUNT} 个错误.',
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
    'linter-run': '正在运行Linter',
    'paste-link-warning': '中止粘贴 lint 因为剪贴板内容是一个链接，这样做将避免与其他修改粘贴的插件发生冲突',
    'see-console': '请查看控制台以获取更多信息',
    'unknown-error': '格式化过程发生未知错误',
    'moment-locale-not-found': '尝试通过 Moment.js 切换到 {MOMENT_LOCALE}, 实际切换到 {CURRENT_LOCALE}',

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
    'missing-footnote-error-message': `脚注 “{FOOTNOTE}” 在脚注内容之前没有对应的脚注引用，无法处理。请确保所有脚注在脚注内容之前都有相应的引用。`,
    'too-many-footnotes-error-message': `脚注 '{FOOTNOTE_KEY}' 有超过1个脚注引用，请更新脚注使得一个脚注编号对应一个脚注`,

    // rules.ts
    'wrapper-yaml-error': 'yaml出现错误: {ERROR_MESSAGE}',
    'wrapper-unknown-error': '未知错误: {ERROR_MESSAGE}',

    // quote-style.ts
    'uneven-amount-of-quotes': '`{QUOTE}` 引号在文件中的实例不是偶数，所以我们无法将直引号转换为弯引号',
  },

  'notice-text': {
    'empty-clipboard': '剪贴板内容为空',
    'characters-added': '字符已添加',
    'characters-removed': '字符已移除',
  },

  // rule-alias-suggester.ts
  'all-rules-option': '全部',

  // settings.ts
  'linter-title': 'Linter',
  'empty-search-results-text': '没有匹配的设置项',

  // lint-confirmation-modal.ts
  'warning-text': '警告',
  'file-backup-text': '请确保你已备份文件',

  'tabs': {
    'names': {
      // tab.ts
      'general': '通用设置',
      'custom': '自定义设置',
      'yaml': 'YAML设置',
      'heading': '标题设置',
      'content': '脚注设置',
      'footnote': '内容设置',
      'spacing': '间距设置',
      'paste': '粘贴设置',
      'debug': 'Debug设置',
    },
    // tab-searcher.ts
    'default-search-bar-text': '搜索所有设置项',
    'general': {
      // general-tab.ts
      'lint-on-save': {
        'name': '保存时格式化文件',
        'description': '手动保存时格式化(当按 `Ctrl + S` 时或者使用vim模式 `:w` 时)',
      },
      'display-message': {
        'name': '格式化后显示消息',
        'description': '格式化后显示修改了多少字符',
      },
      'folders-to-ignore': {
        'name': '忽略文件夹',
        'description': '当格式化所有文件或者格式化保存时需要忽略的文件，每行输入一个文件夹路径',
      },
      'override-locale': {
        'name': '覆盖默认地区语言',
        'description': '如果你想使用不同于默认的地区语言需要设置此项',
      },
      'same-as-system-locale': '和系统地区语言 ({SYS_LOCALE}) 一致',
      'yaml-aliases-section-style': {
        'name': 'YAML 别名部分的样式',
        'description': 'YAML aliases 部分的样式',
      },
      'yaml-tags-section-style': {
        'name': 'YAML tags 部分的样式',
        'description': 'YAML tags 部分的样式',
      },
      'default-escape-character': {
        'name': '默认转义字符',
        'description': '当单引号和双引号不存在时用于转义 YAML 值的默认字符',
      },
      'remove-unnecessary-escape-chars-in-multi-line-arrays': {
        'name': '当使用多行数组格式时删除不必要的转义字符',
        'description': '多行 YAML 数组的转义字符不需要与单行数组相同的转义，因此在多行格式时，删除不必要的额外转义',
      },
      'number-of-dollar-signs-to-indicate-math-block': {
        'name': '指示数学块的 $ 符号数量',
        'description': '将数学内容视为数学块而不是内联数学的 $ 符号的数量',
      },
    },
    'debug': {
      // debug-tab.ts
      'log-level': {
        'name': '日志级别',
        'description': '允许打印的日志类型，默认是 ERROR',
      },
      'linter-config': {
        'name': '格式化设置',
        'description': '在设置页面加载时，Linter 的 data.json 的内容',
      },
      'log-collection': {
        'name': '在保存时格式化和格式化当前文档时收集日志',
        'description': '在保存时格式化和格式化当前文档时收集日志。这些日志有助于调试和创建错误报告。',
      },
      'linter-logs': {
        'name': 'Linter 日志',
        'description': '如果开启，则最后一次格式化时保存或者格式化当前文档时生成日志日志',
      },
    },
  },

  'options': {
    'custom-command': {
      // custom-command-option.ts
      'name': '自定义命令',
      'description': '自定义命令是在 linter 完成运行其常规规则后运行的 Obsidian 命令。这意味着它们不会在 YAML 时间戳逻辑运行之前运行，因此它们可能会导致在下次运行 linter 时触发 YAML 时间戳。您只能选择一次 Obsidian 命令。**_注意 这目前仅适用于检查当前文件._**',
      'warning': '选择选项时，请确保使用鼠标或按回车键选择该选项。其他选择方法可能不起作用，只会保存实际 Obsidian 命令或空字符串的选择。',

      'add-input-button-text': '添加新命令',
      'command-search-placeholder-text': 'Obsidian 命令',
      'move-up-tooltip': '上移',
      'move-down-tooltip': '下移',
      'delete-tooltip': '删除',
    },
    'custom-replace': {
      // custom-replace-option.ts
      'name': '自定义正则表达式替换',
      'description': '自定义正则表达式替换可用于将查找正则表达式匹配的任何内容替换为替换值。替换和查找值必须是有效的正则表达式值',
      'warning': '如果您不知道正则表达式，请谨慎使用它。另外，请确保您不要在iOS移动设备上的正则表达式中使用回溯，因为这会导致格式化失败，因为该平台不支持',
      'add-input-button-text': '添加新的正则替换',
      'regex-to-find-placeholder-text': '正则查找',
      'flags-placeholder-text': 'flags',
      'regex-to-replace-placeholder-text': '正则替换',
      'label-placeholder-text': '标签',
      'move-up-tooltip': '上移',
      'move-down-tooltip': '下移',
      'delete-tooltip': '删除',
    },
  },

  // rules
  'rules': {
    // auto-correct-common-misspellings.ts
    'auto-correct-common-misspellings': {
      'name': '自动更正常见的拼写错误',
      'description': '使用常见拼写错误的字典自动将它们转换为正确的拼写。有关自动更正单词的完整列表，请参阅 [auto-correct map](https://github.com/platers/obsidian-linter/tree/master/src/utils/auto-correct-misspellings.ts)',
      'ignore-words': {
        'name': '忽略单词',
        'description': '以逗号分隔的小写单词列表，在自动更正时会忽略',
      },
    },
    // blockquotify-on-paste.ts
    'add-blockquote-indentation-on-paste': {
      'name': '粘贴时添加块引用(blockquote)缩进',
      'description': '在粘贴过程中光标位于块引用/标注行中时，将块引用添加到除第一行以外的所有行',
    },
    // blockquote-style.ts
    'blockquote-style': {
      'name': '块引用样式',
      'description': '确保块引用样式一致。',
      'style': {
        'name': '风格',
        'description': '块引用指示器上使用的样式',
      },
    },
    // capitalize-headings.ts
    'capitalize-headings': {
      'name': '大写标题(Headdings)',
      'description': '标题会在格式化后大写',
      'style': {
        'name': '样式',
        'description': '大写的方式',
      },
      'ignore-case-words': {
        'name': '忽略大小写的单词',
        'description': '仅将标题大小写样式应用于全部小写的单词',
      },
      'ignore-words': {
        'name': '忽略单词',
        'description': '大写时要忽略的以逗号分隔的单词列表',
      },
      'lowercase-words': {
        'name': '小写的单词',
        'description': '保持小写以逗号分隔的单词列表',
      },
    },
    // compact-yaml.ts
    'compact-yaml': {
      'name': '精简YAML',
      'description': '移除YAML前后的空行',
      'inner-new-lines': {
        'name': '内部新行',
        'description': '删除不在 YAML 开头或结尾的新行',
      },
    },
    // consecutive-blank-lines.ts
    'consecutive-blank-lines': {
      'name': '连续空白行',
      'description': '最多应该有一个连续的空行',
    },
    // convert-bullet-list-markers.ts
    'convert-bullet-list-markers': {
      'name': '转换子弹列表标记',
      'description': '将常用 bullet list 列表标记转换为 Markdown 列表标记',
    },
    // convert-spaces-to-tabs.ts
    'convert-spaces-to-tabs': {
      'name': '转换空格为制表符',
      'description': '将行首空格转换为制表符',
      'tabsize': {
        'name': '制表符宽度',
        'description': '对应的空格数量转变为制表符',
      },
    },
    // emphasis-style.ts
    'emphasis-style': {
      'name': '强调风格',
      'description': '用于确保强调的风格一致',
      'style': {
        'name': '风格',
        'description': '用于表示强调内容的风格',
      },
    },
    // empty-line-around-blockquotes.ts
    'empty-line-around-blockquotes': {
      'name': '引用块 Blockquotes 前后空行',
      'description': '确保引用块 Blockquote前后有空行，除非它在文档的开头和结尾。**注意，这里嵌套块引用也会有对应的空行**',
    },
    // empty-line-around-code-fences.ts
    'empty-line-around-code-fences': {
      'name': '代码块前后空行',
      'description': '确保代码块前后有空行，除非它在文档的开头或结尾',
    },
    // empty-line-around-math-block.ts
    'empty-line-around-math-blocks': {
      'name': '数学块前后空行',
      'description': '确保数学块前后有空行，使用“表示数学块的美元符号数”来确定单行数学的数学块的美元符号数。',
    },
    // empty-line-around-tables.ts
    'empty-line-around-tables': {
      'name': '表格前后空行',
      'description': '确保 github 风格的表格前后有空行，除非它在文档的开始或结尾',
    },
    // escape-yaml-special-characters.ts
    'escape-yaml-special-characters': {
      'name': '转义YAML特殊字符',
      'description': '转义YAML中的冒号（: ），单引号（\'）和双引号（"）。',
      'try-to-escape-single-line-arrays': {
        'name': '尝试转义单行数组',
        'description': '尝试转义数组值，假设一个数组以“[”开头，“]”结尾，并且具有由“，”分隔的项。',
      },
    },
    // file-name-heading.ts
    'file-name-heading': {
      'name': '文件名作为标题',
      'description': '如果没有H1标题，则插入文件名作为H1标题。',
    },
    // footnote-after-punctuation.ts
    'footnote-after-punctuation': {
      'name': '标点符号后脚注',
      'description': '确保脚注引用置于标点符号之后，而不是之前。',
    },
    // force-yaml-escape.ts
    'force-yaml-escape': {
      'name': '强制YAML转义',
      'description': '转义指定YAML键的值。',
      'force-yaml-escape-keys': {
        'name': '强制对YAML键进行转义',
        'description': '如果未转义，则使用YAML转义字符对由换行符分隔的指定YAML键进行转义。 不要在YAML数组上使用它。',
      },
    },
    // format-tags-in-yaml.ts
    'format-tags-in-yaml': {
      'name': '格式化YAML中的标签',
      'description': '从YAML前置语言中的标签中去除井号，因为它们会使标签无效。',
    },
    // format-yaml-array.ts
    'format-yaml-array': {
      'name': '格式化YAML数组',
      'description': '允许将常规YAML数组格式化为多行或单行，并允许有些Obsidian特定的YAML格式可以用作“tags”和“aliases”。请注意，单字符串转换为单行，如果存在多个条目，则会变为单行数组。对于单字符串转换为多行，情况也是如此，只是它变成了多行数组。',
      'alias-key': {
        'name': '格式化yaml别名部分',
        'description': '打开了YAML别名部分的格式设置。不应与规则`YAML Title Alias`同时启用，因为它们可能不会很好地协同工作，或者它们可能有不同的格式样式选择，从而导致意外结果。',
      },
      'tag-key': {
        'name': '格式化yaml标签部分',
        'description': '打开YAML标签部分的格式设置。',
      },
      'default-array-style': {
        'name': '默认的yaml数组部分格式',
        'description': '除了标签，别名或将键值强制为单行数组和将键值强制为多行数组之外，其他为常规 yaml 数组的样式。',
      },
      'default-array-keys': {
        'name': '格式化常规yaml数组部分',
        'description': '对常规YAML数组打开格式设置',
      },
      'force-single-line-array-style': {
        'name': '将键值强制为单行数组',
        'description': '强制将新行分隔的键的YAML数组格式为单行格式（留空以禁用此选项）',
      },
      'force-multi-line-array-style': {
        'name': '将键值强制为多行数组',
        'description': '强制将新行分隔的键的YAML数组格式为多行格式（留空以禁用此选项）',
      },
    },
    // header-increment.ts
    'header-increment': {
      'name': '标题级别递增',
      'description': '标题级别应仅一次递增一个级别',
      'start-at-h2': {
        'name': '从第二级标题开始递增',
        'description': '使第二级标题成为文件中的最小标题级别，从而可相应地调整所有标题，以便它们从第二级标题开始递增。',
      },
    },
    // heading-blank-lines.ts
    'heading-blank-lines': {
      'name': '标题空行',
      'description': '所有标题前后均有一个空行（除非标题位于文档开头或结尾处）。',
      'bottom': {
        'name': '底部',
        'description': '在标题后插入一个空行',
      },
      'empty-line-after-yaml': {
        'name': 'Yaml 与标题之间的空行',
        'description': '保留 Yaml 前置内容与标题之间的空行',
      },
    },
    // headings-start-line.ts
    'headings-start-line': {
      'name': '标题起始行',
      'description': '不以新行开始的标题会将其前面的空白删除，以确保它们能被识别为标题。',
    },
    // insert-yaml-attributes.ts
    'insert-yaml-attributes': {
      'name': '插入 YAML 属性',
      'description': '将给定的 YAML 属性插入到 YAML 前置内容中。每个属性占一行。',
      'text-to-insert': {
        'name': '要插入的文本',
        'description': '要插入到 YAML 前置内容中的文本',
      },
    },
    // line-break-at-document-end.ts
    'line-break-at-document-end': {
      'name': '文件结尾换行',
      'description': '确保文档结尾恰好有一行空行。',
    },
    // move-footnotes-to-the-bottom.ts
    'move-footnotes-to-the-bottom': {
      'name': '移动脚注至底部',
      'description': '移动所有脚注至文档底部',
    },
    // move-math-block-indicators-to-their-own-line.ts
    'move-math-block-indicators-to-their-own-line': {
      'name': '将数学块指示符移到自己的行上',
      'description': '使用“指示数学块所需美元符号数”来确定用多少个美元符号表示单行数学式，将所有起始和结束数学块指示符移到它们自己的行上。',
    },
    // move-tags-to-yaml.ts
    'move-tags-to-yaml': {
      'name': '将标签移至 Yaml',
      'description': '移动所有标签至 Yaml frontmatter',
      'how-to-handle-existing-tags': {
        'name': '如何处理现有的标签',
        'description': '一旦移动到了前置元数据，对于文件正文中的非被忽略标签，应该采取何种操作？',
      },
      'tags-to-ignore': {
        'name': '忽略的标签',
        'description': '这些标签不会被移动到标签数组中，也不会在“从正文内容中移除标签中的井号”启用时从正文内容中移除。每个标签应该单独放在一行上，不要包含“#”。请确保标签名称中不要包含井号。',
      },
    },
    // no-bare-urls.ts
    'no-bare-urls': {
      'name': '禁止裸露URL',
      'description': '除非被反引号、方括号或单引号/双引号包括，否则应将裸露的URL用尖括号包围。',
    },
    // ordered-list-style.ts
    'ordered-list-style': {
      'name': '有序列表样式',
      'description': '确保有序列表遵循指定的样式。请注意，2个空格或1个制表符被视为缩进级别。',
      'number-style': {
        'name': '序号样式',
        'description': '有序列表指示器中使用的序号样式',
      },
      'list-end-style': {
        'name': '有序列表指示器结束样式',
        'description': '有序列表指示器的结束字符',
      },
    },
    // paragraph-blank-lines.ts
    'paragraph-blank-lines': {
      'name': '段落空白行',
      'description': '每个段落前后应该有且仅有一行空白行。',
    },
    // prevent-double-checklist-indicator-on-paste.ts
    'prevent-double-checklist-indicator-on-paste': {
      'name': '防止复制时出现重复的核对列表指示符',
      'description': '如果文件中光标所在行有核对列表指示符，则从要粘贴的文本中移除起始的核对列表指示符。',
    },
    // prevent-double-list-item-indicator-on-paste.ts
    'prevent-double-list-item-indicator-on-paste': {
      'name': '防止复制时出现重复的列表项指示符',
      'description': '如果文件中光标所在行有列表项指示符，则从要粘贴的文本中移除起始的列表指示符。',
    },
    // proper-ellipsis-on-paste.ts
    'proper-ellipsis-on-paste': {
      'name': '正确的省略号',
      'description': '即使要粘贴的文本中它们之间有空格，也用省略号替换三个连续的点。',
    },
    // proper-ellipsis.ts
    'proper-ellipsis': {
      'name': '正确的省略号',
      'description': '用省略号替换三个连续的点。',
    },
    // quote-style.ts
    'quote-style': {
      'name': '引用样式',
      'description': '更新正文内容中的引号以更新为指定的单引号和双引号样式。',
      'single-quote-enabled': {
        'name': '启用`单引号样式`',
        'description': '指定应使用选定的单引号样式。',
      },
      'single-quote-style': {
        'name': '单引号样式',
        'description': '要使用的单引号样式。',
      },
      'double-quote-enabled': {
        'name': '启用`双引号样式`',
        'description': '指定应使用选定的双引号样式。',
      },
      'double-quote-style': {
        'name': '双引号样式',
        'description': '要使用的双引号样式。',
      },
    },
    // re-index-footnotes.ts
    're-index-footnotes': {
      'name': '重新索引脚注',
      'description': '基于出现的顺序重新索引脚注键和脚注（注意：如果一个键有多个脚注，则此规则不适用。）',
    },
    // remove-consecutive-list-markers.ts
    'remove-consecutive-list-markers': {
      'name': '移除连续的列表标记',
      'description': '移除连续的列表标记。复制粘贴列表项时很有用。',
    },
    // remove-empty-lines-between-list-markers-and-checklists.ts
    'remove-empty-lines-between-list-markers-and-checklists': {
      'name': '移除列表标记和核对列表项之间的空行',
      'description': '列表标记和核对列表项之间不应有空行。',
    },
    // remove-empty-list-markers.ts
    'remove-empty-list-markers': {
      'name': '移除空的列表标记',
      'description': '移除空的列表标记，比如列表后没内容。',
    },
    // remove-hyphenated-line-breaks.ts
    'remove-hyphenated-line-breaks': {
      'name': '移除中划线换行符',
      'description': '移除中划线换行符。从教科书中粘贴文本时很有用。',
    },
    // remove-hyphens-on-paste.ts
    'remove-hyphens-on-paste': {
      'name': '移除连字符',
      'description': '从要粘贴的文本中移除连字符。',
    },
    // remove-leading-or-trailing-whitespace-on-paste.ts
    'remove-leading-or-trailing-whitespace-on-paste': {
      'name': '移除粘贴时的前导或尾随空格',
      'description': '移除要粘贴的文本的任何前导非制表符空格和所有尾随空格。',
    },
    // remove-leftover-footnotes-from-quote-on-paste.ts
    'remove-leftover-footnotes-from-quote-on-paste': {
      'name': '移除引用中的剩余脚注',
      'description': '从要粘贴的文本中移除任何剩余的脚注引用。',
    },
    // remove-link-spacing.ts
    'remove-link-spacing': {
      'name': '移除链接间距',
      'description': '移除链接文本周围的间距。',
    },
    // remove-multiple-blank-lines-on-paste.ts
    'remove-multiple-blank-lines-on-paste': {
      'name': '移除粘贴时的多个空白行',
      'description': '将多个空白行压缩为一个空白行以粘贴文本。',
    },
    // remove-multiple-spaces.ts
    'remove-multiple-spaces': {
      'name': '移除多个空格',
      'description': '移除两个或更多连续的空格。忽略行首和行尾的空格。',
    },
    // remove-space-around-characters.ts
    'remove-space-around-characters': {
      'name': '去除字符周围的空格',
      'description': '确保某些字符周围没有空格（包括单个空格或制表符）。请注意，这可能会在某些情况下影响markdown格式。',
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
        'description': '包括en dash (–)和em dash (—)',
      },
      'other-symbols': {
        'name': '其他符号',
        'description': '要包括的其他符号',
      },
    },
    // remove-space-before-or-after-characters.ts
    'remove-space-before-or-after-characters': {
      'name': '删除字符前后的空格',
      'description': '删除指定字符之前和指定字符之后的空格。 请注意，在某些情况下，这可能会导致降价格式出现问题。',
      'characters-to-remove-space-before': {
        'name': '删除字符前的空格',
        'description': '删除指定字符前的空格。 **注意：在字符列表中使用`{`或`}`会意外影响文件，因为它在幕后的忽略语法中使用。**',
      },
      'characters-to-remove-space-after': {
        'name': '删除字符后的空格',
        'description': '删除指定字符后的空格。 **注意：在字符列表中使用`{`或`}`会意外影响文件，因为它在幕后的忽略语法中使用。**',
      },
    },
    // remove-trailing-punctuation-in-heading.ts
    'remove-trailing-punctuation-in-heading': {
      'name': '移除标题中的结尾标点符号',
      'description': '从标题的末尾删除指定的标点符号，确保忽略HTML实体引用末尾的分号。',
      'punctuation-to-remove': {
        'name': '要删除的结尾标点符号',
        'description': '要从文件标题中删除的结尾标点符号。',
      },
    },
    // remove-yaml-keys.ts
    'remove-yaml-keys': {
      'name': '移除 YAML 键',
      'description': '移除特定的 YAML 键',
      'yaml-keys-to-remove': {
        'name': '需要移除的 YAML 键',
        'description': '从带或不带冒号的 yaml frontmatter 中删除的 YAML 键',
      },
    },
    // space-after-list-markers.ts
    'space-after-list-markers': {
      'name': '列表标记后空格',
      'description': '列表标记和复选框后应有一个空格',
    },
    // space-between-chinese-japanese-or-korean-and-english-or-numbers.ts
    'space-between-chinese-japanese-or-korean-and-english-or-numbers': {
      'name': '中文日语或韩语与英语或数字之间的空格',
      'description': '确保中文、日文或韩文和英文或数字由单个空格分隔. [参考链接](https://github.com/sparanoid/chinese-copywriting-guidelines)',
    },
    // strong-style.ts
    'strong-style': {
      'name': '加粗风格',
      'description': '确保加粗风格一致',
      'style': {
        'name': '风格',
        'description': '用于表示加粗的风格',
      },
    },
    // trailing-spaces.ts
    'trailing-spaces': {
      'name': '末尾空格',
      'description': '移除每行末尾多余的空格',
      'twp-space-line-break': {
        'name': '两个空格的换行',
        'description': '忽略两个空格后接换行符的情况（"两个空格规则"）。',
      },
    },
    // two-spaces-between-lines-with-content.ts
    'two-spaces-between-lines-with-content': {
      'name': '内容间隔两个空格',
      'description': '确保在段落、引用和列表项中，被延续到下一行的内容的行末添加两个空格。',
    },
    // unordered-list-style.ts
    'unordered-list-style': {
      'name': '无序列表风格',
      'description': '确保无序列表符合指定的风格',
      'list-style': {
        'name': '列表项风格',
        'description': '列表项需要指定的风格',
      },
    },
    // yaml-key-sort.ts
    'yaml-key-sort': {
      'name': 'YAML 键排序',
      'description': '根据指定的顺序和优先级对 YAML 键进行排序。注意：也许也会删除空白行。',
      'yaml-key-priority-sort-order': {
        'name': 'YAML 键优先级排序顺序',
        'description': '对键进行排序的顺序，每行一个键，按列表中的顺序进行排序',
      },
      'priority-keys-at-start-of-yaml': {
        'name': 'YAML 初始时键的优先级',
        'description': '初始时 YAML 键排序顺序',
      },
      'yaml-sort-order-for-other-keys': {
        'name': 'YAML 其它键的排序顺序',
        'description': '对 YAML 键优先级排序顺序文本区域中未找到的键进行排序',
      },
    },
    // yaml-timestamp.ts
    'yaml-timestamp': {
      'name': 'YAML 时间戳',
      'description': '在 YAML frontmatter 中跟踪上次编辑文档的日期。从文档元数据中获取日期。',
      'date-created': {
        'name': '创建日期',
        'description': '插入文件的创建日期',
      },
      'date-created-key': {
        'name': '创建日期的键',
        'description': '使用哪个 YAML 键来表示创建日期',
      },
      'force-retention-of-create-value': {
        'name': '强制保留创建日期的键值',
        'description': '重用创建日期的 YAML frontmatter 中的值，而不是文档元数据，这对于防止文档元数据更改导致值更改为其他值时非常有用',
      },
      'date-modified': {
        'name': '修改日期',
        'description': '插入文件的最近一次的修改日期',
      },
      'date-modified-key': {
        'name': '修改日期的键',
        'description': '使用哪个 YAML 键来表示修改日期',
      },
      'format': {
        'name': '格式',
        'description': 'Momentjs 语法风格的日期格式 （详情设置见[Moment format options](https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/)',
      },
    },
    // yaml-title-alias.ts
    'yaml-title-alias': {
      'name': 'YAML 标题别名',
      'description': '将文档的标题插入 YAML frontmatter 的别名部分。从第一个 H1 或文档名中获取标题',
      'preserve-existing-alias-section-style': {
        'name': '保留现有别名部分样式',
        'description': '如果设置，此项仅在新创建的别名部分生效',
      },
      'keep-alias-that-matches-the-filename': {
        'name': '确保别名与文件名匹配',
        'description': '这样的别名通常是多余的',
      },
      'use-yaml-key-to-keep-track-of-old-filename-or-heading': {
        'name': '使用 YAML 键 `linter-yaml-title-alias` 帮助更改文档名和标题',
        'description': '如果设置，当第一个 H1 标题更改或文档名（如果第一个 H1 不存在）更改时，则此键中存储的旧别名将替换为新值，而不仅仅是在别名数组中插入新条目',
      },
    },
    // yaml-title.ts
    'yaml-title': {
      'name': 'YAML 标题',
      'description': '将文件的标题插入到 YAML frontmatter 中。 根据所选模式获取标题。',
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
    'Title Case': '标题大小写',
    'ALL CAPS': '全部大写',
    'First letter': '首字母大写',
    '.': '.', // leave as is
    ')': ')', // leave as is
    'ERROR': '错误',
    'TRACE': '跟踪',
    'DEBUG': 'debug',
    'INFO': '信息',
    'WARN': '警告',
    'SILENT': '静默',
    'ascending': '升序',
    'lazy': '懒加载',
    'Nothing': '无',
    'Remove hashtag': '移除hashtag',
    'Remove whole tag': '移除整个标签',
    'asterisk': '星号',
    'underscore': '下划线',
    'consistent': '一致',
    '-': '-', // leave as is
    '*': '*', // leave as is
    '+': '+', // leave as is
    'space': '空间',
    'no space': '没有空间',
    'None': 'None',
    'Ascending Alphabetical': '按字母顺序升序',
    'Descending Alphabetical': '按字母顺序降序',
    // yaml.ts
    'multi-line': '多行',
    'single-line': '单行',
    'single string to single-line': '一行一个字符串',
    'single string to multi-line': '多行一个字符串',
    'single string comma delimited': '字符串用逗号分隔',
    'single string space delimited': '字符串用空格分隔',
    'single-line space delimited': '单行空格分隔',
    // yaml-title.ts
    'first-h1': '第一级标题',
    'first-h1-or-filename-if-h1-missing': '第一级 1 标题或文件名（如果缺少 1 级标题）',
    'filename': '文件名',
    '\'\'': '\'\'', // leave as is
    '‘’': '‘’', // leave as is
    '""': '""', // leave as is
    '“”': '“”', // leave as is
  },
};

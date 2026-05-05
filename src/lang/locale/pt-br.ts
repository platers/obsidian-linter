// Português do Brasil
// Brazilian Portuguese

export default {
  'commands': {
    'lint-file': {
      'name': 'Executar o linter no arquivo atual',
      'error-message': 'Erro ao executar o linter no Arquivo',
    },
    'lint-file-unless-ignored': {
      'name': 'Executar o linter no arquivo atual (se não for ignorado)',
    },
    'lint-all-files': {
      'name': 'Executar o linter em todos os arquivos do cofre',
      'error-message': 'Erro ao executar o linter em massa no Arquivo',
      'success-message': 'Linter executado em todos os arquivos',
      'errors-message-singular': 'Linter executado em todos os arquivos com 1 erro.',
      'errors-message-plural': 'Linter executado em todos os arquivos com {NUM} erros.',
      'start-message': 'Isso editará todos os seus arquivos e pode introduzir erros.',
      'submit-button-text': 'Executar o linter em Tudo',
      'submit-button-notice-text': 'Executando o linter em todos os arquivos...',
    },
    'lint-all-files-in-folder': {
      'name': 'Executar o linter em todos os arquivos da pasta atual',
      'start-message': 'Isso editará todos os seus arquivos em {FOLDER_NAME}, incluindo arquivos em suas subpastas, o que pode introduzir erros.',
      'submit-button-text': 'Executar em todos os arquivos em {FOLDER_NAME}',
      'submit-button-notice-text': 'Executando o linter em todos os arquivos em {FOLDER_NAME}...',
      'error-message': 'Erro ao executar o linter em todos os arquivos da pasta no Arquivo',
      'success-message': 'Linter executado em todos os {NUM} arquivos em {FOLDER_NAME}.',
      'message-singular': 'Linter executado em todos os {NUM} arquivos em {FOLDER_NAME} e houve 1 erro.',
      'message-plural': 'Linter executado em todos os {FILE_COUNT} arquivos em {FOLDER_NAME} e houve {ERROR_COUNT} erros.',
    },
    'paste-as-plain-text': {
      'name': 'Colar como Texto Simples e sem Modificações',
    },
    'ignore-folder': {
      'name': 'Ignorar pasta',
    },
    'ignore-file': {
      'name': 'Ignorar arquivo',
    },
    'lint-file-pop-up-menu-text': {
      'name': 'Executar linter no arquivo',
    },
    'lint-folder-pop-up-menu-text': {
      'name': 'Executar linter na pasta',
    },
    'ignore-file-pop-up-menu-text': {
      'name': 'Ignorar arquivo no Linter',
    },
    'ignore-folder-pop-up-menu-text': {
      'name': 'Ignorar pasta no Linter',
    },
  },

  'logs': {
    'plugin-load': 'Carregando o plugin',
    'plugin-unload': 'Descarregando o plugin',
    'folder-lint': 'Executando linter na pasta ',
    'linter-run': 'Executando o linter',
    'file-change-yaml-lint-run': 'Running editor content change YAML linting',
    'file-change-yaml-lint-skipped': 'Nenhuma alteração de arquivo detectada, portanto, o linter de YAML foi pulado',
    'file-change-yaml-lint-warning': 'Nenhuma informação de arquivo presente, mas o debounce foi executado. Algo deu errado em algum lugar.',
    'paste-link-warning': 'execução do linter ao colar abortada pois o conteúdo da área de transferência é um link e isso evita conflitos com outros plugins que modificam a ação de colar.',
    'see-console': 'Verifique o console para mais detalhes.',
    'unknown-error': 'Ocorreu um erro desconhecido durante a execução do linter.',
    'moment-locale-not-found': 'Tentando alterar a localidade do Moment.js para {MOMENT_LOCALE}, obteve {CURRENT_LOCALE}',
    'file-change-lint-message-start': 'Linter executado',
    'custom-command-callback-warning': 'Por favor, defina o callback de comando personalizado apenas para testes de integração.',

    // rules-runner.ts
    'pre-rules': 'regras anteriores às regras regulares',
    'post-rules': 'regras posteriores às regras regulares',
    'rule-running': 'rules em execução',
    'custom-regex': 'regras de regex personalizadas',
    'running-custom-regex': 'Executando Regex Personalizada',
    'running-custom-lint-command': 'Executando Comandos Personalizados do Linter',
    'custom-lint-duplicate-warning': 'Você não pode executar o mesmo comando ("{COMMAND_NAME}") como uma regra personalizada do linter duas vezes.',
    'custom-lint-error-message': 'Comando Personalizado do Linter',

    // rules-runner.ts and rule-builder.ts
    'disabled-text': 'is disabled',

    // rule-builder.ts
    'run-rule-text': 'Executando',

    // logger.ts
    'timing-key-not-found': 'a chave de temporização \'{TIMING_KEY}\' não existe na lista de informações de temporização, portanto foi ignorada',
    'milliseconds-abbreviation': 'ms',

    'invalid-date-format-error': `O formato da data de criação '{DATE}' não pôde ser analisado ou determinado, portanto a data de criação não foi modificada em '{FILE_NAME}'`,

    // yaml.ts
    'invalid-delimiter-error-message': 'o delimitador deve ser apenas um único caractere',

    // mdast.ts
    'missing-footnote-error-message': `A nota de rodapé '{FOOTNOTE}' não tem uma referência de nota de rodapé correspondente antes do conteúdo da nota de rodapé e não pode ser processada. Por favor, certifique-se de que todas as notas de rodapé tenham uma referência correspondente antes do conteúdo da nota de rodapé.`,
    'too-many-footnotes-error-message': `A chave da nota de rodapé '{FOOTNOTE_KEY}' tem mais de uma nota de rodapé fazendo referência a ela. Por favor, atualize as notas de rodapé para que haja apenas uma nota de rodapé por chave.`,

    // rules.ts
    'wrapper-yaml-error': 'erro no YAML: {ERROR_MESSAGE}',
    'wrapper-unknown-error': 'erro desconhecido: {ERROR_MESSAGE}',
  },

  'notice-text': {
    'empty-clipboard': 'Não há conteúdo na área de transferência.',
    'characters-added': 'caracteres adicionados',
    'characters-removed': 'caracteres removidos',
    'copy-to-clipboard-failed': 'Falha ao copiar texto para a área de transferência: ',
  },

  // rule-alias-suggester.ts
  'all-rules-option': 'All',

  // settings.ts
  'linter-title': 'Linter',
  'empty-search-results-text': 'Nenhuma configuração correspondente à pesquisa',

  // lint-confirmation-modal.ts
  'warning-text': 'Aviso',
  'file-backup-text': 'Certifique-se de ter feito backup dos seus arquivos.',
  'custom-command-warning': 'Executar o linter em múltiplos arquivos com comandos personalizado ativados é um processo lento que requer a habilidade de abrir painéis no painel lateral. É notavelmente mais lento do que executar sem os comandos personalizados ativados. Por favor, proceda com cautela.',
  'cancel-button-text': 'Cancelar',
  'do-not-show-again': 'Não mostrar esta confirmação novamente',

  'copy-aria-label': 'Copiar',

  'disabled-other-rule-notice': 'Se você ativar <code>{NAME_1}</code>, isso desativará <code>{NAME_2}</code>. Deseja prosseguir?',
  'disabled-conflicting-rule-notice': '{NAME_1} entra em conflito com {NAME_2}, portanto foi desativado. Você pode alternar qual configuração está desativada na aba de configurações.',

  // confirm-rule-disable-modal.ts
  'ok': 'Ok',

  // parse-results-modal.ts
  'parse-results-heading-text': 'Valores Personalizados Analisados',
  'file-parse-description-text': 'A seguir está a lista de substituições personalizadas encontradas em {FILE}.',
  'no-parsed-values-found-text': 'Nenhuma substituição personalizada encontrada em {FILE}. Por favor, certifique-se de que todas as tabelas com substituições personalizadas em {FILE} tenham apenas duas colunas e que todas as linhas comecem e terminem com uma barra vertical (ou seja, |).',
  'find-header-text': 'Palavra a Localizar',
  'replace-header-text': 'Palavra de Substituição',
  'close-button-text': 'Fechar',

  'tabs': {
    'names': {
      // tab.ts
      'general': 'Geral',
      'custom': 'Personalizado',
      'yaml': 'YAML',
      'heading': 'Cabeçalho',
      'content': 'Conteúdo',
      'footnote': 'Nota de Rodapé',
      'spacing': 'Espaçamento',
      'paste': 'Colar',
      'debug': 'Debug',
    },
    // tab-searcher.ts
    'default-search-bar-text': 'Pesquisar em todas as configurações',
    'general': {
      // general-tab.ts
      'lint-on-save': {
        'name': 'Executar linter ao salvar',
        'description': 'Executa o linter ao salvar o arquivo manualmente (quando <code>Ctrl + S</code> é pressionado ou quanto <code>:w</code> é executado usando atalhos do vim)',
      },
      'display-message': {
        'name': 'Exibir messagem ao executar linter',
        'description': 'Exibe o número de caracteres alterados após a execução do linter',
      },
      'suppress-message-when-no-change': {
        'name': 'Suprimir mensagem quando não houver alteração',
        'description': 'Se ativado, nenhuma mensagem será mostrada quando nenhuma alteração real ocorrer.',
      },
      'lint-on-file-change': {
        'name': 'Executar linter ao alterar o arquivo focado',
        'description': 'Quando um arquivo é fechado ou um novo arquivo é selecionado, o linter é executado no arquivo anterior.',
      },
      'display-lint-on-file-change-message': {
        'name': 'Exibir mensagem de execução do linter na alteração de arquivo',
        'description': 'Exibe uma mensagem quando <code>Executar linter ao alterar o arquivo focado</code> ocorre',
      },
      'folders-to-ignore': {
        'name': 'Pastas a ignorar',
        'description': 'Pastas a ignorar ao executar o linter em todos os arquivos ou ao salvar.',
        'folder-search-placeholder-text': 'Nome da pasta',
        'add-input-button-text': 'Adicionar outra pasta para ignorar',
        'delete-tooltip': 'Excluir',
      },
      'files-to-ignore': {
        'name': 'Arquivos a ignorar',
        'description': 'Arquivos a ignorar ao executar o linter em todos os arquivos ou ao salvar.',
        'file-search-placeholder-text': 'regex para arquivo a ignorar',
        'add-input-button-text': 'Adicionar outra regex de arquivo para ignorar',
        'delete-tooltip': 'Excluir',
        'label-placeholder-text': 'rótulo',
        'flags-placeholder-text': 'flags',
        'warning': 'Use com cautela se não conhecer regex. Além disso, certifique-se de que, se você usar lookbehinds em sua regex no iOS (móvel), você esteja em uma versão que os suporte.',
      },
      'additional-file-extensions': {
        'name': 'Extensões de arquivo adicionais',
        'description': 'Extensões de arquivo para executar o linter além de md. Por exemplo, mdx ou svx. Não inclua o ponto inicial. <b>Nota: Apenas os arquivos que o Obsidian considera como markdown (seja nativamente ou por meio de outros plugins) sofrerão a execução do linter, independentemente das extensões adicionadas.</b>',
        'extension-placeholder': 'ex. mdx',
        'add-input-button-text': 'Adicionar outra extensão',
        'delete-tooltip': 'Excluir',
      },
      'override-locale': {
        'name': 'Substituir localidade',
        'description': 'Defina isso se desejar usar uma localidade diferente do padrão',
      },
      'same-as-system-locale': 'Mesmo que o sistema ({SYS_LOCALE})',
      'yaml-aliases-section-style': {
        'name': 'Estilo da seção de aliases do YAML',
        'description': 'O estilo da seção de aliases do YAML',
      },
      'yaml-tags-section-style': {
        'name': 'Estilo da seção de tags do YAML',
        'description': 'O estilo da seção de tags do YAML',
      },
      'default-escape-character': {
        'name': 'Caractere de Escape Padrão',
        'description': 'O caractere padrão a ser usado para escapar valores no YAML quando aspas simples e duplas não estiverem presentes.',
      },
      'remove-unnecessary-escape-chars-in-multi-line-arrays': {
        'name': 'Remover Caracteres de Escape Desnecessários em Formato de Array Multi-Linha',
        'description': 'Caracteres de escape para arrays multi-linha no YAML não precisam do mesmo escape que arrays de linha única, portanto, ao estar em formato de multi-linha, os escapes extras desnecessários serão removidos',
      },
      'number-of-dollar-signs-to-indicate-math-block': {
        'name': 'Número de Cifrões para Indicar Bloco Matemático',
        'description': 'A quantidade de cifrões para considerar o conteúdo matemático como um bloco matemático em vez de matemática inline',
      },
    },
    'debug': {
      // debug-tab.ts
      'log-level': {
        'name': 'Nível de Log',
        'description': 'Os tipos de logs que o serviço terá permissão para registrar. O padrão é ERROR.',
      },
      'linter-config': {
        'name': 'Configuração do Linter',
        'description': 'O conteúdo do data.json para o Linter no momento do carregamento da página de configurações',
      },
      'log-collection': {
        'name': 'Coletar logs ao executar linter ao salvar e no arquivo atual',
        'description': 'Coleta logs quando você realiza <code>Executar linter ao salvar</code> e ao executar o linter no arquivo atual. Esses logs podem ser úteis para depuração e criação de relatórios de bugs.',
      },
      'linter-logs': {
        'name': 'Logs do Linter',
        'description': 'Os logs do último <code>Executar linter ao salvar</code> ou da última execução do linter no arquivo atual, se ativado.',
      },
    },
  },

  'options': {
    'custom-command': {
      // custom-command-option.ts
      'name': 'Comandos Personalizados',
      'description': 'Comandos personalizados são comandos do Obsidian que são executados após o linter finalizar a execução de suas regras regulares. Isso significa que eles não são executados antes da lógicas de timestamp do YAML, então podem fazer com que o timestamp do YAML seja acionado na próxima execução do linter. Você pode selecionar um comando do Obsidian apenas uma vez.',
      'warning': 'Ao selecionar uma opção, certifique-se de usar o mouse ou pressionar a tecla Enter. Outros métodos de seleção podem não funcionar e apenas seleções de um comando real do Obsidian ou de uma string vazia serão salvas.',

      'add-input-button-text': 'Adicionar novo comando',
      'command-search-placeholder-text': 'Comando do Obsidian',
      'move-up-tooltip': 'Mover para cima',
      'move-down-tooltip': 'Mover para baixo',
      'delete-tooltip': 'Excluir',
    },
    'custom-replace': {
      // custom-replace-option.ts
      'name': 'Substituição de Regex Personalizada',
      'description': 'A substituição de regex personalizada pode ser usada para substituir qualquer coisa que corresponda à regex de busca pelo valor de substituição. Os valore de substituição e de busca precisarão ser valores de regex válidos.',
      'warning': 'Use com cautela se você não conhecer regex. Além disso, certifique-se de que, se vocÊ usar lookbehinds na sua regex no iOS (móvel), você esteja em uma versão que os suporte.',
      'add-input-button-text': 'Adicionar nova substituição de regex',
      'regex-to-find-placeholder-text': 'regex de busca',
      'flags-placeholder-text': 'flags',
      'regex-to-replace-placeholder-text': 'regex de substituição',
      'label-placeholder-text': 'rótulo',
      'move-up-tooltip': 'Mover para cima',
      'move-down-tooltip': 'Mover para baixo',
      'delete-tooltip': 'Excluir',
    },
    'custom-auto-correct': {
      'delete-tooltip': 'Excluir',
      'show-parsed-contents-tooltip': 'Visualizar substituições analisadas',
      'custom-row-parse-warning': '"{ROW}" não é uma linha válida de substituições personalizadas. Ela deve ter exatamente 2 colunas.',
      'file-search-placeholder-text': 'Nome do arquivo',
      'add-new-replacement-file-tooltip': 'Adicionar outro arquivo personalizado',
      'warning-text': 'Arquivos selecionados terão {NAME} desativado automaticamente.',
      'refresh-tooltip-text': 'Recarregar substituições personalizadas',
    },
  },

  // rules
  'rules': {
    // auto-correct-common-misspellings.ts
    'auto-correct-common-misspellings': {
      'name': 'Auto-correct Common Misspellings',
      'description': 'Uses a dictionary of common misspellings to automatically convert them to their proper spellings. See <a href="https://github.com/platers/obsidian-linter/tree/master/src/utils/default-misspellings.md">auto-correct map</a> for the full list of auto-corrected words. <b>Note: this list can work on text from multiple languages, but this list is the same no matter what language is currently in use.</b>',
      'ignore-words': {
        'name': 'Ignore Words',
        'description': 'A comma separated list of lowercased words to ignore when auto-correcting',
      },
      'extra-auto-correct-files': {
        'name': 'Extra Auto-Correct Source Files',
        'description': 'These are files that have a markdown table in them that have the initial word and the word to correct it to (these are case insensitive corrections). <b>Note: the tables used should have the starting and ending <code>|</code> indicators present for each line.</b>',
      },
      'skip-words-with-multiple-capitals': {
        'name': 'Skip Words with Multiple Capitals',
        'description': 'Will skip any files that have a capital letter in them other than as the first letter of the word. Acronyms and some other words can benefit from this. It may cause issues with proper nouns being properly fixed.',
      },
      'default-install': 'You are using Auto-correct Common Misspellings. In order to do so, the default misspellings will be downloaded. This should only happen once. Please wait...',
      'default-install-failed': 'Failed to download {URL}. Disabling Auto-correct Common Misspellings.',
      'defaults-missing': 'Failed to find default common auto-correct file: {FILE}.',
    },
    // add-blank-line-after-yaml.ts
    'add-blank-line-after-yaml': {
      'name': 'Add Blank Line After YAML',
      'description': 'Adds a blank line after the YAML block if it does not end the current file or it is not already followed by at least 1 blank line',
    },
    // blockquotify-on-paste.ts
    'add-blockquote-indentation-on-paste': {
      'name': 'Add Blockquote Indentation on Paste',
      'description': 'Adds blockquotes to all but the first line, when the cursor is in a blockquote/callout line during pasting',
    },
    // blockquote-style.ts
    'blockquote-style': {
      'name': 'Blockquote Style',
      'description': 'Makes sure the blockquote style is consistent.',
      'style': {
        'name': 'Style',
        'description': 'The style used on blockquote indicators',
      },
    },
    // capitalize-headings.ts
    'capitalize-headings': {
      'name': 'Capitalize Headings',
      'description': 'Headings should be formatted with capitalization',
      'style': {
        'name': 'Style',
        'description': 'The style of capitalization to use',
      },
      'ignore-case-words': {
        'name': 'Ignore Cased Words',
        'description': 'Only apply title case style to words that are all lowercase',
      },
      'ignore-words': {
        'name': 'Ignore Words',
        'description': 'A comma separated list of words to ignore when capitalizing',
      },
      'lowercase-words': {
        'name': 'Lowercase Words',
        'description': 'A comma separated list of words to keep lowercase',
      },
    },
    // compact-yaml.ts
    'compact-yaml': {
      'name': 'Compact YAML',
      'description': 'Removes leading and trailing blank lines in the YAML front matter.',
      'inner-new-lines': {
        'name': 'Inner New Lines',
        'description': 'Remove new lines that are not at the start or the end of the YAML',
      },
    },
    // consecutive-blank-lines.ts
    'consecutive-blank-lines': {
      'name': 'Consecutive blank lines',
      'description': 'There should be at most one consecutive blank line.',
    },
    // convert-bullet-list-markers.ts
    'convert-bullet-list-markers': {
      'name': 'Convert Bullet List Markers',
      'description': 'Converts common bullet list marker symbols to markdown list markers.',
    },
    // convert-spaces-to-tabs.ts
    'convert-spaces-to-tabs': {
      'name': 'Convert Spaces to Tabs',
      'description': 'Converts leading spaces to tabs.',
      'tabsize': {
        'name': 'Tabsize',
        'description': 'Number of spaces that will be converted to a tab',
      },
    },
    // dedupe-yaml-array-values.ts
    'dedupe-yaml-array-values': {
      'name': 'Dedupe YAML Array Values',
      'description': 'Removes duplicate array values in a case sensitive manner.',
      'dedupe-alias-key': {
        'name': 'Dedupe YAML aliases section',
        'description': 'Turns on removing duplicate aliases.',
      },
      'dedupe-tag-key': {
        'name': 'Dedupe YAML tags section',
        'description': 'Turns on removing duplicate tags.',
      },
      'dedupe-array-keys': {
        'name': 'Dedupe YAML array sections',
        'description': 'Turns on removing duplicate values for regular YAML arrays',
      },
      'ignore-keys': {
        'name': 'YAML Keys to Ignore',
        'description': 'A list of YAML keys without the ending colon on their own lines that are not meant to have duplicate values removed from them.',
      },
    },
    // default-language-for-code-fences.ts
    'default-language-for-code-fences': {
      'name': 'Default Language For Code Fences',
      'description': 'Add a default language to code fences that do not have a language specified.',
      'default-language': {
        'name': 'Programming Language',
        'description': 'Leave empty to do nothing. Languages tags can be found <a href="https://prismjs.com/#supported-languages">here</a>.',
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
      'description': 'Ensures that there is an empty line around blockquotes unless they start or end a document. <b>Note: an empty line is either one less level of nesting for blockquotes or a newline character.</b>',
    },
    // empty-line-around-code-fences.ts
    'empty-line-around-code-fences': {
      'name': 'Empty Line Around Code Fences',
      'description': 'Ensures that there is an empty line around code fences unless they start or end a document.',
    },
    // empty-line-around-math-block.ts
    'empty-line-around-math-blocks': {
      'name': 'Empty Line Around Math Blocks',
      'description': 'Ensures that there is an empty line around math blocks using <code>Number of Dollar Signs to Indicate a Math Block</code> to determine how many dollar signs indicates a math block for single-line math.',
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
      'description': 'Allows for the formatting of regular YAML arrays as either multi-line or single-line and <code>tags</code> and <code>aliases</code> are allowed to have some Obsidian specific YAML formats. <b>Note: that single string to single-line goes from a single string entry to a single-line array if more than 1 entry is present. The same is true for single string to multi-line except it becomes a multi-line array.</b>',
      'alias-key': {
        'name': 'Format YAML aliases section',
        'description': 'Turns on formatting for the YAML aliases section. You should not enable this option alongside the rule <code>YAML Title Alias</code> as they may not work well together or they may have different format styles selected causing unexpected results.',
      },
      'tag-key': {
        'name': 'Format YAML tags section',
        'description': 'Turns on formatting for the YAML tags section.',
      },
      'default-array-style': {
        'name': 'Default YAML array section style',
        'description': 'The style of other YAML arrays that are not <code>tags</code>, <code>aliases</code> or  in <code>Force key values to be single-line arrays</code> and <code>Force key values to be multi-line arrays</code>',
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
      'description': 'All headings have one blank line both before and after (except where the heading is at the beginning or end of the document).',
      'bottom': {
        'name': 'Bottom',
        'description': 'Ensures one blank line after headings (when disabled it does not remove blank lines after headings)',
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
      'description': 'Ensures that there is exactly one line break at the end of a document if the note is not empty.',
    },
    // move-footnotes-to-the-bottom.ts
    'move-footnotes-to-the-bottom': {
      'name': 'Move Footnotes to the bottom',
      'description': 'Move all footnotes to the bottom of the document and makes sure they are sorted based on the order they are referenced in the file\'s body.',
      'include-blank-line-between-footnotes': {
        'name': 'Include Blank Line Between Footnotes',
        'description': 'Includes a blank line between footnotes when enabled.',
      },
    },
    // move-math-block-indicators-to-their-own-line.ts
    'move-math-block-indicators-to-their-own-line': {
      'name': 'Move Math Block Indicators to Their Own Line',
      'description': 'Move all starting and ending math block indicators to their own lines using <code>Number of Dollar Signs to Indicate a Math Block</code> to determine how many dollar signs indicates a math block for single-line math.',
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
        'description': 'The tags that will not be moved to the tags array or removed from the body content if <code>Remove the hashtag from tags in content body</code> is enabled. Each tag should be on a new line and without the <code>#</code>. <b>Make sure not to include the hashtag in the tag name.</b>',
      },
    },
    // no-bare-urls.ts
    'no-bare-urls': {
      'name': 'No Bare URLs',
      'description': 'Encloses bare URLs with angle brackets except when enclosed in back ticks, square braces, or single or double quotes.',
      'no-bare-uris': {
        'name': 'No Bare URIs',
        'description': 'Attempts to enclose bare URIs with angle brackets except when enclosed in back ticks, square braces, or single or double quotes.',
      },
    },
    // ordered-list-style.ts
    'ordered-list-style': {
      'name': 'Ordered List Style',
      'description': 'Makes sure that ordered lists follow the style specified. <b>Note: that 2 spaces or 1 tab is considered to be an indentation level.</b>',
      'number-style': {
        'name': 'Number Style',
        'description': 'The number style used in ordered list indicators',
      },
      'list-end-style': {
        'name': 'Ordered List Indicator End Style',
        'description': 'The ending character of an ordered list indicator',
      },
      'preserve-start': {
        'name': 'Preserve Starting Number',
        'description': 'Whether to preserve the starting number of an ordered list. This can be used to have an ordered list that has content in between the ordered list items.',
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
        'name': 'Enable <code>Single Quote Style</code>',
        'description': 'Specifies that the selected single quote style should be used.',
      },
      'single-quote-style': {
        'name': 'Single Quote Style',
        'description': 'The style of single quotes to use.',
      },
      'double-quote-enabled': {
        'name': 'Enable <code>Double Quote Style</code>',
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
      'description': 'Re-indexes footnote keys and footnote, based on the order of footnote references in the file. <b>Note: This rule does <i>not</i> work if there is more than one footnote for a key.</b>',
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
    // empty-line-around-horizontal-rules.ts
    'empty-line-around-horizontal-rules': {
      'name': 'Empty Line Around Horizontal Rules',
      'description': 'Ensures that there is an empty line around horizontal rules unless they start or end a document.',
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
      'description': 'Ensures that certain characters are not surrounded by whitespace (either single spaces or a tab). <b>Note: this may causes issues with markdown format in some cases.</b>',
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
      'description': 'Removes space before the specified characters and after the specified characters. <b>Note: this may causes issues with markdown format in some cases.</b>',
      'characters-to-remove-space-before': {
        'name': 'Remove Space Before Characters',
        'description': 'Removes space before the specified characters. <b>Note: using <code>{</code> or <code>}</code> in the list of characters will unexpectedly affect files as it is used in the ignore syntax behind the scenes.</b>',
      },
      'characters-to-remove-space-after': {
        'name': 'Remove Space After Characters',
        'description': 'Removes space after the specified characters. <b>>Note: using <code>{</code> or <code>}</code> in the list of characters will unexpectedly affect files as it is used in the ignore syntax behind the scenes.</b>',
      },
    },
    // remove-trailing-punctuation-in-heading.ts
    'remove-trailing-punctuation-in-heading': {
      'name': 'Remove Trailing Punctuation in Heading',
      'description': 'Removes the specified punctuation from the end of headings making sure to ignore the semicolon at the end of <a href="https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references">HTML entity references</a>.',
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
    // sort-yaml-array-values.ts
    'sort-yaml-array-values': {
      'name': 'Sort YAML Array Values',
      'description': 'Sorts YAML array values based on the specified sort order.',
      'sort-alias-key': {
        'name': 'Sort YAML aliases section',
        'description': 'Turns on sorting aliases.',
      },
      'sort-tag-key': {
        'name': 'Sort YAML tags section',
        'description': 'Turns on sorting tags.',
      },
      'sort-array-keys': {
        'name': 'Sort YAML array sections',
        'description': 'Turns on sorting values for regular YAML arrays',
      },
      'ignore-keys': {
        'name': 'YAML Keys to Ignore',
        'description': 'A list of YAML keys without the ending colon on their own lines that are not meant to have their values sorted.',
      },
      'sort-order': {
        'name': 'Sort Order',
        'description': 'The way to sort the YAML array values.',
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
      'description': 'Ensures that Chinese, Japanese, or Korean and English or numbers are separated by a single space. Follows these <a href="https://github.com/sparanoid/chinese-copywriting-guidelines">guidelines</a>',
      'english-symbols-punctuation-before': {
        'name': 'English Punctuations and Symbols Before CJK',
        'description': 'The list of non-letter punctuation and symbols to consider to be from English when found before Chinese, Japanese, or Korean characters. <b>Note: "*" is always considered to be English and is necessary for handling some markdown syntaxes properly.</b>',
      },
      'english-symbols-punctuation-after': {
        'name': 'English Punctuations and Symbols After CJK',
        'description': 'The list of non-letter punctuation and symbols to consider to be from English when found after Chinese, Japanese, or Korean characters. <b>Note: "*" is always considered to be English and is necessary for handling some markdown syntaxes properly.</b>',
      },
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
      'two-space-line-break': {
        'name': 'Two Space Linebreak',
        'description': 'Ignore two spaces followed by a line break ("Two Space Rule").',
      },
    },
    // two-spaces-between-lines-with-content.ts
    'two-spaces-between-lines-with-content': {
      'name': 'Line Break Between Lines with Content',
      'description': 'Makes sure that the specified line break is added to the ends of lines with content continued on the next line for paragraphs, blockquotes, and list items',
      'line-break-indicator': {
        'name': 'Line Break Indicator',
        'description': 'The line break indicator to use.',
      },
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
      'description': 'Sorts the YAML keys based on the order and priority specified. <b>Note: may remove blank lines as well. Only works on non-nested keys.</b>',
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
      'date-created-source-of-truth': {
        'name': 'Date Created Source of Truth',
        'description': 'Specifies where to get the date created value from if it is already present in the frontmatter.',
      },
      'date-modified-source-of-truth': {
        'name': 'Date Modified Source of Truth',
        'description': 'Specifies what way should be used to determine when the date modified should be updated if it is already present in the frontmatter.',
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
        'description': 'Moment date format to use (see <a href="https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/">Moment format options</a>)',
      },
      'convert-to-utc': {
        'name': 'Convert Local Time to UTC',
        'description': 'Uses UTC equivalent for saved dates instead of local time',
      },
      'update-on-file-contents-updated': {
        'name': 'Update YAML Timestamp on File Contents Update',
        'description': 'When the currently active note is modified, <code>YAML Timestamp</code> is run on the note. This should update the modified note timestamp if it is more than 5 seconds off from the current value.',
      },
    },
    // yaml-title-alias.ts
    'yaml-title-alias': {
      'name': 'YAML Title Alias',
      'description': 'Inserts or updates the title of the file into the YAML frontmatter\'s aliases section. Gets the title from the first H1 or filename.',
      'preserve-existing-alias-section-style': {
        'name': 'Preserve existing aliases section style',
        'description': 'If set, the <code>YAML aliases section style</code> setting applies only to the newly created sections',
      },
      'keep-alias-that-matches-the-filename': {
        'name': 'Keep alias that matches the filename',
        'description': 'Such aliases are usually redundant',
      },
      'use-yaml-key-to-keep-track-of-old-filename-or-heading': {
        'name': 'Use the YAML key specified by <code>Alias Helper Key</code> to help with filename and heading changes',
        'description': 'If set, when the first H1 heading changes or filename if first H1 is not present changes, then the old alias stored in this key will be replaced with the new value instead of just inserting a new entry in the aliases array',
      },
      'alias-helper-key': {
        'name': 'Alias Helper Key',
        'description': 'The key to use to help keep track of what the last file name or heading was that was stored in the frontmatter by this rule.',
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
    'preserve': 'preserve',
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
    // settings-data.ts
    'never': 'Never',
    'after 5 seconds': 'After 5 seconds',
    'after 10 seconds': 'After 10 seconds',
    'after 15 seconds': 'After 15 seconds',
    'after 30 seconds': 'After 30 seconds',
    'after 1 minute': 'After 1 minute',
    // yaml-timestamp.ts
    'file system': 'File system',
    'frontmatter': 'YAML frontmatter',
    'user or Linter edits': 'Changes in Obsidian',
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

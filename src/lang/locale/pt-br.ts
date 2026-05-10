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
      'submit-button-text': 'Executar em Todos',
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
    'file-change-yaml-lint-run': 'Executando linter de YAML nas alterações de conteúdo do editor',
    'file-change-yaml-lint-skipped': 'Nenhuma alteração de arquivo detectada, portanto, o linter de YAML foi desconsiderado',
    'file-change-yaml-lint-warning': 'Nenhuma informação de arquivo presente, mas o debounce foi executado. Algo deu errado em algum lugar.',
    'paste-link-warning': 'execução do linter ao colar abortada pois o conteúdo da área de transferência é um link e isso evita conflitos com outros plugins que modificam a ação de colar.',
    'see-console': 'Verifique o console para mais detalhes.',
    'unknown-error': 'Ocorreu um erro desconhecido durante a execução do linter.',
    'moment-locale-not-found': 'Tentando alterar a localidade do Moment.js para {MOMENT_LOCALE}, obteve-se {CURRENT_LOCALE}',
    'file-change-lint-message-start': 'Linter executado',
    'custom-command-callback-warning': 'Por favor, defina o callback de comando personalizado apenas para testes de integração.',

    // rules-runner.ts
    'pre-rules': 'regras anteriores às regras regulares',
    'post-rules': 'regras posteriores às regras regulares',
    'rule-running': 'regras em execução',
    'custom-regex': 'regras de regex personalizadas',
    'running-custom-regex': 'Executando Regex Personalizada',
    'running-custom-lint-command': 'Executando Comandos Personalizados do Linter',
    'custom-lint-duplicate-warning': 'Você não pode executar o mesmo comando ("{COMMAND_NAME}") como uma regra personalizada do linter duas vezes.',
    'custom-lint-error-message': 'Comando Personalizado do Linter',

    // rules-runner.ts and rule-builder.ts
    'disabled-text': 'está desativado',

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
  'all-rules-option': 'Todas',

  // settings.ts
  'linter-title': 'Linter',
  'empty-search-results-text': 'Nenhuma configuração correspondente à pesquisa',

  // lint-confirmation-modal.ts
  'warning-text': 'Aviso',
  'file-backup-text': 'Certifique-se de ter feito backup dos seus arquivos.',
  'custom-command-warning': 'Executar o linter em múltiplos arquivos com comandos personalizados ativados é um processo lento que requer a habilidade de abrir painéis no painel lateral. É notavelmente mais lento do que executar sem os comandos personalizados ativados. Por favor, proceda com cautela.',
  'cancel-button-text': 'Cancelar',
  'do-not-show-again': 'Não mostrar esta confirmação novamente',

  'copy-aria-label': 'Copiar',

  'disabled-other-rule-notice': 'Se você ativar <code>{NAME_1}</code>, isso desativará <code>{NAME_2}</code>. Deseja prosseguir?',
  'disabled-conflicting-rule-notice': '{NAME_1} entra em conflito com {NAME_2}, portanto foi desativada. Você pode alternar qual configuração está desativada na aba de configurações.',

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
      'debug': 'Depuração',
    },
    // tab-searcher.ts
    'default-search-bar-text': 'Pesquisar em todas as configurações',
    'general': {
      // general-tab.ts
      'lint-on-save': {
        'name': 'Executar linter ao salvar',
        'description': 'Executa o linter ao salvar o arquivo manualmente (quando <code>Ctrl + S</code> é pressionado ou quando <code>:w</code> é executado usando atalhos do vim)',
      },
      'display-message': {
        'name': 'Exibir mensagem ao executar linter',
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
        'file-search-placeholder-text': 'regex para arquivos a ignorar',
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
        'name': 'Remover Caracteres de Escape Desnecessários em Formato de Array Multilinha',
        'description': 'Caracteres de escape para arrays multilinha no YAML não precisam do mesmo escape que arrays de linha única, portanto, ao estar em formato de multilinha, os escapes extras desnecessários serão removidos',
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
      'description': 'Comandos personalizados são comandos do Obsidian que são executados após o linter finalizar a execução de suas regras regulares. Isso significa que eles não são executados antes da lógica de timestamp do YAML, então podem fazer com que o timestamp do YAML seja acionado na próxima execução do linter. Você pode selecionar um comando do Obsidian apenas uma vez.',
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
      'description': 'A substituição de regex personalizada pode ser usada para substituir qualquer coisa que corresponda à regex de busca pelo valor de substituição. Os valores de substituição e de busca precisarão ser valores de regex válidos.',
      'warning': 'Use com cautela se você não conhecer regex. Além disso, certifique-se de que, se você usar lookbehinds na sua regex no iOS (móvel), você esteja em uma versão que os suporte.',
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
      'warning-text': 'Arquivos selecionados terão {NAME} desativada automaticamente.',
      'refresh-tooltip-text': 'Recarregar substituições personalizadas',
    },
  },

  // rules
  'rules': {
    // auto-correct-common-misspellings.ts
    'auto-correct-common-misspellings': {
      'name': 'Corrigir Automaticamente Erros Ortográficos Comuns',
      'description': 'Usa um dicionário de erros ortográficos comuns para convertê-los automaticamente para a ortografia correta. Veja o <a href="https://github.com/platers/obsidian-linter/tree/master/src/utils/default-misspellings.md">mapa de correção automática</a> para a lista completa das palavras corrigidas automaticamente. <b>Nota: essa lista pode funcionar em texto de vários idiomas, mas esta mesma lista será aplicada, não importa o idioma que esteja em uso.</b>',
      'ignore-words': {
        'name': 'Ignorar Palavras',
        'description': 'Uma lista separada por vírgulas de palavras em minúsculas a serem ignoradas na correção automática',
      },
      'extra-auto-correct-files': {
        'name': 'Arquivos Extras de Correção Automática',
        'description': 'Estes são arquivos que contêm uma tabela em markdown com a palavra inicial e a palavra para a qual deve ser corrigida (são correções sem distinção de maiúsculas e minúsculas). <b>Nota: as tabelas utilizadas devem ter os indicadores <code>|</code> iniciais e finais presentes em cada linha.</b>',
      },
      'skip-words-with-multiple-capitals': {
        'name': 'Pular Palavras com Várias Maiúsculas',
        'description': 'Irá ignorar quaisquer palavras que tenham uma letra maiúscula além da primeira letra. Acrônimos e algumas outras palavras podem se beneficiar disso. Isso pode causar problemas com a correção adequada de nomes próprios.',
      },
      'default-install': 'Você está usando Corrigir Automaticamente Erros Ortográficos Comuns. Para isso, os erros ortográficos padrão serão baixados. Isso deve ocorrer apenas uma vez. Por favor, aguarde...',
      'default-install-failed': 'Falha ao baixar {URL}. Desativando a Correção Automática de Erros Ortográficos Comuns.',
      'defaults-missing': 'Falha ao encontrar o arquivo de correção automática padrão: {FILE}.',
    },
    // add-blank-line-after-yaml.ts
    'add-blank-line-after-yaml': {
      'name': 'Adicionar Linha em Branco Após YAML',
      'description': 'Adiciona uma linha em branco após o bloco YAML se ele não for o final do arquivo ou não for seguido por pelo menos 1 linha em branco',
    },
    // blockquotify-on-paste.ts
    'add-blockquote-indentation-on-paste': {
      'name': 'Adicionar Recuo de Citação ao Colar',
      'description': 'Adiciona citações (blockquotes) a todas as linhas, exceto a primeira, quando o cursor estiver em uma linha de citação/destaque durante a colagem',
    },
    // blockquote-style.ts
    'blockquote-style': {
      'name': 'Estilo de Citação',
      'description': 'Garante que o estilo de citação seja consistente.',
      'style': {
        'name': 'Estilo',
        'description': 'O estilo usado nos indicadores de citação',
      },
    },
    // capitalize-headings.ts
    'capitalize-headings': {
      'name': 'Capitalizar Cabeçalhos',
      'description': 'Os cabeçalhos devem ser formatados com capitalização',
      'style': {
        'name': 'Estilo',
        'description': 'O estilo de capitalização a usar',
      },
      'ignore-case-words': {
        'name': 'Ignorar Palavras com Maiúsculas',
        'description': 'Aplica o estilo Title Case apenas em palavras que estejam totalmente em minúsculas',
      },
      'ignore-words': {
        'name': 'Ignorar Palavras',
        'description': 'Uma lista separada por vírgulas de palavras a serem ignoradas na capitalização',
      },
      'lowercase-words': {
        'name': 'Palavras em Minúsculas',
        'description': 'Uma lista separada por vírgulas de palavras a manter em minúsculas',
      },
      'starting-word-ignore-characters': {
        'name': 'Caracteres a ignorar no início de palavras potenciais',
        'description': 'Caracteres que podem preceder uma ou mais letras, aspas simples ou traços para que o conjunto seja considerado uma palavra',
      },
      'ending-word-ignore-characters': {
        'name': 'Caracteres a ignorar no final de palavras potenciais',
        'description': 'Caracteres que podem seguir uma ou mais letras, aspas simples ou traços para que o conjunto seja considerado uma palavra',
      },
    },
    // compact-yaml.ts
    'compact-yaml': {
      'name': 'YAML Compacto',
      'description': 'Remove linhas em branco no início e no final do frontmatter YAML.',
      'inner-new-lines': {
        'name': 'Novas Linhas Internas',
        'description': 'Remove novas linhas que não estão no início ou no final do YAML',
      },
    },
    // consecutive-blank-lines.ts
    'consecutive-blank-lines': {
      'name': 'Linhas em branco consecutivas',
      'description': 'Deve haver no máximo uma linha em branco consecutiva.',
    },
    // convert-bullet-list-markers.ts
    'convert-bullet-list-markers': {
      'name': 'Converter Marcadores de Listas de Tópicos',
      'description': 'Converte símbolos de marcadores de lista comuns para marcadores de lista em markdown.',
    },
    // convert-spaces-to-tabs.ts
    'convert-spaces-to-tabs': {
      'name': 'Converter Espaços em Tabs',
      'description': 'Converte espaços iniciais em tabs.',
      'tabsize': {
        'name': 'Tamanho do Tab',
        'description': 'Número de espaços que serão convertidos para uma tabulação (tab)',
      },
    },
    // dedupe-yaml-array-values.ts
    'dedupe-yaml-array-values': {
      'name': 'Desduplicar Valores de Array no YAML',
      'description': 'Remove valores de array duplicados distinguindo maiúsculas de minúsculas.',
      'dedupe-alias-key': {
        'name': 'Desduplicar a seção de aliases no YAML',
        'description': 'Ativa a remoção de aliases duplicados.',
      },
      'dedupe-tag-key': {
        'name': 'Desduplicar a seção de tags no YAML',
        'description': 'Ativa a remoção de tags duplicadas.',
      },
      'dedupe-array-keys': {
        'name': 'Desduplicar as seções de array no YAML',
        'description': 'Ativa a remoção de valores duplicados para arrays regulares no YAML',
      },
      'ignore-keys': {
        'name': 'Chaves do YAML a Ignorar',
        'description': 'Uma lista de chaves do YAML, sem os dois pontos finais e em linhas separadas, cujos valores duplicados não devem ser removidos.',
      },
    },
    // default-language-for-code-fences.ts
    'default-language-for-code-fences': {
      'name': 'Linguagem Padrão para Blocos de Código',
      'description': 'Adiciona uma linguagem padrão a blocos de código que não têm uma linguagem especificada.',
      'default-language': {
        'name': 'Linguagem de Programação',
        'description': 'Deixe em branco para não fazer nada. Tags de linguagens podem ser encontradas <a href="https://prismjs.com/#supported-languages">aqui</a>.',
      },
    },
    // emphasis-style.ts
    'emphasis-style': {
      'name': 'Estilo de Ênfase',
      'description': 'Garante que o estilo de ênfase (itálico) seja consistente.',
      'style': {
        'name': 'Estilo',
        'description': 'O estilo usado para denotar conteúdo com ênfase',
      },
    },
    // empty-line-around-blockquotes.ts
    'empty-line-around-blockquotes': {
      'name': 'Linha Vazia ao Redor de Citações',
      'description': 'Garante que haja uma linha vazia ao redor de citações (blockquotes) a menos que elas iniciem ou terminem um documento. <b>Nota: uma linha vazia é um nível a menos de aninhamento para citações ou um caractere de nova linha.</b>',
    },
    // empty-line-around-code-fences.ts
    'empty-line-around-code-fences': {
      'name': 'Linha Vazia ao Redor de Blocos de Código',
      'description': 'Garante que haja uma linha vazia ao redor de blocos de código a menos que eles iniciem ou terminem um documento.',
    },
    // empty-line-around-math-block.ts
    'empty-line-around-math-blocks': {
      'name': 'Linha Vazia ao Redor de Blocos Matemáticos',
      'description': 'Garante que haja uma linha vazia ao redor de blocos matemáticos usando <code>Número de Cifrões para Indicar Bloco Matemático</code> para determinar quantos cifrões indicam um bloco matemático em matemática de linha única.',
    },
    // empty-line-around-tables.ts
    'empty-line-around-tables': {
      'name': 'Linha Vazia ao Redor de Tabelas',
      'description': 'Garante que haja uma linha vazia ao redor de tabelas no estilo GitHub, a menos que elas iniciem ou terminem um documento.',
    },
    // escape-yaml-special-characters.ts
    'escape-yaml-special-characters': {
      'name': 'Escapar Caracteres Especiais no YAML',
      'description': 'Faz o escape de dois-pontos seguidos por um espaço (: ), aspas simples (\') e aspas duplas (") no YAML.',
      'try-to-escape-single-line-arrays': {
        'name': 'Tentar Escapar Arrays de Linha Única',
        'description': 'Tenta fazer o escape de valores de array presumindo que o array começa com "[", termina com "]" e possui itens delimitados por ",".',
      },
    },
    // file-name-heading.ts
    'file-name-heading': {
      'name': 'Cabeçalho de Nome do Arquivo',
      'description': 'Insere o nome do arquivo como um cabeçalho H1 se nenhum cabeçalho H1 existir.',
    },
    // footnote-after-punctuation.ts
    'footnote-after-punctuation': {
      'name': 'Nota de Rodapé após Pontuação',
      'description': 'Garante que as referências a notas de rodapé sejam colocadas após a pontuação, e não antes.',
    },
    // force-yaml-escape.ts
    'force-yaml-escape': {
      'name': 'Forçar Escape no YAML',
      'description': 'Faz o escape dos valores das chaves YAML especificadas.',
      'force-yaml-escape-keys': {
        'name': 'Forçar Escape em Chaves do YAML',
        'description': 'Usa o caractere de escape do YAML nas chaves especificadas, separadas por uma quebra de linha, se ainda não tiverem escape. Não use em arrays do YAML.',
      },
    },
    // format-tags-in-yaml.ts
    'format-tags-in-yaml': {
      'name': 'Formatar Tags no YAML',
      'description': 'Remove hashtags (#) das tags no frontmatter YAML, pois elas tornam as tags inválidas.',
    },
    // format-yaml-array.ts
    'format-yaml-array': {
      'name': 'Formatar Array no YAML',
      'description': 'Permite a formatação de arrays regulares no YAML como linha múltipla ou linha única e permite que <code>tags</code> e <code>aliases</code> tenham alguns formatos do YAML específicos do Obsidian. <b>Nota: de string única para linha única converte uma entrada de string única em um array de linha única se houver mais de 1 entrada. O mesmo é válido de string única para múltiplas linhas, exceto que se torna um array multilinha.</b>',
      'alias-key': {
        'name': 'Formatar seção de aliases no YAML',
        'description': 'Ativa a formatação para a seção de aliases do YAML. Você não deve ativar esta opção junto com a regra <code>Alias do Título no YAML</code>, pois podem não funcionar bem em conjunto ou podem ter estilos de formato diferentes selecionados causando resultados inesperados.',
      },
      'tag-key': {
        'name': 'Formatar seção de tags no YAML',
        'description': 'Ativa a formatação para a seção de tags do YAML.',
      },
      'default-array-style': {
        'name': 'Estilo de seção padrão do array no YAML',
        'description': 'O estilo de outros arrays no YAML que não são <code>tags</code>, <code>aliases</code> ou que não estejam em <code>Forçar valores das chaves a serem arrays de linha única</code> e <code>Forçar valores das chaves a serem arrays de múltiplas linhas</code>',
      },
      'default-array-keys': {
        'name': 'Formatar seção de array no YAML',
        'description': 'Ativa a formatação para arrays regulares no YAML',
      },
      'force-single-line-array-style': {
        'name': 'Forçar valores das chaves a serem arrays de linha única',
        'description': 'Força os arrays no YAML correspondentes às chaves (separadas por novas linhas) a usarem o formato de linha única (deixe em branco para desativar)',
      },
      'force-multi-line-array-style': {
        'name': 'Forçar valores das chaves a serem arrays de múltiplas linhas',
        'description': 'Força os arrays no YAML correspondentes às chaves (separadas por novas linhas) a usarem o formato de múltiplas linhas (deixe em branco para desativar)',
      },
    },
    // header-increment.ts
    'header-increment': {
      'name': 'Incremento de Cabeçalho',
      'description': 'Níveis de cabeçalho devem ser incrementados apenas em um nível por vez',
      'start-at-h2': {
        'name': 'Iniciar Incremento de Cabeçalho a partir do Nível 2',
        'description': 'Torna o cabeçalho de nível 2 o nível mínimo em um arquivo para incremento e altera todos os cabeçalhos de acordo, de forma a começarem no mínimo a partir do nível 2.',
      },
    },
    // heading-blank-lines.ts
    'heading-blank-lines': {
      'name': 'Linhas em branco em cabeçalhos',
      'description': 'Todos os cabeçalhos devem ter uma linha em branco tanto antes quanto depois (exceto quando o cabeçalho estiver no início ou no fim do documento).',
      'bottom': {
        'name': 'Depois',
        'description': 'Garante uma linha em branco após os cabeçalhos (quando desativado não remove linhas em branco depois dos cabeçalhos)',
      },
      'empty-line-after-yaml': {
        'name': 'Linha Vazia entre YAML e Cabeçalho',
        'description': 'Mantém a linha em branco entre o frontmatter YAML e o cabeçalho',
      },
    },
    // headings-start-line.ts
    'headings-start-line': {
      'name': 'Cabeçalhos no Início da Linha',
      'description': 'Cabeçalhos que não iniciam uma linha terão os espaços em branco precedentes removidos, garantindo que sejam reconhecidos como cabeçalhos.',
    },
    // insert-yaml-attributes.ts
    'insert-yaml-attributes': {
      'name': 'Inserir Atributos YAML',
      'description': 'Insere os atributos YAML informados no frontmatter YAML. Coloque cada atributo em uma única linha.',
      'text-to-insert': {
        'name': 'Texto a inserir',
        'description': 'Texto a ser inserido no frontmatter YAML',
      },
    },
    // line-break-at-document-end.ts
    'line-break-at-document-end': {
      'name': 'Quebra de Linha ao Final do Documento',
      'description': 'Garante que haja exatamente uma quebra de linha ao final do documento, se a nota não estiver vazia.',
    },
    // move-footnotes-to-the-bottom.ts
    'move-footnotes-to-the-bottom': {
      'name': 'Mover Notas de Rodapé para o Fim',
      'description': 'Move todas as notas de rodapé para o final do documento e garante que elas sejam organizadas com base na ordem em que são referenciadas no corpo do arquivo.',
      'include-blank-line-between-footnotes': {
        'name': 'Incluir Linha em Branco entre Notas de Rodapé',
        'description': 'Inclui uma linha em branco entre as notas de rodapé quando ativado.',
      },
    },
    // move-math-block-indicators-to-their-own-line.ts
    'move-math-block-indicators-to-their-own-line': {
      'name': 'Mover Indicadores de Blocos Matemáticos para Linha Própria',
      'description': 'Move todos os indicadores de início e fim de blocos matemáticos para suas próprias linhas, usando o <code>Número de Cifrões para Indicar Bloco Matemático</code> para determinar quantos cifrões indicam um bloco matemático para expressões em linha única.',
    },
    // move-tags-to-yaml.ts
    'move-tags-to-yaml': {
      'name': 'Mover Tags para o YAML',
      'description': 'Move todas as tags para o frontmatter YAML do documento.',
      'how-to-handle-existing-tags': {
        'name': 'Operação na tag no corpo do texto',
        'description': 'O que fazer com as tags não ignoradas no corpo do arquivo após terem sido movidas para o frontmatter',
      },
      'tags-to-ignore': {
        'name': 'Tags a ignorar',
        'description': 'As tags que não serão movidas para o array de tags ou removidas do conteúdo do corpo caso <code>Remover a hashtag de tags no corpo do conteúdo</code> esteja ativado. Cada tag deve estar em uma nova linha e sem o <code>#</code>. <b>Certifique-se de não incluir a hashtag no nome da tag.</b>',
      },
    },
    // no-bare-urls.ts
    'no-bare-urls': {
      'name': 'Sem URLs sem Delimitadores',
      'description': 'Envolve as URLs soltas com sinais de menor e maior (< >) exceto quando em crases, colchetes, aspas simples ou aspas duplas.',
      'no-bare-uris': {
        'name': 'Sem URIs sem Delimitadores',
        'description': 'Tenta envolver URIs soltas com sinais de menor e maior (< >) exceto quando em crases, colchetes, aspas simples ou aspas duplas.',
      },
    },
    // ordered-list-style.ts
    'ordered-list-style': {
      'name': 'Estilo de Lista Ordenada',
      'description': 'Garante que as listas ordenadas sigam o estilo especificado. <b>Nota: 2 espaços ou 1 tabulação são considerados como um nível de indentação.</b>',
      'number-style': {
        'name': 'Estilo Numérico',
        'description': 'O estilo numérico usado em indicadores de lista ordenada',
      },
      'list-end-style': {
        'name': 'Estilo do Sufixo do Indicador de Lista',
        'description': 'O caractere final do indicador de lista ordenada',
      },
      'preserve-start': {
        'name': 'Preservar Número Inicial',
        'description': 'Se o número inicial de uma lista ordenada deve ser preservado. Isso pode ser usado para ter uma lista ordenada com conteúdo inserido entre os itens da lista.',
      },
    },
    // paragraph-blank-lines.ts
    'paragraph-blank-lines': {
      'name': 'Linhas em branco nos parágrafos',
      'description': 'Todos os parágrafos devem ter exatamente uma linha em branco tanto antes quanto depois.',
    },
    // prevent-double-checklist-indicator-on-paste.ts
    'prevent-double-checklist-indicator-on-paste': {
      'name': 'Prevenir Duplo Indicador de Checklist ao Colar',
      'description': 'Remove o indicador inicial de checklist do texto a colar se a linha onde o cursor está já tiver um indicador de checklist',
    },
    // prevent-double-list-item-indicator-on-paste.ts
    'prevent-double-list-item-indicator-on-paste': {
      'name': 'Prevenir Duplo Indicador de Item de Lista ao Colar',
      'description': 'Remove o indicador inicial de lista do texto a colar se a linha onde o cursor está já tiver um indicador de lista',
    },
    // proper-ellipsis-on-paste.ts
    'proper-ellipsis-on-paste': {
      'name': 'Reticências Adequadas ao Colar',
      'description': 'Substitui os três pontos consecutivos por reticências, mesmo que haja espaço entre elas, no texto a ser colado',
    },
    // proper-ellipsis.ts
    'proper-ellipsis': {
      'name': 'Reticências Adequadas',
      'description': 'Substitui três pontos consecutivos por reticências.',
    },
    // quote-style.ts
    'quote-style': {
      'name': 'Estilo de Aspas',
      'description': 'Atualiza as aspas no conteúdo do corpo para os estilos especificados de aspas simples e duplas.',
      'single-quote-enabled': {
        'name': 'Ativar <code>Estilo de Aspas Simples</code>',
        'description': 'Especifica que o estilo selecionado para aspas simples deve ser utilizado.',
      },
      'single-quote-style': {
        'name': 'Estilo de Aspas Simples',
        'description': 'O estilo de aspas simples a ser utilizado.',
      },
      'double-quote-enabled': {
        'name': 'Ativar <code>Estilo de Aspas Duplas</code>',
        'description': 'Especifica que o estilo selecionado para aspas duplas deve ser utilizado.',
      },
      'double-quote-style': {
        'name': 'Estilo de Aspas Duplas',
        'description': 'O estilo de aspas duplas a ser utilizado.',
      },
    },
    // re-index-footnotes.ts
    're-index-footnotes': {
      'name': 'Reindexar Notas de Rodapé',
      'description': 'Reindexa as chaves e notas de rodapé, baseando-se na ordem das referências no arquivo. <b>Nota: Esta regra <i>não</i> funciona se houver mais de uma nota de rodapé para a mesma chave.</b>',
    },
    // remove-consecutive-list-markers.ts
    'remove-consecutive-list-markers': {
      'name': 'Remover Marcadores de Lista Consecutivos',
      'description': 'Remove marcadores de lista consecutivos. Útil ao copiar e colar itens de lista.',
    },
    // remove-empty-lines-between-list-markers-and-checklists.ts
    'remove-empty-lines-between-list-markers-and-checklists': {
      'name': 'Remover Linhas Vazias Entre Marcadores e Checklists',
      'description': 'Não deve haver linhas vazias entre marcadores de lista e checklists.',
    },
    // remove-empty-list-markers.ts
    'remove-empty-list-markers': {
      'name': 'Remover Marcadores de Lista Vazios',
      'description': 'Remove marcadores de lista vazios, ou seja, itens de lista sem conteúdo.',
    },
    // empty-line-around-horizontal-rules.ts
    'empty-line-around-horizontal-rules': {
      'name': 'Linha Vazia ao Redor de Réguas Horizontais',
      'description': 'Garante que haja uma linha vazia ao redor das réguas horizontais a menos que iniciem ou terminem o documento.',
    },
    // remove-hyphenated-line-breaks.ts
    'remove-hyphenated-line-breaks': {
      'name': 'Remover Quebras de Linha Hifenizadas',
      'description': 'Remove quebras de linha com hífen. Útil ao colar textos de livros.',
    },
    // remove-hyphens-on-paste.ts
    'remove-hyphens-on-paste': {
      'name': 'Remover Hífens ao Colar',
      'description': 'Remove hífens do texto ao colar',
    },
    // remove-leading-or-trailing-whitespace-on-paste.ts
    'remove-leading-or-trailing-whitespace-on-paste': {
      'name': 'Remover Espaços em Branco Iniciais ou Finais ao Colar',
      'description': 'Remove quaisquer espaços em branco iniciais (exceto tabulações) e todos os espaços em branco finais do texto ao colar',
    },
    // remove-leftover-footnotes-from-quote-on-paste.ts
    'remove-leftover-footnotes-from-quote-on-paste': {
      'name': 'Remover Notas de Rodapé Restantes em Citações ao Colar',
      'description': 'Remove quaisquer referências a notas de rodapé restantes no texto a colar',
    },
    // remove-link-spacing.ts
    'remove-link-spacing': {
      'name': 'Remover Espaçamento de Links',
      'description': 'Remove o espaçamento ao redor do texto do link.',
    },
    // remove-multiple-blank-lines-on-paste.ts
    'remove-multiple-blank-lines-on-paste': {
      'name': 'Remover Várias Linhas em Branco ao Colar',
      'description': 'Condensa várias linhas em branco em apenas uma para o texto a colar',
    },
    // remove-multiple-spaces.ts
    'remove-multiple-spaces': {
      'name': 'Remover Espaços Múltiplos',
      'description': 'Remove dois ou mais espaços consecutivos. Ignora espaços no início e no fim da linha. ',
    },
    // remove-space-around-characters.ts
    'remove-space-around-characters': {
      'name': 'Remover Espaço ao Redor de Caracteres',
      'description': 'Garante que determinados caracteres não estejam cercados por espaços em branco (seja espaço simples ou tabulação). <b>Nota: isso pode causar problemas de formatação no markdown em alguns casos.</b>',
      'include-fullwidth-forms': {
        'name': 'Incluir Formas de Largura Completa (Fullwidth)',
        'description': 'Inclui o <a href="https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)">bloco Unicode de Formas de Largura Meia e Completa</a>',
      },
      'include-cjk-symbols-and-punctuation': {
        'name': 'Incluir Símbolos e Pontuação CJK',
        'description': 'Inclui o <a href="https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation">bloco Unicode de Símbolos e Pontuação CJK</a>',
      },
      'include-dashes': {
        'name': 'Incluir Traços',
        'description': 'Inclui o traço curto (–) e o travessão (—)',
      },
      'other-symbols': {
        'name': 'Outros Símbolos',
        'description': 'Outros símbolos a incluir',
      },
    },
    // remove-space-before-or-after-characters.ts
    'remove-space-before-or-after-characters': {
      'name': 'Remover Espaço Antes ou Depois de Caracteres',
      'description': 'Remove o espaço antes e depois dos caracteres especificados. <b>Nota: isso pode causar problemas de formatação em markdown em alguns casos.</b>',
      'characters-to-remove-space-before': {
        'name': 'Remover Espaço Antes de Caracteres',
        'description': 'Remove espaço antes dos caracteres especificados. <b>Nota: usar <code>{</code> ou <code>}</code> na lista de caracteres afetará inesperadamente os arquivos, pois são usados na sintaxe de ignorar nos bastidores.</b>',
      },
      'characters-to-remove-space-after': {
        'name': 'Remover Espaço Após Caracteres',
        'description': 'Remove o espaço após os caracteres especificados. <b>Nota: usar <code>{</code> ou <code>}</code> na lista de caracteres afetará inesperadamente os arquivos, pois são usados na sintaxe de ignorar nos bastidores.</b>',
      },
    },
    // remove-trailing-punctuation-in-heading.ts
    'remove-trailing-punctuation-in-heading': {
      'name': 'Remover Pontuação Final em Cabeçalhos',
      'description': 'Remove as pontuações especificadas do fim dos cabeçalhos, certificando-se de ignorar o ponto e vírgula no fim de <a href="https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references">referências e entidades HTML</a>.',
      'punctuation-to-remove': {
        'name': 'Pontuação Final',
        'description': 'A pontuação final a ser removida dos cabeçalhos do arquivo.',
      },
    },
    // remove-yaml-keys.ts
    'remove-yaml-keys': {
      'name': 'Remover Chaves do YAML',
      'description': 'Remove as chaves especificadas do YAML',
      'yaml-keys-to-remove': {
        'name': 'Chaves do YAML a Remover',
        'description': 'As chaves do YAML a serem removidas do frontmatter, com ou sem dois-pontos',
      },
    },
    // sort-yaml-array-values.ts
    'sort-yaml-array-values': {
      'name': 'Ordenar Valores de Array no YAML',
      'description': 'Ordena os valores dos arrays no YAML com base na ordem de classificação especificada.',
      'sort-alias-key': {
        'name': 'Ordenar a seção de aliases do YAML',
        'description': 'Ativa a ordenação de aliases.',
      },
      'sort-tag-key': {
        'name': 'Ordenar a seção de tags do YAML',
        'description': 'Ativa a ordenação de tags.',
      },
      'sort-array-keys': {
        'name': 'Ordenar seções de arrays no YAML',
        'description': 'Ativa a ordenação de valores para arrays regulares no YAML',
      },
      'ignore-keys': {
        'name': 'Chaves do YAML a Ignorar',
        'description': 'Uma lista de chaves do YAML sem os dois pontos finais em linhas próprias que não devem ter seus valores ordenados.',
      },
      'sort-order': {
        'name': 'Ordem de Classificação',
        'description': 'A forma de ordenar os valores do array do YAML.',
      },
    },
    // space-after-list-markers.ts
    'space-after-list-markers': {
      'name': 'Espaços após marcadores de lista',
      'description': 'Deve haver um único espaço após os marcadores de lista e checkboxes.',
    },
    // space-between-chinese-japanese-or-korean-and-english-or-numbers.ts
    'space-between-chinese-japanese-or-korean-and-english-or-numbers': {
      'name': 'Espaço entre Chinês, Japonês ou Coreano e Inglês ou números',
      'description': 'Garante que os idiomas Chinês, Japonês ou Coreano e Inglês ou números sejam separados por um único espaço. Segue essas <a href="https://github.com/sparanoid/chinese-copywriting-guidelines">diretrizes</a>',
      'english-symbols-punctuation-before': {
        'name': 'Símbolos e Pontuações do Inglês Antes de CJK',
        'description': 'A lista de pontuações e símbolos não-letras a considerar como sendo do Inglês quando encontrados antes de caracteres Chineses, Japoneses ou Coreanos. <b>Nota: "*" é sempre considerado como sendo Inglês e é necessário para lidar adequadamente com algumas sintaxes de markdown.</b>',
      },
      'english-symbols-punctuation-after': {
        'name': 'Símbolos e Pontuações do Inglês Depois de CJK',
        'description': 'A lista de pontuações e símbolos não-letras a considerar como sendo do Inglês quando encontrados depois de caracteres Chineses, Japoneses ou Coreanos. <b>Nota: "*" é sempre considerado como sendo Inglês e é necessário para lidar adequadamente com algumas sintaxes de markdown.</b>',
      },
    },
    // strong-style.ts
    'strong-style': {
      'name': 'Estilo de Negrito',
      'description': 'Garante que o estilo de negrito seja consistente.',
      'style': {
        'name': 'Estilo',
        'description': 'O estilo usado para denotar conteúdo em negrito',
      },
    },
    // trailing-spaces.ts
    'trailing-spaces': {
      'name': 'Espaços Finais',
      'description': 'Remove espaços extras no final de todas as linhas.',
      'two-space-line-break': {
        'name': 'Quebra de Linha com Dois Espaços',
        'description': 'Ignora dois espaços seguidos de uma quebra de linha ("Regra dos Dois Espaços").',
      },
    },
    // two-spaces-between-lines-with-content.ts
    'two-spaces-between-lines-with-content': {
      'name': 'Quebra de Linha Entre Linhas com Conteúdo',
      'description': 'Garante que a quebra de linha especificada seja adicionada aos fins de linhas com conteúdo que continuam na próxima linha para parágrafos, blockquotes e itens de lista',
      'line-break-indicator': {
        'name': 'Indicador de Quebra de Linha',
        'description': 'O indicador de quebra de linha a ser utilizado.',
      },
    },
    // unordered-list-style.ts
    'unordered-list-style': {
      'name': 'Estilo de Lista Não Ordenada',
      'description': 'Garante que as listas não ordenadas sigam o estilo especificado.',
      'list-style': {
        'name': 'Estilo de item de lista',
        'description': 'O estilo de item de lista a usar em listas não ordenadas',
      },
    },
    // yaml-key-sort.ts
    'yaml-key-sort': {
      'name': 'Ordenar Chaves do YAML',
      'description': 'Ordena as chaves do YAML baseando-se na ordem e prioridade especificadas. <b>Nota: também pode remover linhas em branco. Funciona apenas em chaves não aninhadas.</b>',
      'yaml-key-priority-sort-order': {
        'name': 'Ordem de Classificação e Prioridade de Chaves do YAML',
        'description': 'A ordem pela qual classificar as chaves, colocando uma em cada linha, sendo ordenadas conforme aparecem na lista',
      },
      'priority-keys-at-start-of-yaml': {
        'name': 'Chaves Prioritárias no Início do YAML',
        'description': 'Posiciona as chaves da "Ordem de Classificação de Chaves do YAML" no início do frontmatter YAML',
      },
      'yaml-sort-order-for-other-keys': {
        'name': 'Ordem de Classificação do YAML para Outras Chaves',
        'description': 'A forma de classificar as chaves que não se encontram na área de texto de Ordem de Classificação de Chaves do YAML',
      },
    },
    // yaml-timestamp.ts
    'yaml-timestamp': {
      'name': 'Timestamp no YAML',
      'description': 'Acompanha a data em que o arquivo foi editado pela última vez no frontmatter YAML. Obtém as datas a partir dos metadados do arquivo.',
      'date-created': {
        'name': 'Data de Criação',
        'description': 'Inserir a data de criação do arquivo',
      },
      'date-created-key': {
        'name': 'Chave de Data de Criação',
        'description': 'Qual chave do YAML usar para a data de criação',
      },
      'date-created-source-of-truth': {
        'name': 'Fonte da Verdade da Data de Criação',
        'description': 'Especifica de onde obter o valor da data de criação se ela já estiver presente no frontmatter.',
      },
      'date-modified-source-of-truth': {
        'name': 'Fonte da Verdade da Data de Modificação',
        'description': 'Especifica qual método deve ser usado para determinar quando a data de modificação deve ser atualizada caso ela esteja presente no frontmatter.',
      },
      'date-modified': {
        'name': 'Data de Modificação',
        'description': 'Inserir a data em que o arquivo foi modificado pela última vez',
      },
      'date-modified-key': {
        'name': 'Chave da Data de Modificação',
        'description': 'Qual chave do YAML usar para a data de modificação',
      },
      'format': {
        'name': 'Formato',
        'description': 'Formato de data do Moment a utilizar (veja as <a href="https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/">opções de formato do Moment</a>)',
      },
      'convert-to-utc': {
        'name': 'Converter Horário Local para UTC',
        'description': 'Usa a equivalência em UTC para datas salvas em vez do horário local',
      },
      'update-on-file-contents-updated': {
        'name': 'Atualizar Timestamp no YAML ao Atualizar o Conteúdo do Arquivo',
        'description': 'Quando a nota atualmente ativa for modificada, o <code>Timestamp no YAML</code> será executado na nota. Isso deve atualizar o timestamp da nota se diferir do valor atual em mais de 5 segundos.',
      },
    },
    // yaml-title-alias.ts
    'yaml-title-alias': {
      'name': 'Alias do Título no YAML',
      'description': 'Insere ou atualiza o título do arquivo na seção de aliases do frontmatter YAML. Obtém o título do primeiro H1 ou do nome do arquivo.',
      'preserve-existing-alias-section-style': {
        'name': 'Preservar estilo da seção de aliases existentes',
        'description': 'Se definido, a configuração <code>Estilo da seção de aliases no YAML</code> será aplicada apenas nas seções recém-criadas',
      },
      'keep-alias-that-matches-the-filename': {
        'name': 'Manter alias que corresponda ao nome do arquivo',
        'description': 'Tais aliases geralmente são redundantes',
      },
      'use-yaml-key-to-keep-track-of-old-filename-or-heading': {
        'name': 'Usar a chave do YAML especificada por <code>Chave Auxiliar de Alias</code> para ajudar com alterações no nome do arquivo e cabeçalho',
        'description': 'Se ativado, ao alterar o primeiro cabeçalho H1 (ou o nome do arquivo, caso não haja H1), o alias antigo guardado nessa chave será substituído pelo novo valor em vez de apenas inserir uma nova entrada no array de aliases',
      },
      'alias-helper-key': {
        'name': 'Chave Auxiliar de Alias',
        'description': 'A chave a ser utilizada para ajudar a rastrear qual foi o último nome de arquivo ou cabeçalho salvo no frontmatter por esta regra.',
      },
    },
    // yaml-title.ts
    'yaml-title': {
      'name': 'Título no YAML',
      'description': 'Insere o título do arquivo no frontmatter YAML. Obtém o título baseando-se no modo selecionado.',
      'title-key': {
        'name': 'Chave de Título',
        'description': 'Qual chave do YAML usar para o título',
      },
      'mode': {
        'name': 'Modo',
        'description': 'O método a usar para obter o título',
      },
    },
  },

  // These are the string values in the UI for enum values and thus they do not follow the key format as used above
  'enums': {
    'Title Case': 'Title Case',
    'ALL CAPS': 'TUDO EM MAIÚSCULAS',
    'First letter': 'Primeira letra',
    '.': '.', // leave as is
    ')': ')', // leave as is
    'ERROR': 'erro',
    'TRACE': 'trace',
    'DEBUG': 'debug',
    'INFO': 'info',
    'WARN': 'aviso',
    'SILENT': 'silencioso',
    'ascending': 'ascendente',
    'lazy': 'lazy',
    'preserve': 'preservar',
    'Nothing': 'Nada',
    'Remove hashtag': 'Remover hashtag',
    'Remove whole tag': 'Remover tag inteira',
    'asterisk': 'asterisco',
    'underscore': 'sublinhado',
    'consistent': 'consistente',
    '-': '-', // leave as is
    '*': '*', // leave as is
    '+': '+', // leave as is
    'space': 'espaço',
    'no space': 'sem espaço',
    'None': 'Nenhum',
    'Ascending Alphabetical': 'Alfabética Ascendente',
    'Descending Alphabetical': 'Alfabética Descendente',
    // yaml.ts
    'multi-line': 'várias linhas',
    'single-line': 'linha única',
    'single string to single-line': 'string única para linha única',
    'single string to multi-line': 'string única para várias linhas',
    'single string comma delimited': 'string única delimitada por vírgulas',
    'single string space delimited': 'string única delimitada por espaços',
    'single-line space delimited': 'linha única delimitada por espaços',
    // yaml-title.ts
    'first-h1': 'Primeiro H1',
    'first-h1-or-filename-if-h1-missing': 'Primeiro H1 ou Nome do Arquivo se H1 estiver ausente',
    'filename': 'Nome do Arquivo',
    // settings-data.ts
    'never': 'Nunca',
    'after 5 seconds': 'Após 5 segundos',
    'after 10 seconds': 'Após 10 segundos',
    'after 15 seconds': 'Após 15 segundos',
    'after 30 seconds': 'Após 30 segundos',
    'after 1 minute': 'Após 1 minuto',
    // yaml-timestamp.ts
    'file system': 'Sistema de arquivos',
    'frontmatter': 'Frontmatter YAML',
    'user or Linter edits': 'Alterações no Obsidian',
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

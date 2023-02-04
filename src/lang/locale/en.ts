// English

export default {
  'commands': {
    'lint-file': {
      'name': 'Lint the current file',
      'error-message': 'Lint File Error in File',
    },
    'lint-file-unless-ignored': {
      'name': 'Lint the current file unless ignored',
    },
    'lint-all-files': {
      'name': 'Lint all files in the vault',
      'error-message': 'Lint All Files Error in File',
      'success-message': 'Linted all files',
      'errors-message-singular': 'Linted all files and there was 1 error.',
      'errors-message-plural': 'Linted all files and there were {NUM} errors.',
      'start-message': 'This will edit all of your files and may introduce errors.',
      'submit-button-text': 'Lint All',
      'submit-button-notice-text': 'Linting all files...',
    },
    'lint-all-files-in-folder': {
      'name': 'Lint all files in the current folder',
      'start-message': 'This will edit all of your files in {FOLDER_NAME} including files in its subfolders which may introduce errors.',
      'submit-button-text': 'Lint All Files in {FOLDER_NAME}',
      'submit-button-notice-text': 'Lint all files in {FOLDER_NAME}...',
      'error-message': 'Lint All Files in Folder Error in File',
      'success-message': 'Linted all {NUM} files in {FOLDER_NAME}.',
      'message-singular': 'Linted all {NUM} files in {FOLDER_NAME} and there was 1 error.',
      'message-plural': 'Linted all {FILE_COUNT} files in {FOLDER_NAME} and there were {ERROR_COUNT} error.',
    },
    'paste-as-plain-text': {
      'name': 'Paste as Plain Text & without Modifications',
    },
    'lint-file-pop-up-menu-text': {
      'name': 'Lint file',
    },
    'lint-folder-pop-up-menu-text': {
      'name': 'Lint folder',
    },
  },

  'logs': {
    'plugin-load': 'Loading plugin',
    'plugin-unload': 'Unloading plugin',
    'folder-lint': 'Linting folder ',
    'linter-run': 'Running linter',
    'paste-link-warning': 'aborted paste lint as the clipboard content is a link and doing so will avoid conflicts with other plugins that modify pasting.',
    'see-console': 'See console for more details.',
    'unknown-error': 'An unknown error occurred during linting.',
    'moment-locale-not-found': 'Trying to switch Moment.js locale to {MOMENT_LOCALE}, got {CURRENT_LOCALE}',

    // rules-runner.ts
    'pre-rules': 'rules before regular rules',
    'post-rules': 'rules after regular rules',
    'rule-running': 'rules running',
    'custom-regex': 'custom regex rules',
    'running-custom-regex': 'Running Custom Regex',
    'running-custom-lint-command': 'Running Custom Lint Commands',
    'custom-lint-duplicate-warning': 'You cannot run the same command ("{COMMAND_NAME}") as a custom lint rule twice.',
    'custom-lint-error-message': 'Custom Lint Command',

    // rules-runner.ts and rule-builder.ts
    'disabled-text': 'is disabled',

    // rule-builder.ts
    'run-rule-text': 'Running',


    // logger.ts
    'timing-key-not-found': 'timing key \'{TIMING_KEY}\' does not exist in the timing info list, so it was ignored',
  },

  'notice-text': {
    'empty-clipboard': 'There is no clipboard content.',
    'characters-added': 'characters added',
    'characters-removed': 'characters removed',
  },

  // settings.ts
  'linter-title': 'Linter',
  'empty-search-results-text': 'No settings match search',

  // lint-confirmation-modal.ts
  'warning-text': 'Warning',
  'file-backup-text': 'Make sure you have backed up your files.',

  // tab.ts
  'general-tab-name': 'General Settings',
  'custom-tab-name': 'Custom Settings',
  'yaml-tab-name': 'YAML Settings',
  'heading-tab-name': 'Heading Settings',
  'footnote-tab-name': 'Footnote Settings',
  'content-tab-name': 'Content Settings',
  'spacing-tab-name': 'Spacing Settings',
  'paste-tab-name': 'Paste Settings',
  'debug-tab-name': 'Debug Settings',

  // tab-searcher.ts
  'default-search-bar-text': 'Search all settings',

  // general-tab.ts
  'lint-on-save-name': 'Lint on save',
  'lint-on-save-description': 'Lint the file on manual save (when `Ctrl + S` is pressed or when `:w` is executed while using vim keybindings)',
  'display-message-name': 'Display message on lint',
  'display-message-description': 'Display the number of characters changed after linting',
  'folders-to-ignore-name': 'Folders to ignore',
  'folders-to-ignore-description': 'Folders to ignore when linting all files or linting on save. Enter folder paths separated by newlines',
  'override-locale-name': 'Override locale',
  'override-locale-description': 'Set this if you want to use a locale different from the default',
  'same-as-system-locale': 'Same as system ({SYS_LOCALE})',
  'yaml-aliases-section-style-name': 'YAML aliases section style',
  'yaml-aliases-section-style-description': 'The style of the YAML aliases section',
  'yaml-tags-section-style-name': 'YAML tags section style',
  'yaml-tags-section-style-description': 'The style of the YAML tags section',
  'default-escape-character-name': 'Default Escape Character',
  'remove-unnecessary-escape-chars-in-multi-line-arrays-name': 'Remove Unnecessary Escape Characters when in Multi-Line Array Format',
  'remove-unnecessary-escape-chars-in-multi-line-arrays-description': 'Escape characters for multi-line YAML arrays don\'t need the same escaping as single-line arrays, so when in multi-line format remove extra escapes that are not necessary',
  'default-escape-character-description': 'The default character to use to escape YAML values when a single quote and double quote are not present.',
  'number-of-dollar-signs-to-indicate-math-block-name': 'Number of Dollar Signs to Indicate Math Block',
  'number-of-dollar-signs-to-indicate-math-block-description': 'The amount of dollar signs to consider the math content to be a math block instead of inline math',

  // debug-tab.ts
  'log-level-name': 'Log Level',
  'log-level-description': 'The types of logs that will be allowed to be logged by the service. The default is ERROR.',
  'linter-config-name': 'Linter Config',
  'linter-config-description': 'The contents of the data.json for the Linter as of the setting page loading',
  'log-collection-name': 'Collect logs when linting on save and linting the current file',
  'log-collection-description': 'Goes ahead and collects logs when you `Lint on save` and linting the current file. These logs can be helpful for debugging and create bug reports.',
  'linter-logs-name': 'Linter Logs',
  'linter-logs-description': 'The logs from the last `Lint on save` or the last lint current file run if enabled.',
  'ERROR': 'error',
  'TRACE': 'trace',
  'DEBUG': 'debug',
  'INFO': 'info',
  'WARN': 'warn',
  'SILENT': 'silent',

  // custom-command-option.ts
  'custom-command-name': 'Custom Commands',
  'custom-command-description': 'Custom commands are Obsidian commands that get run after the linter is finished running its regular rules. This means that they do not run before the YAML timestamp logic runs, so they can cause YAML timestamp to be triggered on the next run of the linter. You may only select an Obsidian command once. **_Note that this currently only works on linting the current file._**',
  'custom-command-warning': 'When selecting an option, make sure to select the option either by using the mouse or by hitting the enter key. Other selection methods may not work and only selections of an actual Obsidian command or an empty string will be saved.',
  'custom-command-add-input-button-text': 'Add new command',
  'custom-command-command-search-placeholder-text': 'Obsidian command',
  'custom-command-move-up-tooltip': 'Move up',
  'custom-command-move-down-tooltip': 'Move down',
  'custom-command-delete-tooltip': 'Delete',

  // custom-replace-option.ts
  'custom-replace-name': 'Custom Regex Replacement',
  'custom-replace-description': 'Custom regex replacement can be used to replace anything that matches the find regex with the replacement value. The replace and find values will need to be valid regex values.',
  'custom-replace-warning': 'Use this with caution if you do not know regex. Also, please make sure that you do not use lookbehinds in your regex on iOS mobile as that will cause linting to fail since that is not supported on that platform.',
  'custom-replace-add-input-button-text': 'Add new regex replacement',
  'custom-replace-regex-to-find-placeholder-text': 'regex to find',
  'custom-replace-flags-placeholder-text': 'flags',
  'custom-replace-regex-to-replace-placeholder-text': 'regex to replace',
  'custom-replace-delete-tooltip': 'Delete',

  // mdast.ts
  'missing-footnote-error-message': `Footnote '{FOOTNOTE}' has no corresponding footnote reference before the footnote contents and cannot be processed. Please make sure that all footnotes have a corresponding reference before the content of the footnote.`,

  // yaml.ts
  'invalid-delimiter-error-message': 'delimiter is only allowed to be a single character',

  // rules
  'rules': {
    // auto-correct-common-misspellings.ts
    'auto-correct-common-misspellings': {
      'name': 'Auto-correct Common Misspellings',
      'description': 'Uses a dictionary of common misspellings to automatically convert them to their proper spellings. See [auto-correct map](https://github.com/platers/obsidian-linter/tree/master/src/utils/auto-correct-misspellings.ts) for the full list of auto-corrected words.',
      'ignore-words': {
        'name': 'Ignore Words',
        'description': 'A comma separated list of lowercased words to ignore when auto-correcting',
      },
      // blockquotify-on-paste.ts
      'add-blockquote-indentation-on-paste': {
        'name': 'Add Blockquote Indentation on Paste',
        'description': 'Adds blockquotes to all but the first line, when the cursor is in a blockquote/callout line during pasting',
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
          'ame': 'Ignore Words',
          'description': 'A comma separated list of words to ignore when capitalizing',
        },
        'lowercase-words': {
          'name': 'Lowercase Words',
          'description': 'A comma separated list of words to keep lowercase',
        },
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
  },

  // compact-yaml.ts
  'compact-yaml-name': 'Compact YAML',
  'compact-yaml-description': 'Removes leading and trailing blank lines in the YAML front matter.',
  'compact-yaml-inner-new-lines-name': 'Inner New Lines',
  'compact-yaml-inner-new-lines-description': 'Remove new lines that are not at the start or the end of the YAML',
  // consecutive-blank-lines.ts
  'consecutive-blank-lines-name': 'Consecutive blank lines',
  'consecutive-blank-lines-description': 'There should be at most one consecutive blank line.',
  // convert-bullet-list-markers.ts
  'convert-bullet-list-markers-name': 'Convert Bullet List Markers',
  'convert-bullet-list-markers-description': 'Converts common bullet list marker symbols to markdown list markers.',
  // convert-spaces-to-tabs.ts
  'convert-spaces-to-tabs-name': 'Convert Spaces to Tabs',
  'convert-spaces-to-tabs-description': 'Converts leading spaces to tabs.',
  'convert-spaces-to-tabs-tabsize-name': 'Tabsize',
  'convert-spaces-to-tabs-tabsize-description': 'Number of spaces that will be converted to a tab',
  // emphasis-style.ts
  'emphasis-style-name': 'Emphasis Style',
  'emphasis-style-description': 'Makes sure the emphasis style is consistent.',
  'emphasis-style-style-name': 'Style',
  'emphasis-style-style-description': 'The style used to denote emphasized content',
  // empty-line-around-blockquotes.ts
  'empty-line-around-blockquotes-name': 'Empty Line Around Blockquotes',
  'empty-line-around-blockquotes-description': 'Ensures that there is an empty line around blockquotes unless they start or end a document. **Note that an empty line is either one less level of nesting for blockquotes or a newline character.**',
  // empty-line-around-code-fences.ts
  'empty-line-around-code-fences-name': 'Empty Line Around Code Fences',
  'empty-line-around-code-fences-description': 'Ensures that there is an empty line around code fences unless they start or end a document.',
  // empty-line-around-math-block.ts
  'empty-line-around-math-blocks-name': 'Empty Line Around Math Blocks',
  'empty-line-around-math-blocks-description': 'Ensures that there is an empty line around math blocks using `Number of Dollar Signs to Indicate a Math Block` to determine how many dollar signs indicates a math block for single-line math.',
  // empty-line-around-tables.ts
  'empty-line-around-tables-name': 'Empty Line Around Tables',
  'empty-line-around-tables-description': 'Ensures that there is an empty line around github flavored tables unless they start or end a document.',
  // escape-yaml-special-characters.ts
  'escape-yaml-special-characters-name': 'Escape YAML Special Characters',
  'escape-yaml-special-characters-description': 'Escapes colons with a space after them (: ), single quotes (\'), and double quotes (") in YAML.',
  'escape-yaml-special-characters-try-to-escape-single-line-arrays-name': 'Try to Escape Single Line Arrays',
  'escape-yaml-special-characters-try-to-escape-single-line-arrays-description': 'Tries to escape array values assuming that an array starts with "[", ends with "]", and has items that are delimited by ",".',
  // file-name-heading.ts
  'file-name-heading-name': 'File Name Heading',
  'file-name-heading-description': 'Inserts the file name as a H1 heading if no H1 heading exists.',
  // footnote-after-punctuation.ts
  'footnote-after-punctuation-name': 'Footnote after Punctuation',
  'footnote-after-punctuation-description': 'Ensures that footnote references are placed after punctuation, not before.',
  // force-yaml-escape.ts
  'force-yaml-escape-name': 'Force YAML Escape',
  'force-yaml-escape-description': 'Escapes the values for the specified YAML keys.',
  'force-yaml-escape-force-yaml-escape-name': 'Force YAML Escape on Keys',
  'force-yaml-escape-force-yaml-escape-description': 'Uses the YAML escape character on the specified YAML keys separated by a new line character if it is not already escaped. Do not use on YAML arrays.',
  // format-tags-in-yaml.ts
  'format-tags-in-yaml-name': 'Format Tags in YAML',
  'format-tags-in-yaml-description': 'Remove Hashtags from tags in the YAML frontmatter, as they make the tags there invalid.',
  // format-yaml-array.ts
  'format-yaml-array-name': 'Format Yaml Array',
  'format-yaml-array-description': 'Allows for the formatting of regular yaml arrays as either multi-line or single-line and `tags` and `aliases` are allowed to have some Obsidian specific yaml formats. Note that single string to single-line goes from a single string entry to a single-line array if more than 1 entry is present. The same is true for single string to multi-line except it becomes a multi-line array.',
  'format-yaml-array-format-alias-key-name': 'Format yaml aliases section',
  'format-yaml-array-format-alias-key-description': 'Turns on formatting for the yaml aliases section. You should not enable this option alongside the rule `YAML Title Alias` as they may not work well together or they may have different format styles selected causing unexpected results.',
  'format-yaml-array-format-tag-key-name': 'Format yaml tags section',
  'format-yaml-array-format-tag-key-description': 'Turns on formatting for the yaml tags section.',
  'format-yaml-array-default-array-style-name': 'Default yaml array section style',
  'format-yaml-array-default-array-style-description': 'The style of other yaml arrays that are not `tags`, `aliases` or  in `Force key values to be single-line arrays` and `Force key values to be multi-line arrays`',
  'format-yaml-array-default-array-keys-name': 'Format yaml array sections',
  'format-yaml-array-default-array-keys-description': 'Turns on formatting for regular yaml arrays',
  'format-yaml-array-force-single-line-array-style-name': 'Force key values to be single-line arrays',
  'format-yaml-array-force-single-line-array-style-description': 'Forces the yaml array for the new line separated keys to be in single-line format (leave empty to disable this option)',
  'format-yaml-array-force-multi-line-array-style-name': 'Force key values to be multi-line arrays',
  'format-yaml-array-force-multi-line-array-style-description': 'Forces the yaml array for the new line separated keys to be in multi-line format (leave empty to disable this option)',
  // header-increment.ts
  'header-increment-name': 'Header Increment',
  'header-increment-description': 'Heading levels should only increment by one level at a time',
  'header-increment-start-at-h2-name': 'Start Header Increment at Heading Level 2',
  'header-increment-start-at-h2-description': 'Makes heading level 2 the minimum heading level in a file for header increment and shifts all headings accordingly so they increment starting with a level 2 heading.',
  // heading-blank-lines.ts
  'heading-blank-lines-name': 'Heading blank lines',
  'heading-blank-lines-description': 'All headings have a blank line both before and after (except where the heading is at the beginning or end of the document).',
  'heading-blank-lines-bottom-name': 'Bottom',
  'heading-blank-lines-bottom-description': 'Insert a blank line after headings',
  'heading-blank-lines-empty-line-after-yaml-name': 'Empty Line Between Yaml and Header',
  'heading-blank-lines-empty-line-after-yaml-description': 'Keep the empty line between the Yaml frontmatter and header',
  // headings-start-line.ts
  'headings-start-line-name': 'Headings Start Line',
  'headings-start-line-description': 'Headings that do not start a line will have their preceding whitespace removed to make sure they get recognized as headers.',
  // insert-yaml-attributes.ts
  'insert-yaml-attributes-name': 'Insert YAML attributes',
  'insert-yaml-attributes-description': 'Inserts the given YAML attributes into the YAML frontmatter. Put each attribute on a single line.',
  'insert-yaml-attributes-text-to-insert-name': 'Text to insert',
  'insert-yaml-attributes-text-to-insert-description': 'Text to insert into the YAML frontmatter',
  // line-break-at-document-end.ts
  'line-break-at-document-end-name': 'Line Break at Document End',
  'line-break-at-document-end-description': 'Ensures that there is exactly one line break at the end of a document.',
  // move-footnotes-to-the-bottom.ts
  'move-footnotes-to-the-bottom-name': 'Move Footnotes to the bottom',
  'move-footnotes-to-the-bottom-description': 'Move all footnotes to the bottom of the document.',
  // move-math-block-indicators-to-their-own-line.ts
  'move-math-block-indicators-to-their-own-line-name': 'Move Math Block Indicators to Their Own Line',
  'move-math-block-indicators-to-their-own-line-description': 'Move all starting and ending math block indicators to their own lines using `Number of Dollar Signs to Indicate a Math Block` to determine how many dollar signs indicates a math block for single-line math.',
  // move-tags-to-yaml.ts
  'move-tags-to-yaml-name': 'Move Tags to Yaml',
  'move-tags-to-yaml-description': 'Move all tags to Yaml frontmatter of the document.',
  'move-tags-to-yaml-how-to-handle-existing-tags-name': 'Body tag operation',
  'move-tags-to-yaml-how-to-handle-existing-tags-description': 'What to do with non-ignored tags in the body of the file once they have been moved to the frontmatter',
  'Nothing': 'Nothing',
  'Remove hashtag': 'Remove hashtag',
  'Remove whole tag': 'Remove whole tag',
  'move-tags-to-yaml-tags-to-ignore-name': 'Tags to ignore',
  'move-tags-to-yaml-tags-to-ignore-description': 'The tags that will not be moved to the tags array or removed from the body content if `Remove the hashtag from tags in content body` is enabled. Each tag should be on a new line and without the `#`. **Make sure not to include the hashtag in the tag name.**',
  // no-bare-urls.ts
  'no-bare-urls-name': 'No Bare URLs',
  'no-bare-urls-description': 'Encloses bare URLs with angle brackets except when enclosed in back ticks, square braces, or single or double quotes.',
  // ordered-list-style.ts
  'ordered-list-style-name': 'Ordered List Style',
  'ordered-list-style-description': 'Makes sure that ordered lists follow the style specified. Note that 2 spaces or 1 tab is considered to be an indentation level.',
  'ordered-list-style-number-style-name': 'Number Style',
  'ordered-list-style-number-style-description': 'The number style used in ordered list indicators',
  'ascending': 'ascending',
  'lazy': 'lazy',
  'ordered-list-style-list-end-style-name': 'Ordered List Indicator End Style',
  'ordered-list-style-list-end-style-description': 'The ending character of an ordered list indicator',
  // paragraph-blank-lines.ts
  'paragraph-blank-lines-name': 'Paragraph blank lines',
  'paragraph-blank-lines-description': 'All paragraphs should have exactly one blank line both before and after.',
  // prevent-double-checklist-indicator-on-paste.ts
  'prevent-double-checklist-indicator-on-paste-name': 'Prevent Double Checklist Indicator on Paste',
  'prevent-double-checklist-indicator-on-paste-description': 'Removes starting checklist indicator from the text to paste if the line the cursor is on in the file has a checklist indicator',
  // prevent-double-list-item-indicator-on-paste.ts
  'prevent-double-list-item-indicator-on-paste-name': 'Prevent Double List Item Indicator on Paste',
  'prevent-double-list-item-indicator-on-paste-description': 'Removes starting list indicator from the text to paste if the line the cursor is on in the file has a list indicator',
  // proper-ellipsis-on-paste.ts
  'proper-ellipsis-on-paste-name': 'Proper Ellipsis on Paste',
  'proper-ellipsis-on-paste-description': 'Replaces three consecutive dots with an ellipsis even if they have a space between them in the text to paste',
  // proper-ellipsis.ts
  'proper-ellipsis-name': 'Proper Ellipsis',
  'proper-ellipsis-description': 'Replaces three consecutive dots with an ellipsis.',
  // re-index-footnotes.ts
  're-index-footnotes-name': 'Re-Index Footnotes',
  're-index-footnotes-description': 'Re-indexes footnote keys and footnote, based on the order of occurrence (NOTE: This rule deliberately does *not* preserve the relation between key and footnote, to be able to re-index duplicate keys.)',
  // remove-consecutive-list-markers.ts
  'remove-consecutive-list-markers-name': 'Remove Consecutive List Markers',
  'remove-consecutive-list-markers-description': 'Removes consecutive list markers. Useful when copy-pasting list items.',
  // remove-empty-lines-between-list-markers-and-checklists.ts
  'remove-empty-lines-between-list-markers-and-checklists-name': 'Remove Empty Lines Between List Markers and Checklists',
  'remove-empty-lines-between-list-markers-and-checklists-description': 'There should not be any empty lines between list markers and checklists.',
  // remove-empty-list-markers.ts
  'remove-empty-list-markers-name': 'Remove Empty List Markers',
  'remove-empty-list-markers-description': 'Removes empty list markers, i.e. list items without content.',
  // remove-hyphenated-line-breaks.ts
  'remove-hyphenated-line-breaks-name': 'Remove Hyphenated Line Breaks',
  'remove-hyphenated-line-breaks-description': 'Removes hyphenated line breaks. Useful when pasting text from textbooks.',
  // remove-hyphens-on-paste.ts
  'remove-hyphens-on-paste-name': 'Remove Hyphens on Paste',
  'remove-hyphens-on-paste-description': 'Removes hyphens from the text to paste',
  // remove-leading-or-trailing-whitespace-on-paste.ts
  'remove-leading-or-trailing-whitespace-on-paste-name': 'Remove Leading or Trailing Whitespace on Paste',
  'remove-leading-or-trailing-whitespace-on-paste-description': 'Removes any leading non-tab whitespace and all trailing whitespace for the text to paste',
  // remove-leftover-footnotes-from-quote-on-paste.ts
  'remove-leftover-footnotes-from-quote-on-paste-name': 'Remove Leftover Footnotes from Quote on Paste',
  'remove-leftover-footnotes-from-quote-on-paste-description': 'Removes any leftover footnote references for the text to paste',
  // remove-link-spacing.ts
  'remove-link-spacing-name': 'Remove link spacing',
  'remove-link-spacing-description': 'Removes spacing around link text.',
  // remove-multiple-blank-lines-on-paste.ts
  'remove-multiple-blank-lines-on-paste-name': 'Remove Multiple Blank Lines on Paste',
  'remove-multiple-blank-lines-on-paste-description': 'Condenses multiple blank lines down into one blank line for the text to paste',
  // remove-multiple-spaces.ts
  'remove-multiple-spaces-name': 'Remove Multiple Spaces',
  'remove-multiple-spaces-description': 'Removes two or more consecutive spaces. Ignores spaces at the beginning and ending of the line. ',
  // remove-space-around-characters.ts
  'remove-space-around-characters-name': 'Remove Space around Characters',
  'remove-space-around-characters-description': 'Ensures that certain characters are not surrounded by whitespace (either single spaces or a tab). Note that this may causes issues with markdown format in some cases.',
  'remove-space-around-characters-include-fullwidth-forms-name': 'Include Fullwidth Forms',
  'remove-space-around-characters-include-fullwidth-forms-description': 'Include <a href="https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)">Fullwidth Forms Unicode block</a>',
  'remove-space-around-characters-include-cjk-symbols-and-punctuation-name': 'Include CJK Symbols and Punctuation',
  'remove-space-around-characters-include-cjk-symbols-and-punctuation-description': 'Include <a href="https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation">CJK Symbols and Punctuation Unicode block</a>',
  'remove-space-around-characters-include-dashes-name': 'Include Dashes',
  'remove-space-around-characters-include-dashes-description': 'Include en dash (–) and em dash (—)',
  'remove-space-around-characters-other-symbols-name': 'Other symbols',
  'remove-space-around-characters-other-symbols-description': 'Other symbols to include',
  // remove-trailing-punctuation-in-heading.ts
  'remove-trailing-punctuation-in-heading-name': 'Remove Trailing Punctuation in Heading',
  'remove-trailing-punctuation-in-heading-description': 'Removes the specified punctuation from the end of headings making sure to ignore the semicolon at the end of [HTML entity references](https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references).',
  'remove-trailing-punctuation-in-heading-punctuation-to-remove-name': 'Trailing Punctuation',
  'remove-trailing-punctuation-in-heading-punctuation-to-remove-description': 'The trailing punctuation to remove from the headings in the file.',
  // remove-yaml-keys.ts
  'remove-yaml-keys-name': 'Remove YAML Keys',
  'remove-yaml-keys-description': 'Removes the YAML keys specified',
  'remove-yaml-keys-yaml-keys-to-remove-name': 'YAML Keys to Remove',
  'remove-yaml-keys-yaml-keys-to-remove-description': 'The yaml keys to remove from the yaml frontmatter with or without colons',
  // space-after-list-markers.ts
  'space-after-list-markers-name': 'Space after list markers',
  'space-after-list-markers-description': 'There should be a single space after list markers and checkboxes.',
  // space-between-chinese-japanese-or-korean-and-english-or-numbers.ts
  'space-between-chinese-japanese-or-korean-and-english-or-numbers-name': 'Space between Chinese Japanese or Korean and English or numbers',
  'space-between-chinese-japanese-or-korean-and-english-or-numbers-description': 'Ensures that Chinese, Japanese, or Korean and English or numbers are separated by a single space. Follows these [guidelines](https://github.com/sparanoid/chinese-copywriting-guidelines)',
  // strong-style.ts
  'strong-style-name': 'Strong Style',
  'strong-style-description': 'Makes sure the strong style is consistent.',
  'strong-style-style-name': 'Style',
  'strong-style-style-description': 'The style used to denote strong/bolded content',
  'asterisk': 'asterisk',
  'underscore': 'underscore',
  // trailing-spaces.ts
  'trailing-spaces-name': 'Trailing spaces',
  'trailing-spaces-description': 'Removes extra spaces after every line.',
  'trailing-spaces-two-space-line-break-name': 'Two Space Linebreak',
  'trailing-spaces-two-space-line-break-description': 'Ignore two spaces followed by a line break ("Two Space Rule").',
  // two-spaces-between-lines-with-content.ts
  'two-spaces-between-lines-with-content-name': 'Two Spaces Between Lines with Content',
  'two-spaces-between-lines-with-content-description': 'Makes sure that two spaces are added to the ends of lines with content continued on the next line for paragraphs, blockquotes, and list items',
  // unordered-list-style.ts
  'unordered-list-style-name': 'Unordered List Style',
  'unordered-list-style-description': 'Makes sure that unordered lists follow the style specified.',
  'unordered-list-style-list-style-name': 'List item style',
  'unordered-list-style-list-style-description': 'The list item style to use in unordered lists',
  'consistent': 'consistent',
  '-': '-', // leave as is
  '*': '*', // leave as is
  '+': '+', // leave as is
  // yaml-key-sort.ts
  'yaml-key-sort-name': 'YAML Key Sort',
  'yaml-key-sort-description': 'Sorts the YAML keys based on the order and priority specified. Note: may remove blank lines as well.',
  'yaml-key-sort-yaml-key-priority-sort-order-name': 'YAML Key Priority Sort Order',
  'yaml-key-sort-yaml-key-priority-sort-order-description': 'The order in which to sort keys with one on each line where it sorts in the order found in the list',
  'yaml-key-sort-priority-keys-at-start-of-yaml-name': 'Priority Keys at Start of YAML',
  'yaml-key-sort-priority-keys-at-start-of-yaml-description': 'YAML Key Priority Sort Order is placed at the start of the YAML frontmatter',
  'yaml-key-sort-yaml-sort-order-for-other-keys-name': 'YAML Sort Order for Other Keys',
  'yaml-key-sort-yaml-sort-order-for-other-keys-description': 'The way in which to sort the keys that are not found in the YAML Key Priority Sort Order text area',
  'None': 'None',
  'Ascending Alphabetical': 'Ascending Alphabetical',
  'Descending Alphabetical': 'Descending Alphabetical',
  // yaml-timestamp.ts
  'yaml-timestamp-name': 'YAML Timestamp',
  'yaml-timestamp-description': 'Keep track of the date the file was last edited in the YAML front matter. Gets dates from file metadata.',
  'yaml-timestamp-date-created-name': 'Date Created',
  'yaml-timestamp-date-created-description': 'Insert the file creation date',
  'yaml-timestamp-date-created-key-name': 'Date Created Key',
  'yaml-timestamp-date-created-key-description': 'Which YAML key to use for creation date',
  'yaml-timestamp-force-retention-of-create-value-name': 'Force Date Created Key Value Retention',
  'yaml-timestamp-force-retention-of-create-value-description': 'Reuses the value in the YAML frontmatter for date created instead of the file metadata which is useful for preventing file metadata changes from causing the value to change to a different value.',
  'yaml-timestamp-date-modified-name': 'Date Modified',
  'yaml-timestamp-date-modified-description': 'Insert the date the file was last modified',
  'yaml-timestamp-date-modified-key-name': 'Date Modified Key',
  'yaml-timestamp-date-modified-key-description': 'Which YAML key to use for modification date',
  'yaml-timestamp-format-name': 'Format',
  'yaml-timestamp-format-description': 'Moment date format to use (see [Moment format options](https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/))',
  'yaml-timestamp-force-retention-of-create-value-name': 'Force Retention of `Date Created Key`\'s Value',
  'yaml-timestamp-force-retention-of-create-value-description': 'Forces the reuse of the value of `Date Created Key` in the YAML frontmatter if it exists instead of using the file metadata which helps preserve the created at timestamp when syncing a file between devices or after a file has lost its original creation date.',
  'invalid-date-format-error': `The format of the created date '{DATE}' could not be parsed or determined so the created date was left alone in '{FILE_NAME}'`,
  // yaml-title-alias.ts
  'yaml-title-alias-name': 'YAML Title Alias',
  'yaml-title-alias-description': 'Inserts the title of the file into the YAML frontmatter\'s aliases section. Gets the title from the first H1 or filename.',
  'yaml-title-alias-preserve-existing-alias-section-style-name': 'Preserve existing aliases section style',
  'yaml-title-alias-preserve-existing-alias-section-style-description': 'If set, the `YAML aliases section style` setting applies only to the newly created sections',
  'yaml-title-alias-keep-alias-that-matches-the-filename-name': 'Keep alias that matches the filename',
  'yaml-title-alias-keep-alias-that-matches-the-filename-description': 'Such aliases are usually redundant',
  'yaml-title-alias-use-yaml-key-to-keep-track-of-old-filename-or-heading-name': 'Use the YAML key `linter-yaml-title-alias` to help with filename and heading changes',
  'yaml-title-alias-use-yaml-key-to-keep-track-of-old-filename-or-heading-description': 'If set, when the first H1 heading changes or filename if first H1 is not present changes, then the old alias stored in this key will be replaced with the new value instead of just inserting a new entry in the aliases array',
  // yaml-title.ts
  'yaml-title-name': 'YAML Title',
  'yaml-title-description': 'Inserts the title of the file into the YAML frontmatter. Gets the title from the first H1 or filename if there is no H1.',
  'yaml-title-title-key-name': 'Title Key',
  'yaml-title-title-key-description': 'Which YAML key to use for title',

  // yaml.ts
  'multi-line': 'multi-line',
  'single-line': 'single-line',
  'single string to single-line': 'single string to single-line',
  'single string to multi-line': 'single string to multi-line',
  'single string comma delimited': 'single string to multi-line',
  'single string space delimited': 'single string space delimited',
  'single-line space delimited': 'single-line space delimited',
};

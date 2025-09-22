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
      'submit-button-notice-text': 'Linting all files in {FOLDER_NAME}...',
      'error-message': 'Lint All Files in Folder Error in File',
      'success-message': 'Linted all {NUM} files in {FOLDER_NAME}.',
      'message-singular': 'Linted all {NUM} files in {FOLDER_NAME} and there was 1 error.',
      'message-plural': 'Linted all {FILE_COUNT} files in {FOLDER_NAME} and there were {ERROR_COUNT} error.',
    },
    'paste-as-plain-text': {
      'name': 'Paste as Plain Text & without Modifications',
    },
    'ignore-folder': {
      'name': 'Ignore folder',
    },
    'ignore-file': {
      'name': 'Ignore file',
    },
    'lint-file-pop-up-menu-text': {
      'name': 'Lint file',
    },
    'lint-folder-pop-up-menu-text': {
      'name': 'Lint folder',
    },
    'ignore-file-pop-up-menu-text': {
      'name': 'Ignore file in Linter',
    },
    'ignore-folder-pop-up-menu-text': {
      'name': 'Ignore folder in Linter',
    },
  },

  'logs': {
    'plugin-load': 'Loading plugin',
    'plugin-unload': 'Unloading plugin',
    'folder-lint': 'Linting folder ',
    'linter-run': 'Running linter',
    'file-change-yaml-lint-run': 'Running editor content change YAML linting',
    'file-change-yaml-lint-skipped': 'No file change detected, so YAML linting skipped',
    'file-change-yaml-lint-warning': 'No file info is present, but debounce ran. Something went wrong somewhere.',
    'paste-link-warning': 'aborted paste lint as the clipboard content is a link and doing so will avoid conflicts with other plugins that modify pasting.',
    'see-console': 'See console for more details.',
    'unknown-error': 'An unknown error occurred during linting.',
    'moment-locale-not-found': 'Trying to switch Moment.js locale to {MOMENT_LOCALE}, got {CURRENT_LOCALE}',
    'file-change-lint-message-start': 'Linted',
    'custom-command-callback-warning': 'Please only set the custom command callback for integration tests.',

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
    'milliseconds-abbreviation': 'ms',

    'invalid-date-format-error': `The format of the created date '{DATE}' could not be parsed or determined so the created date was left alone in '{FILE_NAME}'`,

    // yaml.ts
    'invalid-delimiter-error-message': 'delimiter is only allowed to be a single character',

    // mdast.ts
    'missing-footnote-error-message': `Footnote '{FOOTNOTE}' has no corresponding footnote reference before the footnote contents and cannot be processed. Please make sure that all footnotes have a corresponding reference before the content of the footnote.`,
    'too-many-footnotes-error-message': `Footnote key '{FOOTNOTE_KEY}' has more than 1 footnote referencing it. Please update the footnotes so that there is only one footnote per footnote key.`,

    // rules.ts
    'wrapper-yaml-error': 'error in the YAML: {ERROR_MESSAGE}',
    'wrapper-unknown-error': 'unknown error: {ERROR_MESSAGE}',
  },

  'notice-text': {
    'empty-clipboard': 'There is no clipboard content.',
    'characters-added': 'characters added',
    'characters-removed': 'characters removed',
    'copy-to-clipboard-failed': 'Failed to copy text to clipboard: ',
  },

  // rule-alias-suggester.ts
  'all-rules-option': 'All',

  // settings.ts
  'linter-title': 'Linter',
  'empty-search-results-text': 'No settings match search',

  // lint-confirmation-modal.ts
  'warning-text': 'Warning',
  'file-backup-text': 'Make sure you have backed up your files.',
  'custom-command-warning': 'Linting multiple files with custom commands enabled is a slow process that requires the ability to open panes in the side panel. It is noticeably slower than running without custom commands enabled. Please proceed with caution.',
  'cancel-button-text': 'Cancel',

  'copy-aria-label': 'Copy',

  'disabled-other-rule-notice': 'If you enable <code>{NAME_1}</code>, it will disable <code>{NAME_2}</code>. Would you like to proceed?',
  'disabled-conflicting-rule-notice': '{NAME_1}, conflicts with {NAME_2}, so it has been turned off. You can switch which setting is off in the settings tab.',

  // confirm-rule-disable-modal.ts
  'ok': 'Ok',

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
      'general': 'General',
      'custom': 'Custom',
      'yaml': 'YAML',
      'heading': 'Heading',
      'content': 'Content',
      'footnote': 'Footnote',
      'spacing': 'Spacing',
      'paste': 'Paste',
      'debug': 'Debug',
    },
    // tab-searcher.ts
    'default-search-bar-text': 'Search all settings',
    'general': {
      // general-tab.ts
      'lint-on-save': {
        'name': 'Lint on save',
        'description': 'Lint the file on manual save (when <code>Ctrl + S</code> is pressed or when <code>:w</code> is executed while using vim keybindings)',
      },
      'display-message': {
        'name': 'Display message on lint',
        'description': 'Display the number of characters changed after linting',
      },
      'suppress-message-when-no-change': {
        'name': 'Suppress Message When No Change',
        'description': 'If enabled, no message will be shown when no actual changes occur.',
      },
      'lint-on-file-change': {
        'name': 'Lint on Focused File Change',
        'description': 'When a file is closed or a new file is swapped to, the previous file is linted.',
      },
      'display-lint-on-file-change-message': {
        'name': 'Display Lint on File Change Message',
        'description': 'Displays a message when <code>Lint on Focused File Change</code> occurs',
      },
      'folders-to-ignore': {
        'name': 'Folders to ignore',
        'description': 'Folders to ignore when linting all files or linting on save.',
        'folder-search-placeholder-text': 'Folder name',
        'add-input-button-text': 'Add another folder to ignore',
        'delete-tooltip': 'Delete',
      },
      'files-to-ignore': {
        'name': 'Files to ignore',
        'description': 'Files to ignore when linting all files or linting on save.',
        'file-search-placeholder-text': 'regex for file to ignore',
        'add-input-button-text': 'Add another file to ignore regex',
        'delete-tooltip': 'Delete',
        'label-placeholder-text': 'label',
        'flags-placeholder-text': 'flags',
        'warning': 'Use this with caution if you do not know regex. Also, please make sure that if you use lookbehinds in your regex on iOS mobile that you are on a version that supports using them.',
      },
      'override-locale': {
        'name': 'Override locale',
        'description': 'Set this if you want to use a locale different from the default',
      },
      'same-as-system-locale': 'Same as system ({SYS_LOCALE})',
      'yaml-aliases-section-style': {
        'name': 'YAML aliases section style',
        'description': 'The style of the YAML aliases section',
      },
      'yaml-tags-section-style': {
        'name': 'YAML tags section style',
        'description': 'The style of the YAML tags section',
      },
      'default-escape-character': {
        'name': 'Default Escape Character',
        'description': 'The default character to use to escape YAML values when a single quote and double quote are not present.',
      },
      'remove-unnecessary-escape-chars-in-multi-line-arrays': {
        'name': 'Remove Unnecessary Escape Characters when in Multi-Line Array Format',
        'description': 'Escape characters for multi-line YAML arrays don\'t need the same escaping as single-line arrays, so when in multi-line format remove extra escapes that are not necessary',
      },
      'number-of-dollar-signs-to-indicate-math-block': {
        'name': 'Number of Dollar Signs to Indicate Math Block',
        'description': 'The amount of dollar signs to consider the math content to be a math block instead of inline math',
      },
    },
    'debug': {
      // debug-tab.ts
      'log-level': {
        'name': 'Log Level',
        'description': 'The types of logs that will be allowed to be logged by the service. The default is ERROR.',
      },
      'linter-config': {
        'name': 'Linter Config',
        'description': 'The contents of the data.json for the Linter as of the setting page loading',
      },
      'log-collection': {
        'name': 'Collect logs when linting on save and linting the current file',
        'description': 'Goes ahead and collects logs when you <code>Lint on save</code> and linting the current file. These logs can be helpful for debugging and create bug reports.',
      },
      'linter-logs': {
        'name': 'Linter Logs',
        'description': 'The logs from the last <code>Lint on save</code> or the last lint current file run if enabled.',
      },
    },
  },

  'options': {
    'custom-command': {
      // custom-command-option.ts
      'name': 'Custom Commands',
      'description': 'Custom commands are Obsidian commands that get run after the linter is finished running its regular rules. This means that they do not run before the YAML timestamp logic runs, so they can cause YAML timestamp to be triggered on the next run of the linter. You may only select an Obsidian command once.',
      'warning': 'When selecting an option, make sure to select the option either by using the mouse or by hitting the enter key. Other selection methods may not work and only selections of an actual Obsidian command or an empty string will be saved.',

      'add-input-button-text': 'Add new command',
      'command-search-placeholder-text': 'Obsidian command',
      'move-up-tooltip': 'Move up',
      'move-down-tooltip': 'Move down',
      'delete-tooltip': 'Delete',
    },
    'custom-replace': {
      // custom-replace-option.ts
      'name': 'Custom Regex Replacement',
      'description': 'Custom regex replacement can be used to replace anything that matches the find regex with the replacement value. The replace and find values will need to be valid regex values.',
      'warning': 'Use this with caution if you do not know regex. Also, please make sure that if you use lookbehinds in your regex on iOS mobile that you are on a version that supports using them.',
      'add-input-button-text': 'Add new regex replacement',
      'regex-to-find-placeholder-text': 'regex to find',
      'flags-placeholder-text': 'flags',
      'regex-to-replace-placeholder-text': 'regex to replace',
      'label-placeholder-text': 'label',
      'move-up-tooltip': 'Move up',
      'move-down-tooltip': 'Move down',
      'delete-tooltip': 'Delete',
    },
    'custom-auto-correct': {
      'delete-tooltip': 'Delete',
      'show-parsed-contents-tooltip': 'View parsed replacements',
      'custom-row-parse-warning': '"{ROW}" is not a valid row with custom replacements. It must have only 2 columns.',
      'file-search-placeholder-text': 'File name',
      'add-new-replacement-file-tooltip': 'Add another custom file',
      'warning-text': 'Selected files will automatically have {NAME} disabled.',
      'refresh-tooltip-text': 'Reload custom replacements',
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
        'description': 'Ensures one blank line after headings',
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
      'description': 'Re-indexes footnote keys and footnote, based on the order of occurrence. <b>Note: This rule does <i>not</i> work if there is more than one footnote for a key.</b>',
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

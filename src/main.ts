import {normalizePath, App, Editor, EventRef, MarkdownView, Menu, Notice, Plugin, TAbstractFile, TFile, TFolder, addIcon, htmlToMarkdown, EditorSelection, EditorChange} from 'obsidian';
import {LinterSettings, rules} from './rules';
import DiffMatchPatch from 'diff-match-patch';
import dedent from 'ts-dedent';
import {stripCr} from './utils/strings';
import log from 'loglevel';
import {logInfo, logError, logDebug, setLogLevel, logWarn} from './logger';
import {moment} from 'obsidian';
import './rules-registry';
import {iconInfo} from './icons';
import {createRunLinterRulesOptions, RulesRunner} from './rules-runner';
import {LinterError} from './linter-error';
import {LintConfirmationModal} from './ui/modals/lint-confirmation-modal';
import {SettingTab} from './ui/settings';
import {NormalArrayFormats, SpecialArrayFormats, TagSpecificArrayFormats} from './utils/yaml';
import {urlRegex} from './utils/regex';

// https://github.com/liamcain/obsidian-calendar-ui/blob/03ceecbf6d88ef260dadf223ee5e483d98d24ffc/src/localization.ts#L20-L43
const langToMomentLocale = {
  'en': 'en-gb',
  'zh': 'zh-cn',
  'zh-TW': 'zh-tw',
  'ru': 'ru',
  'ko': 'ko',
  'it': 'it',
  'id': 'id',
  'ro': 'ro',
  'pt-BR': 'pt-br',
  'cz': 'cs',
  'da': 'da',
  'de': 'de',
  'es': 'es',
  'fr': 'fr',
  'no': 'nn',
  'pl': 'pl',
  'pt': 'pt',
  'tr': 'tr',
  'hi': 'hi',
  'nl': 'nl',
  'ar': 'ar',
  'ja': 'ja',
};

const DEFAULT_SETTINGS: Partial<LinterSettings> = {
  ruleConfigs: {},
  lintOnSave: false,
  displayChanged: true,
  foldersToIgnore: [],
  linterLocale: 'system-default',
  logLevel: log.levels.ERROR,
  lintCommands: [],
  customRegexs: [],
  commonStyles: {
    aliasArrayStyle: NormalArrayFormats.SingleLine,
    tagArrayStyle: NormalArrayFormats.SingleLine,
    minimumNumberOfDollarSignsToBeAMathBlock: 2,
    escapeCharacter: '"',
  },
};

export default class LinterPlugin extends Plugin {
  settings: LinterSettings;
  private eventRefs: EventRef[] = [];
  private momentLocale: string;
  private isEnabled: boolean = true;
  private rulesRunner = new RulesRunner();

  async onload() {
    logInfo('Loading plugin');

    this.isEnabled = true;
    // eslint-disable-next-line guard-for-in
    for (const key in iconInfo) {
      const svg = iconInfo[key];
      addIcon(svg.id, svg.source);
    }

    await this.loadSettings();

    this.addCommands();

    this.registerEventsAndSaveCallback();

    this.addSettingTab(new SettingTab(this.app, this));
  }

  async onunload() {
    logInfo('Unloading plugin');
    this.isEnabled = false;

    for (const eventRef of this.eventRefs) {
      this.app.workspace.offref(eventRef);
    }
  }

  async loadSettings() {
    const data = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data);

    setLogLevel(this.settings.logLevel);
    this.setOrUpdateMomentInstance();

    const escapeYAMLSpecialCharactersRule = this.settings.ruleConfigs['Move Tags to Yaml'];
    if (escapeYAMLSpecialCharactersRule) {
      const forceYamlEscapeKeys = escapeYAMLSpecialCharactersRule['Force Yaml Escape on Keys'];
      if (forceYamlEscapeKeys) {
        if (!this.settings.ruleConfigs['Force YAML Escape']) {
          this.settings.ruleConfigs['Force YAML Escape'] = {};
        }

        this.settings.ruleConfigs['Force YAML Escape']['Force YAML Escape on Keys'] = forceYamlEscapeKeys ?? this.settings.ruleConfigs['Force YAML Escape']['Force YAML Escape on Keys'];
      }

      delete this.settings.ruleConfigs['Escape YAML Special Characters']['Force Yaml Escape on Keys'];
    }

    const moveTagsToYamlRule = this.settings.ruleConfigs['Move Tags to Yaml'];
    if (moveTagsToYamlRule) {
      const removeHashtag = moveTagsToYamlRule['Remove the hashtag from tags in content body'];
      if (removeHashtag !== null && removeHashtag !== undefined) {
        this.settings.ruleConfigs['Move Tags to Yaml']['Body tag operation'] = removeHashtag ? 'Remove hashtag' : 'Nothing';

        delete this.settings.ruleConfigs['Move Tags to Yaml']['Remove the hashtag from tags in content body'];
      }
    }

    const spaceBetweenChineseAndEnglishOrNumbers = this.settings.ruleConfigs['Space between Chinese and English or numbers'];
    if (spaceBetweenChineseAndEnglishOrNumbers) {
      const enabled = spaceBetweenChineseAndEnglishOrNumbers['Ensures that Chinese and English or numbers are separated by a single space. Follows these [guidelines](https://github.com/sparanoid/chinese-copywriting-guidelines)'];
      this.settings.ruleConfigs['Space between Chinese Japanese or Korean and English or numbers'] = {
        'Ensures that Chinese, Japanese, or Korean and English or numbers are separated by a single space. Follows these [guidelines](https://github.com/sparanoid/chinese-copywriting-guidelines)': enabled,
      };
      delete this.settings.ruleConfigs['Space between Chinese and English or numbers'];
    }

    this.moveSettingsToCommonSettings();

    // make sure to load the defaults of any missing rules to make sure they do not cause issues on the settings page
    for (const rule of rules) {
      if (!this.settings.ruleConfigs[rule.name]) {
        this.settings.ruleConfigs[rule.name] = rule.getDefaultOptions();
      }
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  addCommands() {
    this.addCommand({
      id: 'lint-file',
      name: 'Lint the current file',
      editorCallback: (editor) => this.runLinterEditor(editor),
      icon: iconInfo.file.id,
      hotkeys: [
        {
          modifiers: ['Mod', 'Alt'],
          key: 'L',
        },
      ],
    });

    this.addCommand({
      id: 'lint-all-files',
      name: 'Lint all files in the vault',
      icon: iconInfo.vault.id,
      callback: () => {
        const startMessage = 'This will edit all of your files and may introduce errors.';
        const submitBtnText = 'Lint All';
        const submitBtnNoticeText = 'Linting all files...';
        new LintConfirmationModal(this.app, startMessage, submitBtnText, submitBtnNoticeText, () => {
          return this.runLinterAllFiles(this.app);
        }).open();
      },
    });

    this.addCommand({
      id: 'lint-all-files-in-folder',
      name: 'Lint all files in the current folder',
      icon: iconInfo.folder.id,
      editorCheckCallback: (checking: Boolean, _) => {
        if (checking) {
          return !this.app.workspace.getActiveFile().parent.isRoot();
        }

        this.createFolderLintModal(this.app.workspace.getActiveFile().parent);
      },
    });

    this.addCommand({
      id: 'paste-as-plain-text',
      name: 'Paste as Plain Text & without Modifications',
      editorCallback: (editor) => this.pasteAsPlainText(editor),
    });
  }

  registerEventsAndSaveCallback() {
    let eventRef = this.app.workspace.on('editor-paste', (clipboardEv: ClipboardEvent) => {
      // do not paste if another handler has already handled pasting text as that would likely cause a
      // double pasting of the clipboard contents
      if (clipboardEv.defaultPrevented) {
        return;
      }

      this.modifyPasteEvent(clipboardEv);
    });
    this.registerEvent(eventRef);
    this.eventRefs.push(eventRef);

    eventRef = this.app.workspace.on('file-menu', (menu, file, source) => this.onMenuOpenCallback(menu, file, source));
    this.registerEvent(eventRef);
    this.eventRefs.push(eventRef);

    // Source for save setting
    // https://github.com/hipstersmoothie/obsidian-plugin-prettier/blob/main/src/main.ts
    const saveCommandDefinition = this.app.commands?.commands?.[
      'editor:save-file'
    ];
    const save = saveCommandDefinition?.callback;

    if (typeof save === 'function') {
      saveCommandDefinition.callback = () => {
        if (this.settings.lintOnSave && this.isEnabled) {
          const editor = this.getEditor();
          if (!editor) {
            return;
          }

          const file = this.app.workspace.getActiveFile();

          if (!this.shouldIgnoreFile(file)) {
            this.runLinterEditor(editor);
          }
        }
      };
    }

    // defines the vim command for saving a file and lets the linter run on save for it
    // accounts for https://github.com/platers/obsidian-linter/issues/19
    const that = this;
    window.CodeMirrorAdapter.commands.save = () => {
      that.app.commands.executeCommandById('editor:save-file');
    };
  }

  onMenuOpenCallback(menu: Menu, file: TAbstractFile, _source: string) {
    if (file instanceof TFile && file.extension === 'md') {
      menu.addItem((item) => {
        item.setIcon(iconInfo.file.id)
            .setTitle('Lint file')
            .onClick(async () => {
              this.runLinterFile(file);
            });
      });
    } else if (file instanceof TFolder) {
      menu.addItem((item) => {
        item
            .setTitle('Lint folder')
            .setIcon(iconInfo.folder.id)
            .onClick(() => this.createFolderLintModal(file));
      });
    }
  }

  shouldIgnoreFile(file: TFile) {
    for (const folder of this.settings.foldersToIgnore) {
      if (folder.length > 0 && file.path.startsWith(folder)) {
        return true;
      }
    }
    return false;
  }

  async runLinterFile(file: TFile) {
    const oldText = stripCr(await this.app.vault.read(file));
    const newText = this.rulesRunner.lintText(createRunLinterRulesOptions(oldText, file, this.momentLocale, this.settings));

    await this.app.vault.modify(file, newText);

    // Make sure this is disabled until we actually add something to let it work on folder and vault linting
    // this.rulesRunner.runCustomCommands(this.settings.lintCommands, this.app.commands);
  }

  async runLinterAllFiles(app: App) {
    let numberOfErrors = 0;
    await Promise.all(app.vault.getMarkdownFiles().map(async (file) => {
      if (!this.shouldIgnoreFile(file)) {
        try {
          await this.runLinterFile(file);
        } catch (error) {
          this.handleLintError(file, error, 'Lint All Files Error in File \'${file.path}\'');

          numberOfErrors += 1;
        }
      }
    }));

    const userClickTimeout = 0;
    if (numberOfErrors === 0) {
      new Notice('Linted all files', userClickTimeout);
    } else {
      const amountOfErrorsMessage = numberOfErrors === 1 ? 'was 1 error' : 'were ' + numberOfErrors + ' errors';
      new Notice('Linted all files and there ' + amountOfErrorsMessage + '.', userClickTimeout);
    }
  }

  async runLinterAllFilesInFolder(folder: TFolder) {
    logInfo('Linting folder ' + folder.name);

    let numberOfErrors = 0;
    let lintedFiles = 0;
    const folderPath = normalizePath(folder.path) + '/';
    await Promise.all(this.app.vault.getMarkdownFiles().map(async (file) => {
      if (normalizePath(file.path).startsWith(folderPath) && !this.shouldIgnoreFile(file)) {
        try {
          await this.runLinterFile(file);
        } catch (error) {
          this.handleLintError(file, error, 'Lint All Files in Folder Error in File \'${file.path}\'');

          numberOfErrors += 1;
        }

        lintedFiles++;
      }
    }));

    const userClickTimeout = 0;
    if (numberOfErrors === 0) {
      new Notice('Linted all ' + lintedFiles + ' files in ' + folder.name + '.', userClickTimeout);
    } else {
      const amountOfErrorsMessage = numberOfErrors === 1 ? 'was 1 error' : 'were ' + numberOfErrors + ' errors';
      new Notice('Linted all ' + lintedFiles + ' files in ' + folder.name + ' and there ' + amountOfErrorsMessage + '.', userClickTimeout);
    }
  }

  // handles the creation of the folder linting modal since this happens in multiple places and it should be consistent
  createFolderLintModal(folder: TFolder) {
    const startMessage = 'This will edit all of your files in ' + folder.name + ' including files in its subfolders which may introduce errors.';
    const submitBtnText = 'Lint All Files in ' + folder.name;
    const submitBtnNoticeText = 'Linting all files in ' + folder.name + '...';
    new LintConfirmationModal(this.app, startMessage, submitBtnText, submitBtnNoticeText, () => this.runLinterAllFilesInFolder(folder)).open();
  }

  runLinterEditor(editor: Editor) {
    logInfo('Running linter');

    const file = this.app.workspace.getActiveFile();
    const oldText = editor.getValue();
    let newText: string;
    try {
      newText = this.rulesRunner.lintText(createRunLinterRulesOptions(oldText, file, this.momentLocale, this.settings));
    } catch (error) {
      this.handleLintError(file, error, 'Lint File Error in File \'${file.path}\'', false);
      return;
    }

    // Replace changed lines
    const dmp = new DiffMatchPatch.diff_match_patch(); // eslint-disable-line new-cap
    const changes = dmp.diff_main(oldText, newText);
    let curText = '';
    changes.forEach((change) => {
      function endOfDocument(doc: string) {
        const lines = doc.split('\n');
        return {line: lines.length - 1, ch: lines[lines.length - 1].length};
      }

      const [type, value] = change;

      if (type == DiffMatchPatch.DIFF_INSERT) {
        editor.replaceRange(value, endOfDocument(curText));
        curText += value;
      } else if (type == DiffMatchPatch.DIFF_DELETE) {
        const start = endOfDocument(curText);
        let tempText = curText;
        tempText += value;
        const end = endOfDocument(tempText);
        editor.replaceRange('', start, end);
      } else {
        curText += value;
      }
    });

    const charsAdded = changes.map((change) => change[0] == DiffMatchPatch.DIFF_INSERT ? change[1].length : 0).reduce((a, b) => a + b, 0);
    const charsRemoved = changes.map((change) => change[0] == DiffMatchPatch.DIFF_DELETE ? change[1].length : 0).reduce((a, b) => a + b, 0);
    this.displayChangedMessage(charsAdded, charsRemoved);

    try {
      this.rulesRunner.runCustomCommands(this.settings.lintCommands, this.app.commands);
    } catch (error) {
      this.handleLintError(file, error, 'Lint File Error in File \'${file.path}\'', false);
    }
  }

  // based on https://github.com/liamcain/obsidian-calendar-ui/blob/03ceecbf6d88ef260dadf223ee5e483d98d24ffc/src/localization.ts#L85-L109
  async setOrUpdateMomentInstance() {
    const obsidianLang: string = localStorage.getItem('language') || 'en';
    const systemLang = navigator.language?.toLowerCase();

    let momentLocale = langToMomentLocale[obsidianLang as keyof typeof langToMomentLocale];

    if (this.settings.linterLocale !== 'system-default') {
      momentLocale = this.settings.linterLocale;
    } else if (systemLang.startsWith(obsidianLang)) {
      // If the system locale is more specific (en-gb vs en), use the system locale.
      momentLocale = systemLang;
    }

    this.momentLocale = momentLocale;
    const oldLocale = moment.locale();
    const currentLocale = moment.locale(momentLocale);
    logDebug(`Trying to switch Moment.js locale to ${momentLocale}, got ${currentLocale}`);

    moment.locale(oldLocale);
  }

  private displayChangedMessage(charsAdded: number, charsRemoved: number) {
    if (this.settings.displayChanged) {
      const message = dedent`
        ${charsAdded} characters added
        ${charsRemoved} characters removed
      `;
      new Notice(message);
    }
  }

  private handleLintError(file: TFile, error: Error, logErrorStringTemplate: string, useLogTemplateInNotice: boolean = true) {
    const errorMessage = logErrorStringTemplate.replace('${file.path}', file.path);
    if (error instanceof LinterError) {
      if (useLogTemplateInNotice) {
        new Notice(`${errorMessage} ${error.message}.\nSee console for more details.`);
      } else {
        new Notice(`${error.message}.\nSee console for more details.`);
      }
    } else {
      new Notice('An unknown error occurred during linting. See console for details');
    }

    logError(errorMessage, error);
  }

  // based on https://github.com/chrisgrieser/obsidian-smarter-paste/blob/master/main.ts#L43-L79
  // INFO: to inspect clipboard content types, use https://evercoder.github.io/clipboard-inspector/
  async modifyPasteEvent(clipboardEv: ClipboardEvent): Promise<void> {
    // abort when pane isn't markdown editor
    const editor = this.getEditor();
    if (!editor) return;
    // abort when clipboard contains an image (or is empty)
    // check for plain text, since 'getData("text/html")' ignores plain-text
    const plainClipboard = clipboardEv.clipboardData.getData('text/plain');
    if (!plainClipboard) return;

    // Abort when clipboard has URL, to prevent conflict with the plugins
    // Auto Title Link & Paste URL into Selection
    // has to search the entire clipboard (not surrounding the regex with ^$),
    // because otherwise having 2 URLs cause Obsidian-breaking conflict
    if (urlRegex.test(plainClipboard.trim())) {
      logWarn('aborted paste lint as the clipboard content is a link and doing so will avoid conflicts with other plugins that modify pasting.');
      return;
    }

    // prevent default pasting & abort when not successful
    clipboardEv.stopPropagation();
    clipboardEv.preventDefault();
    if (!clipboardEv.defaultPrevented) return;

    // use Turndown via Obsidian API to emulate "Auto Convert HTML" setting
    const convertHtmlEnabled = this.app.vault.getConfig('autoConvertHtml');
    const htmlClipText = clipboardEv.clipboardData.getData('text/html');
    let clipboardText = htmlClipText && convertHtmlEnabled ? htmlToMarkdown(htmlClipText) : plainClipboard;

    // if everything went well, run clipboard modifications (passing in current line and and text to paste)
    const cursorSelections = editor.listSelections();
    if (cursorSelections.length === 1) {
      const cursorSelection = cursorSelections[0];
      clipboardText = this.rulesRunner.runPasteLint(this.getLineContent(editor, cursorSelection), createRunLinterRulesOptions(clipboardText, null, this.momentLocale, this.settings));
      editor.replaceSelection(clipboardText);
    } else {
      this.handleMultiCursorPaste(editor, cursorSelections, clipboardText);
    }
  }

  /**
   * Goes ahead and makes sure that each cursor has the proper paste value and only gets that text pasted there instead of at each cursor.
   * @param {Editor} editor - The codemirror editor where the content is located.
   * @param {EditorSelection[]} cursorSelections - The cursor selections made by the user.
   * @param {string} clipboardText - The clipboard text that is to be pasted, but first needs to be converted to the proper paste value for each cursor.
   */
  handleMultiCursorPaste(editor: Editor, cursorSelections: EditorSelection[], clipboardText: string) {
    const pasteContentPerCursor = this.convertContentIntoProperPasteContent(cursorSelections, clipboardText);
    const editorChange: EditorChange[] = [];

    cursorSelections.forEach((cursorSelection: EditorSelection, index: number) => {
      clipboardText = this.rulesRunner.runPasteLint(this.getLineContent(editor, cursorSelection), createRunLinterRulesOptions(pasteContentPerCursor[index], null, this.momentLocale, this.settings));
      editorChange.push({
        text: clipboardText,
        from: cursorSelection.anchor,
        to: cursorSelection.head,
      });
    });

    // make sure that they are considered one change so that undo will only need to happen once for a multicursor paste
    editor.transaction({
      changes: editorChange,
    });
  }

  /**
   * Divvies up the clipboard text between the multiple cursors and makes sure they either have the whole clipboard text or an even amount of lines from the the clipboard text.
   * @param {EditorSelection[]} cursorSelections - The cursor selections made by the user.
   * @param {string} clipboardText - The clipboard text that is to be pasted, but first needs to be converted to the proper paste value for each cursor.
   * @return {string[]} The content to paste at each cursor which is either the clipboard text or an even division of the clipboard text if there is a multiple
   * of the amount of cursors that is equal to the amount of lines clipboard text.
   */
  convertContentIntoProperPasteContent(cursorSelections: EditorSelection[], clipboardText: string): string[] {
    const clipboardLines = clipboardText.split('\n');
    const contentToPasteForEachCursor: string[] = [];
    if (clipboardLines.length % cursorSelections.length !== 0) {
      for (let index = 0; index < cursorSelections.length; index++) {
        contentToPasteForEachCursor.push(clipboardText);
      }
    } else {
      const numberOfLinesPerCursorSelection = clipboardLines.length / cursorSelections.length;
      let contentToPasteForCursorSelection = '';
      for (let index = 0; index < clipboardLines.length; index++) {
        contentToPasteForCursorSelection += clipboardLines[index];

        // if we are the last index or if the next index should start the next cursor selection paste content, add the cursor selection content to its proper location
        if (index + 1 === cursorSelections.length || ((index + 1) % numberOfLinesPerCursorSelection === 0)) {
          contentToPasteForEachCursor.push(contentToPasteForCursorSelection);
          contentToPasteForCursorSelection = '';
        }
      }
    }

    return contentToPasteForEachCursor;
  }

  async pasteAsPlainText(editor: Editor): Promise<void> {
    const clipboardContent = await navigator.clipboard.readText();
    if (!clipboardContent) {
      new Notice('There is no clipboard content.');
      return;
    }

    editor.replaceSelection(clipboardContent);
  }

  /**
   * Gets the current markdown editor if it exists {@link https://github.com/chrisgrieser/obsidian-smarter-paste/blob/master/main.ts#L37-L41|Obsidian Smarter Paste Source}
   * @return {Editor} Returns the current codemirror editor if there is an active view of type markdown or null if there is not one.
   */
  private getEditor(): Editor {
    const activeLeaf = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeLeaf) return null;
    return activeLeaf.editor;
  }

  /**
   * Makes sure to get the whole line where the cursor is at even if a selection is made.
   * @param {Editor} editor - The codemirror editor where the content is located.
   * @param {EditorSelection} selection - The codemirror editor selection where a cursor is at.
   * @return {string} The current line contents in the editor (i.e. the line where the cursor is)
   */
  private getLineContent(editor:Editor, selection: EditorSelection): string {
    return editor.getLine(selection.anchor.line);
  }

  /**
   * Moves settings to common settings in order to allow for better settings experience moving forward.
   */
  private moveSettingsToCommonSettings() {
    let newAliasFormat: NormalArrayFormats | SpecialArrayFormats = undefined;
    // alias format
    const YamlTitleAliasRule = this.settings.ruleConfigs['YAML Title Alias'];
    if (YamlTitleAliasRule && YamlTitleAliasRule['YAML aliases section style']) {
      // if the rule is not enabled it does not matter what the format for the aliases is for copying over the value
      if (YamlTitleAliasRule['Inserts the title of the file into the YAML frontmatter\'s aliases section. Gets the title from the first H1 or filename.']) {
        switch (YamlTitleAliasRule['YAML aliases section style']) {
          case 'Multi-line array':
            newAliasFormat = NormalArrayFormats.MultiLine;
            break;
          case 'Single-line array':
            newAliasFormat = NormalArrayFormats.SingleLine;
            break;
          case 'Single string that expands to multi-line array if needed':
            newAliasFormat = SpecialArrayFormats.SingleStringToMultiLine;
            break;
          case 'Single string that expands to single-line array if needed':
            newAliasFormat = SpecialArrayFormats.SingleStringToSingleLine;
            break;
        }
      }

      delete this.settings.ruleConfigs['YAML Title Alias']['YAML aliases section style'];
    }

    const formatYamlRule = this.settings.ruleConfigs['Format Yaml Array'];
    if (formatYamlRule && formatYamlRule['Yaml aliases section style']) {
      // if the rule is enabled and the actual format for aliases is enabled then check the value
      if (formatYamlRule['Allows for the formatting of regular yaml arrays as either multi-line or single-line and `tags` and `aliases` are allowed to have some Obsidian specific yaml formats. Note that single string to single-line goes from a single string entry to a single-line array if more than 1 entry is present. The same is true for single string to multi-line except it becomes a multi-line array.'] &&
        formatYamlRule['Format yaml aliases section']) {
        const tempYAMLAliasFormat = formatYamlRule['Yaml aliases section style'] as NormalArrayFormats | SpecialArrayFormats;
        if (!newAliasFormat) {
          newAliasFormat = tempYAMLAliasFormat;
        } else {
          switch (tempYAMLAliasFormat) {
            case NormalArrayFormats.SingleLine:
              newAliasFormat = NormalArrayFormats.SingleLine;
              break;
            case NormalArrayFormats.MultiLine:
              if (newAliasFormat != NormalArrayFormats.SingleLine) {
                newAliasFormat = NormalArrayFormats.SingleLine;
              }
              break;
            case SpecialArrayFormats.SingleStringCommaDelimited:
              if (newAliasFormat != NormalArrayFormats.SingleLine && newAliasFormat != NormalArrayFormats.MultiLine) {
                newAliasFormat = SpecialArrayFormats.SingleStringCommaDelimited;
              }
              break;
            case SpecialArrayFormats.SingleStringToMultiLine:
              if (newAliasFormat != NormalArrayFormats.SingleLine && newAliasFormat != NormalArrayFormats.MultiLine) {
                newAliasFormat = SpecialArrayFormats.SingleStringToMultiLine;
              }
              break;
            case SpecialArrayFormats.SingleStringToSingleLine:
              if (newAliasFormat != NormalArrayFormats.SingleLine && newAliasFormat != NormalArrayFormats.MultiLine) {
                newAliasFormat = SpecialArrayFormats.SingleStringToSingleLine;
              }
              break;
          }
        }
      }


      delete this.settings.ruleConfigs['Format Yaml Array']['Yaml aliases section style'];
    }

    if (newAliasFormat) {
      this.settings.commonStyles.aliasArrayStyle = newAliasFormat;
    }

    // tags format
    let newTagFormat: NormalArrayFormats | SpecialArrayFormats | TagSpecificArrayFormats = undefined;

    if (formatYamlRule && formatYamlRule['Yaml tags section style']) {
      // if the rule is enabled and the actual format for aliases is enabled then check the value
      if (formatYamlRule['Allows for the formatting of regular yaml arrays as either multi-line or single-line and `tags` and `aliases` are allowed to have some Obsidian specific yaml formats. Note that single string to single-line goes from a single string entry to a single-line array if more than 1 entry is present. The same is true for single string to multi-line except it becomes a multi-line array.'] &&
       formatYamlRule['Format yaml tags section']) {
        newTagFormat = formatYamlRule['Yaml tags section style'];
      }

      delete this.settings.ruleConfigs['Format Yaml Array']['Yaml tags section style'];
    }

    const moveTagsToYamlRule = this.settings.ruleConfigs['Move Tags to Yaml'];
    if (moveTagsToYamlRule && moveTagsToYamlRule['Yaml tags section style']) {
      // only check the value if the rule is enabled
      if (moveTagsToYamlRule['Move all tags to Yaml frontmatter of the document.']) {
        const tempYAMLTagFormat = moveTagsToYamlRule['Yaml tags section style'];
        if (!newTagFormat) {
          newTagFormat = tempYAMLTagFormat;
        } else {
          switch (tempYAMLTagFormat) {
            case NormalArrayFormats.SingleLine:
              newTagFormat = NormalArrayFormats.SingleLine;
              break;
            case NormalArrayFormats.MultiLine:
              if (newTagFormat != NormalArrayFormats.SingleLine) {
                newTagFormat = NormalArrayFormats.SingleLine;
              }
              break;
            case SpecialArrayFormats.SingleStringCommaDelimited:
              if (newTagFormat != NormalArrayFormats.SingleLine && newTagFormat != NormalArrayFormats.MultiLine) {
                newTagFormat = SpecialArrayFormats.SingleStringCommaDelimited;
              }
              break;
            case SpecialArrayFormats.SingleStringToMultiLine:
              if (newTagFormat != NormalArrayFormats.SingleLine && newTagFormat != NormalArrayFormats.MultiLine) {
                newTagFormat = SpecialArrayFormats.SingleStringToMultiLine;
              }
              break;
            case SpecialArrayFormats.SingleStringToSingleLine:
              if (newTagFormat != NormalArrayFormats.SingleLine && newTagFormat != NormalArrayFormats.MultiLine) {
                newTagFormat = SpecialArrayFormats.SingleStringToSingleLine;
              }
              break;
            case TagSpecificArrayFormats.SingleLineSpaceDelimited:
              if (newTagFormat != NormalArrayFormats.SingleLine && newTagFormat != NormalArrayFormats.MultiLine &&
                  newTagFormat != SpecialArrayFormats.SingleStringCommaDelimited && newTagFormat != SpecialArrayFormats.SingleStringToSingleLine &&
                  newTagFormat != SpecialArrayFormats.SingleStringToMultiLine) {
                newTagFormat = TagSpecificArrayFormats.SingleLineSpaceDelimited;
              }
              break;
            case TagSpecificArrayFormats.SingleStringSpaceDelimited:
              if (newTagFormat != NormalArrayFormats.SingleLine && newTagFormat != NormalArrayFormats.MultiLine &&
                    newTagFormat != SpecialArrayFormats.SingleStringCommaDelimited && newTagFormat != SpecialArrayFormats.SingleStringToSingleLine &&
                    newTagFormat != SpecialArrayFormats.SingleStringToMultiLine) {
                newTagFormat = TagSpecificArrayFormats.SingleStringSpaceDelimited;
              }
              break;
          }
        }
      }

      delete this.settings.ruleConfigs['Move Tags to Yaml']['Yaml tags section style'];
    }

    if (newTagFormat) {
      this.settings.commonStyles.tagArrayStyle = newTagFormat;
    }

    // escape character
    const escapeYAMLSpecialCharactersRule = this.settings.ruleConfigs['Escape YAML Special Characters'];
    if (escapeYAMLSpecialCharactersRule) {
      this.settings.commonStyles.escapeCharacter = escapeYAMLSpecialCharactersRule['Default Escape Character'] ?? this.settings.commonStyles.escapeCharacter;

      delete this.settings.ruleConfigs['Escape YAML Special Characters']['Default Escape Character'];
    }

    this.saveSettings();
  }
}

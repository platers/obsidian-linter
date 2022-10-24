import {normalizePath, App, Editor, EventRef, MarkdownView, Menu, Notice, Plugin, TAbstractFile, TFile, TFolder, addIcon, htmlToMarkdown} from 'obsidian';
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
import {NormalArrayFormats} from './utils/yaml';

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

export default class LinterPlugin extends Plugin {
  settings: LinterSettings;
  private eventRef: EventRef;
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

    this.addCommand({
      id: 'lint-file',
      name: 'Lint the current file',
      editorCallback: (editor) => this.runLinterEditor(editor),
      icon: iconInfo.file.id,
      hotkeys: [
        {
          modifiers: ['Mod', 'Alt'],
          key: 'l',
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

    this.registerEvent(
        this.app.workspace.on('editor-paste', (clipboardEv: ClipboardEvent) => {
          if (this.isEnabled) {
            this.modifyPasteEvent(clipboardEv);
          }
        }),
    );

    // https://github.com/mgmeyers/obsidian-kanban/blob/main/src/main.ts#L239-L251
    this.registerEvent(
        this.app.workspace.on('file-menu', (menu, file: TFile) => {
          if (file instanceof TFolder) {
            menu.addItem((item) => {
              item
                  .setTitle('Lint folder')
                  .setIcon(iconInfo.folder.id)
                  .onClick(() => this.createFolderLintModal(file));
            });
          }
        }),
    );

    this.eventRef = this.app.workspace.on('file-menu',
        (menu, file, source) => this.onMenuOpenCallback(menu, file, source));
    this.registerEvent(this.eventRef);

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

    this.addSettingTab(new SettingTab(this.app, this));
  }

  async onunload() {
    logInfo('Unloading plugin');
    this.isEnabled = false;
    this.app.workspace.offref(this.eventRef);
  }

  async loadSettings() {
    this.settings = {
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
      },
    };
    const data = await this.loadData();
    const storedSettings = data || {};

    for (const rule of rules) {
      this.settings.ruleConfigs[rule.name] = rule.getDefaultOptions();
      if (storedSettings?.ruleConfigs && storedSettings?.ruleConfigs[rule.name]) {
        Object.assign(this.settings.ruleConfigs[rule.name], storedSettings.ruleConfigs[rule.name]);

        // For backwards compatibility, if enabled is set, copy it to the new option and remove it
        if (storedSettings.ruleConfigs[rule.name].Enabled !== undefined) {
          const newEnabledOptionName = rule.enabledOptionName();
          this.settings.ruleConfigs[rule.name][newEnabledOptionName] = storedSettings.ruleConfigs[rule.name].Enabled;
          delete this.settings.ruleConfigs[rule.name].Enabled;
        }
      }
    }

    if (Object.prototype.hasOwnProperty.call(storedSettings, 'lintOnSave')) {
      this.settings.lintOnSave = storedSettings.lintOnSave;
    }
    if (Object.prototype.hasOwnProperty.call(storedSettings, 'displayChanged')) {
      this.settings.displayChanged = storedSettings.displayChanged;
    }
    if (Object.prototype.hasOwnProperty.call(storedSettings, 'foldersToIgnore')) {
      this.settings.foldersToIgnore = storedSettings.foldersToIgnore;
    }
    if (Object.prototype.hasOwnProperty.call(storedSettings, 'linterLocale')) {
      this.settings.linterLocale = storedSettings.linterLocale;
    }
    if (Object.prototype.hasOwnProperty.call(storedSettings, 'logLevel')) {
      this.settings.logLevel = storedSettings.logLevel;
    }
    if (Object.prototype.hasOwnProperty.call(storedSettings, 'lintCommands')) {
      this.settings.lintCommands = storedSettings.lintCommands;
    }
    if (Object.prototype.hasOwnProperty.call(storedSettings, 'customRegexs')) {
      this.settings.customRegexs = storedSettings.customRegexs;
    }
    if (Object.prototype.hasOwnProperty.call(storedSettings, 'commonStyles')) {
      this.settings.commonStyles = storedSettings.commonStyles;
    }

    setLogLevel(this.settings.logLevel);
    this.setOrUpdateMomentInstance();
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }

  onMenuOpenCallback(menu: Menu, file: TAbstractFile, _source: string) {
    if (file instanceof TFile && file.extension === 'md') {
      menu.addItem((item) => {
        item.setIcon(iconInfo.file.id);
        item.setTitle('Lint file');
        item.onClick(async (_evt) => {
          this.runLinterFile(file);
        });
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

    this.rulesRunner.runCustomRegexReplacement(this.settings.customRegexs, editor);
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

  // from https://github.com/chrisgrieser/obsidian-smarter-paste/blob/master/main.ts#L37-L41
  private getEditor(): Editor {
    const activeLeaf = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeLeaf) return;
    return activeLeaf.editor;
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
    const urlRegex = /((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()[\]{};:'".,<>?«»“”‘’]))/i;
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
    clipboardText = this.rulesRunner.runPasteLint(this.getLineContent(editor), createRunLinterRulesOptions(clipboardText, null, this.momentLocale, this.settings));

    editor.replaceSelection(clipboardText);
  }

  // if there is a selection, gets the content of the beginning of the selection
  private getLineContent(editor: Editor) {
    const currentLineNumber = editor.getCursor('from').line;
    return editor.getLine(currentLineNumber);
  }

  async pasteAsPlainText(editor: Editor): Promise<void> {
    const clipboardContent = await navigator.clipboard.readText();
    if (!clipboardContent) {
      new Notice('There is no clipboard content.');
      return;
    }

    editor.replaceSelection(clipboardContent);
  }
}

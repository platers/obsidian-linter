import {App, Editor, EventRef, MarkdownView, Menu, Modal, Notice, Plugin, PluginSettingTab, Setting, TAbstractFile, TFile, TFolder} from 'obsidian';
import {LinterSettings, Options, rules, getDisabledRules} from './rules';
import DiffMatchPatch from 'diff-match-patch';
import {BooleanOption, DropdownOption, MomentFormatOption, TextAreaOption, TextOption} from './option';
import dedent from 'ts-dedent';
import {stripCr} from './utils';
import log from 'loglevel';
import {logInfo, logError, logDebug, setLogLevel} from './logger';


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
    public momentInstance: any;
    private eventRef: EventRef;

    async onload() {
      logInfo('Loading plugin');
      await this.loadSettings();

      this.addCommand({
        id: 'lint-file',
        name: 'Lint the current file',
        editorCallback: (editor) => this.runLinterEditor(editor),
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
        callback: () => {
          const startMessage = 'This will edit all of your files and may introduce errors.';
          const submitBtnText = 'Lint All';
          const submitBtnNoticeText = 'Linting all files...';
          new LintConfirmationModal(this.app, startMessage, submitBtnText, submitBtnNoticeText, () =>{
            return this.runLinterAllFiles(this.app);
          }).open();
        },
      });

      this.addCommand({
        id: 'lint-all-files-in-folder',
        name: 'Lint all files in the current folder',
        editorCheckCallback: (checking: Boolean, _) => {
          if (checking) {
            return !this.app.workspace.getActiveFile().parent.isRoot();
          }

          this.createFolderLintModal(this.app.workspace.getActiveFile().parent);
        },
      });

      // https://github.com/mgmeyers/obsidian-kanban/blob/main/src/main.ts#L239-L251
      this.registerEvent(
          this.app.workspace.on('file-menu', (menu, file: TFile) => {
            // Add a menu item to the folder context menu to create a board
            if (file instanceof TFolder) {
              menu.addItem((item) => {
                item
                    .setTitle('Lint folder')
                    .setIcon('wrench-screwdriver-glyph')
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
      const saveCommandDefinition = (this.app as any).commands?.commands?.[
        'editor:save-file'
      ];
      const save = saveCommandDefinition?.callback;

      if (typeof save === 'function') {
        saveCommandDefinition.callback = () => {
          if (this.settings.lintOnSave) {
            const editor = this.app.workspace.getActiveViewOfType(MarkdownView).editor;
            const file = this.app.workspace.getActiveFile();

            if (!this.shouldIgnoreFile(file)) {
              this.runLinterEditor(editor);
            }
          }
        };
      }

      this.addSettingTab(new SettingTab(this.app, this));
    }

    async onunload() {
      logInfo('Unloading plugin');
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

      setLogLevel(this.settings.logLevel);
      this.setOrUpdateMomentInstance();
    }
    async saveSettings() {
      await this.saveData(this.settings);
    }

    onMenuOpenCallback(menu: Menu, file: TAbstractFile, source: string) {
      if (file instanceof TFile && file.extension === 'md') {
        menu.addItem((item) => {
          item.setIcon('wrench-screwdriver-glyph');
          item.setTitle('Lint file');
          item.onClick(async (evt) => {
            this.runLinterFile(file);
          });
        });
      }
    }

    lintText(oldText: string, file: TFile) {
      let newText = oldText;

      // escape YAML where possible before parsing yaml
      const escape_yaml_rule = rules.find((rule) => rule.name === 'Escape YAML Special Characters');
      const escape_yaml_options = escape_yaml_rule.getOptions(this.settings);
      if (escape_yaml_options[escape_yaml_rule.enabledOptionName()]) {
        newText = escape_yaml_rule.apply(newText, escape_yaml_options);
      }

      // remove hashtags from tags before parsing yaml
      const tag_rule = rules.find((rule) => rule.name === 'Format Tags in YAML');
      const tag_options = tag_rule.getOptions(this.settings);
      if (tag_options[tag_rule.enabledOptionName()]) {
        newText = tag_rule.apply(newText, tag_options);
      }

      const disabledRules = getDisabledRules(newText);

      for (const rule of rules) {
        // if you are run prior to or after the regular rules or are a disabled rule, skip running the rule
        if (disabledRules.includes(rule.alias()) || rule.alias() === 'yaml-timestamp' || rule.alias() === 'format-tags-in-yaml' || rule.alias() === 'escape-yaml-special-characters') {
          continue;
        }

        const options: Options =
          Object.assign({
            'metadata: file created time': this.momentInstance(file.stat.ctime).format(),
            'metadata: file modified time': this.momentInstance(file.stat.mtime).format(),
            'metadata: file name': file.basename,
            'moment': this.momentInstance,
          }, rule.getOptions(this.settings));

        if (options[rule.enabledOptionName()]) {
          logDebug(`Running ${rule.name}`);
          newText = rule.apply(newText, options);
        }
      }

      // run yaml timestamp at the end to help determine if something has changed
      const yaml_timestamp_rule = rules.find((rule) => rule.alias() === 'yaml-timestamp');
      const yaml_timestamp_options: Options =
      Object.assign({
        'metadata: file created time': this.momentInstance(file.stat.ctime).format(),
        'metadata: file modified time': this.momentInstance(file.stat.mtime).format(),
        'metadata: file name': file.basename,
        'Current Time': this.momentInstance(),
        'Already Modified': oldText != newText,
        'moment': this.momentInstance,
      }, yaml_timestamp_rule.getOptions(this.settings));
      if (yaml_timestamp_options[yaml_timestamp_rule.enabledOptionName()]) {
        newText = yaml_timestamp_rule.apply(newText, yaml_timestamp_options);
      }

      return newText;
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
      const newText = this.lintText(oldText, file);

      await this.app.vault.modify(file, newText);
    }

    async runLinterAllFiles(app: App) {
      let numberOfErrors = 0;
      await Promise.all(app.vault.getMarkdownFiles().map(async (file) => {
        if (!this.shouldIgnoreFile(file)) {
          try {
            await this.runLinterFile(file);
          } catch (error) {
            if (error.name === 'YAMLException') {
              new Notice(`There is an error in file "${file.path}" in the YAML ` + error.mark);
            } else {
              new Notice('An error occurred during linting. See console for details');
            }

            logError(`Lint All Files Error in File '${file.path}'`, error);

            numberOfErrors+=1;
          }
        }
      }));
      if (numberOfErrors === 0) {
        new Notice('Linted all files');
      } else {
        const amountOfErrorsMessage = numberOfErrors === 1 ? 'was 1 error': 'were ' + numberOfErrors + ' errors';
        new Notice('Linted all files and there ' + amountOfErrorsMessage + '.');
      }
    }

    async runLinterAllFilesInFolder(folder: TFolder) {
      logInfo('Linting folder ' + folder.name);

      let numberOfErrors = 0;
      let lintedFiles = 0;
      await Promise.all(this.app.vault.getMarkdownFiles().map(async (file) => {
        if (this.convertPathToNormalizedString(file.path).startsWith(this.convertPathToNormalizedString(folder.path) + '|') && !this.shouldIgnoreFile(file)) {
          try {
            await this.runLinterFile(file);
          } catch (error) {
            if (error.name === 'YAMLException') {
              new Notice(`There is an error in file "${file.path}" in the YAML ` + error.mark);
            } else {
              new Notice('An error occurred during linting. See console for details');
            }

            logError(`Lint All Files in Folder Error in File '${file.path}'`, error);

            numberOfErrors+=1;
          }

          lintedFiles++;
        }
      }));
      if (numberOfErrors === 0) {
        new Notice('Linted all ' + lintedFiles + ' files in ' + folder.name + '.');
      } else {
        const amountOfErrorsMessage = numberOfErrors === 1 ? 'was 1 error': 'were ' + numberOfErrors + ' errors';
        new Notice('Linted all ' + lintedFiles + ' files in ' + folder.name + ' and there ' + amountOfErrorsMessage + '.');
      }
    }

    // convert the path separators to | in order to "normalize" the path for better comparisons
    convertPathToNormalizedString(path: string): string {
      return path.replace('\\', '|').replace('/', '|');
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
        newText = this.lintText(oldText, file);
      } catch (error) {
        if (error.name === 'YAMLException') {
          new Notice('There is an error in the YAML ' + error.mark);
        } else {
          new Notice('An error occurred during linting. See console for details');
        }

        logError(`Lint File Error in File '${file.path}'`, error);
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
    }

    // based on https://github.com/liamcain/obsidian-calendar-ui/blob/03ceecbf6d88ef260dadf223ee5e483d98d24ffc/src/localization.ts#L85-L109
    setOrUpdateMomentInstance() {
      // loading moment as follows allows for updating the locale while using moment directly has issues loading the locale
      const {moment} = window;

      const obsidianLang: string = localStorage.getItem('language') || 'en';
      const systemLang = navigator.language?.toLowerCase();

      let momentLocale = langToMomentLocale[obsidianLang as keyof typeof langToMomentLocale];

      if (this.settings.linterLocale !== 'system-default') {
        momentLocale = this.settings.linterLocale;
      } else if (systemLang.startsWith(obsidianLang)) {
        // If the system locale is more specific (en-gb vs en), use the system locale.
        momentLocale = systemLang;
      }

      const currentLocale = moment.locale(momentLocale);
      logDebug(`Trying to switch Moment.js global locale to ${momentLocale}, got ${currentLocale}`);

      this.momentInstance = moment;
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
}

class SettingTab extends PluginSettingTab {
    plugin: LinterPlugin;

    constructor(app: App, plugin: LinterPlugin) {
      super(app, plugin);
      this.plugin = plugin;

      // Inject display functions. Necessary because the Settings object cannot be used in tests.
      BooleanOption.prototype.display = function(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
        new Setting(containerEl)
            .setName(this.name)
            .setDesc(this.description)
            .addToggle((toggle) => {
              toggle.setValue(settings.ruleConfigs[this.ruleName][this.name]);
              toggle.onChange((value) => {
                this.setOption(value, settings);
                plugin.settings = settings;
                plugin.saveData(plugin.settings);
              });
            });
      };

      TextOption.prototype.display = function(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
        new Setting(containerEl)
            .setName(this.name)
            .setDesc(this.description)
            .addText((textbox) => {
              textbox.setValue(settings.ruleConfigs[this.ruleName][this.name]);
              textbox.onChange((value) => {
                this.setOption(value, settings);
                plugin.settings = settings;
                plugin.saveData(plugin.settings);
              });
            });
      };

      TextAreaOption.prototype.display = function(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
        new Setting(containerEl)
            .setName(this.name)
            .setDesc(this.description)
            .addTextArea((textbox) => {
              textbox.setValue(settings.ruleConfigs[this.ruleName][this.name]);
              textbox.onChange((value) => {
                this.setOption(value, settings);
                plugin.settings = settings;
                plugin.saveData(plugin.settings);
              });
            });
      };

      MomentFormatOption.prototype.display = function(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
        new Setting(containerEl)
            .setName(this.name)
            .setDesc(this.description)
            .addMomentFormat((format) => {
              format.setValue(settings.ruleConfigs[this.ruleName][this.name]);
              format.setPlaceholder('dddd, MMMM Do YYYY, h:mm:ss a');
              format.onChange((value) => {
                this.setOption(value, settings);
                plugin.settings = settings;
                plugin.saveData(plugin.settings);
              });
            });
      };

      DropdownOption.prototype.display = function(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
        new Setting(containerEl)
            .setName(this.name)
            .setDesc(this.description)
            .addDropdown((dropdown) => {
              // First, add all the available options
              for (const option of this.options) {
                dropdown.addOption(option.value, option.value);
              }

              // Set currently selected value from existing settings
              dropdown.setValue(settings.ruleConfigs[this.ruleName][this.name]);

              dropdown.onChange((value) => {
                this.setOption(value, settings);
                plugin.settings = settings;
                plugin.saveData(plugin.settings);
              });
            });
      };
    }

    display(): void {
      const {containerEl} = this;

      containerEl.empty();

      containerEl.createEl('h2', {text: 'General Settings'});

      new Setting(containerEl)
          .setName('Lint on save')
          .setDesc('Lint the file on manual save (when `Ctrl + S` is pressed)')
          .addToggle((toggle) => {
            toggle
                .setValue(this.plugin.settings.lintOnSave)
                .onChange(async (value) => {
                  this.plugin.settings.lintOnSave = value;
                  await this.plugin.saveSettings();
                });
          });

      new Setting(containerEl)
          .setName('Display message on lint')
          .setDesc('Display the number of characters changed after linting')
          .addToggle((toggle) => {
            toggle
                .setValue(this.plugin.settings.displayChanged)
                .onChange(async (value) => {
                  this.plugin.settings.displayChanged = value;
                  await this.plugin.saveSettings();
                });
          });

      new Setting(containerEl)
          .setName('Folders to ignore')
          .setDesc('Folders to ignore when linting all files or linting on save. Enter folder paths separated by newlines')
          .addTextArea((textArea) => {
            textArea
                .setValue(this.plugin.settings.foldersToIgnore.join('\n'))
                .onChange(async (value) => {
                  this.plugin.settings.foldersToIgnore = value.split('\n');
                  await this.plugin.saveSettings();
                });
          });

      this.addLocaleOverrideSetting();

      let prevSection = '';

      for (const rule of rules) {
        if (rule.type !== prevSection) {
          containerEl.createEl('h2', {text: rule.type});
          prevSection = rule.type;
        }

        containerEl.createEl('h3', {}, (el) =>{
          el.innerHTML = `<a href="${rule.getURL()}">${rule.name}</a>`;
        });

        for (const option of rule.options) {
          option.display(containerEl, this.plugin.settings, this.plugin);
        }
      }
    }

    addLocaleOverrideSetting(): void {
      const {moment} = window;
      const sysLocale = navigator.language?.toLowerCase();

      new Setting(this.containerEl)
          .setName('Override locale:')
          .setDesc(
              'Set this if you want to use a locale different from the default',
          )
          .addDropdown((dropdown) => {
            dropdown.addOption('system-default', `Same as system (${sysLocale})`);
            moment.locales().forEach((locale) => {
              dropdown.addOption(locale, locale);
            });
            dropdown.setValue(this.plugin.settings.linterLocale);
            dropdown.onChange(async (value) => {
              this.plugin.settings.linterLocale = value;
              this.plugin.setOrUpdateMomentInstance();
              await this.plugin.saveSettings();
            });
          });
    }
}

// https://github.com/nothingislost/obsidian-workspaces-plus/blob/bbba928ec64b30b8dec7fe8fc9e5d2d96543f1f3/src/modal.ts#L68
class LintConfirmationModal extends Modal {
  constructor(app: App, startModalMessageText: string, submitBtnText: string,
      submitBtnNoticeText: string, btnSubmitAction: () => Promise<void>) {
    super(app);
    this.modalEl.addClass('confirm-modal');

    this.contentEl.createEl('h3', {text: 'Warning'});

    const e: HTMLParagraphElement = this.contentEl.createEl('p',
        {text: startModalMessageText + ' Make sure you have backed up your files.'});
    e.id = 'confirm-dialog';

    this.contentEl.createDiv('modal-button-container', (buttonsEl) => {
      buttonsEl.createEl('button', {text: 'Cancel'}).addEventListener('click', () => this.close());

      const btnSubmit = buttonsEl.createEl('button', {
        attr: {type: 'submit'},
        cls: 'mod-cta',
        text: submitBtnText,
      });
      btnSubmit.addEventListener('click', async (e) => {
        new Notice(submitBtnNoticeText);
        this.close();
        await btnSubmitAction();
      });
      setTimeout(() => {
        btnSubmit.focus();
      }, 50);
    });
  }
}

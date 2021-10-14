import {App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile} from 'obsidian';
import {LinterSettings, Options, rules, getDisabledRules} from './rules';
import Diff from 'diff';
import moment from 'moment';
import {BooleanOption, DropdownOption, MomentFormatOption, TextAreaOption, TextOption} from './option';
import dedent from 'ts-dedent';

export default class LinterPlugin extends Plugin {
    settings: LinterSettings;

    async onload() {
      console.log('Loading Linter plugin');
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
          new ConfirmationModal(this.app, this).open();
        },
      });

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
      console.log('Unloading Linter plugin');
    }

    async loadSettings() {
      this.settings = {
        ruleConfigs: {},
        lintOnSave: false,
        displayChanged: true,
        foldersToIgnore: [],
      };
      const storedSettings = await this.loadData();

      for (const rule of rules) {
        this.settings.ruleConfigs[rule.name] = rule.getDefaultOptions();
        if (storedSettings?.ruleConfigs && storedSettings?.ruleConfigs[rule.name]) {
          Object.assign(this.settings.ruleConfigs[rule.name], storedSettings.ruleConfigs[rule.name]);
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
    }
    async saveSettings() {
      await this.saveData(this.settings);
    }

    lintText(oldText: string, file: TFile) {
      let newText = oldText;
      const disabledRules = getDisabledRules(oldText);

      for (const rule of rules) {
        if (disabledRules.includes(rule.alias())) {
          continue;
        }

        const options: Options =
          Object.assign({
            'metadata: file created time': moment(file.stat.ctime).format(),
            'metadata: file modified time': moment(file.stat.mtime).format(),
            'metadata: file name': file.basename,
          }, rule.getOptions(this.settings));

        if (options['Enabled']) {
          newText = rule.apply(newText, options);
        }
      }

      return newText;
    }

    shouldIgnoreFile(file: TFile) {
      for (const folder of this.settings.foldersToIgnore) {
        if (file.path.startsWith(folder)) {
          return true;
        }
      }
      return false;
    }

    async runLinterFile(file: TFile) {
      const oldText = await this.app.vault.read(file);
      const newText = this.lintText(oldText, file);
      this.app.vault.modify(file, newText);
    }

    async runLinterAllFiles() {
      this.app.vault.getMarkdownFiles().forEach((file) => {
        if (!this.shouldIgnoreFile(file)) {
          this.runLinterFile(file);
        }
      });
      new Notice('Linted all files');
    }

    runLinterEditor(editor: Editor) {
      console.log('running linter');

      const file = this.app.workspace.getActiveFile();
      const oldText = editor.getValue();
      const newText = this.lintText(oldText, file);

      // Replace changed lines
      const changes = Diff.diffChars(oldText, newText);
      let curText = '';
      changes.forEach((change) => {
        function endOfDocument(doc: string) {
          const lines = doc.split('\n');
          return {line: lines.length - 1, ch: lines[lines.length - 1].length};
        }

        if (change.added) {
          editor.replaceRange(change.value, endOfDocument(curText));
          curText += change.value;
        } else if (change.removed) {
          const start = endOfDocument(curText);
          let tempText = curText;
          tempText += change.value;
          const end = endOfDocument(tempText);
          editor.replaceRange('', start, end);
        } else {
          curText += change.value;
        }
      });

      const charsAdded = changes.map((change) => change.added ? change.value.length : 0).reduce((a, b) => a + b, 0);
      const charsRemoved = changes.map((change) => change.removed ? change.value.length : 0).reduce((a, b) => a + b, 0);
      this.displayChangedMessage(charsAdded, charsRemoved);
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
              dropdown.setValue(settings.ruleConfigs[this.ruleName][this.name]);
              for (const option of this.options) {
                dropdown.addOption(option.value, option.value);
              }
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
          .setDesc('Folders to ignore when linting all files. Enter folder paths separated by newlines')
          .addTextArea((textArea) => {
            textArea
                .setValue(this.plugin.settings.foldersToIgnore.join('\n'))
                .onChange(async (value) => {
                  this.plugin.settings.foldersToIgnore = value.split('\n');
                  await this.plugin.saveSettings();
                });
          });

      let prevSection = '';

      for (const rule of rules) {
        if (rule.type !== prevSection) {
          containerEl.createEl('h2', {text: rule.type});
          prevSection = rule.type;
        }

        containerEl.createEl('h3', {text: rule.name});
        containerEl.createEl('a', {text: rule.alias(), href: rule.getURL()});
        containerEl.createEl('p', {text: rule.description});

        for (const option of rule.options) {
          option.display(containerEl, this.plugin.settings, this.plugin);
        }
      }
    }
}

// https://github.com/nothingislost/obsidian-workspaces-plus/blob/bbba928ec64b30b8dec7fe8fc9e5d2d96543f1f3/src/modal.ts#L68
class ConfirmationModal extends Modal {
  constructor(app: App, plugin: LinterPlugin) {
    super(app);
    this.modalEl.addClass('confirm-modal');

    this.contentEl.createEl('h3', {text: 'Warning'});

    const e: HTMLParagraphElement = this.contentEl.createEl('p',
        {text: 'This will edit all of your files and may introduce errors. Make sure you have backed up your files.'});
    e.id = 'confirm-dialog';

    this.contentEl.createDiv('modal-button-container', (buttonsEl) => {
      buttonsEl.createEl('button', {text: 'Cancel'}).addEventListener('click', () => this.close());

      const btnSumbit = buttonsEl.createEl('button', {
        attr: {type: 'submit'},
        cls: 'mod-cta',
        text: 'Lint All',
      });
      btnSumbit.addEventListener('click', async (e) => {
        await plugin.runLinterAllFiles();
        this.close();
      });
      setTimeout(() => {
        btnSumbit.focus();
      }, 50);
    });
  }
}

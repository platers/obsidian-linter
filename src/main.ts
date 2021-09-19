import {App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, TFile} from 'obsidian';
import {LinterSettings, Options, rules} from './rules';
import {getDisabledRules} from './utils';
import Diff from 'diff';
import moment from 'moment';
import {BooleanOption, MomentFormatOption} from './option';
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
          this.app.vault.getMarkdownFiles().forEach((file) => {
            this.runLinterFile(file);
          });
        },
      }); ;

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
            this.runLinterEditor(editor);
          }

          save();
        };
      }

      this.addSettingTab(new SettingTab(this.app, this));
    }

    async loadSettings() {
      this.settings = {
        ruleConfigs: {},
        lintOnSave: false,
      };
      const storedSettings = await this.loadData();

      for (const rule of rules) {
        this.settings.ruleConfigs[rule.name] = rule.getDefaultOptions();
        if (storedSettings.ruleConfigs[rule.name]) {
          Object.assign(this.settings.ruleConfigs[rule.name], storedSettings.ruleConfigs[rule.name]);
        }
      }

      if (storedSettings.lintOnSave) {
        this.settings.lintOnSave = storedSettings.lintOnSave;
      }
    }

    async saveSettings() {
      await this.saveData(this.settings);
    }

    lintText(oldText: string, file: TFile) {
      let newText = oldText;
      const disabledRules = getDisabledRules(oldText);

      for (const rule of rules) {
        if (disabledRules.includes(rule.name)) {
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

    async runLinterFile(file: TFile) {
      const oldText = await this.app.vault.read(file);
      const newText = this.lintText(oldText, file);
      this.app.vault.modify(file, newText);
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
      new Notice(dedent`
        ${charsAdded} characters added
        ${charsRemoved} characters removed
      `);
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
    }

    display(): void {
      const {containerEl} = this;

      containerEl.empty();

      containerEl.createEl('h2', {text: 'General Settings'});

      new Setting(containerEl)
          .setName('Lint on save')
          .setDesc('Lint the file on save')
          .addToggle((toggle) => {
            toggle
                .setValue(this.plugin.settings.lintOnSave)
                .onChange(async (value) => {
                  this.plugin.settings.lintOnSave = value;
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

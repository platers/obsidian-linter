import {App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting} from 'obsidian';
import dedent from 'ts-dedent';
import {parseOptions, rulesDict} from './rules';
import Diff from 'diff';
import moment from 'moment';

interface LinterSettings {
    enabledRules: string;
    lintOnSave: boolean;
}

const DEFAULT_SETTINGS: LinterSettings = {
  enabledRules: dedent`
        trailing-spaces
        heading-blank-lines
        space-after-list-markers
        `,
  lintOnSave: false,
};

export default class LinterPlugin extends Plugin {
    settings: LinterSettings;

    async onload() {
      await this.loadSettings();

      this.addCommand({
        id: 'lint-file',
        name: 'Lint the current file',
        editorCallback: (editor) => this.runLinter(editor),
        hotkeys: [
          {
            modifiers: ['Mod', 'Alt'],
            key: 'l',
          },
        ],
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
            this.runLinter(editor);
          }

          save();
        };
      }

      this.addSettingTab(new SettingTab(this.app, this));
    }

    async loadSettings() {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
      await this.saveData(this.settings);
    }

    runLinter(editor: Editor) {
      console.log('running linter');

      const file = this.app.workspace.getActiveFile();
      const oldText = editor.getValue();
      let newText = oldText;
      const enabledRules = this.settings.enabledRules.split('\n');

      for (const line of enabledRules) {
        if (line.match(/^\s*$/) || line.startsWith('// ')) {
          continue;
        }

        // Split the line into the rule name and the rule options
        const ruleName = line.split(/\s+/)[0];

        if (ruleName in rulesDict) {
          const options: { [id: string]: string; } =
            Object.assign({
              'metadata: file created time': moment(file.stat.ctime).format(),
              'metadata: file modified time': moment(file.stat.mtime).format(),
            }, parseOptions(line));
          newText = rulesDict[ruleName].apply(newText, options);
        } else {
          new Notice(`Rule ${ruleName} not recognized`);
        }
      }

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
    }
}

class SettingTab extends PluginSettingTab {
    plugin: LinterPlugin;

    constructor(app: App, plugin: LinterPlugin) {
      super(app, plugin);
      this.plugin = plugin;
    }

    display(): void {
      const {containerEl} = this;

      containerEl.empty();

      containerEl.createEl('h2', {text: 'Settings for Linter'});

      new Setting(containerEl)
          .setName('Rules to apply')
          .setDesc('List the rules to apply to the markdown file')
          .addTextArea((text) => {
            text
                .setValue(this.plugin.settings.enabledRules)
                .onChange(async (value) => {
                  this.plugin.settings.enabledRules = value;
                  await this.plugin.saveSettings();
                });
            text.inputEl.rows = 20;
            text.inputEl.cols = 40;
          });

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
    }
}

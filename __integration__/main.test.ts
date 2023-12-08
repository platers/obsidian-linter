import {Editor, MarkdownView, Plugin, TFile, normalizePath} from 'obsidian';
import LinterPlugin from 'src/main';
import {obsidianModeTestCases} from './obsidian-mode.test';
import {setWorkspaceItemMode} from './utils.test';

export type IntegrationTestCase = {
  name: string,
  filePath: string,
  setup?: (plugin: TestLinterPlugin, editor: Editor) => void,
  assertions: (editor: Editor) => void,
}

export default class TestLinterPlugin extends Plugin {
  tests: Array<IntegrationTestCase> = [...obsidianModeTestCases];
  plugin: LinterPlugin;

  async onload() {
    this.addCommand({
      id: 'run-linter-tests',
      name: 'Run Linter Tests',
      callback: async () => {
        await this.setup();
        await this.runTests();
      },
    });
  }

  async setup() {
    if (!this.plugin) {
      this.plugin = new LinterPlugin(this.app, this.manifest);
    }

    await this.loadOrResetSettings();
  }

  async runTests() {
    const activeLeaf = this.getActiveLeaf();
    if (!activeLeaf) {
      console.error('failed to get active leaf');
      return;
    }

    for (const t of this.tests) {
      const file = this.getFileFromPath(t.filePath);
      if (!file) {
        console.error('failed to get file: ' + t.filePath);
        continue;
      }

      await activeLeaf.leaf.openFile(file);

      const originalText = activeLeaf.editor.getValue();

      await this.loadOrResetSettings();

      try {
        if (t.setup) {
          await t.setup(this, activeLeaf.editor);
        }

        this.plugin.runLinterEditor(activeLeaf.editor);

        t.assertions(activeLeaf.editor);
        console.log('✅', t.name);
      } catch (e) {
        console.log('❌', t.name);
        console.error(e);
      } finally {
        if (activeLeaf) {
          activeLeaf.editor.setValue(originalText);
          await setWorkspaceItemMode(this.app, true);
        }
      }
    }
  }

  private getActiveLeaf(): MarkdownView {
    const activeLeaf = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeLeaf) return null;
    return activeLeaf;
  }

  private getFileFromPath(filePath: string): TFile {
    const file = this.app.vault.getAbstractFileByPath(normalizePath(filePath));
    if (file instanceof TFile) {
      return file;
    }

    return null;
  }

  private async loadOrResetSettings() {
    await this.plugin.loadSettings();
  }
}

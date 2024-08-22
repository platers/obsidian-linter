import {Editor, MarkdownView, Plugin, TFile, normalizePath} from 'obsidian';
import LinterPlugin from 'src/main';
import {obsidianModeTestCases} from './obsidian-mode.test';
import {setWorkspaceItemMode} from './utils.test';
import {customCommandTestCases} from './custom-commands.test';
import {obsidianYAMLRuleTestCases} from './yaml-rule.test';
import expect from 'expect';

export type IntegrationTestCase = {
  name: string,
  filePath: string,
  setup?: (plugin: TestLinterPlugin, editor: Editor) => void,
  assertions?: (editor: Editor) => void,
  modifyExpected? (expectedText: string): string,
}

const testTimeout = 15000;

export default class TestLinterPlugin extends Plugin {
  regularTests: Array<IntegrationTestCase> = [...obsidianModeTestCases, ...obsidianYAMLRuleTestCases];
  afterCacheUpdateTests: Array<IntegrationTestCase> = [...customCommandTestCases];
  plugin: LinterPlugin;
  private testsCompleted: number;
  private timeoutId: any = undefined;

  async onload() {
    this.addCommand({
      id: 'run-linter-tests',
      name: 'Run Linter Tests',
      callback: async () => {
        if (this.timeoutId != undefined) {
          clearTimeout(this.timeoutId);
        }

        await this.setup();

        this.timeoutId = setTimeout(() =>{
          const expectedTestCount = this.regularTests.length + this.afterCacheUpdateTests.length;
          if (this.testsCompleted != expectedTestCount) {
            console.log('❌', `Tests took too long to run with only ${this.testsCompleted} of ${expectedTestCount} tests running in ${testTimeout/1000}s.`);
          } else {
            console.log(`✅ all ${expectedTestCount} tests have completed in the alloted time.`);
          }
        }, testTimeout);

        await this.runTests();
      },
    });
  }

  async setup() {
    if (!this.plugin) {
      this.plugin = new LinterPlugin(this.app, this.manifest);

      await this.plugin.onload();
    } else {
      await this.resetSettings();
    }

    this.testsCompleted = 0;
  }

  async runTests() {
    const activeLeaf = this.getActiveLeaf();
    if (!activeLeaf) {
      console.error('failed to get active leaf');
      return;
    }

    for (const t of this.regularTests) {
      const file = this.getFileFromPath(t.filePath);
      if (!file) {
        console.error('failed to get file: ' + t.filePath);
        continue;
      }

      await activeLeaf.leaf.openFile(file);
      const originalText = activeLeaf.editor.getValue();
      await this.resetSettings();

      try {
        if (t.setup) {
          t.setup(this, activeLeaf.editor);
        }

        await this.plugin.runLinterEditor(activeLeaf.editor);
        await this.handleAssertions(t, activeLeaf);

        console.log('✅', t.name);
        this.testsCompleted++;
      } catch (e) {
        console.log('❌', t.name);
        console.error(e);
        this.testsCompleted++;
      }

      console.log('resetting file contents for ' + t.filePath);
      await this.resetFileContents(activeLeaf, originalText);
    }

    await this.runMetadataTests(this.afterCacheUpdateTests, activeLeaf);
  }

  async runMetadataTests(tests: IntegrationTestCase[], activeLeaf: MarkdownView) {
    let index = 0;
    let originalText = await this.setupMetadataTest(this, tests[index], activeLeaf);
    if (originalText == null) {
      return;
    }

    const that = this;

    this.plugin.setCustomCommandCallback(async (file: TFile) => {
      if (file !== activeLeaf.file) {
        return;
      }

      if (originalText == null) {
        that.plugin.setCustomCommandCallback(null);
      }

      const t = tests[index];
      try {
        await this.handleAssertions(t, activeLeaf);

        console.log('✅', t.name);
        this.testsCompleted++;
      } catch (e) {
        console.log('❌', t.name);
        console.error(e);
        this.testsCompleted++;
      }

      await that.resetFileContents(activeLeaf, originalText);

      originalText = null;
      while (index+1 < tests.length && originalText == null) {
        originalText = await that.setupMetadataTest(that, tests[++index], activeLeaf);
      }

      // remove the custom commands callback once all tests have run
      if (index >= tests.length && originalText == null) {
        that.plugin.setCustomCommandCallback(null);
      }
    });
  }

  async setupMetadataTest(testPlugin: TestLinterPlugin, t: IntegrationTestCase, activeLeaf: MarkdownView): Promise<string> {
    const file = this.getFileFromPath(t.filePath);
    if (!file) {
      console.error('failed to get file: ' + t.filePath);
      return null;
    }

    await activeLeaf.leaf.openFile(file);
    const originalText = activeLeaf.editor.getValue();
    await testPlugin.resetSettings();

    try {
      if (t.setup) {
        t.setup(this, activeLeaf.editor);
      }

      await testPlugin.plugin.runLinterEditor(activeLeaf.editor);
    } catch (e) {
      this.testsCompleted++;
      console.log('❌', t.name);
      console.error(e);
      await testPlugin.resetFileContents(activeLeaf, originalText);

      return null;
    }

    return originalText;
  }

  async onunload(): Promise<void> {
    if (this.plugin) {
      await this.plugin.onunload();
    }
  }

  private async handleAssertions(t: IntegrationTestCase, activeLeaf: MarkdownView) {
    let expectedText = await this.getExpectedContents(t.filePath.replace('.md', '.linted.md'));
    if (t.modifyExpected) {
      expectedText = t.modifyExpected(expectedText);
    }

    expect(activeLeaf.editor.getValue()).toBe(expectedText);
    if (t.assertions) {
      t.assertions(activeLeaf.editor);
    }

    console.log('assertions complete for ' + t.filePath);
  }

  private async resetFileContents(activeLeaf: MarkdownView, originalText: string) {
    if (activeLeaf) {
      activeLeaf.editor.setValue(originalText);
      await setWorkspaceItemMode(this.app, true);
    }
  }

  private getActiveLeaf(): MarkdownView {
    const activeLeaf = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeLeaf) return null;
    return activeLeaf;
  }

  private async getExpectedContents(filePath: string): Promise<string> {
    const file = this.getFileFromPath(filePath);
    if (!file) {
      console.error('failed to get file: ' + filePath);
      return;
    }

    return await this.app.vault.cachedRead(file);
  }

  private getFileFromPath(filePath: string): TFile {
    const file = this.app.vault.getAbstractFileByPath(normalizePath(filePath));
    if (file instanceof TFile) {
      return file;
    }

    return null;
  }

  private async resetSettings() {
    await this.plugin.loadSettings();
  }
}

import {Editor, EventRef, MarkdownView, Plugin, TFile, normalizePath} from 'obsidian';
import LinterPlugin from 'src/main';
import {obsidianModeTestCases} from './obsidian-mode.test';
import {delay, setWorkspaceItemMode} from './utils.test';
import {customCommandTestCases} from './custom-commands.test';

export type IntegrationTestCase = {
  name: string,
  filePath: string,
  setup?: (plugin: TestLinterPlugin, editor: Editor) => void,
  assertions: (editor: Editor) => void,
}

export default class TestLinterPlugin extends Plugin {
  regularTests: Array<IntegrationTestCase> = [...obsidianModeTestCases];
  afterCacheUpdateTests: Array<IntegrationTestCase> = [...customCommandTestCases];
  plugin: LinterPlugin;
  private eventRefs: EventRef[] = [];

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

      await this.plugin.onload();
    } else {
      await this.resetSettings();
    }
  }

  async runTests() {
    const activeLeaf = this.getActiveLeaf();
    if (!activeLeaf) {
      console.error('failed to get active leaf');
      return;
    }

    await this.runTestSuite(this.regularTests, activeLeaf);

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

      const t = tests[index];
      try {
        await t.assertions(activeLeaf.editor);

        console.log('✅', t.name);
      } catch (e) {
        console.log('❌', t.name);
        console.error(e);
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
        await t.setup(this, activeLeaf.editor);
      }

      testPlugin.plugin.runLinterEditor(activeLeaf.editor);
    } catch (e) {
      console.log('❌', t.name);
      console.error(e);
      await testPlugin.resetFileContents(activeLeaf, originalText);

      return null;
    }

    return originalText;
  }

  async runTestSuite(tests: IntegrationTestCase[], activeLeaf: MarkdownView, runAssertionsRightAway: boolean = true, delayMs?: number, extraSetup?: (t: IntegrationTestCase, activeLeaf: MarkdownView, originalText: string) => void) {
    for (const t of tests) {
      const file = this.getFileFromPath(t.filePath);
      if (!file) {
        console.error('failed to get file: ' + t.filePath);
        continue;
      }

      await activeLeaf.leaf.openFile(file);
      const originalText = activeLeaf.editor.getValue();
      await this.resetSettings();

      if (extraSetup) {
        extraSetup(t, activeLeaf, originalText);
      }

      try {
        if (t.setup) {
          await t.setup(this, activeLeaf.editor);
        }

        this.plugin.runLinterEditor(activeLeaf.editor);
        if (runAssertionsRightAway) {
          await t.assertions(activeLeaf.editor);

          console.log('✅', t.name);
        }
      } catch (e) {
        console.log('❌', t.name);
        console.error(e);

        if (!runAssertionsRightAway) {
          await this.resetFileContents(activeLeaf, originalText);
        }
      }

      if (runAssertionsRightAway) {
        await this.resetFileContents(activeLeaf, originalText);
      }

      if (delayMs && delayMs > 0) {
        await delay(delayMs);
      }
    }
  }

  addMetadataCacheTestCallback(t: IntegrationTestCase, activeLeaf: MarkdownView, originalText: string) {
    // we use this to make sure a second cache update is not able to run before the first one
    // for the file we are looking for has completed
    let alreadyRun = false;
    const eventRef = this.app.metadataCache.on('changed', async (updatedFile: TFile) => {
      if (activeLeaf.file !== updatedFile || alreadyRun ) {
        return;
      }

      alreadyRun = true;

      try {
        await t.assertions(activeLeaf.editor);

        console.log('✅', t.name);
      } catch (e) {
        console.log('❌', t.name);
        console.error(e);
      } finally {
        this.app.workspace.offref(eventRef);
        this.eventRefs.remove(eventRef);

        await this.resetFileContents(activeLeaf, originalText);
      }
    });

    this.registerEvent(eventRef);
    this.eventRefs.push(eventRef);
  }

  onunload(): void {
    for (const eventRef of this.eventRefs) {
      this.app.workspace.offref(eventRef);
    }

    if (this.plugin) {
      this.plugin.onunload();
    }
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

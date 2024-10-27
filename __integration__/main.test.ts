import {Editor, MarkdownView, Notice, Plugin, TFile, normalizePath} from 'obsidian';
import LinterPlugin from 'src/main';
import {obsidianModeTestCases} from './obsidian-mode.test';
import {setWorkspaceItemMode} from './utils.test';
import {customCommandTestCases} from './custom-commands.test';
import {obsidianYAMLRuleTestCases} from './yaml-rule.test';
import expect from 'expect';
import {ignoreTestCases} from './ignore.test';

export type IntegrationTestCase = {
  name: string,
  filePath: string,
  setup?: (plugin: TestLinterPlugin, editor: Editor) => Promise<void>,
  assertions?: (editor: Editor) => void,
  modifyExpected?: (expectedText: string, file: TFile) => string,
}

export type IntegrationIgnoreTestCase = {
  name: string,
  filePath: string,
  setup?: (plugin: TestLinterPlugin) => Promise<void>,
  expectedShouldIgnore: boolean
}

type testStatus = {
  name: string,
  succeeded: boolean,
}

const testTimeout = 15000;

export default class TestLinterPlugin extends Plugin {
  regularTests: Array<IntegrationTestCase> = [...obsidianModeTestCases, ...obsidianYAMLRuleTestCases];
  ignoreTests: Array<IntegrationIgnoreTestCase> = ignoreTestCases;
  afterCacheUpdateTests: Array<IntegrationTestCase> = [...customCommandTestCases];
  plugin: LinterPlugin;
  private timeoutId: any = undefined;
  private testRunNotice: Notice;

  async onload() {
    this.addCommand({
      id: 'run-linter-tests',
      name: 'Run Linter Tests',
      callback: async () => {
        if (this.timeoutId != undefined) {
          clearTimeout(this.timeoutId);
        }

        await this.setup();

        const testStatuses = [] as testStatus[];
        const expectedTestCount = this.regularTests.length + this.ignoreTests.length + this.afterCacheUpdateTests.length;
        this.timeoutId = setTimeout(() => {
          console.log(testStatuses);
          if (testStatuses.length != expectedTestCount) {
            if (this.testRunNotice) {
              this.testRunNotice.setMessage(`❌: Tests took too long to run with only ${testStatuses.length} of ${expectedTestCount} tests running in ${testTimeout/1000}s.`);
            } else {
              console.log('❌', `Tests took too long to run with only ${testStatuses.length} of ${expectedTestCount} tests running in ${testTimeout/1000}s.`);
            }
          } else {
            this.handleTestFinalization(testStatuses);
            console.log(`✅ all ${expectedTestCount} tests have completed in the alloted time.`);
          }
        }, testTimeout);

        await this.runTests(testStatuses, expectedTestCount);
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

  async runTests(testStatuses: testStatus[], totalTestCount: number) {
    this.testRunNotice = new Notice('Starting the Linter\'s Integration Tests', 0);

    const activeLeaf = this.getActiveLeaf();
    if (!activeLeaf) {
      console.error('failed to get active leaf');
      return;
    }

    for (const t of this.regularTests) {
      const file = this.getFileFromPath(t.filePath);
      if (!file) {
        console.error('failed to get file: ' + t.filePath);

        this.handleTestCompletion(t.name, false, testStatuses, totalTestCount);
        continue;
      }

      await activeLeaf.leaf.openFile(file);
      const originalText = activeLeaf.editor.getValue();
      await this.resetSettings();

      try {
        if (t.setup) {
          await t.setup(this, activeLeaf.editor);
        }

        await this.plugin.runLinterEditor(activeLeaf.editor);
        await this.handleAssertions(t, activeLeaf, file);

        console.log('✅', t.name);
        this.handleTestCompletion(t.name, true, testStatuses, totalTestCount);
      } catch (e) {
        console.log('❌', t.name);
        console.error(e);

        this.handleTestCompletion(t.name, false, testStatuses, totalTestCount);
      }

      await this.resetFileContents(activeLeaf, originalText);
    }

    await this.runIgnoreTests(testStatuses, totalTestCount);

    if (testStatuses.length != (this.regularTests.length + this.ignoreTests.length)) {
      if (this.testRunNotice) {
        this.testRunNotice.setMessage(`❌ failed to run all ${this.regularTests.length + this.ignoreTests.length} regular and ignore tests before attempting to start the metadata tests.`);
      } else {
        console.log(`❌ failed to run all ${this.regularTests.length} regular tests before attempting to start the metadata tests.`);
      }
      return;
    }

    await this.runMetadataTests(this.afterCacheUpdateTests, activeLeaf, testStatuses, totalTestCount);
  }

  async runIgnoreTests(testStatuses: testStatus[], totalTestCount: number) {
    for (const t of this.ignoreTests) {
      const file = this.getFileFromPath(t.filePath);
      if (!file) {
        console.error('failed to get file: ' + t.filePath);

        this.handleTestCompletion(t.name, false, testStatuses, totalTestCount);
        continue;
      }

      await this.resetSettings();

      try {
        if (t.setup) {
          await t.setup(this);
        }

        if (this.plugin.shouldIgnoreFile(file) == t.expectedShouldIgnore) {
          this.handleTestCompletion(t.name, true, testStatuses, totalTestCount);
          console.log('✅', t.name);
        } else {
          this.handleTestCompletion(t.name, false, testStatuses, totalTestCount);
          console.log('❌', t.name);
        }
      } catch (e) {
        console.log('❌', t.name);
        console.error(e);

        this.handleTestCompletion(t.name, false, testStatuses, totalTestCount);
      }
    }
  }

  async runMetadataTests(tests: IntegrationTestCase[], activeLeaf: MarkdownView, testStatuses: testStatus[], totalTestCount: number) {
    let index = 0;
    let originalText = await this.setupMetadataTest(this, tests[index], activeLeaf, testStatuses, totalTestCount);
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
        await this.handleAssertions(t, activeLeaf, file);

        console.log('✅', t.name);
        this.handleTestCompletion(t.name, true, testStatuses, totalTestCount);
      } catch (e) {
        console.log('❌', t.name);
        console.error(e);

        this.handleTestCompletion(t.name, false, testStatuses, totalTestCount);
      }

      await that.resetFileContents(activeLeaf, originalText);

      originalText = null;
      if (index+1 < tests.length) {
        originalText = await that.setupMetadataTest(that, tests[++index], activeLeaf, testStatuses, totalTestCount);
      } else { // remove the custom commands callback once all tests have run
        that.plugin.setCustomCommandCallback(null);
      }
    });
  }

  async setupMetadataTest(testPlugin: TestLinterPlugin, t: IntegrationTestCase, activeLeaf: MarkdownView, testStatuses: testStatus[], totalTestCount: number): Promise<string> {
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

      await testPlugin.plugin.runLinterEditor(activeLeaf.editor);
    } catch (e) {
      this.handleTestCompletion(t.name, false, testStatuses, totalTestCount);

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

  private async handleAssertions(t: IntegrationTestCase, activeLeaf: MarkdownView, file: TFile) {
    let expectedText = await this.getExpectedContents(t.filePath.replace('.md', '.linted.md'));
    if (t.modifyExpected) {
      expectedText = t.modifyExpected(expectedText, file);
    }

    expect(activeLeaf.editor.getValue()).toBe(expectedText);
    if (t.assertions) {
      t.assertions(activeLeaf.editor);
    }

    console.log('assertions complete for ' + t.filePath);

    return;
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

  private handleTestCompletion(testName: string, succeeded: boolean, testStatuses: testStatus[], totalTestCount: number) {
    testStatuses.push(
        {
          name: testName,
          succeeded: succeeded,
        });

    let numberOfSuccesses = 0;
    let numberOfFailures = 0;
    for (const testResult of testStatuses) {
      if (testResult.succeeded) {
        numberOfSuccesses++;
      } else {
        numberOfFailures++;
      }
    }

    if (this.testRunNotice) {
      let message = `Running the Linter's Integration Tests (${testStatuses.length}/${totalTestCount})`;
      message += '\nSo far there ';

      if (numberOfFailures == 1) {
        message += 'has been 1 failure';
      } else {
        message += `have been ${numberOfFailures} failures`;
      }

      message += ' and there ';

      if (numberOfSuccesses == 1) {
        message += 'has been 1 success';
      } else {
        message += `have been ${numberOfSuccesses} successes`;
      }

      message += '.';

      this.testRunNotice.setMessage(message);
    }
  }

  private handleTestFinalization(testStatuses: testStatus[]) {
    if (this.testRunNotice) {
      let message = `Finished running the Linter's Integration Tests.`;
      message += '\nThere ';

      let numberOfSuccesses = 0;
      let numberOfFailures = 0;
      for (const testResult of testStatuses) {
        if (testResult.succeeded) {
          numberOfSuccesses++;
        } else {
          numberOfFailures++;
        }
      }

      if (numberOfFailures == 1) {
        message += 'was 1 failure';
      } else {
        message += `have been ${numberOfFailures} failures`;
      }

      message += ' and there ';

      if (numberOfSuccesses == 1) {
        message += 'has been 1 success';
      } else {
        message += `have been ${numberOfSuccesses} successes`;
      }

      message += '. See the console for more details.';

      this.testRunNotice.setMessage(message);
    }
  }
}

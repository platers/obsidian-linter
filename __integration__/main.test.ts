import { Editor, MarkdownView, Notice, Plugin, TFile, normalizePath } from 'obsidian';
import LinterPlugin from '../src/main';
import { obsidianModeTestCases } from './obsidian-mode.test';
import { setWorkspaceItemMode } from './utils.test';
import { customCommandTestCases } from './custom-commands.test';
import { obsidianYAMLRuleTestCases } from './yaml-rule.test';
import expect from 'expect';
import { ignoreTestCases } from './ignore.test';
import { ruleTests } from './rule-tests'; // keep the name the same unless you change it in the generation logic
import { DiffPreviewView, diffPreviewViewType } from '../src/ui/views/diff-preview-view';
import { DEFAULT_SETTINGS, LinterSettings } from '../src/settings-data';
import { rules } from '../src/rules';
import { disabledRulesTestCases } from './disable-rules.test';

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
  regularTests: Array<IntegrationTestCase> = [...obsidianModeTestCases, ...obsidianYAMLRuleTestCases, ...disabledRulesTestCases, ...ruleTests];
  ignoreTests: Array<IntegrationIgnoreTestCase> = ignoreTestCases;
  afterCacheUpdateTests: Array<IntegrationTestCase> = [...customCommandTestCases];
  plugin: LinterPlugin;
  private timeoutId: number | undefined = undefined;
  private testRunNotice: Notice;
  private settingsBaseline: LinterSettings;

  async onload() {
    this.addCommand({
      id: 'run-linter-tests',
      name: 'Run Linter Tests',
      callback: async () => {
        if (this.timeoutId != undefined) {
          window.clearTimeout(this.timeoutId);
        }

        await this.setup();

        const testStatuses = [] as testStatus[];
        const expectedTestCount = this.regularTests.length + this.ignoreTests.length + this.afterCacheUpdateTests.length;
        this.timeoutId = window.setTimeout(() => {
          console.log(testStatuses);
          if (testStatuses.length != expectedTestCount) {
            if (this.testRunNotice) {
              this.testRunNotice.setMessage(`❌: Tests took too long to run with only ${testStatuses.length} of ${expectedTestCount} tests running in ${testTimeout / 1000}s.`);
            } else {
              console.log('❌', `Tests took too long to run with only ${testStatuses.length} of ${expectedTestCount} tests running in ${testTimeout / 1000}s.`);
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

      // saveSettings' 5s debounce holds a live reference to the settings object test cases
      // mutate, so without this stub it persists one test's rule configs for all later ones.
      this.plugin.saveData = () => Promise.resolve();
      this.settingsBaseline = this.buildSettingsBaseline();

      await this.plugin.onload();
    }

    await this.resetSettings();
  }

  async runTests(testStatuses: testStatus[], totalTestCount: number) {
    this.testRunNotice = new Notice('Starting the Linter\'s Integration Tests', 0);

    const activeLeaf = this.getActiveLeaf();
    if (!activeLeaf) {
      console.error('failed to get active leaf');
      return;
    }

    await this.runRegularTest(0, totalTestCount, activeLeaf, testStatuses);
  }

  async runRegularTest(index: number, totalTestCount: number, activeLeaf: MarkdownView, testStatuses: testStatus[]) {
    if (index < 0 || index >= this.regularTests.length) {
      return;
    }

    const t = this.regularTests[index]
    const file = this.getFileFromPath(t.filePath);
    if (!file) {
      console.error('failed to get file: ' + t.filePath);

      this.handleTestCompletion(t.name, false, testStatuses, totalTestCount);
      await this.nextRegularTest(index, totalTestCount, activeLeaf, testStatuses);
    }

    await activeLeaf.leaf.openFile(file);
    // Consecutive cases reuse a fixture and openFile will not reload an already-open file,
    // so an editor read would adopt the previous case's end state as this case's baseline.
    const originalText = await this.app.vault.read(file);
    await this.resetSettings();

    try {
      if (t.setup) {
        await t.setup(this, activeLeaf.editor);
        await this.refreshDerivedSettingsState();
      }

      await this.plugin.runLinterEditor(activeLeaf.editor, async () => {
        try {
          await this.handleAssertions(t, activeLeaf, file);

          console.log('✅', t.name);
          this.handleTestCompletion(t.name, true, testStatuses, totalTestCount);
        } catch (e) {
          console.log('❌', t.name);
          console.error(e);

          this.handleTestCompletion(t.name, false, testStatuses, totalTestCount);
        }
        finally {
          await this.resetFileContents(file, originalText);

          await this.nextRegularTest(index, totalTestCount, activeLeaf, testStatuses);
        }
      });
    } catch (e) {
      console.log('❌', t.name);
      console.error(e);

      this.handleTestCompletion(t.name, false, testStatuses, totalTestCount);
    }
  }

  async nextRegularTest(index: number, totalTestCount: number, activeLeaf: MarkdownView, testStatuses: testStatus[]) {
    if (index < this.regularTests.length - 1) {
      await this.runRegularTest(index + 1, totalTestCount, activeLeaf, testStatuses);
    } else {
      await this.runIgnoreTests(testStatuses, totalTestCount);

      if (testStatuses.length != (this.regularTests.length + this.ignoreTests.length)) {
        if (this.testRunNotice) {
          this.testRunNotice.setMessage(`❌ failed to run all ${this.regularTests.length + this.ignoreTests.length} regular and ignore tests before attempting to start the metadata tests.`);
        } else {
          console.log(`❌ failed to run all ${this.regularTests.length} regular tests before attempting to start the metadata tests.`);
        }
      } else {
        await this.runMetadataTests(this.afterCacheUpdateTests, activeLeaf, testStatuses, totalTestCount);
      }
    }
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

        if ((!this.plugin.isMarkdownFile(file) || this.plugin.shouldIgnoreFile(file)) == t.expectedShouldIgnore) {
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

    this.plugin.setCustomCommandCallback(async (file: TFile) => {
      if (file !== activeLeaf.file) {
        return;
      }

      if (originalText == null) {
        this.plugin.setCustomCommandCallback(null);
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
      } finally {
        await this.resetFileContents(file, originalText);
      }

      originalText = null;
      if (index + 1 < tests.length) {
        originalText = await this.setupMetadataTest(this, tests[++index], activeLeaf, testStatuses, totalTestCount);
      } else { // remove the custom commands callback once all tests have run
        this.plugin.setCustomCommandCallback(null);
      }
    });
  }

  async setupMetadataTest(testPlugin: TestLinterPlugin, t: IntegrationTestCase, activeLeaf: MarkdownView, testStatuses: testStatus[], totalTestCount: number): Promise<string> {
    const file = this.getFileFromPath(t.filePath);
    if (!file) {
      console.error('failed to get file: ' + t.filePath);
      this.handleTestCompletion(t.name, false, testStatuses, totalTestCount);
      return null;
    }

    await activeLeaf.leaf.openFile(file);
    const originalText = await this.app.vault.read(file);
    await testPlugin.resetSettings();

    try {
      if (t.setup) {
        await t.setup(this, activeLeaf.editor);
        await testPlugin.refreshDerivedSettingsState();
      }

      await testPlugin.plugin.runLinterEditor(activeLeaf.editor);
    } catch (e) {
      this.handleTestCompletion(t.name, false, testStatuses, totalTestCount);

      console.log('❌', t.name);
      console.error(e);
      await testPlugin.resetFileContents(file, originalText);

      return null;
    }

    return originalText;
  }

  onunload(): void {
    if (this.plugin) {
      // based on https://github.com/dbarenholz/obsidian-plaintext/blob/2c30a6e957e5cc9ac7757cc9fbeb641de1b158dc/src/main.ts#L160
      const view = this.app.workspace.getActiveViewOfType(DiffPreviewView);
      if (view) {
        view.leaf.detach();
      }

      this.app.viewRegistry.unregisterView(diffPreviewViewType);
      this.plugin.onunload();
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

  private async resetFileContents(file: TFile, originalText: string) {
    // Resolved per call rather than reusing the leaf captured before the run, since custom
    // commands and the diff preview can both leave a different leaf active.
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (view && view.file === file && view.editor.getValue() !== originalText) {
      view.editor.setValue(originalText);
      // Obsidian's autosave is debounced well past the start of the next test, and the mode
      // switch below rebuilds the editor, which would drop an unflushed setValue.
      await view.save();
    }

    await this.app.vault.process(file, () => originalText);
    await setWorkspaceItemMode(this.app, true);
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

    // do not use cached read as it seems to add an extra newline character for some reason..
    return await this.app.vault.read(file);
  }

  private getFileFromPath(filePath: string): TFile {
    const file = this.app.vault.getAbstractFileByPath(normalizePath(filePath));
    if (file instanceof TFile) {
      return file;
    }

    return null;
  }

  private buildSettingsBaseline(): LinterSettings {
    const baseline = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)) as LinterSettings;
    // DEFAULT_SETTINGS ships an empty ruleConfigs; the plugin fills it in from an un-awaited
    // onLayoutReady callback, so seeding it here keeps the baseline free of that race. Every
    // rule's 'enabled' option defaults to false, which is what prevents bleed over for tests.
    for (const rule of rules) {
      baseline.ruleConfigs[rule.alias] = rule.getDefaultOptions();
    }

    return baseline;
  }

  private async resetSettings() {
    const baseline = JSON.parse(
      JSON.stringify(this.settingsBaseline)
    ) as LinterSettings;

    Object.assign(this.plugin.settings, baseline);
    await this.plugin.saveSettings();
  }

  // hasCustomCommands and overridePaste are only recomputed by loadSettings/saveSettings, so a
  // test case that assigns settings directly needs this or the plugin ignores its lintCommands.
  private async refreshDerivedSettingsState() {
    await this.plugin.saveSettings();
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

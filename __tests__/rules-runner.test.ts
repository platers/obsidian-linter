import {Command} from 'obsidian';
import {RulesRunner} from '../src/rules-runner';
import { CustomReplace } from "../src/settings-data";
import dedent from 'ts-dedent';
import { LintCommand } from "../src/settings-data";
import { ObsidianCommandInterface } from '../src/typings/obsidian-ex';
import {DEFAULT_SETTINGS, LinterSettings} from '../src/settings-data';
import FileNameHeading from '../src/rules/file-name-heading';
import ReIndexFootnotes from '../src/rules/re-index-footnotes';
import RemoveYamlKeys from '../src/rules/remove-yaml-keys';
import ProperEllipsis from '../src/rules/proper-ellipsis';
import RemoveMultipleSpaces from '../src/rules/remove-multiple-spaces';
import StrongStyle from '../src/rules/strong-style';

const rulesRunner = new RulesRunner();
describe('settings enablement before batch barriers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe.each([
    {rule: RemoveYamlKeys.getRule(), isBarrier: true},
    {rule: FileNameHeading.getRule(), isBarrier: true},
    {rule: ReIndexFootnotes.getRule(), isBarrier: true},
    {rule: StrongStyle.getRule(), isBarrier: false},
  ])('$rule.alias', ({rule, isBarrier}) => {
    it.each([false, undefined, true])('preserves output and shares snapshots only when safe with enabled=%s', (enabled) => {
      const firstRule = ProperEllipsis.getRule();
      const lastRule = RemoveMultipleSpaces.getRule();
      const settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)) as LinterSettings;
      settings.ruleConfigs[firstRule.settingsKey] = {enabled: true};
      settings.ruleConfigs[rule.settingsKey] = enabled === undefined ? {} : {enabled};
      settings.ruleConfigs[lastRule.settingsKey] = {enabled: true};

      // Keep the edits far enough apart that only the middle rule can split this batch.
      const text = 'first\n\nunchanged\n\nunchanged\n\nlast';
      const firstApply = jest.spyOn(firstRule, 'apply').mockImplementation((snapshot) => snapshot.replace('first', 'FIRST'));
      const middleApply = jest.spyOn(rule, 'apply').mockImplementation((snapshot) => snapshot);
      const lastApply = jest.spyOn(lastRule, 'apply').mockImplementation((snapshot) => snapshot.replace('last', 'LAST'));

      const output = rulesRunner['runRulesInBatches']([firstRule, rule, lastRule], text, settings, {});

      expect(output).toBe('FIRST\n\nunchanged\n\nunchanged\n\nLAST');
      expect(firstApply).toHaveBeenCalledTimes(1);
      expect(middleApply).toHaveBeenCalledTimes(enabled ? 1 : 0);
      expect(lastApply).toHaveBeenCalledTimes(1);
      const startsNewBatch = enabled && isBarrier;
      expect(lastApply.mock.calls[0][0]).toBe(startsNewBatch ? text.replace('first', 'FIRST') : text);
      if (startsNewBatch) {
        // Even an enabled barrier that returns unchanged text must see earlier work first.
        expect(middleApply.mock.calls[0][0]).toBe(text.replace('first', 'FIRST'));
        expect(lastApply.mock.calls[0][2]).not.toBe(firstApply.mock.calls[0][2]);
      } else {
        expect(lastApply.mock.calls[0][2]).toBe(firstApply.mock.calls[0][2]);
      }
    });
  });
});

interface AppCommandsMock extends ObsidianCommandInterface {
  numberOfCommands: number;
  numberOfHitsPerId: Map<string, number>;
  resetStats(): void;
}

const appCommandsMock: AppCommandsMock = {
  numberOfCommands: 0,
  numberOfHitsPerId: new Map<string, number>(),
  executeCommandById(this: AppCommandsMock, id: string): void {
    this.numberOfCommands += 1;
    if (this.numberOfHitsPerId.has(id)) {
      this.numberOfHitsPerId.set(id, 1);
    } else {
      this.numberOfHitsPerId.set(id, (this.numberOfHitsPerId.get(id) ?? 0) + 1);
    }
  },
  commands: {
    'editor:save-file': {
      checkCallback: () => {},
    },
  },
  listCommands(): Command[] {
    return [];
  },
  resetStats(this: AppCommandsMock) {
    this.numberOfCommands = 0;
    this.numberOfHitsPerId = new Map<string, number>();
  },
};

type CustomCommandTestCase = {
  testName: string,
  listOfCommands: LintCommand[],
  expectedCommandCount: Map<string, number>;
  expectedNumberOfCommandsRun: number;
  skipFileValue: boolean
}

const customCommandTestCases: CustomCommandTestCase[] = [
  {
    testName: 'No app lint commands running should include no hit results for command lint run',
    listOfCommands: [],
    expectedCommandCount: new Map<string, number>(),
    expectedNumberOfCommandsRun: 0,
    skipFileValue: false,
  },
  {
    testName: 'When an app lint command is run it should be executed',
    listOfCommands: [
      {id: 'first id', name: 'command name', enabled: true},
      {id: 'second id', name: 'command name 2', enabled: true},
    ],
    expectedCommandCount: new Map([
      ['first id', 1],
      ['second id', 1],
    ]),
    expectedNumberOfCommandsRun: 2,
    skipFileValue: false,
  },
  {
    testName: 'A lint command with an empty id should not get run',
    listOfCommands: [
      {id: '', name: '', enabled: true},
    ],
    expectedCommandCount: new Map([
      ['', 0],
    ]),
    expectedNumberOfCommandsRun: 0,
    skipFileValue: false,
  },
  {
    testName: 'When custom commands are run with two of the same command, the second command instance is skipped',
    listOfCommands: [
      {id: 'first id', name: 'command name', enabled: true},
      {id: 'first id', name: 'command name', enabled: true},
    ],
    expectedCommandCount: new Map([
      ['first id', 1],
    ]),
    expectedNumberOfCommandsRun: 1,
    skipFileValue: false,
  },
  {
    testName: 'When the file is listed to be skipped, no custom commands are run',
    listOfCommands: [
      {id: 'first id', name: 'command name', enabled: true},
      {id: 'second id', name: 'command name 2', enabled: true},
    ],
    expectedCommandCount: new Map<string, number>(),
    expectedNumberOfCommandsRun: 0,
    skipFileValue: true,
  },
  {
    testName: 'When the custom commands are not enabled, nothing gets run',
    listOfCommands: [
      {id: 'first id', name: 'command name', enabled: false},
      {id: 'second id', name: 'command name 2', enabled: false},
    ],
    expectedCommandCount: new Map<string, number>(),
    expectedNumberOfCommandsRun: 0,
    skipFileValue: false,
  },
];


type CustomReplaceTestCase = {
  testName: string,
  listOfRegexReplacements: CustomReplace[],
  before: string,
  after: string,
}

const customReplaceTestCases: CustomReplaceTestCase[] = [
  {
    testName: 'A custom replace with no find value does not affect the text',
    listOfRegexReplacements: [
      {
        label: '', find: '', replace: 'hello', flags: 'g', enabled: true,
      },
    ],
    before: dedent`
      How does this look?
      Did it stay the same?
    `,
    after: dedent`
      How does this look?
      Did it stay the same?
    `,
  },
  {
    testName: 'A custom replace with a null or undefined find value does not affect the text',
    listOfRegexReplacements: [
      {
        label: '', find: 'How', replace: null, flags: '', enabled: true,
      },
      {
        label: 'Replace 2', find: 'look', replace: undefined, flags: '', enabled: true,
      },
    ],
    before: dedent`
      How does this look?
      Did it stay the same?
    `,
    after: dedent`
      How does this look?
      Did it stay the same?
    `,
  },
  {
    testName: 'A custom replace searching for multiple blank lines in a row works (has proper escaping of a slash)',
    listOfRegexReplacements: [
      {
        label: 'condense multiple blanks into 1', find: '\n{3,}', replace: '\n\n', flags: 'g', enabled: true,
      },
    ],
    before: dedent`
      How does this look?
      ${''}
      ${''}
      Did it stay the same?
    `,
    after: dedent`
      How does this look?
      ${''}
      Did it stay the same?
    `,
  },
  {
    testName: 'A custom replace using capture groups works',
    listOfRegexReplacements: [
      {
        label: 'Remove a question mark proceeded by a k or an e', find: '(k|e)(\\?)', replace: '$1', flags: 'g', enabled: true,
      },
    ],
    before: dedent`
      How does this look?
      Did it stay the same?
    `,
    after: dedent`
      How does this look
      Did it stay the same
    `,
  },
  {
    testName: 'A custom replace using ^ and $ works',
    listOfRegexReplacements: [
      {
        label: 'Replace Did at the start of a line or look? at the end of a line', find: '(^Did)|(look\\?$)', replace: 'swapped', flags: 'gm', enabled: true,
      },
    ],
    before: dedent`
      How does this look?
      Did it stay the same?
    `,
    after: dedent`
      How does this swapped
      swapped it stay the same?
    `,
  },
  { // accounts for https://github.com/platers/obsidian-linter/issues/739
    testName: 'A custom replace should respect linter ignore ranges',
    listOfRegexReplacements: [
      {
        label: 'Replace Did at the start of a line or look? at the end of a line', find: '(^Did)|(look\\?$)', replace: 'swapped', flags: 'gm', enabled: true,
      },
    ],
    before: dedent`
      How does this look?
      <!-- linter-disable -->
      Did it stay the same?
      <!-- linter-enable -->
    `,
    after: dedent`
      How does this swapped
      <!-- linter-disable -->
      Did it stay the same?
      <!-- linter-enable -->
    `,
  },
  { // accounts for https://github.com/platers/obsidian-linter/issues/1025
    testName: 'A custom replace with an undefined label should still run.',
    listOfRegexReplacements: [
      {
        label: undefined, find: 'lobo', replace: 'hello', flags: 'g', enabled: true,
      },
    ],
    before: dedent`
      How does this lobo?
      Did it stay the same?
    `,
    after: dedent`
      How does this hello?
      Did it stay the same?
    `,
  },
  { // relates for https://github.com/platers/obsidian-linter/issues/1121
    testName: 'A custom replace should respect linter ignore ranges that use the Obsidian comment format',
    listOfRegexReplacements: [
      {
        label: 'Replace Did at the start of a line or look? at the end of a line', find: '(^Did)|(look\\?$)', replace: 'swapped', flags: 'gm', enabled: true,
      },
    ],
    before: dedent`
      How does this look?
      %% linter-disable %%
      Did it stay the same?
      %% linter-enable %%
    `,
    after: dedent`
      How does this swapped
      %% linter-disable %%
      Did it stay the same?
      %% linter-enable %%
    `,
  },
  {
    testName: 'A custom replace that is not enabled should not run',
    listOfRegexReplacements: [
      {
        label: undefined, find: 'lobo', replace: 'hello', flags: 'g', enabled: false,
      },
    ],
    before: dedent`
      How does this look?
      Did it stay the same?
    `,
    after: dedent`
      How does this look?
      Did it stay the same?
    `,
  },
  { // accounts for https://github.com/platers/obsidian-linter/issues/1508
    testName: 'An escaped slash should be handled first before other escapes',
    listOfRegexReplacements: [
      {
        label: undefined, find: '\\|([\\w\\d])>', replace: '$|$1 \\rangle$', flags: 'gm', enabled: true,
      },
    ],
    before: dedent`
      |x>
    `,
    after: dedent`
      $|x \rangle$
    `,
  },
];

describe('Rules Runner', () => {
  describe.each([
    ['HTML', '<!-- linter-disable -->', '<!-- linter-enable -->'],
    ['Obsidian', '%% linter-disable %%', '%% linter-enable %%'],
  ])('custom regex protection with %s comments', (_format, start, end) => {
    const ignored = `${start}x${end}`;
    const replace = (text: string, find: string, replacement: string, flags: string) => rulesRunner.runCustomRegexReplacement([
      {label: '', find, replace: replacement, flags, enabled: true},
    ], text);

    it('continues to the first unprotected non-global match', () => {
      // A protected match must not consume the single replacement a non-global expression makes.
      expect(replace(`${ignored}xx`, 'x', 'y', '')).toBe(`${ignored}yx`);
    });

    it('discards global matches inside protection', () => {
      expect(replace(`x${ignored}x`, 'x', 'y', 'g')).toBe(`y${ignored}y`);
    });

    it('discards a match spanning a disabled section', () => {
      expect(replace(`before${ignored}after`, 'before[\\s\\S]*after', 'removed', 'g')).toBe(`before${ignored}after`);
    });

    it('continues after a rejected spanning non-global match', () => {
      expect(replace(`a${ignored}b ab ab`, 'a[\\s\\S]*?b', 'y', '')).toBe(`a${ignored}b y ab`);
    });

    it('preserves native replacement expansion and lookahead', () => {
      const suffix = ' (x) (x)';
      const replacement = '$$:$&:$1:$2:$<letter>:$<missing>:$12:$01:$0';
      expect(replace(ignored + suffix, '(?<letter>x)(z)?(?=\\))', replacement, 'g'))
          .toBe(ignored + suffix.replace(new RegExp('(?<letter>x)(z)?(?=\\))', 'g'), replacement));
    });

    it('preserves native prefix and suffix replacement references', () => {
      const text = `${ignored} x!`;
      expect(replace(text, 'x(?=!)', "$`|$&|$'", '')).toBe(text.replace(/x(?=!)/, "$`|$&|$'"));
    });

    it('advances past protected empty Unicode matches', () => {
      const text = `${start}😀${end}😀`;
      expect(replace(text, '(?=😀)', 'y', 'gu')).toBe(`${start}😀${end}y😀`);
    });

    it('permits empty matches at protection boundaries', () => {
      expect(replace(ignored, '(?:)', '|', 'gu')).toBe(`|${ignored}|`);
    });

    it('preserves sticky matching without searching past a gap', () => {
      expect(replace(`x ${ignored}x`, 'x', 'y', 'gy')).toBe(`y ${ignored}x`);
    });

    it('refreshes protection offsets between expressions', () => {
      expect(rulesRunner.runCustomRegexReplacement([
        {label: '', find: '^a', replace: 'longer', flags: '', enabled: true},
        {label: '', find: 'x', replace: 'y', flags: 'g', enabled: true},
      ], `a${ignored}x`)).toBe(`longer${ignored}y`);
    });
  });

  // custom commands
  for (const testCase of customCommandTestCases) {
    it(testCase.testName, () => {
      appCommandsMock.resetStats();
      rulesRunner.skipFile = testCase.skipFileValue;
      rulesRunner.runCustomCommands(testCase.listOfCommands, appCommandsMock);

      expect(appCommandsMock.numberOfCommands).toEqual(testCase.expectedNumberOfCommandsRun);
      for (const command of testCase.listOfCommands) {
        expect(appCommandsMock.numberOfHitsPerId.get(command.id) ?? 0).toEqual(testCase.expectedCommandCount.get(command.id) ?? 0);
      }
    });
  }

  // custom regex replacement
  for (const testCase of customReplaceTestCases) {
    it(testCase.testName, () => {
      const updateText = rulesRunner.runCustomRegexReplacement(testCase.listOfRegexReplacements, testCase.before);

      expect(updateText).toEqual(testCase.after);
    });
  }
});

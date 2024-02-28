import {Command} from 'obsidian';
import {RulesRunner} from '../src/rules-runner';
import {CustomReplace} from '../src/ui/linter-components/custom-replace-option';
import dedent from 'ts-dedent';

const rulesRunner = new RulesRunner();
const appCommandsMock = {
  numberOfCommands: 0,
  numberOfHitsPerId: new Map<string, number>(),
  executeCommandById: function(id: string): void {
    this.numberOfCommands += 1;
    if (!this.numberOfHitsPerId.has(id)) {
      this.numberOfHitsPerId.set(id, 1);
    } else {
      this.numberOfHitsPerId.set(id, this.numberOfHitsPerId.get(id) + 1);
    }
  },
  commands: {
    'editor:save-file': {
      callback: () => {},
    },
  },
  listCommands: (): Command[] => {
    return [];
  },
  resetStats: function() {
    this.numberOfCommands = 0;
    this.numberOfHitsPerId = new Map<string, number>();
  },
};

type CustomCommandTestCase = {
  testName: string,
  listOfCommands: Command[],
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
      {id: 'first id', name: 'command name'},
      {id: 'second id', name: 'command name 2'},
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
      {id: '', name: ''},
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
      {id: 'first id', name: 'command name'},
      {id: 'first id', name: 'command name'},
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
      {id: 'first id', name: 'command name'},
      {id: 'second id', name: 'command name 2'},
    ],
    expectedCommandCount: new Map<string, number>(),
    expectedNumberOfCommandsRun: 0,
    skipFileValue: true,
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
        label: '', find: '', replace: 'hello', flags: 'g',
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
        label: '', find: 'How', replace: null, flags: '',
      },
      {
        label: 'Replace 2', find: 'look', replace: undefined, flags: '',
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
        label: 'condense multiple blanks into 1', find: '\n{3,}', replace: '\n\n', flags: 'g',
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
        label: 'Remove a question mark proceeded by a k or an e', find: '(k|e)(\\?)', replace: '$1', flags: 'g',
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
        label: 'Replace Did at the start of a line or look? at the end of a line', find: '(^Did)|(look\\?$)', replace: 'swapped', flags: 'gm',
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
        label: 'Replace Did at the start of a line or look? at the end of a line', find: '(^Did)|(look\\?$)', replace: 'swapped', flags: 'gm',
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
        label: undefined, find: 'lobo', replace: 'hello', flags: 'g',
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
];

describe('Rules Runner', () => {
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

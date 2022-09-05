import moment from 'moment';
import {Command} from 'obsidian';
import {RulesRunner, RunLinterRulesOptions} from '../src/rules-runner';
import {LinterSettings, rules, LintCommand} from '../src/rules';

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

afterEach(() => {
  appCommandsMock.resetStats();
});

function setEmptyRuleConfig(settings: LinterSettings) {
  for (const rule of rules) {
    settings.ruleConfigs[rule.name] = rule.getDefaultOptions();
  }
}

describe('Rules Runner', () => {
  it('No app lint commands running should include no hits results for command lints run', () => {
    rulesRunner.lintText(createTestLinterRulesOptions([]));

    expect(appCommandsMock.numberOfCommands).toEqual(0);
  });

  it('When an app lint command is run it should be executed', () => {
    const listOfCommands = [
      {id: 'first id', name: 'command name'},
      {id: 'second id', name: 'command name 2'},
    ];
    rulesRunner.lintText(createTestLinterRulesOptions(listOfCommands));

    expect(appCommandsMock.numberOfCommands).toEqual(2);
    expect(appCommandsMock.numberOfHitsPerId.get('first id') ?? 0).toEqual(1);
    expect(appCommandsMock.numberOfHitsPerId.get('second id') ?? 0).toEqual(1);
  });

  it('A lint command with an empty id should not get run', () => {
    const listOfCommands = [
      {id: '', name: ''},
    ];
    rulesRunner.lintText(createTestLinterRulesOptions(listOfCommands));

    expect(appCommandsMock.numberOfCommands).toEqual(0);
    expect(appCommandsMock.numberOfHitsPerId.get('') ?? 0).toEqual(0);
  });
});

function createTestLinterRulesOptions(lintCommands: LintCommand[]): RunLinterRulesOptions {
  const settings = {
    ruleConfigs: {},
    lintOnSave: false,
    displayChanged: false,
    foldersToIgnore: [] as string[],
    linterLocale: 'en',
    logLevel: 1,
    lintCommands: lintCommands,
  };
  setEmptyRuleConfig(settings);

  return {
    oldText: '',
    fileInfo: {
      name: 'file name',
      createdAtFormatted: 'Wednesday, January 1st 2020, 12:00:00 am',
      modifiedAtFormatted: 'Thursday, January 2nd 2020, 12:00:00 am',
    },
    settings: settings,
    momentLocale: 'en',
    commands: appCommandsMock,
    getCurrentTime: () => {
      return moment();
    },
  };
}

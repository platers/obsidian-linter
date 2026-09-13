import {existsSync, readFileSync} from 'fs';
import {moment} from 'obsidian';
import {rules} from '../src/rules';
import {RulesRunner} from '../src/rules-runner';
import {LinterSettings} from '../src/settings-data';
import {setLanguage} from '../src/lang/helpers';
import {parseCustomReplacements} from '../src/utils/strings';
import '../src/rules-registry';

// Parsing the document is the bulk of the cost of linting a large one, and the number of parses is
// stable from run to run in a way that the elapsed time is not, so it is the number that gets
// asserted on. jest insists the variable a mock factory closes over is named `mock` something.
const mockParseStats = {calls: 0, ms: 0};

jest.mock('mdast-util-from-markdown', () => {
  const actual = jest.requireActual<typeof import('mdast-util-from-markdown')>('mdast-util-from-markdown');

  return {
    ...actual,
    fromMarkdown: (...args: Parameters<typeof actual.fromMarkdown>) => {
      const start = performance.now();
      const result = actual.fromMarkdown(...args);
      mockParseStats.calls++;
      mockParseStats.ms += performance.now() - start;

      return result;
    },
  };
});

const largeFixturePath = 'Introduction.to.a.Self.Managed.Life.md';
const settingsFixturePath = 'data-test.json';
const excerptLineCount = 600;

// Both fixtures are untracked, so anyone without them gets a run that reports nothing rather than
// a failure. Set LINT_FULL_FIXTURE=1 to measure the whole document instead of an excerpt of it.
const runsWholeFixture = process.env.LINT_FULL_FIXTURE === '1';
const excerptParseBudget = 36;
const wholeFixtureParseBudget = 36;

function settingsFromFixture(): LinterSettings {
  const settings = JSON.parse(readFileSync(settingsFixturePath, 'utf8')) as LinterSettings;

  for (const rule of rules) {
    const config = Object.assign(rule.getDefaultOptions(), settings.ruleConfigs[rule.settingsKey] ?? {});
    // assigning an undefined value over a default wins, so an option the settings have no value
    // for has to be left out rather than passed through
    for (const key of Object.keys(config)) {
      if (config[key] === undefined) {
        delete config[key];
      }
    }

    settings.ruleConfigs[rule.settingsKey] = config;
  }

  settings.logLevel = 'ERROR';

  return settings;
}

describe('linting a large document', () => {
  const fixturesArePresent = existsSync(largeFixturePath) && existsSync(settingsFixturePath);
  const testIfFixturesArePresent = fixturesArePresent ? it : it.skip;

  testIfFixturesArePresent('parses it no more times than it is allowed to', () => {
    setLanguage('en');

    let text = readFileSync(largeFixturePath, 'utf8');
    if (!runsWholeFixture) {
      text = text.split('\n').slice(0, excerptLineCount).join('\n');
    }

    const settings = settingsFromFixture();
    const misspellings = parseCustomReplacements(readFileSync('src/utils/default-misspellings.md', 'utf8'));

    mockParseStats.calls = 0;
    mockParseStats.ms = 0;

    const start = performance.now();
    new RulesRunner().lintText({
      oldText: text,
      fileInfo: {name: 'note', createdAtFormatted: '2025-05-11T19:34:17-04:00', modifiedAtFormatted: '2025-05-31T12:38:50-04:00', path: 'note.md'},
      settings,
      momentLocale: 'en',
      getCurrentTime: () => moment('2025-05-31T12:38:50-04:00'),
      defaultMisspellings: misspellings,
    });
    const elapsed = performance.now() - start;

    process.stdout.write(`\nparses: ${mockParseStats.calls}, parsing: ${Math.round(mockParseStats.ms)}ms, lint: ${Math.round(elapsed)}ms\n`);

    expect(mockParseStats.calls).toBeLessThanOrEqual(runsWholeFixture ? wholeFixtureParseBudget : excerptParseBudget);
  }, 30 * 60 * 1000);
});

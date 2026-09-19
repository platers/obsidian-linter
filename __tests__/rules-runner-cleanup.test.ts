import {moment} from 'obsidian';
import {setLanguage} from '../src/lang/helpers';
import {rules} from '../src/rules';
import {RulesRunner} from '../src/rules-runner';
import BlockquoteStyle from '../src/rules/blockquote-style';
import ConsecutiveBlankLines from '../src/rules/consecutive-blank-lines';
import ForceYamlEscape from '../src/rules/force-yaml-escape';
import TrailingSpaces from '../src/rules/trailing-spaces';
import {DEFAULT_SETTINGS, LinterSettings} from '../src/settings-data';
import * as textEdits from '../src/utils/text-edits';
import '../src/rules-registry';

const cleanupRules = [BlockquoteStyle.getRule(), ForceYamlEscape.getRule(), TrailingSpaces.getRule(), ConsecutiveBlankLines.getRule()];
const documents = [
  {name: 'nested blockquotes', text: '>>one  \n> >\ttwo\t\n> >\n>three\n'},
  {name: 'blockquotes in lists', text: '- item\n\n  >quote  \n  >>nested\t\n\n- next\n'},
  {name: 'callouts', text: '>[!note]\n>\tcontent  \n>>nested\t\n>\t\n>last\n'},
  {name: 'marker-only lines', text: '> \t\n>\n>\t\n'},
  {name: 'blockquote at EOF', text: '>quote  '},
  {name: 'marker at EOF', text: '>\t'},
  {name: 'whitespace-only document', text: ' \t\n\t\n   \n'},
  {name: 'blank runs', text: 'before\n \t\n\t\n   \nafter\n'},
  {name: 'blank runs at EOF', text: 'before\n \t\n\t\n   '},
  {name: 'code boundaries', text: 'before\n \t\n\t\n```\ncode  \n \t\n\n```\n \t\n\t\nafter\n'},
  {name: 'math boundaries', text: 'before\n \t\n\t\n$$\nx  \n\n\n$$\n \t\n\t\nafter\n'},
  {name: 'custom ignore boundaries', text: 'before\n \t\n\t\n<!-- linter-disable -->\n>quote  \n \t\n\n<!-- linter-enable -->\n \t\n\t\nafter\n'},
  {name: 'link boundaries', text: '[link](url)\n \t\n\t\n[[wiki]]\n \t\n\t\n`code`\n'},
  {name: 'list boundaries', text: 'before\n \t\n\t\n- item  \n \t\n\t\n- next\n \t\n\t\nafter\n'},
  {name: 'nested list boundaries', text: '- item\n  - nested  \n \t\n\t\n  - next\n\n\nafter\n'},
  {name: 'frontmatter directly before content', text: '---\nkey: value\n---\n>quote  \n'},
  {name: 'frontmatter before one blank line', text: '---\nkey: value\n---\n\n>quote  \n'},
  {name: 'frontmatter before several blank lines', text: '---\nkey: value\n---\n \t\n\t\n\n>quote  \n'},
  {name: 'frontmatter-only file', text: '---\nkey: value\n---\n'},
  {name: 'closing delimiter at EOF', text: '---\nkey: value\n---'},
  {name: 'empty frontmatter', text: '---\n---'},
  {name: 'empty file', text: ''},
];

function cleanupSettings(mask: number, style: string = 'space', twoSpaceLineBreak: boolean = false): LinterSettings {
  const settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)) as LinterSettings;
  for (const rule of rules) {
    settings.ruleConfigs[rule.settingsKey] = {...rule.getDefaultOptions(), enabled: false};
  }
  for (const [index, rule] of cleanupRules.entries()) {
    settings.ruleConfigs[rule.settingsKey] = {...settings.ruleConfigs[rule.settingsKey], enabled: (mask & (1 << index)) !== 0};
  }
  settings.ruleConfigs['blockquote-style'] = {...settings.ruleConfigs['blockquote-style'], style};
  settings.ruleConfigs['trailing-spaces'] = {...settings.ruleConfigs['trailing-spaces'], 'two-space-line-break': twoSpaceLineBreak};
  settings.ruleConfigs['force-yaml-escape'] = {...settings.ruleConfigs['force-yaml-escape'], 'force-yaml-escape-keys': 'key'};
  return settings;
}

function sequentialCleanup(text: string, settings: LinterSettings, disabledRules: string[] = []): string {
  [text] = BlockquoteStyle.applyIfEnabled(text, settings, disabledRules);
  [text] = ForceYamlEscape.applyIfEnabled(text, settings, disabledRules, {
    defaultEscapeCharacter: settings.commonStyles.escapeCharacter,
  });
  [text] = TrailingSpaces.applyIfEnabled(text, settings, disabledRules);
  [text] = ConsecutiveBlankLines.applyIfEnabled(text, settings, disabledRules);
  return text;
}

function runCleanup(text: string, settings: LinterSettings, disabledRules: string[] = []): string {
  const runner = new RulesRunner();
  runner['disabledRules'] = disabledRules;
  return runner['runAfterRegularRules'](text, {
    oldText: text,
    fileInfo: {name: 'note', createdAtFormatted: '', modifiedAtFormatted: '', path: 'note.md'},
    settings,
    momentLocale: 'en',
    getCurrentTime: () => moment('2025-05-31T12:38:50-04:00'),
    defaultMisspellings: new Map<string, string>(),
  });
}

describe('the four adjacent cleanup rules', () => {
  beforeAll(() => {
    setLanguage('en');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('matches sequential output for hazards, both line endings, and every enabled subset', () => {
    for (const newline of ['\n', '\r\n']) {
      for (const style of ['space', 'no space']) {
        for (const twoSpaceLineBreak of [false, true]) {
          for (let mask = 0; mask < 16; mask++) {
            const settings = cleanupSettings(mask, style, twoSpaceLineBreak);
            for (const document of documents) {
              const input = document.text.replace(/\n/g, newline);
              const expected = sequentialCleanup(input, settings);
              const actual = runCleanup(input, settings);
              expect({name: document.name, input, mask, style, twoSpaceLineBreak, output: actual})
                  .toEqual({name: document.name, input, mask, style, twoSpaceLineBreak, output: expected});
            }
          }
        }
      }
    }
  });

  it.each(['settings', 'file'])('matches every subset disabled by %s without splitting the remaining snapshot', (disabledBy) => {
    const text = '---\nkey: value\n---\none\ntwo\nthree\nfour\nfive\n>quote\none\ntwo\nthree\nfour\nfive\nlast  \none\ntwo\nthree\nfour\nfive\n\n\nend\n';
    for (let mask = 0; mask < 16; mask++) {
      const settings = cleanupSettings(disabledBy === 'settings' ? 15 ^ mask : 15);
      const disabled = cleanupRules.filter((_rule, index) => (mask & (1 << index)) !== 0).map((rule) => rule.alias);
      const disabledRules = disabledBy === 'file' ? disabled : [];
      const expected = sequentialCleanup(text, settings, disabledRules);
      const applies = cleanupRules.map((rule) => jest.spyOn(rule, 'apply'));
      expect(runCleanup(text, settings, disabledRules)).toBe(expected);
      const enabledApplies = applies.filter((_apply, index) => !disabled.includes(cleanupRules[index].alias));
      for (const [index, apply] of applies.entries()) {
        expect(apply).toHaveBeenCalledTimes(disabled.includes(cleanupRules[index].alias) ? 0 : 1);
      }
      for (const apply of enabledApplies) {
        expect(apply.mock.calls[0][0]).toBe(text);
        expect(apply.mock.calls[0][2]).toBe(enabledApplies[0].mock.calls[0][2]);
      }
      jest.restoreAllMocks();
    }
  });

  it.each([
    {name: 'blockquote markers', text: '> \t\n>\n'},
    {name: 'LF blank runs', text: 'before\n \t\n\t\n   \nafter\n'},
    {name: 'CRLF blank runs', text: 'before\r\n \t\r\n\t\r\n   \r\nafter\r\n'},
  ])('retries genuine overlapping whitespace edits on $name', ({name, text}) => {
    const settings = cleanupSettings(15);
    const expected = sequentialCleanup(text, settings);
    const clashes = jest.spyOn(textEdits, 'addEditsIfTheyDoNotClash');
    const retriedRule = name === 'blockquote markers' ? TrailingSpaces.getRule() : ConsecutiveBlankLines.getRule();
    const retriedApply = jest.spyOn(retriedRule, 'apply');
    expect(runCleanup(text, settings)).toBe(expected);
    expect(clashes.mock.results.some((result) => result.type === 'return' && result.value === false)).toBe(true);
    expect(retriedApply).toHaveBeenCalledTimes(2);
    expect(retriedApply.mock.calls[1][0]).not.toBe(text);
  });
});

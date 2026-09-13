import {readFileSync} from 'fs';
import {moment} from 'obsidian';
import dedent from 'ts-dedent';
import {rules, Rule} from '../src/rules';
import {RulesRunner} from '../src/rules-runner';
import {DEFAULT_SETTINGS, LinterSettings} from '../src/settings-data';
import {setLanguage} from '../src/lang/helpers';
import {parseCustomReplacements} from '../src/utils/strings';
import '../src/rules-registry';

let misspellings: Map<string, string>;

// The rules that rewrite whitespace, blockquote indicators, list markers and heading text are the
// ones that can undo each other. Time and file name dependent rules are left off so that the only
// thing being measured is whether the rules settle on an answer.
const rulesUnderTest = [
  'blockquote-style',
  'trailing-spaces',
  'remove-trailing-punctuation-in-heading',
  'heading-blank-lines',
  'headings-start-line',
  'paragraph-blank-lines',
  'consecutive-blank-lines',
  'empty-line-around-blockquotes',
  'empty-line-around-code-fences',
  'empty-line-around-tables',
  'space-after-list-markers',
  'unordered-list-style',
  'ordered-list-style',
  'remove-multiple-spaces',
  'remove-empty-list-markers',
  'remove-empty-lines-between-list-markers-and-checklists',
  'line-break-at-document-end',
  'emphasis-style',
  'strong-style',
  'proper-ellipsis',
  'capitalize-headings',
];

function settingsForRulesUnderTest(): LinterSettings {
  const settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)) as LinterSettings;

  // every rule needs an entry, since the runner reads the enabled flag off it before doing anything
  settings.ruleConfigs = {};
  for (const rule of rules) {
    const config = Object.assign(rule.getDefaultOptions(), DEFAULT_SETTINGS.ruleConfigs[rule.settingsKey] ?? {}) as {enabled: boolean};
    config.enabled = rulesUnderTest.includes(rule.alias);
    settings.ruleConfigs[rule.settingsKey] = config;
  }

  // the options that the rules actually disagree under, rather than whatever the defaults happen
  // to be, so that this keeps testing the interaction it was written for
  Object.assign(settings.ruleConfigs['blockquote-style'], {'style': 'space'});
  Object.assign(settings.ruleConfigs['trailing-spaces'], {'two-space-line-break': true});
  Object.assign(settings.ruleConfigs['remove-trailing-punctuation-in-heading'], {'punctuation-to-remove': '.,;:!。，；：！'});

  settings.logLevel = 'ERROR';
  return settings;
}

function lint(text: string, settings: LinterSettings): string {
  return new RulesRunner().lintText({
    oldText: text,
    fileInfo: {name: 'note', createdAtFormatted: '2025-05-11T19:34:17-04:00', modifiedAtFormatted: '2025-05-31T12:38:50-04:00', path: 'note.md'},
    settings,
    momentLocale: 'en',
    getCurrentTime: () => moment('2025-05-31T12:38:50-04:00'),
    defaultMisspellings: misspellings,
  });
}

const documents: {name: string, text: string}[] = [
  { // blockquote style used to add a space to empty quote lines that trailing spaces then removed
    name: 'a blockquote with empty lines in it',
    text: dedent`
      > a quote
      >
      > with an empty line
      ${''}
      after
    `,
  },
  {
    name: 'a nested blockquote with empty lines in it',
    text: '> > a\n> >\n> > b\n\nafter\n',
  },
  { // only the last character of the trailing punctuation used to be removed per lint
    name: 'headings ending in several punctuation characters',
    text: '# Heading!!!\n\nbody\n\n## Another one...\n\nmore\n',
  },
  {
    name: 'a list with nested items and trailing spaces',
    text: '- one   \n  - two   \n    - three   \n\nafter\n',
  },
  {
    name: 'a document mixing the constructs that rules tend to fight over',
    text: dedent`
      ---
      title: a title
      ---
      ${''}
      # Heading!!
      ${''}
      > a quote
      >
      > more quote
      ${''}
      - a list
        - nested
      ${''}
      \`\`\`js
      const a = 1;
      \`\`\`
      ${''}
      Some *emphasis* and **strong** and \`code\` and [a link](https://example.com).
    `,
  },
  {
    name: 'an empty document',
    text: '',
  },
];

describe('linting twice changes nothing the second time', () => {
  beforeAll(() => {
    setLanguage('en');
    misspellings = parseCustomReplacements(readFileSync('src/utils/default-misspellings.md', 'utf8'));
  });

  for (const document of documents) {
    it(document.name, () => {
      const settings = settingsForRulesUnderTest();
      const once = lint(document.text, settings);
      const twice = lint(once, settings);

      expect(twice).toBe(once);
    });
  }
});

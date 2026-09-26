import {moment} from 'obsidian';
import dedent from 'ts-dedent';
import {setLanguage} from '../src/lang/helpers';
import {rules} from '../src/rules';
import {RulesRunner} from '../src/rules-runner';
import {DEFAULT_SETTINGS, LinterSettings} from '../src/settings-data';
import {NormalArrayFormats, SpecialArrayFormats} from '../src/utils/yaml';
import '../src/rules-registry';

function settingsWithRulesEnabled(ruleConfigs: Record<string, Record<string, unknown>>): LinterSettings {
  const settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)) as LinterSettings;
  for (const rule of rules) {
    settings.ruleConfigs[rule.settingsKey] = {...rule.getDefaultOptions(), enabled: false};
  }

  for (const [settingsKey, config] of Object.entries(ruleConfigs)) {
    settings.ruleConfigs[settingsKey] = {...settings.ruleConfigs[settingsKey], ...config, enabled: true};
  }

  return settings;
}

function lint(text: string, settings: LinterSettings): string {
  return new RulesRunner().lintText({
    oldText: text,
    fileInfo: {name: 'note', createdAtFormatted: '', modifiedAtFormatted: '', path: 'note.md'},
    settings,
    momentLocale: 'en',
    getCurrentTime: () => moment('2025-05-31T12:38:50-04:00'),
    defaultMisspellings: new Map<string, string>(),
  });
}

describe('Move inline fields to YAML run order', () => {
  beforeAll(() => {
    setLanguage('en');
  });

  it('runs before the regular YAML rules and YAML Key Sort so that the keys it adds are formatted and sorted', () => {
    const settings = settingsWithRulesEnabled({
      'move-inline-fields-to-yaml': {},
      // alphabetically this runs before Move inline fields to YAML, so it only sees the moved keys if they are moved first
      'format-yaml-array': {'default-array-style': 'multi-line'},
      'yaml-key-sort': {'yaml-sort-order-for-other-keys': 'Ascending Alphabetical'},
    });

    const before = dedent`
      ---
      title: Note
      ---
      context:: home
      context:: garden
      author:: me
    `;

    expect(lint(before, settings)).toBe(dedent`
      ---
      author: me
      context:
        - home
        - garden
      title: Note
      ---
    `);
  });

  it('uses the tag and alias array styles from the general settings', () => {
    const settings = settingsWithRulesEnabled({'move-inline-fields-to-yaml': {}});
    settings.commonStyles.tagArrayStyle = NormalArrayFormats.MultiLine;
    settings.commonStyles.aliasArrayStyle = SpecialArrayFormats.SingleStringCommaDelimited;

    const before = dedent`
      tags:: #book #fiction
      aliases:: Pratchett, Sir Terry
    `;

    expect(lint(before, settings)).toBe(dedent`
      ---
      tags:
        - book
        - fiction
      aliases: Pratchett, Sir Terry
      ---
    `);
  });
});

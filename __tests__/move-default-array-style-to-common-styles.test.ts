import { DEFAULT_SETTINGS, LinterSettings, moveDefaultArrayStyleToCommonStyles } from '../src/settings-data';
import { ArrayFormats } from '../src/utils/yaml';

function getSettings(formatYamlArrayConfig: Record<string, unknown> | undefined, commonStyles?: Partial<LinterSettings['commonStyles']>): LinterSettings {
  const settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)) as LinterSettings;
  if (formatYamlArrayConfig != undefined) {
    settings.ruleConfigs['format-yaml-array'] = formatYamlArrayConfig;
  }

  if (commonStyles != undefined) {
    // settings saved before the default array style was a common style do not have it
    delete settings.commonStyles.defaultArrayStyle;
    Object.assign(settings.commonStyles, commonStyles);
  }

  return settings;
}

describe('Move default array style to common styles', () => {
  it('moves the value from Format YAML array to the common styles', () => {
    const settings = getSettings({ 'enabled': true, 'default-array-style': 'multi-line', 'format-array-keys': true }, {});

    expect(moveDefaultArrayStyleToCommonStyles(settings)).toBe(true);
    expect(settings.commonStyles.defaultArrayStyle).toBe(ArrayFormats.MultiLine);
    expect(settings.ruleConfigs['format-yaml-array']).toEqual({ 'enabled': true, 'format-array-keys': true });
  });

  it('uses single-line when the value in Format YAML array is not a valid array style', () => {
    const settings = getSettings({ 'default-array-style': 'not a style' }, {});

    expect(moveDefaultArrayStyleToCommonStyles(settings)).toBe(true);
    expect(settings.commonStyles.defaultArrayStyle).toBe(ArrayFormats.SingleLine);
    expect(settings.ruleConfigs['format-yaml-array']).toEqual({});
  });

  it('uses single-line when Format YAML array has no settings yet', () => {
    const settings = getSettings(undefined, {});

    expect(moveDefaultArrayStyleToCommonStyles(settings)).toBe(true);
    expect(settings.commonStyles.defaultArrayStyle).toBe(ArrayFormats.SingleLine);
  });

  it('makes no change when the common style is already set and Format YAML array does not have the value', () => {
    const settings = getSettings({ 'enabled': true });
    settings.commonStyles.defaultArrayStyle = ArrayFormats.MultiLine;

    expect(moveDefaultArrayStyleToCommonStyles(settings)).toBe(false);
    expect(settings.commonStyles.defaultArrayStyle).toBe(ArrayFormats.MultiLine);
  });
});

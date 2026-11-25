import {getTextInLanguage, localeMap, setLanguage} from '../src/lang/helpers';
import {getString} from '../src/utils/nested-keyof';

describe.each(Object.keys(localeMap))('invariant error localization in %s', (language) => {
  beforeEach(() => setLanguage(language));
  afterEach(() => setLanguage('en'));

  it.each([
    ['logs.overlapping-replacements-error', 'Rule replacements must be ordered and non-overlapping'],
    ['logs.paragraph-gap-conflict-error', 'Paragraphs sharing a gap must agree on its replacement'],
    ['logs.protected-ranges-combine-error', 'Protected ranges that did not come from a lint context cannot be combined with more ignore types'],
    ['logs.protected-ranges-projection-error', 'Protected ranges that did not come from a lint context cannot provide a projection'],
    ['logs.invalid-projection-replacements-error', 'Projection replacements must be sorted, non-empty and disjoint source ranges with non-empty tokens'],
  ] as const)('resolves %s to its translation or English fallback', (key, expected) => {
    const translation = getString(localeMap[language], key);
    expect(getTextInLanguage(key)).toBe(translation || expected);
  });
});

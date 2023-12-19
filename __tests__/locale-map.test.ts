import {getLanguageSourceFile, localeMap, localeToFileName} from '../src/lang/helpers';
import * as fs from 'fs';

describe('Locales all map back to a unique file that exists', () => {
  const locales = Object.keys(localeMap);
  const localesFromFileReference = Object.keys(localeToFileName);

  it('Number of locales and locale references to files should be equal', () =>{
    expect(locales.length).toBe(localesFromFileReference.length);
  });

  const localePaths = new Set<string>();
  let path: string;
  for (const locale of locales) {
    path = getLanguageSourceFile(locale);
    localePaths.add(path);

    it(`"${locale}" refers to an existing file "${path}"`, () => {
      expect(fs.existsSync(path)).toBe(true);
    });
  }

  it('Number of unique locale paths should be the same as the number of locales', () =>{
    expect(locales.length).toBe(localePaths.size);
  });
});

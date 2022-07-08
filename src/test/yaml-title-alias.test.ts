import dedent from 'ts-dedent';
import {rulesDict} from '../rules';

describe('YAML Title Alias', () => {
  it('Creates multi-line array aliases when missing', () => {
    const before = dedent`
      # Title
      `;

    const after = dedent`
      ---
      aliases:
        - Title
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Multi-line array'})).toBe(after);
  });

  it('Creates single-line array aliases when missing', () => {
    const before = dedent`
      # Title
      `;

    const after = dedent`
      ---
      aliases: [Title]
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Single-line array'})).toBe(after);
  });

  it('Creates single string alias when missing', () => {
    const before = dedent`
      # Title
      `;

    const after = dedent`
      ---
      aliases: Title
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Single string that expands to multi-line array if needed'})).toBe(after);
  });

  it('Creates multi-line array aliases when empty', () => {
    const before = dedent`
      ---
      aliases: 
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases:
        - Title
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Multi-line array'})).toBe(after);
  });

  it('Creates single-line array aliases when empty', () => {
    const before = dedent`
      ---
      aliases: 
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases: [Title]
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Single-line array'})).toBe(after);
  });

  it('Creates single string alias when empty', () => {
    const before = dedent`
      ---
      aliases: 
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases: Title
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Single string that expands to multi-line array if needed'})).toBe(after);
  });

  it('Updates first alias in multi-line array', () => {
    const before = dedent`
      ---
      aliases:
        - alias1
        - alias2
        - alias3
      linter-yaml-title-alias: alias1
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases:
        - Title
        - alias2
        - alias3
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before)).toBe(after);
  });

  it('Adds before first alias in multi-line array', () => {
    const before = dedent`
      ---
      aliases:
        - alias1
        - alias2
        - alias3
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases:
        - Title
        - alias1
        - alias2
        - alias3
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before)).toBe(after);
  });

  it('Updates first alias in single-line array', () => {
    const before = dedent`
      ---
      aliases: [alias1, alias2, alias3]
      linter-yaml-title-alias: alias1
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases: [Title, alias2, alias3]
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before)).toBe(after);
  });

  it('Adds before first alias in single-line array', () => {
    const before = dedent`
      ---
      aliases: [alias1, alias2, alias3]
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases: [Title, alias1, alias2, alias3]
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before)).toBe(after);
  });

  it('Updates single string alias', () => {
    const before = dedent`
      ---
      aliases: other alias
      linter-yaml-title-alias: other alias
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases: Title
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before)).toBe(after);
  });

  it('Changes single string aliases to multi-line array when adding', () => {
    const before = dedent`
      ---
      aliases: other alias
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases:
        - Title
        - other alias
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Single string that expands to multi-line array if needed'})).toBe(after);
  });

  it('Changes single string aliases to single-line array when adding', () => {
    const before = dedent`
      ---
      aliases: other alias
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases: [Title, other alias]
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Single string that expands to single-line array if needed'})).toBe(after);
  });

  it('Titles with special characters are escaped', () => {
    const before = dedent`
      # Title with: colon, 'quote', "single quote"
      `;

    const after = dedent`
      ---
      aliases:
        - 'Title with: colon, ''quote'', "single quote"'
      linter-yaml-title-alias: 'Title with: colon, ''quote'', "single quote"'
      ---
      # Title with: colon, 'quote', "single quote"
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Multi-line array'})).toBe(after);
  });

  it('Position of existing non-empty aliases section is preserved', () => {
    const before = dedent`
      ---
      key1: value1
      key2: value2
      aliases:
        - alias1
        - alias2
        - alias3
      key3: value3
      ---
      # Title
      `;

    const after = dedent`
      ---
      key1: value1
      key2: value2
      aliases:
        - Title
        - alias1
        - alias2
        - alias3
      key3: value3
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before)).toBe(after);
  });

  it('Position of existing empty aliases section is preserved', () => {
    const before = dedent`
      ---
      key1: value1
      key2: value2
      aliases: 
      key3: value3
      ---
      # Title
      `;

    const after = dedent`
      ---
      key1: value1
      key2: value2
      aliases:
        - Title
      key3: value3
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Multi-line array'})).toBe(after);
  });

  it('Does not add alias that matches the filename for multi-line array style aliases section', () => {
    const before = dedent`
      ---
      aliases:
        - alias1
      ---
      # Filename
      `;

    const after = dedent`
      ---
      aliases:
        - alias1
      ---
      # Filename
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'Keep alias that matches the filename': false, 'metadata: file name': 'Filename'})).toBe(after);
  });

  it('Does not add alias that matches the filename for single-line array style aliases section', () => {
    const before = dedent`
      ---
      aliases: [alias1]
      ---
      # Filename
      `;

    const after = dedent`
      ---
      aliases: [alias1]
      ---
      # Filename
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'Keep alias that matches the filename': false, 'metadata: file name': 'Filename'})).toBe(after);
  });

  it('Does not add alias that matches the filename for single string style aliases section', () => {
    const before = dedent`
      ---
      aliases: alias1
      ---
      # Filename
      `;

    const after = dedent`
      ---
      aliases: alias1
      ---
      # Filename
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'Keep alias that matches the filename': false, 'metadata: file name': 'Filename'})).toBe(after);
  });

  it('Does not add alias that matches the filename for multi-line array style aliases section, removes previous alias', () => {
    const before = dedent`
      ---
      aliases:
        - alias1
        - alias2
      linter-yaml-title-alias: alias1
      ---
      # Filename
      `;

    const after = dedent`
      ---
      aliases:
        - alias2
      ---
      # Filename
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'Keep alias that matches the filename': false, 'metadata: file name': 'Filename'})).toBe(after);
  });

  it('Does not add alias that matches the filename for single-line array style aliases section, removes previous alias', () => {
    const before = dedent`
      ---
      aliases: [alias1, alias2]
      linter-yaml-title-alias: alias1
      ---
      # Filename
      `;

    const after = dedent`
      ---
      aliases: [alias2]
      ---
      # Filename
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'Keep alias that matches the filename': false, 'metadata: file name': 'Filename'})).toBe(after);
  });

  it('Does not add alias that matches the filename for single string style aliases section, removes previous alias', () => {
    const before = dedent`
      ---
      aliases: alias1
      linter-yaml-title-alias: alias1
      ---
      # Filename
      `;

    const after = dedent`
      ---
      ---
      # Filename
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'Keep alias that matches the filename': false, 'metadata: file name': 'Filename'})).toBe(after);
  });

  it('Adds alias that matches the filename for multi-line array style aliases section', () => {
    const before = dedent`
      ---
      aliases:
        - alias1
      ---
      # Filename
      `;

    const after = dedent`
      ---
      aliases:
        - Filename
        - alias1
      linter-yaml-title-alias: Filename
      ---
      # Filename
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'Keep alias that matches the filename': true, 'metadata: file name': 'Filename'})).toBe(after);
  });

  it('Adds alias that matches the filename for single-line array style aliases section', () => {
    const before = dedent`
      ---
      aliases: [alias1]
      ---
      # Filename
      `;

    const after = dedent`
      ---
      aliases: [Filename, alias1]
      linter-yaml-title-alias: Filename
      ---
      # Filename
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'Keep alias that matches the filename': true, 'metadata: file name': 'Filename'})).toBe(after);
  });

  it('Adds alias that matches the filename for single string style aliases section', () => {
    const before = dedent`
      ---
      aliases: alias1
      ---
      # Filename
      `;

    const after = dedent`
      ---
      aliases:
        - Filename
        - alias1
      linter-yaml-title-alias: Filename
      ---
      # Filename
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'Keep alias that matches the filename': true, 'metadata: file name': 'Filename', 'YAML aliases section style': 'Single string that expands to multi-line array if needed'})).toBe(after);
  });

  it('Replaces alias that matches the filename for multi-line array style aliases section', () => {
    const before = dedent`
      ---
      aliases:
        - alias1
        - alias2
      linter-yaml-title-alias: alias1
      ---
      # Filename
      `;

    const after = dedent`
      ---
      aliases:
        - Filename
        - alias2
      linter-yaml-title-alias: Filename
      ---
      # Filename
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'Keep alias that matches the filename': true, 'metadata: file name': 'Filename'})).toBe(after);
  });

  it('Replaces alias that matches the filename for single-line array style aliases section', () => {
    const before = dedent`
      ---
      aliases: [alias1, alias2]
      linter-yaml-title-alias: alias1
      ---
      # Filename
      `;

    const after = dedent`
      ---
      aliases: [Filename, alias2]
      linter-yaml-title-alias: Filename
      ---
      # Filename
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'Keep alias that matches the filename': true, 'metadata: file name': 'Filename'})).toBe(after);
  });

  it('Replaces alias that matches the filename for single string style aliases section, removes previous alias', () => {
    const before = dedent`
      ---
      aliases: alias1
      linter-yaml-title-alias: alias1
      ---
      # Filename
      `;

    const after = dedent`
      ---
      aliases: Filename
      linter-yaml-title-alias: Filename
      ---
      # Filename
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'Keep alias that matches the filename': true, 'metadata: file name': 'Filename'})).toBe(after);
  });

  it('Dollar sign $ is handled properly', () => {
    const before = dedent`
      # Dollar $
      `;

    const after = dedent`
      ---
      aliases:
        - Dollar $
      linter-yaml-title-alias: Dollar $
      ---
      # Dollar $
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Multi-line array'})).toBe(after);
  });

  it('Converts from single-line array to multi-line array', () => {
    const before = dedent`
      ---
      aliases: [Title]
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases:
        - Title
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Multi-line array', 'Preserve existing aliases section style': false})).toBe(after);
  });

  it('Converts from single-line array to multi-line array for single string style setting', () => {
    const before = dedent`
      ---
      aliases: [Title, alias2]
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases:
        - Title
        - alias2
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Single string that expands to multi-line array if needed', 'Preserve existing aliases section style': false})).toBe(after);
  });

  it('Converts from single string to multi-line array', () => {
    const before = dedent`
      ---
      aliases: Title
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases:
        - Title
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Multi-line array', 'Preserve existing aliases section style': false})).toBe(after);
  });

  it('Converts from multi-line array to single-line array', () => {
    const before = dedent`
      ---
      aliases:
        - Title
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases: [Title]
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Single-line array', 'Preserve existing aliases section style': false})).toBe(after);
  });

  it('Converts from multi-line array to single-line array for single string style setting', () => {
    const before = dedent`
      ---
      aliases:
        - Title
        - alias2
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases: [Title, alias2]
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Single string that expands to single-line array if needed', 'Preserve existing aliases section style': false})).toBe(after);
  });

  it('Converts from single string to single-line array', () => {
    const before = dedent`
      ---
      aliases: Title
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases: [Title]
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Single-line array', 'Preserve existing aliases section style': false})).toBe(after);
  });

  it('Converts from multi-line array to single string', () => {
    const before = dedent`
      ---
      aliases:
        - Title
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases: Title
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Single string that expands to multi-line array if needed', 'Preserve existing aliases section style': false})).toBe(after);
  });

  it('Converts from single-line array to single string', () => {
    const before = dedent`
      ---
      aliases: [Title]
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    const after = dedent`
      ---
      aliases: Title
      linter-yaml-title-alias: Title
      ---
      # Title
      `;

    expect(rulesDict['yaml-title-alias'].apply(before, {'YAML aliases section style': 'Single string that expands to multi-line array if needed', 'Preserve existing aliases section style': false})).toBe(after);
  });
});

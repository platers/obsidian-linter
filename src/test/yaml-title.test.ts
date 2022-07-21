import dedent from 'ts-dedent';
import {rulesDict} from '../rules-list';

describe('YAML Title', () => {
  it('Keeps unescaped title if possible', () => {
    const before = dedent`
      # Hello world
      `;

    const after = dedent`
      ---
      title: Hello world
      ---
      # Hello world
      `;

    expect(rulesDict['yaml-title'].apply(before, {'Title Key': 'title'})).toBe(after);
  });

  it('Escapes title if it contains colon', () => {
    const before = dedent`
      # Hello: world
      `;

    const after = dedent`
      ---
      title: 'Hello: world'
      ---
      # Hello: world
      `;

    expect(rulesDict['yaml-title'].apply(before, {'Title Key': 'title'})).toBe(after);
  });

  it('Escapes title if it starts with single quote', () => {
    const before = dedent`
      # 'Hello world
      `;

    const after = dedent`
      ---
      title: '''Hello world'
      ---
      # 'Hello world
      `;

    expect(rulesDict['yaml-title'].apply(before, {'Title Key': 'title'})).toBe(after);
  });

  it('Escapes title if it starts with double quote', () => {
    const before = dedent`
      # "Hello world
      `;

    const after = dedent`
      ---
      title: '"Hello world'
      ---
      # "Hello world
      `;

    expect(rulesDict['yaml-title'].apply(before, {'Title Key': 'title'})).toBe(after);
  });

  it('Does not insert line breaks for long title', () => {
    const before = dedent`
      # Very long title 1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
      `;

    const after = dedent`
      ---
      title: Very long title 1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
      ---
      # Very long title 1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
      `;

    expect(rulesDict['yaml-title'].apply(before, {'Title Key': 'title'})).toBe(after);
  });
});

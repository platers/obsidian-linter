import dedent from 'ts-dedent';
import {getDisabledRules, rules} from '../rules';

describe('Disabled rules parsing', () => {
  it('No YAML', () => {
    const text = dedent`
        Text
        `;
    expect(getDisabledRules(text)).toEqual([]);
  });
  it('No ignored rules', () => {
    const text = dedent`
        ---
        ---
        Text
        `;
    expect(getDisabledRules(text)).toEqual([]);
  });
  it('Ignore one rule', () => {
    const text = dedent`
        ---
        disabled rules: [ yaml-timestamp ]
        ---
        Text
        `;
    expect(getDisabledRules(text)).toEqual(['yaml-timestamp']);
  });
  it('Ignore some rules', () => {
    const text = dedent`
        ---
        random-rule: true
        disabled rules: [ yaml-timestamp, capitalize-headings ]
        ---
        Text
        `;
    expect(getDisabledRules(text)).toEqual(['yaml-timestamp', 'capitalize-headings']);
  });
  it('Ignored no rules', () => {
    const text = dedent`
        ---
        disabled rules:
        ---
        Text
        `;
    expect(getDisabledRules(text)).toEqual([]);
  });
  it('Ignored all rules', () => {
    const text = dedent`
        ---
        disabled rules: all
        ---
        Text
        `;
    expect(getDisabledRules(text)).toEqual(rules.map((r) => r.alias()));
  });
  it('Works with misformatted yamls', () => {
    const text = dedent`
        ---
        tfratfrat
  
        
        ---
        `;
    expect(getDisabledRules(text)).toEqual([]);
  });
});

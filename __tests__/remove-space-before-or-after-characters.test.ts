import RemoveSpaceBeforeOrAfterCharacters from '../src/rules/remove-space-before-or-after-characters';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveSpaceBeforeOrAfterCharacters,
  testCases: [
    {
      testName: 'Make sure that checklists completion indicator does not get affected by the rule',
      before: dedent`
        # Title
        ${''}
        - [ ] ]Task 1 starting with opening square brace keeps initial space
        - [ ] Task 2
        - [x] Task 3
        - [ ] Task 4 .
        ${''}
      `,
      after: dedent`
        # Title
        ${''}
        - [ ] ]Task 1 starting with opening square brace keeps initial space
        - [ ] Task 2
        - [x] Task 3
        - [ ] Task 4.
        ${''}
      `,
    },
    {
      testName: 'Make sure that checklists completion indicator does not get affected by the rule when there is a sublist',
      before: dedent`
        # Title
        ${''}
        - [ ] Task 1
          - [ ] Task 2
          - [x] Task 3 ,
        - [ ] Task 4 .
        ${''}
      `,
      after: dedent`
        # Title
        ${''}
        - [ ] Task 1
          - [ ] Task 2
          - [x] Task 3,
        - [ ] Task 4.
        ${''}
      `,
    },
  ],
});

describe('protected ranges preserve the masking contract', () => {
  it.each(['', '- '])('does not use protected symbols as anchors with prefix %j', (prefix) => {
    const text = prefix + 'text [link](url) text';
    const options = {'characters-to-remove-space-before': '[', 'characters-to-remove-space-after': ')'};
    // An ignored link's brackets cannot license deletion of whitespace outside that link.
    expect(RemoveSpaceBeforeOrAfterCharacters.getRule().apply(text, options)).toBe(text);
  });

  it.each(['', '- '])('allows unprotected anchors next to protected regions with prefix %j', (prefix) => {
    const text = prefix + '[link](url) . ( [link](url)';
    expect(RemoveSpaceBeforeOrAfterCharacters.getRule().apply(text)).toBe(prefix + '[link](url). ([link](url)');
  });

  it('uses literal braces, not legacy placeholder braces, as anchors', () => {
    const text = 'text [link](url) text {literal} text';
    const options = {'characters-to-remove-space-before': '{', 'characters-to-remove-space-after': '}'};
    // Intentionally unlike masking: synthetic placeholder braces must not trigger edits.
    expect(RemoveSpaceBeforeOrAfterCharacters.getRule().apply(text, options)).toBe('text [link](url) text{literal}text');
  });
});

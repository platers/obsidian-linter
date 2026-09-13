import RemoveSpaceBeforeOrAfterCharacters from '../src/rules/remove-space-before-or-after-characters';
import dedent from 'ts-dedent';
import {ruleTest} from './common';
import {ignoreListOfTypes, IgnoreTypes} from '../src/utils/ignore-types';
import {updateListItemText} from '../src/utils/mdast';
import {escapeRegExp} from '../src/utils/regex';

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
  const documents = [
    '( \t ) and [ \t ] and text \t ,',
    '-   ) text ,\n- [ ]   ) task ,\n- [x] ( text )\n- [?] ( text )',
    '- item ,\n  - nested ( text )\n\n  another paragraph ,\n\n- last .',
    '> - ( text )\n>   continuation ,\n>   - [ ] task .',
    '- text [ link ](url) , [[ wiki ]] . #tag !\n- <span title="x ,"> text , </span>',
    'text [ link ](url) text [[ wiki ]] text #tag text',
    '---\ntitle: text ,\n---\n\n```md\n- text ,\n```\n\n$$\nx ,\n$$\n\ntext ,',
    '<!-- linter-disable -->\n- text ,\n<!-- linter-enable -->\n\n- text ,',
    '- text ,\n\n  ```md\n  code ,\n  ```\n\n  paragraph ,',
    '- `inline , code` and $inline , math$ ,',
  ];

  it.each(documents)('matches the legacy rule for %j', (text) => {
    const builder = new RemoveSpaceBeforeOrAfterCharacters();
    const options = builder.buildRuleOptions();
    const before = new RegExp(`([ \t])+([${escapeRegExp(options.charactersToRemoveSpacesBefore)}])`, 'g');
    const after = new RegExp(`([${escapeRegExp(options.charactersToRemoveSpacesAfter)}])([ \t])+`, 'g');
    const replace = (value: string): string => value.replace(before, '$2').replace(after, '$1');
    const expected = ignoreListOfTypes(builder.ignoreTypes, text, (value) => {
      return updateListItemText(ignoreListOfTypes([IgnoreTypes.list, IgnoreTypes.html], value, replace), replace);
    });

    expect(RemoveSpaceBeforeOrAfterCharacters.getRule().apply(text)).toBe(expected);
  });

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

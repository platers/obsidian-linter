import dedent from 'ts-dedent';
import {rules, Rule, rulesDict, Example} from './rules';
import {getDisabledRules} from './utils';

describe('Examples pass', () => {
  for (const rule of rules) {
    describe(rule.name, () => {
      test.each(rule.examples)('$description', (example: Example) => {
        let options = rule.getDefaultOptions();
        if (example.options) {
          Object.assign(options, example.options);
        }
        expect(rule.apply(example.before, options)).toBe(example.after);
      });
    });
  }
});

describe('Check missing fields', () => {
  test.each(rules)('$name', (rule: Rule) => {
    expect(rule.name).toBeTruthy();
    expect(rule.description).toBeTruthy();
    expect(rule.examples.length).toBeGreaterThan(0);
  });
});

describe('Rules tests', () => {
  describe('Heading blank lines', () => {
    it('Ignores codeblocks', () => {
      const before = dedent`
        ---
        front matter
        ---
        
        # H1
        \`\`\`
        # comment not header
        a = b
        \`\`\``;
      const after = dedent`
        ---
        front matter
        ---

        # H1

        \`\`\`
        # comment not header
        a = b
        \`\`\``;
      expect(rulesDict['heading-blank-lines'].apply(before)).toBe(after);
    });
    it('Ignores # not in headings', () => {
      const before = dedent`
        Not a header # .
        Line
        \`\`\`
        # comment not header
        a = b
        \`\`\`
        ~~~
        # comment not header
        ~~~
          # tabbed not header
            # space not header
        `;
      const after = dedent`
        Not a header # .
        Line
        \`\`\`
        # comment not header
        a = b
        \`\`\`
        ~~~
        # comment not header
        ~~~
          # tabbed not header
            # space not header
        `;
      expect(rulesDict['heading-blank-lines'].apply(before)).toBe(after);
    });
    it('Works normally', () => {
      const before = dedent`
        # H1
        ## H2
        Line
        ### H3
        `;
      const after = dedent`
        # H1

        ## H2

        Line
        
        ### H3
        `;
      expect(rulesDict['heading-blank-lines'].apply(before)).toBe(after);
    });
  });
  describe('List spaces', () => {
    it('Handles empty bullets', () => {
      const before = dedent`
        Line
        - 1
        - 
        Line
        `;
      const after = dedent`
        Line
        - 1
        - 
        Line
        `;
      expect(rulesDict['space-after-list-markers'].apply(before)).toBe(after);
    });
  });
  describe('Header Increment', () => {
    it('Handles large increments', () => {
      const before = dedent`
        # H1
        #### H4
        ####### H7
        `;
      const after = dedent`
        # H1
        ## H4
        ### H7
        `;
      expect(rulesDict['header-increment'].apply(before)).toBe(after);
    });
  });
  describe('Capitalize Headings', () => {
    it('Ignores not words', () => {
      const before = dedent`
        # h1
        ## a c++ lan
        ## this is a sentence.
        ## I can't do this
        ## comma, comma, comma
        `;
      const after = dedent`
        # h1
        ## A c++ Lan
        ## This is a Sentence.
        ## I Can't Do This
        ## Comma, Comma, Comma
        `;
      expect(rulesDict['capitalize-headings'].apply(before, {'Title Case': true})).toBe(after);
    });
  });
  describe('File Name Heading', () => {
    it('Handles stray dashes', () => {
      const before = dedent`
      Text 1

      ---
      
      Text 2
        `;
      const after = dedent`
      # File Name
      Text 1
      
      ---
      
      Text 2
        `;
      expect(rulesDict['file-name-heading'].apply(before, {'metadata: file name': 'File Name'})).toBe(after);
    });
  });
});
describe('Consecutive blank lines', () => {
  it('Handles ignores code blocks', () => {
    const before = dedent`
      Line 1


      \`\`\`
      


      \`\`\`
      `;
    const after = dedent`
      Line 1

      \`\`\`



      \`\`\`
      `;
    expect(rulesDict['consecutive-blank-lines'].apply(before)).toBe(after);
  });
});

describe('Ignored rules parsing', () => {
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
});

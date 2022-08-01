import dedent from 'ts-dedent';
import {Example, rules} from '../src/rules';
import {yamlRegex, escapeRegExp} from '../src/utils/regex';
import '../src/rules-registry';

describe('Examples pass', () => {
  for (const rule of rules) {
    describe(rule.name, () => {
      test.each(rule.examples)('$description', (example: Example) => {
        expect(rule.apply(example.before, example.options)).toBe(example.after);
      });
    });
  }
});

describe('Augmented examples pass', () => {
  for (const rule of rules) {
    describe(rule.name, () => {
      test.each(rule.examples)('$description', (example: Example) => {
        // Add a YAML
        if (rule.type !== 'YAML' && !example.before.match(yamlRegex)) {
          const yaml = dedent`
            ---
            foo: bar
            ---
            ${''}
          `;

          const before = yaml + example.before;
          expect(rule.apply(before, example.options)).toMatch(new RegExp(`${escapeRegExp(yaml)}\n?${escapeRegExp(example.after)}`));
        }
      });
    });
  }
});

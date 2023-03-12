import dedent from 'ts-dedent';
import {Example, rules, RuleType} from '../src/rules';
import {yamlRegex, escapeRegExp} from '../src/utils/regex';
import '../src/rules-registry';

describe('Examples pass', () => {
  for (const rule of rules) {
    describe(rule.getName(), () => {
      test.each(rule.examples)('$description', (example: Example) => {
        expect(rule.apply(example.before, example.options)).toBe(example.after);
      });
    });
  }
});

describe('Augmented examples pass', () => {
  for (const rule of rules) {
    describe(rule.getName(), () => {
      test.each(rule.examples)('$description', (example: Example) => {
        // Add YAML
        if (rule.type !== RuleType.YAML && rule.type !== RuleType.PASTE && !example.before.match(yamlRegex)) {
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

import dedent from 'ts-dedent';
import {Example, rules} from '../rules';
import {yamlRegex, escapeRegExp} from '../utils/regex';

describe('Examples pass', () => {
  for (const rule of rules) {
    describe(rule.name, () => {
      test.each(rule.examples)('$description', (example: Example) => {
        const options = rule.getDefaultOptions();
        if (example.options) {
          Object.assign(options, example.options);
        }
        expect(rule.apply(example.before, options)).toBe(example.after);
      });
    });
  }
});

describe('Augmented examples pass', () => {
  for (const rule of rules) {
    describe(rule.name, () => {
      test.each(rule.examples)('$description', (example: Example) => {
        const options = rule.getDefaultOptions();
        if (example.options) {
          Object.assign(options, example.options);
        }

        // Add a YAML
        if (rule.type !== 'YAML' && !example.before.match(yamlRegex)) {
          const yaml = dedent`
            ---
            foo: bar
            ---\n\n`;

          const before = yaml + example.before;
          expect(rule.apply(before, options)).toMatch(new RegExp(`${escapeRegExp(yaml)}\n?${escapeRegExp(example.after)}`));
        }
      });
    });
  }
});

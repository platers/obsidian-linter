import {moment} from '../../__mocks__/obsidian';
import dedent from 'ts-dedent';
import {Example, rules} from '../rules';
import {yamlRegex, escapeRegExp} from '../utils/regex';
import '../rules-registry';
// import * as Moment from 'moment';

// const obsidian = jest.createMockFromModule('obsidian');
// obsidian['moment'] = typeof Moment;

// jest.mock('obsidian', () => ({
//   moment: () => typeof Moment,
// }))

// jest.mock('obsidian', () => ({
//   __esModule: true,
//   default: () => 'You have called a mocked method 1!',
// }))

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

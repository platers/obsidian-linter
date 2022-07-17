import {Rule} from '../rules';
import {rules} from '../rules-list';

describe('Check missing fields', () => {
  test.each(rules)('$name', (rule: Rule) => {
    expect(rule.name).toBeTruthy();
    expect(rule.description).toBeTruthy();
    expect(rule.examples.length).toBeGreaterThan(0);
  });
});

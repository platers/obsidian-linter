import {Rule, rules} from '../rules';

describe('Check missing fields', () => {
  test.each(rules)('$name', (rule: Rule) => {
    expect(rule.name).toBeTruthy();
    expect(rule.description).toBeTruthy();
    expect(rule.examples.length).toBeGreaterThan(0);
  });
});

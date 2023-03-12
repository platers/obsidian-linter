import {Rule, rules} from '../src/rules';
import '../src/rules-registry';

describe('Check missing fields', () => {
  test.each(rules)('$name', (rule: Rule) => {
    expect(rule.getName()).toBeTruthy();
    expect(rule.getDescription()).toBeTruthy();
    expect(rule.examples.length).toBeGreaterThan(0);
  });
});

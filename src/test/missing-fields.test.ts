import {Rule} from '../rules';
import rulesList from '../rules-list';

describe('Check missing fields', () => {
  test.each(rulesList.rules)('$name', (rule: Rule) => {
    expect(rule.name).toBeTruthy();
    expect(rule.description).toBeTruthy();
    expect(rule.examples.length).toBeGreaterThan(0);
  });
});

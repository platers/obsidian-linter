import {rules} from '../src/rules';
import '../src/rules-registry';

describe('Check missing fields', () => {
  for (const rule of rules) {
    it(rule.getName(), () => {
      expect(rule.getName()).toBeTruthy();
      expect(rule.getDescription()).toBeTruthy();
      expect(rule.examples.length).toBeGreaterThan(0);
    });
  }
});

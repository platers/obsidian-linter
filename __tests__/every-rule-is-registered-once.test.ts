import {rules} from '../src/rules';
import '../src/rules-registry';

describe('rule registry', () => {
  // three rules were left named `RuleTemplate` after being copied from the template. The registry
  // kept rules under the name of the class they came from, so the second and third of them were
  // handed the first one's rule and quietly stopped doing anything.
  it('registers each rule exactly once', () => {
    const timesRegistered = new Map<string, number>();
    for (const rule of rules) {
      timesRegistered.set(rule.alias, (timesRegistered.get(rule.alias) ?? 0) + 1);
    }

    expect([...timesRegistered.entries()].filter(([, count]) => count > 1)).toEqual([]);
    expect(timesRegistered.size).toBe(rules.length);
  });

  it('registers the rules that share a class name with another rule', () => {
    const aliases = rules.map((rule) => rule.alias);

    expect(aliases).toContain('dedupe-yaml-array-values');
    expect(aliases).toContain('sort-yaml-array-values');
    expect(aliases).toContain('format-yaml-array');
  });
});

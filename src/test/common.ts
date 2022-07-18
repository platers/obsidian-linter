import {Options} from '../rules';
import RuleBuilder, {RuleBuilderBase} from '../rules/rule-builder';

type TestCase<TOptions extends Options> = {
  testName: string,
  before: string,
  after: string,
  options?: TOptions
};

export function ruleTest<TOptions extends Options>(args: {
  RuleBuilderClass: typeof RuleBuilderBase & (new() => RuleBuilder<TOptions>),
  testCases: TestCase<TOptions>[]
}): void {
  const rule = args.RuleBuilderClass.getRule();

  describe(rule.name, () => {
    for (const testCase of args.testCases) {
      it(testCase.testName, () => {
        expect(rule.apply(testCase.before, testCase.options)).toBe(testCase.after);
      });
    }
  });
}

import {Options} from '../src/rules';
import RuleBuilder, {RuleBuilderBase} from '../src/rules/rule-builder';

type TestCase<TOptions extends Options> = {
  testName: string,
  before: string,
  after: string,
  options?: TOptions | (() => TOptions),
  afterTestFunc?: () => void,
};

export function ruleTest<TOptions extends Options>(args: {
  RuleBuilderClass: typeof RuleBuilderBase & (new() => RuleBuilder<TOptions>),
  testCases: TestCase<TOptions>[]
}): void {
  const rule = args.RuleBuilderClass.getRule();

  describe(rule.getName(), () => {
    for (const testCase of args.testCases) {
      it(testCase.testName, () => {
        const options = testCase.options instanceof Function ? testCase.options() : testCase.options;
        expect(rule.apply(testCase.before, options)).toBe(testCase.after);
        testCase.afterTestFunc?.call(testCase);
      });
    }
  });
}

import { readFileSync } from 'fs';
import { Options } from '../src/rules';
import RuleBuilder, { RuleBuilderBase } from '../src/rules/rule-builder';
import { parseCustomReplacements } from '../src/utils/strings';
import { RunLinterRulesOptions } from '../src/typings/worker';
import { lintText, runAfterRegularRules, runMainThreadRules } from '../src/rules-runner/rules-runner';
import moment from 'moment';

let defaultMap: Map<string, string>;

export function defaultMisspellings(): Map<string, string> {
  if (!defaultMap) {
    const data = readFileSync('src/utils/default-misspellings.md', 'utf8');
    defaultMap = parseCustomReplacements(data);
  }

  return defaultMap;
}

export function runRules(runOptions: RunLinterRulesOptions, getCurrentTime: () => moment.Moment): string {
  runOptions.newText = lintText(runOptions);

  runMainThreadRules(runOptions, getCurrentTime);

  return runOptions.newText
}

export function runAfterRules(currentText: string, runOptions: RunLinterRulesOptions, getCurrentTime: () => moment.Moment): string {
  runOptions.newText = currentText;
  runOptions.newText = runAfterRegularRules(runOptions.newText, runOptions);

  runMainThreadRules(runOptions, getCurrentTime);

  return runOptions.newText
}


type TestCase<TOptions extends Options> = {
  testName: string,
  before: string,
  after: string,
  options?: TOptions | (() => TOptions),
  afterTestFunc?: () => void,
};

export function ruleTest<TOptions extends Options>(args: {
  RuleBuilderClass: typeof RuleBuilderBase & (new () => RuleBuilder<TOptions>),
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

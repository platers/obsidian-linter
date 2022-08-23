import RuleBuilder, {OptionBuilder, RuleBuilderBase} from '../src/rules/rule-builder';
import {Options, rules} from '../src/rules';
import '../src/rules-registry';

describe('Setting controls initialize all options class keys', () => {
  for (const rule of rules) {
    describe(rule.name, () => {
      const builder = RuleBuilderBase.getBuilderByName(rule.name) as RuleBuilder<Options>;
      const optionsClass = builder.OptionsClass;
      const optionsClassKeys = Object.getOwnPropertyNames(new optionsClass());
      const optionsControlKeys = new Set(builder.optionBuilders.map(optionBuilder => (optionBuilder as OptionBuilder<Options, unknown>).optionsKey));

      for (const optionsClassKey of optionsClassKeys) {
        it(`${optionsClassKey}`, () => {
          expect(optionsControlKeys).toContain(optionsClassKey);
        });
      }
    });
  }
});

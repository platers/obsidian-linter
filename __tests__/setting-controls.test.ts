import RuleBuilder, {OptionBuilder, RuleBuilderBase} from '../src/rules/rule-builder';
import {Options, rules} from '../src/rules';
import '../src/rules-registry';

describe('Setting controls initialize all options class keys', () => {
  for (const rule of rules) {
    describe(rule.getName(), () => {
      const builder = RuleBuilderBase.getBuilderByName(rule.alias) as RuleBuilder<Options>;
      const optionsInstance = new builder.OptionsClass();
      const optionsClassKeys = Object.getOwnPropertyNames(optionsInstance);
      const optionsControlKeys = new Set(builder.optionBuilders.map((optionBuilder) => (optionBuilder as OptionBuilder<Options, unknown>).optionsKey));

      for (const optionsClassKey of optionsClassKeys) {
        it(`${optionsClassKey}`, () => {
          const hasSettingControl = RuleBuilderBase.hasSettingControl(builder.OptionsClass.name, optionsClassKey);
          if (hasSettingControl) {
            expect(optionsControlKeys).toContain(optionsClassKey);
          } else {
            expect(optionsControlKeys).not.toContain(optionsClassKey);
          }
        });
      }
    });
  }
});

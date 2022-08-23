import RuleBuilder, {OptionBuilder, RuleBuilderBase} from '../src/rules/rule-builder';
import {Options, rules} from '../src/rules';
import '../src/rules-registry';
import 'reflect-metadata';

describe('Setting controls initialize all options class keys', () => {
  for (const rule of rules) {
    describe(rule.name, () => {
      const builder = RuleBuilderBase.getBuilderByName(rule.name) as RuleBuilder<Options>;
      const optionsInstance = new builder.OptionsClass();
      const optionsClassKeys = Object.getOwnPropertyNames(optionsInstance);
      const optionsControlKeys = new Set(builder.optionBuilders.map((optionBuilder) => (optionBuilder as OptionBuilder<Options, unknown>).optionsKey));

      for (const optionsClassKey of optionsClassKeys) {
        it(`${optionsClassKey}`, () => {
          const noSettingControl = Reflect.getMetadata(RuleBuilder.NoSettingControlKey, optionsInstance, optionsClassKey);
          if (noSettingControl === true) {
            expect(optionsControlKeys).not.toContain(optionsClassKey);
          } else {
            expect(optionsControlKeys).toContain(optionsClassKey);
          }
        });
      }
    });
  }
});

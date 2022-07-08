import {Example, Options, Rule, RuleType} from '../rules';
import {Option} from '../option';

export default class RuleBase<TOptions extends Options> {
  register(): Rule {
    const rule = new Rule(this.name, this.description, this.type, this.safeApply.bind(this), this.examples, this.options);
    const classInstance = this.constructor as typeof RuleBase;
    classInstance.rule = rule;

    return rule;
  }

    static rule: Rule;

    get name(): string {
      throw new Error('get name() is not implemented');
    }

    get description(): string {
      throw new Error('get description() is not implemented');
    }

    get type(): RuleType {
      throw new Error('get type() is not implemented');
    }

    safeApply(text: string, options?: Options): string {
      options = options ?? {};
      const ruleOptions = options as TOptions;

      for (const option of this.options) {
        const optionsKey = option.optionsKey as keyof TOptions;
        if (option.optionsKey !== undefined && ruleOptions[optionsKey] === undefined) {
          ruleOptions[optionsKey] = options[option.name];
        }
      }
      return this.apply(text, ruleOptions);
    }

    apply(text: string, options: Options): string {
      throw new Error('apply() is not implemented');
    }

    get examples(): Example[] {
      throw new Error('get examples() is not implemented');
    }

    get options(): Option[] {
      throw new Error('get options() is not implemented');
    }
}

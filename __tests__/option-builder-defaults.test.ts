import {BooleanOption, DropdownOption, ListItemOption, MomentFormatOption, TextOption} from '../src/option';
import {ListItemOptionBuilder} from '../src/rules/rule-builder';

describe('Option defaults', () => {
  it.each([
    new BooleanOption('enabled', 'add-tooltip', 'edit-tooltip', true),
    new TextOption('text', 'add-tooltip', 'edit-tooltip', 'text default'),
    new MomentFormatOption('format', 'add-tooltip', 'edit-tooltip', 'YYYY-MM-DD'),
    new DropdownOption('choice', 'add-tooltip', 'edit-tooltip', 'selected', []),
  ])('preserves the base constructor default for $configKey', (option) => {
    const expected = {enabled: true, text: 'text default', format: 'YYYY-MM-DD', choice: 'selected'};
    expect(option.defaultValue).toBe(expected[option.configKey as keyof typeof expected]);
  });

  it('passes the options-class default array to the list control', () => {
    class PriorityOptions {
      keys = ['title', 'tags'];
    }

    const builder = new ListItemOptionBuilder({
      OptionsClass: PriorityOptions,
      optionsKey: 'keys',
      nameKey: 'rules.yaml-key-sort.yaml-key-priority-sort-order.name',
      descriptionKey: 'rules.yaml-key-sort.yaml-key-priority-sort-order.description',
      emptyStateKey: 'rules.yaml-key-sort.priority-keys-at-start-of-yaml.empty-state',
      fieldNamePlaceholderKey: 'rules.yaml-key-sort.priority-keys-at-start-of-yaml.placeholder-text',
    });

    expect(builder.option).toBeInstanceOf(ListItemOption);
    expect(builder.option.defaultValue).toEqual(['title', 'tags']);
  });

});

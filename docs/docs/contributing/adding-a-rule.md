# Adding a Rule

Before trying to add a rule, make sure that you have setup the Linter for local use as described in the [Setup Guide](getting-setup.md).

Once the Linter is setup locally, there are several steps in adding a new rule to the Linter that should be followed
that will make your and our lives easier by saving you and us time in the long run.

## 1. Create a Feature Request

Please first put in a [feature request](https://github.com/platers/obsidian-linter/issues/new?assignees=&labels=rule+suggestion&template=feature_request.md&title=FR%3A+).
This will allow us to take a look at the requested feature and make sure it fits within the Linter.

## 2. Create New File for the Rule

Once the new rule has been verified to be something that fits within the scope of the Linter, the rule can be added to the repository.
To do this, you will need to add a new file to `src/rules/` in the repository. It is easiest to either copy an existing rule.
or copy and rename [src/rules_rule-template.ts.txt](https://github.com/platers/obsidian-linter/blob/master/src/rules/_rule-template.ts.txt).

Please try to follow the format of existing rules where possible since that makes the code easier to maintain and changes
easier to review.

## 3. Fill Out the Different Parts of a Rule

Rules generally have several parts to them:

- The options
- The option builders or settings
- The constructor
- The apply function or logic for the rule
- The examples
- The rule text

To help better understand these parts and make it easier to feel comfortable with the different parts let's look at a general
example and go over each part of a rule.

In general a rule looks something like the following example which is a trimmed down version of [YAML Key Sort](../settings/yaml-rules.md#yaml-key-sort):

``` TypeScript
import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {yamlRegex} from '../utils/regex';
import {getYamlSectionValue, loadYAML, removeYamlSection, setYamlSection} from '../utils/yaml';

type YamlSortOrderForOtherKeys = 'None' | 'Ascending Alphabetical' | 'Descending Alphabetical';

class YamlKeySortOptions implements Options {
  priorityKeysAtStartOfYaml?: boolean = true;

  @RuleBuilder.noSettingControl()
    dateModifiedKey?: string;

  @RuleBuilder.noSettingControl()
    currentTimeFormatted?: string;

  @RuleBuilder.noSettingControl()
    yamlTimestampDateModifiedEnabled?: boolean;

  yamlKeyPrioritySortOrder?: string[] = [];
  yamlSortOrderForOtherKeys?: YamlSortOrderForOtherKeys = 'None';
}

@RuleBuilder.register // This decorator allows the rule to automatically be registered as a rule when the plugin loads
export default class YamlKeySort extends RuleBuilder<YamlKeySortOptions> {
  constructor() {
    super({
      nameKey: 'rules.yaml-key-sort.name',
      descriptionKey: 'rules.yaml-key-sort.description',
      type: RuleType.YAML,
      hasSpecialExecutionOrder: true,
    });
  }
  get OptionsClass(): new () => YamlKeySortOptions {
    return YamlKeySortOptions; // always returns the options for the current rule
  }
  apply(text: string, options: YamlKeySortOptions): string {
    // Rule logic goes here...
  }
  getYAMLKeysSorted(yaml: string, keys: string[]): {remainingYaml: string, sortedYamlKeyValues: string} {
    // helper function's logic here...
  }
  get exampleBuilders(): ExampleBuilder<YamlKeySortOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language`',
        before: dedent`
          ---
          language: Typescript
          type: programming
          tags: computer
          keywords: []
          status: WIP
          date: 02/15/2022
          ---
        `,
        after: dedent`
          ---
          date: 02/15/2022
          type: programming
          language: Typescript
          tags: computer
          keywords: []
          status: WIP
          ---
        `,
        options: { // only needed when using non-default values for rule options
          yamlKeyPrioritySortOrder: [
            'date',
            'type',
            'language',
          ],
          yamlSortOrderForOtherKeys: 'None',
          priorityKeysAtStartOfYaml: true,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<YamlKeySortOptions>[] {
    return [
      new TextAreaOptionBuilder({
        OptionsClass: YamlKeySortOptions,
        nameKey: 'rules.yaml-key-sort.yaml-key-priority-sort-order.name',
        descriptionKey: 'rules.yaml-key-sort.yaml-key-priority-sort-order.description',
        optionsKey: 'yamlKeyPrioritySortOrder',
      }),
      new BooleanOptionBuilder({
        OptionsClass: YamlKeySortOptions,
        nameKey: 'rules.yaml-key-sort.priority-keys-at-start-of-yaml.name',
        descriptionKey: 'rules.yaml-key-sort.priority-keys-at-start-of-yaml.description',
        optionsKey: 'priorityKeysAtStartOfYaml',
      }),
      new DropdownOptionBuilder<YamlKeySortOptions, YamlSortOrderForOtherKeys>({
        OptionsClass: YamlKeySortOptions,
        nameKey: 'rules.yaml-key-sort.yaml-sort-order-for-other-keys.name',
        descriptionKey: 'rules.yaml-key-sort.yaml-sort-order-for-other-keys.description',
        optionsKey: 'yamlSortOrderForOtherKeys',
        records: [
          {
            value: 'None',
            description: 'No sorting other than what is in the YAML Key Priority Sort Order text area',
          },
          {
            value: 'Ascending Alphabetical',
            description: 'Sorts the keys based on key value from a to z',
          },
          {
            value: 'Descending Alphabetical',
            description: 'Sorts the keys based on key value from z to a',
          },
        ],
      }),
    ];
  }
}
```

Now let's take a look at the parts of a rule.

### Rule Options

Rule options are options that are passed into a rule for use within the rule logic. These are often user defined or
related to the current file or environment to help determine how to execute the rule logic.

Here is an example of what rule options look like in use:

``` TypeScript
class YamlKeySortOptions implements Options {
  priorityKeysAtStartOfYaml?: boolean = true;

  @RuleBuilder.noSettingControl()
    dateModifiedKey?: string;

  @RuleBuilder.noSettingControl()
    currentTimeFormatted?: string;

  @RuleBuilder.noSettingControl()
    yamlTimestampDateModifiedEnabled?: boolean;

  yamlKeyPrioritySortOrder?: string[] = [];
  yamlSortOrderForOtherKeys?: YamlSortOrderForOtherKeys = 'None';
}
```

There are probably a couple of things you notice that may seem weird. The first thing you may notice
is that some rules have `@RuleBuilder.noSettingControl()` above them and some do not. You may wonder
why that is. The reason for this decorator being above some options and not others is that some of these
options get their values from the settings for this particular rule and some do not.
Using this decorator above options that do not have a setting that is generated by the rule allows us
to test that all options for a rule have a corresponding setting and thus get set.

!!! warning "Setting noSettingControl settings"
    If you are adding a setting that has no setting control in the rule you are adding, make sure that the value of the setting
    is being set in [rules-runner.ts](https://github.com/platers/obsidian-linter/blob/master/src/rules-runner.ts).

The second thing that you may notice is that all of the rule options are optional on the options class (`?:`).
This is done to allow for easier testing in the unit tests and examples since you will only need to set values
relevant to the test or example in question.

The third thing you may notice is that all of the regular rule options have a default value (` = value;`). This makes
sure that even if no value is provided a default is used. This makes the rule options more reliable and less prone
to bugs when reading in the settings file or running unit tests.

#### Empty Rule Options

There are rules that do not have any options at all. These rules still need an option class for the rule to work, but the
class body can be left empty like so:

``` TypeScript
class YamlKeySortOptions implements Options {}
```

### Rule Settings

Rule settings are directly related to rule options. Each rule setting must correspond to a value in the rule options.
Since each rule setting is used to "build" the UI component for the corresponding value in the rule options, the
rule settings are created via the use of the option builder functions. Another function of the rule settings is that
they help link settings in the UI with settings in the config file.

In the example above we see the following settings:

``` TypeScript
get optionBuilders(): OptionBuilderBase<YamlKeySortOptions>[] {
  return [
    new TextAreaOptionBuilder({
      OptionsClass: YamlKeySortOptions,
      nameKey: 'rules.yaml-key-sort.yaml-key-priority-sort-order.name',
      descriptionKey: 'rules.yaml-key-sort.yaml-key-priority-sort-order.description',
      optionsKey: 'yamlKeyPrioritySortOrder',
    }),
    new BooleanOptionBuilder({
      OptionsClass: YamlKeySortOptions,
      nameKey: 'rules.yaml-key-sort.priority-keys-at-start-of-yaml.name',
      descriptionKey: 'rules.yaml-key-sort.priority-keys-at-start-of-yaml.description',
      optionsKey: 'priorityKeysAtStartOfYaml',
    }),
    new DropdownOptionBuilder<YamlKeySortOptions, YamlSortOrderForOtherKeys>({
      OptionsClass: YamlKeySortOptions,
      nameKey: 'rules.yaml-key-sort.yaml-sort-order-for-other-keys.name',
      descriptionKey: 'rules.yaml-key-sort.yaml-sort-order-for-other-keys.description',
      optionsKey: 'yamlSortOrderForOtherKeys',
      records: [
        {
          value: 'None',
          description: 'No sorting other than what is in the YAML Key Priority Sort Order text area',
        },
        {
          value: 'Ascending Alphabetical',
          description: 'Sorts the keys based on key value from a to z',
        },
        {
          value: 'Descending Alphabetical',
          description: 'Sorts the keys based on key value from z to a',
        },
      ],
    }),
  ];
}
```

We see in the example above that there are several common properties among the different kinds of settings.

| Name | Description |
| ---- | ----------- |
| `optionsKey` | The string name of the property that this setting will update when its value changes on the settings page |
| `OptionsClass` | Allows the option builder validate that rule option specified in `optionsKey` is the correct type for the values that the option builder expects to deal with |
| `nameKey` | The object property representation of the value in [en.ts](https://github.com/platers/obsidian-linter/blob/master/src/lang/locale/en.ts) that has the text for the name of the rule setting |
| `descriptionKey` | The object property representation of the value in [en.ts](https://github.com/platers/obsidian-linter/blob/master/src/lang/locale/en.ts) that has the text for the description of the rule setting |

You may notice that the keys for the settings follow the format of `rules.rule-alias.setting-name.name` or `rules.rule-alias.setting-name.description`.
Following this pattern allows for ease of understanding what each value means.

The `DropdownOptionBuilder` is a little different from other option builders in that it lets a user select an option from a
list know as the `records`. Records have a value and a description. The value is what is stored in the config and is
used as part of the identifier for the key of the display text. For example, the text value of `None` in the UI is determined
by pulling back the text value for `enums.None` in the corresponding language file (`en.ts` being the source of truth for all keys).
The description of a record currently is only used for documentation and rule searching purposes. It is only in English at this time.

The `DropdownOptionBuilder` is also a little special in that it expects not only the option class, but also the type of the
record values to expect (an enum or union type). In the example above we see that `DropdownOptionBuilder<YamlKeySortOptions, YamlSortOrderForOtherKeys>`
expects the values of the records to be part of `YamlSortOrderForOtherKeys` so it can give warnings about improper values being
used in the unit tests and the rule setting itself. This can help reduce the amount of programmatic errors that come with changes
in the code over time.

#### Empty Rule Settings

Some rules have no options that have a setting in the UI. When this happens, the rule settings can be left blank like so:

``` TypeScript
get optionBuilders(): OptionBuilderBase<YamlKeySortOptions>[] {
  return [];
}
```

### The Rule Constructor

The rule constructor helps simplify the setup of several rule properties without having to pass them around in multiple places.

In the example above it looks like the following:

``` TypeScript
constructor() {
  super({
    nameKey: 'rules.yaml-key-sort.name',
    descriptionKey: 'rules.yaml-key-sort.description',
    type: RuleType.YAML,
    hasSpecialExecutionOrder: true,
  });
}
```

Here are all the properties that can be specified in the constructor of a rule:

| Name | Description | Is Required (Y/N) | Example Value |
| ---- | ----------- | ----------------- | ------------- |
| `nameKey` | The object property representation of the value in [en.ts](https://github.com/platers/obsidian-linter/blob/master/src/lang/locale/en.ts) that has the text for the name of the rule. The value should be in the format `rules.rule-alias.name`. | Y | `rules.yaml-key-sort.name` |
| `descriptionKey` | The object property representation of the value in [en.ts](https://github.com/platers/obsidian-linter/blob/master/src/lang/locale/en.ts) that has the text for the description of the rule. The value should be in the format `rules.rule-alias.description`. | Y | `rules.yaml-key-sort.description` |
| `type` | The type of the rule which determines where in the settings it shows up and whether to test it with YAML frontmatter added as part of the example tests. | Y | `RuleType.YAML` |
| `hasSpecialExecutionOrder` | Specifies whether this rule will be manually executed in either the before or after Linter rules in [rules-runner.ts](https://github.com/platers/obsidian-linter/blob/master/src/rules-runner.ts). Its default value is `false`. | N | `true` |
| `ruleIgnoreTypes` | The list of ignore types which can be found in [ignore-types.ts](https://github.com/platers/obsidian-linter/blob/master/src/utils/ignore-types.ts) that should be ignored for all the logic of the rule. This is useful for ignoring things like code blocks or YAML frontmatter. It default to an empty array (`[]`). Do not put `IgnoreTypes.customIgnore` in this list as it is automatically added to all rules except for `RuleType.PASTE`. | N | `[IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],` |

### The Rule Logic

The rule logic of all rules is applied after the types specified in `ruleIgnoreTypes` and the added value of
`IgnoreTypes.customIgnore` is applied. Once those types of elements in the file have been ignored, the rule logic
can safely be applied.

The logic of a rule goes in the `apply` function. You may add as many helper functions to the rule class as you need.

In the example above we see the following for the `apply` and helper functions:

``` TypeScript
apply(text: string, options: YamlKeySortOptions): string {
  // Rule logic goes here...
}
getYAMLKeysSorted(yaml: string, keys: string[]): {remainingYaml: string, sortedYamlKeyValues: string} {
  // helper function's logic here...
}
```

At times you may find a function or variable that is needed in multiple rules. These functions and variables are often
stored in  `src/utils/`. Feel free to reuse as much logic as possible from within these existing files to help reduce
the amount of code we need to maintain.

#### Ignoring Types for Part of a Rule's Logic

At times, there is a need to ignore a specific type of element in a file for just a portion of the logic of the rule.
This can be done using `ignoreListOfTypes` from
[ignore-types.ts](https://github.com/platers/obsidian-linter/blob/master/src/utils/ignore-types.ts)
which takes a list of `IgnoreTypes` and a function that takes the resulting string and returns another string.

We have an example of this in [Remove Space Around Characters](https://github.com/platers/obsidian-linter/blob/master/src/rules/remove-space-around-characters.ts) where we needed to make sure we did not remove whitespace between a list indicator and the fullwidth or other characters in question so we had to ignore lists for the first regex replacement and then do the same regex replacement on just the list item text:

``` TypeScript
const replaceWhitespaceAroundFullwidthCharacters = function(text: string): string {
  return text.replace(fullwidthCharacterWithTextAtStart, '$2').replace(fullwidthCharacterWithTextAtEnd, '$1');
};

let newText = ignoreListOfTypes([IgnoreTypes.list], text, replaceWhitespaceAroundFullwidthCharacters);

newText = updateListItemText(newText, replaceWhitespaceAroundFullwidthCharacters);
```

### Rule Examples

Rule examples are pretty important for rules as they serve as both examples that people see in the documentation for
rules, but also because they double as unit tests that are run in simple and advanced cases so long as they are not `YAML`
or `PASTE` rules.

**There must be at least 1 example per rule. The more complex the rule the more examples should be shown.**

In the example above, the rule examples looked as follows:

``` TypeScript
get exampleBuilders(): ExampleBuilder<YamlKeySortOptions>[] {
  return [
    new ExampleBuilder({
      description: 'Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language`',
      before: dedent`
        ---
        language: Typescript
        type: programming
        tags: computer
        keywords: []
        status: WIP
        date: 02/15/2022
        ---
      `,
      after: dedent`
        ---
        date: 02/15/2022
        type: programming
        language: Typescript
        tags: computer
        keywords: []
        status: WIP
        ---
      `,
      options: { // only needed when using non-default values for rule options
        yamlKeyPrioritySortOrder: [
          'date',
          'type',
          'language',
        ],
        yamlSortOrderForOtherKeys: 'None',
        priorityKeysAtStartOfYaml: true,
      },
    }),
  ];
}
```

Here are the properties of each example:

| Name | Description | Is Required (Y/N) |
| ---- | ----------- | ----------------- |
| `description` | The name and description of the example which is meant to explain if any options are set that are not the default and give an overview of what the example shows | Y |
| `before` | This is the file before changes are made by the rule or the clipboard contents before the changes made by the rule when the rule's type is `PASTE` | Y |
| `after` | This is the file after changes are made by the rule or the clipboard contents after the changes made by the rule when the rule's type is `PASTE` | Y |
| `options` | These are the options to use for the example. It should only be used for clarity around what options are being set or in order to set non-default values for options. | N |


### Rule Text

The text that displays for the rule and its settings is something that needs to be added as well.
They were mentioned above in the sections talking about [Rule Settings](#rule-settings) and [Rule Constructor](#the-rule-constructor).

At the very least, a new rule requires entries to be added for the rule name and description of the new rule in [en.ts](https://github.com/platers/obsidian-linter/blob/master/src/lang/locale/en.ts).

If we `YAML Key Sort` did not already exist, I would need to navigate to [en.ts](https://github.com/platers/obsidian-linter/blob/master/src/lang/locale/en.ts).
Once there I would need to find the  `rules` property of the file and determine where the alias for `YAML Key Sort` would go alphabetically or roughly alphabetically.
That means I would either add the new properties at the start or the end of the rules that start with the letter y since the alias for `YAML Key Sort` is `yaml-key-sort`.
Once it has been decided where `YAML Key Sort` will be added, we would add the following for the rule name and description:

```TypeScript
// yaml-key-sort.ts
'yaml-key-sort': {
  'name': 'YAML Key Sort',
  'description': 'Sorts the YAML keys based on the order and priority specified. Note: may remove blank lines as well.',
},
```

Then I would need to add entries for each and every rule setting making the final text for rule as follows:

``` TypeScript
// yaml-key-sort.ts
'yaml-key-sort': {
  'name': 'YAML Key Sort',
  'description': 'Sorts the YAML keys based on the order and priority specified. Note: may remove blank lines as well.',
  'yaml-key-priority-sort-order': {
    'name': 'YAML Key Priority Sort Order',
    'description': 'The order in which to sort keys with one on each line where it sorts in the order found in the list',
  },
  'priority-keys-at-start-of-yaml': {
    'name': 'Priority Keys at Start of YAML',
    'description': 'YAML Key Priority Sort Order is placed at the start of the YAML frontmatter',
  },
  'yaml-sort-order-for-other-keys': {
    'name': 'YAML Sort Order for Other Keys',
    'description': 'The way in which to sort the keys that are not found in the YAML Key Priority Sort Order text area',
  },
},
```

However we are not quite done. We also had dropdown records that were added, so we also need to navigate to the `enums`
property in the file and add one value for each new record value text:

``` TypeScript
'enums': {
  ...
  'None': 'None',
  'Ascending Alphabetical': 'Ascending Alphabetical',
  'Descending Alphabetical': 'Descending Alphabetical',
  ...
},
  
```

Once that is done feel free to repeat this change in any other language that is supported by the Linter.
There is no need to add the values to any other supported languages since the value will come from the English
text values if it is not found in the other languages. Generally Google Translate is acceptable for the values
for the initial translation into a language. If someone sees that the value is not correct in the language they use,
they can suggest a change to the wording.

## 4. Add Edge Case Tests if Applicable

Once a rule has been created, see about adding tests for edge cases as described in [Adding Test](testing.md#adding-tests).

## 5. Open a Pull Request

Once the tests are in place, the new rule should be ready for review. So go on ahead and [open a pull request](open-a-pr.md).

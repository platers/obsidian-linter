<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->
# Contributing

Thank you for your interest in contributing to the Linter. Please feel free to look read here for more information around different ways you may be able to contribute.

## AI Usage

AI is becoming more and more prevalent in programming. This comes with both good and bad side effects.
AI can be a good tool to help with coding. However it should not take the place of understanding the code submitted.
Any and all code submitted needs to be understood by the person submitting it at least to the point where they can
provide answers to questions around why specific choices were made. Failure to be able to explain why code choices
were made may result in PRs being rejected.

## Setting Up the Linter

You will want to start by forking this repository. Once that is done, you will want to clone your fork of the repository.
The command should look something like the following:

``` sh
git clone https://github.com/{USERNAME_HERE}/obsidian-linter/
```

### Node and NPM

Next you will want to install the appropriate versions of Node and NPM.  
_This plugin requires Node version `15.x` or higher._

#### Windows

Install the version of [Node](https://nodejs.org/en/download/) you would like. Make sure to add it to your path under environment variables.

#### Linux, Mac, and Windows via WSL/WSL2

It is recommended that you use [NVM](https://github.com/nvm-sh/nvm#installing-and-updating) which is a node version manager that comes in handy when swapping and installing node versions,
especially since most linux package managers do not have the needed node version in the standard packages.

### Install Dependencies

Now that Node and NPM are installed, we can go ahead and run `npm ci` from the base of the cloned repository.
This should install the necessary dependencies for working on the plugin. The command may take several minutes to complete.

Once this is done, you should be all set up for contributing to the plugin.

## Linter Documentation

The documentation for the Linter is broken up into a couple of different categories: manually created, template, and generated.

### Manually Created Documentation

Manually created documentation is documentation that lives in the `docs/docs` folder and is not generated. These files are
created and added to the `mkdocs` setup in order to allow them to be hosted with the rest of the documentation for the Linter.
Some examples of manually created documentation include this page and all of the other pages under the "Contributing" heading.

### Generated Documentation

A lot of the documentation for this plugin is generated. See the [Documentation Templates](#documentation-templates) 
section to see which files they are and when they should be updated.

If you are looking to update the rules list information like section, examples, descriptions, or options in the README
or rules documentation, update the rule information in the corresponding rule file located in `src/rules/`.

To update how rules have their information displayed, you will want to update the logic in the `generateDocs` method in 
[docs.ts](src/docs.ts).

### Additional Information for Rules and Rule Types

Sometimes there is a need to clarify how a rule works, why a rule works the way that it does, or some general things to keep in
mind about specific rule types.

#### Additional Information for Rules

Additional info for rules are located under `docs/additional-info/rules/`. The file names are the same as the rule alias for
the rule that they are supposed to add additional information for. Info added in these files generally are used to help clarify
how a rule works or limitations to that specific rule. It can also warn users not to use specific rules with each other.

#### Additional Information for Rule Types

Additional info for rules are located under `docs/additional-info/rule-types/`. The file names are the same as the rule type
when lowercased. Info added in these files generally include limitations and things to keep in mind.

### Documentation Templates

Currently there are 2 template files used for generating documentation with:

1. [readme_template.md](docs/templates/readme_template.md)
  - This template is used for generating the [README](README.md) file and should be updated for changes that are not rules documentation links and their corresponding sections.
2. [contributing_template.md](docs/templates/contributing_template.md)
  - This template is used for generating the [CONTRIBUTING.md](CONTRIBUTING.md]) file and should be updated for changes that are not meant for the documentation website, but are meant for contributing documentation.

You may also want to take a look at [docs.ts](src/docs.ts) to modify how the generated files are created.

### Generating Documentation

Before trying to generate documentation, make sure that you have setup the Linter for local use as described in the [Setup Guide](#setting-up-the-linter).

Once that is done, to update the documentation you can run `npm run compile` if you need to compile the code as well or
just run `npm run docs` which just generates the documentation.

!!! note "Not seeing changes to docs?"
    If you run `npm run docs`, but do not see any changes to any of the generated files, try running `npm run build` and then
    try again. The changes may not have been built since they were made.

## Translating the Linter

If you would like to help out by translating the Linter there are several ways in which you can help out.
The following instructions should help you with translating the Linter.

!!! note "Using translation helper"
    Before being able to translate using the translation helper, you will need to make sure that you have setup the Linter for local use as described in the [Setup Guide](#setting-up-the-linter).

Before we can make changes to a translation in the Linter, we will want to know what a translation is and how they work.

### What is a Translation?

A translation for the Linter is a language file that contains the string values of the text the Linter uses for logs and the UI in Obsidian.
The files for the languages are located under `src/lang/locale/`. Each language has a file that is named using the 2 letter language abbreviation.
If the language is for a specific dialect (i.e. simplified Chinese which or British English), make sure it starts with the
2 letter language code followed by the 2 letter code for the language dialect in question.

An example of a regular translation file with no dialect is [en.ts](src/lang/locale/en.ts).  
An example of a translation file for a dialect is [zh-cn.ts](src/lang/locale/zh-cn.ts).

#### Translation File Structure

A translation file is a TypeScript file that is structured as a JSON object. That is to say it is a key value mapping with
the nesting of values in it. The structures of all translation files are to follow the structure of [en.ts](src/lang/locale/en.ts)
which is the source of truth for the keys that exist for use in the Linter. So if you need to add a new value or change the
structure of the existing values, you will first need to update them in this file.

The following is the general structure of `en.ts`:

``` TypeScript
// English

export default {
  // UI text for the Obsidian commands that the Linter uses
  'commands': {...},

  // logs are general pieces of text to either partially include in the UI or to just put in the developer console.
  'logs': {...},

  'notice-text': {
    'empty-clipboard': 'There is no clipboard content.',
    'characters-added': 'characters added',
    'characters-removed': 'characters removed',
  },

  // settings.ts
  'linter-title': 'Linter',
  'empty-search-results-text': 'No settings match search',

  // lint-confirmation-modal.ts
  'warning-text': 'Warning',
  'file-backup-text': 'Make sure you have backed up your files.',

  // tabs contains tab specific UI text and setting text (tab specific setting text is text not generated by rules)
  'tabs': {
    'names': {
      // tab.ts
      'general': 'General Settings',
      'custom': 'Custom Settings',
      'yaml': 'YAML Settings',
      'heading': 'Heading Settings',
      'content': 'Content Settings',
      'footnote': 'Footnote Settings',
      'spacing': 'Spacing Settings',
      'paste': 'Paste Settings',
      'debug': 'Debug Settings',
    },
    // tab-searcher.ts
    'default-search-bar-text': 'Search all settings',
    'general': {...},
    'debug': {...},
  },

  // options is for specific UI elements that help out with settings
  'options': {
    'custom-command': {...},
    'custom-replace': {...},
  },

  // rules is where you put names and descriptions for rules and rule settings, but not dropdown record values
  'rules': {...},

  // These are the string values in the UI for enum values and thus they do not follow the key format as used above
  // they are also for dropdown records that come from union types
  'enums': {...},
};
```

As you can see the Linter is broken into the several sections which each have their own uses:

| Name | Description |
| ---- | ----------- |
| `commands` | The portion of the language text to use for Obsidian commands that the Linter creates. |
| `logs` | The portion of the language text to use for general pieces of text to either partially include in the UI or to just put in the developer console. |
| `notice-text` | The portion of the language text to use for notices that are used by the Linter to alert the user about something that is not an error. |
| `tabs` | The portion of the language text to use for tab specific UI text and setting text (tab specific setting text is text not generated by rules). |
| `options` | The portion of the language text to use for custom Linter components that in general help out with settings. Things like custom commands and custom regex replace have components that have their text listed in this section. |
| `rules` | The portion of the language text to use for names and descriptions for rules and rule settings, but not dropdown record values. |
| `enums` | The portion of the language text to use for values in the UI for enum values and thus they do not follow the key format as used above. It is also for dropdown records that come from union types. |

#### How Are Partial Translations Handled?

Any missing keys in a language will be defaulted to its English values which allows for partial translation of a language.
This way you can add as many or as few translations to the translation file at any given time.

### Adding/Updating Values for an Existing Language

If you would like to add a translation to a language the Linter already has a file for under `src/lang/locale`,
you can add values manually to the desired file or via running `npm run translate`. If you choose to use the script,
you will be able to add a translation value for a specific language, list untranslated keys in a specified language,
replace translated value with a new value for a specified key, translate all untranslated keys in a language one at a time

If you choose to do so manually, you will need to copy the structure found in [en.ts](src/lang/locale/en.ts) to the language that you want to add values for.

!!! note "Translation helper requirements"
    The translation helper requires that you have already followed the steps to setup npm and have installed its dependencies for this project.

Once the translation(s) has/have been added, the translation(s) should be ready for review. So go on ahead and [open a pull request](#open-a-pull-request).

### Adding a New Language Translation

If you want to add language support for a language, but the file does not already exist, there are a couple of steps that need
to be followed for adding that language to the Linter.

#### 1. Create the Translation File

Determine the name for the translation file as described by [What is a Translation?](#what-is-a-translation).
Once you know what the name of the file should be, create a new file for it under `src/lang/locale/`. You will want to
make sure that the new file follows the following format:

``` TypeScript
// {NAME_OF_LANGUAGE_IN_LANGUAGE_HERE}

export default {};
```

We will use an example of adding Spanish as the new language. The 2 letter abbreviation for Spanish is `es` so the
new file will be called `es.ts`.

So we will create a file under `es.ts` that as follows:

``` TypeScript
// Español

export default {};
```

!!! note
    The name of the language in the comment is the name used to refer to the language of Spanish in Spanish.
    Doing this helps native speakers better identify the language and dialect that the translation is for.

#### 2. Update Imports in Language Helper

Now that the language file has been created it exists and is ready to be used by the Linter.
The only problem is that the Linter does not know that the file exists. So we need to update [helpers.ts](src/lang/helpers.ts)
and add the new file to the list of files it knows about. To do this add the following line to [helpers.ts](src/lang/helpers.ts):

``` TypeScript
import {LANGUAGE_SHORT_CODE} from './locale/{LANGUAGE_SHORT_CODE}';
```

Then the `localeMap` in [helpers.ts](src/lang/helpers.ts) needs to
have an entry added in it for the new language:

``` TypeScript
export const localeMap: { [k: string]: LanguageLocale } = {
  en,
  {LANGUAGE_SHORT_CODE},
  ...
};
```

Lastly you will need to make sure that you add the proper value to the list of locales to their corresponding file names:

``` TypeScript
export const localeToFileName: { [k: string]: string} = {
  'en': 'en',
  '{LANGUAGE_SHORT_CODE}': '{LANGUAGE_SHORT_CODE}',
  ...
}
```

!!! info "Why add values to locale to file name object?"
    This is is done because it allows the UTs to validate that there is a unique file that exists for each locale that the
    Linter users.

In the case of adding Spanish, we would make the following changes:

``` TypeScript
import es from './locale/es'; // import new language into helper file
...
export const localeMap: { [k: string]: LanguageLocale } = {
  en,
  es, // add new language to locale mapping
  ...
};

export const localeToFileName: { [k: string]: string} = {
  'en': 'en',
  'es': 'es', // add new language locale to file name mapping
  ...
}
```

!!! note "Special Considerations for Locale Map"
    In some cases, the language name of the file and the language name of the Obsidian locale used are different.
    In these cases, you will want to make sure to map the Obsidian locale to the new language:

    ``` TypeScript
    export const localeMap: { [k: string]: LanguageLocale } = {
      en,
      es,
      'pt-BR': ptBR, // special mapping of Obsidian locale to language
      ...
      'zh-TW': zhTW, // special mapping of Obsidian locale to language
      'zh': zhCN, // special mapping of Obsidian locale to language
    };

    export const localeToFileName: { [k: string]: string} = {
      'en': 'en',
      'es': 'es',
      'pt-BR': 'pt-br', // special mapping of Obsidian locale to language file name
      ...
      'zh-TW': 'zh-tw', // special mapping of Obsidian locale to language file name
      'zh': 'zh-cn', // special mapping of Obsidian locale to language file name
    };
    ```

#### 3. Add Translations to File

Now that the translation file has been created and the language helper knows about the new language and what Obsidian locale
to use it for, the next thing to do is [add translations](#addingupdating-values-for-an-existing-language) to the newly created file.

#### 4. Open a Pull Request

Once the translation(s) has/have been added, the new language addition should be ready for review. So go on ahead and [open a pull request](#open-a-pull-request).

## Bug Fixes

Before trying to fix a bug, make sure that you have setup the Linter for local use as described in the [Setup Guide](#setting-up-the-linter).

Once the Linter is setup as a local repo, there are several things that can be done to fix bugs.

### Identify the Cause of the Bug

When a bug has been reported or encountered and you do not know where the bug is, it can be very helpful to try a couple
of things to narrow down what causes the bug.

#### Load in Config that Causes the Bug

The first thing that I tend to do once I get a bug report is make sure I have the `data.json` of the person who reported the
issue. Without having this, it can be very hard to reproduce the issue in some cases.

#### Start Disabling Rules

Once I have the config loaded, the next step is start disabling rules. I will generally start with 1 rule being disabled at a
time before re-linting the file in question to see if it reproduces the issue in question. I will sometimes just turn off a
bunch of unrelated rules when I am fairly confident that these rules are unrelated.

The end goal of disabling rules is to get down to just 1 rule that causes the issue. If you have to have 2 or more rules
active in order to cause the issue, the bug fix will get a lot tougher.

!!! note "multiple rule bugs"
    When a bug is caused by multiple rules making changes to a file, the only way to currently reproduce the behavior
    is in Obsidian itself. So you need to run `npm run build` once you have added `console.log` statements to
    [rules-runner.ts](src/rules-runner.ts) to help narrow down what the
    text looks like when it is being processed by each of the rules that are enabled in order to cause the bug.

### Create a Unit Test

If the bug is caused by a single rule, please [add a unit test](#adding-tests) to the rule's [general test suite](#general-rule-test-suites).
This will make it easier to tell when the bug is fixed and help make sure that we do not cause the same issue again down the
road.

### Update Code

Now comes the fun part: updating the code to fix the bug. Sometimes this is straight forward and other times this is complex.
The thing that will dictate how hard the fix will be is how complex the rule logic is already.

### Create a Pull Request

Once you have updated the code and the bug is fixed, then [open a pull request](#open-a-pull-request).

## Refactoring Code

Before trying to refactor code or create a proof of concept, make sure that you have setup the Linter for local use as described in the [Setup Guide](#setting-up-the-linter).

### Create an Issue

When planning to refactor large portions of code, please [create an issue](https://github.com/platers/obsidian-linter/issues/new?assignees=&labels=code%20cleanup)
on the repository before creating a pull request, so that the suggested refactor can be looked at before any work or
[proof of concept](#proof-of-concept) is requested. This will help save time for everyone involved.

### Proof of Concept

A proof of concept may be requested for code refactors or code cleanup which should be a small example
of the refactor that will be created. It should be created as a draft pull request.

These types of pull requests should give an idea of the suggested change without spending the time needed
to convert all code to use the suggestion. It can help display the strengths and weaknesses of the suggested change.

### Code Changes

Once the proof of concept, if requested, or refactor idea gets the green light, feel free to create a [pull request](#open-a-pull-request) with the suggested changes present or convert the draft pull request to a regular pull request if it already exists.

## Adding a Rule

Before trying to add a rule, make sure that you have setup the Linter for local use as described in the [Setup Guide](#setting-up-the-linter).

Once the Linter is setup locally, there are several steps in adding a new rule to the Linter that should be followed
that will make your and our lives easier by saving you and us time in the long run.

### 1. Create a Feature Request

Please first put in a [feature request](https://github.com/platers/obsidian-linter/issues/new?assignees=&labels=rule+suggestion&template=feature_request.md&title=FR%3A+).
This will allow us to take a look at the requested feature and make sure it fits within the Linter.

### 2. Create New File for the Rule

Once the new rule has been verified to be something that fits within the scope of the Linter, the rule can be added to the repository.
To do this, you will need to add a new file to `src/rules/` in the repository. It is easiest to either copy an existing rule.
or copy and rename [src/rules_rule-template.ts.txt](src/rules/_rule-template.ts.txt).

Please try to follow the format of existing rules where possible since that makes the code easier to maintain and changes
easier to review.

### 3. Fill Out the Different Parts of a Rule

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

#### Rule Options

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
    is being set in [rules-runner.ts](src/rules-runner.ts).

The second thing that you may notice is that all of the rule options are optional on the options class (`?:`).
This is done to allow for easier testing in the unit tests and examples since you will only need to set values
relevant to the test or example in question.

The third thing you may notice is that all of the regular rule options have a default value (` = value;`). This makes
sure that even if no value is provided a default is used. This makes the rule options more reliable and less prone
to bugs when reading in the settings file or running unit tests.

##### Empty Rule Options

There are rules that do not have any options at all. These rules still need an option class for the rule to work, but the
class body can be left empty like so:

``` TypeScript
class YamlKeySortOptions implements Options {}
```

#### Rule Settings

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
| `nameKey` | The object property representation of the value in [en.ts](src/lang/locale/en.ts) that has the text for the name of the rule setting |
| `descriptionKey` | The object property representation of the value in [en.ts](src/lang/locale/en.ts) that has the text for the description of the rule setting |

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

##### Empty Rule Settings

Some rules have no options that have a setting in the UI. When this happens, the rule settings can be left blank like so:

``` TypeScript
get optionBuilders(): OptionBuilderBase<YamlKeySortOptions>[] {
  return [];
}
```

#### The Rule Constructor

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
| `nameKey` | The object property representation of the value in [en.ts](src/lang/locale/en.ts) that has the text for the name of the rule. The value should be in the format `rules.rule-alias.name`. | Y | `rules.yaml-key-sort.name` |
| `descriptionKey` | The object property representation of the value in [en.ts](src/lang/locale/en.ts) that has the text for the description of the rule. The value should be in the format `rules.rule-alias.description`. | Y | `rules.yaml-key-sort.description` |
| `type` | The type of the rule which determines where in the settings it shows up and whether to test it with YAML frontmatter added as part of the example tests. | Y | `RuleType.YAML` |
| `hasSpecialExecutionOrder` | Specifies whether this rule will be manually executed in either the before or after Linter rules in [rules-runner.ts](src/rules-runner.ts). Its default value is `false`. | N | `true` |
| `ruleIgnoreTypes` | The list of ignore types which can be found in [ignore-types.ts](src/utils/ignore-types.ts) that should be ignored for all the logic of the rule. This is useful for ignoring things like code blocks or YAML frontmatter. It default to an empty array (`[]`). Do not put `IgnoreTypes.customIgnore` in this list as it is automatically added to all rules except for `RuleType.PASTE`. | N | `[IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],` |

#### The Rule Logic

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

##### Ignoring Types for Part of a Rule's Logic

At times, there is a need to ignore a specific type of element in a file for just a portion of the logic of the rule.
This can be done using `ignoreListOfTypes` from
[ignore-types.ts](src/utils/ignore-types.ts)
which takes a list of `IgnoreTypes` and a function that takes the resulting string and returns another string.

We have an example of this in [Remove Space Around Characters](src/rules/remove-space-around-characters.ts) where we needed to make sure we did not remove whitespace between a list marker and the fullwidth or other characters in question so we had to ignore lists for the first regex replacement and then do the same regex replacement on just the list item text:

``` TypeScript
const replaceWhitespaceAroundFullwidthCharacters = function(text: string): string {
  return text.replace(fullwidthCharacterWithTextAtStart, '$2').replace(fullwidthCharacterWithTextAtEnd, '$1');
};

let newText = ignoreListOfTypes([IgnoreTypes.list], text, replaceWhitespaceAroundFullwidthCharacters);

newText = updateListItemText(newText, replaceWhitespaceAroundFullwidthCharacters);
```

#### Rule Examples

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


#### Rule Text

The text that displays for the rule and its settings is something that needs to be added as well.
They were mentioned above in the sections talking about [Rule Settings](#rule-settings) and [Rule Constructor](#the-rule-constructor).

At the very least, a new rule requires entries to be added for the rule name and description of the new rule in [en.ts](src/lang/locale/en.ts).

If we `YAML Key Sort` did not already exist, I would need to navigate to [en.ts](src/lang/locale/en.ts).
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

### 4. Add Edge Case Tests if Applicable

Once a rule has been created, see about adding tests for edge cases as described in [Adding Test](#adding-tests).

### 5. Open a Pull Request

Once the tests are in place, the new rule should be ready for review. So go on ahead and [open a pull request](#open-a-pull-request).

## Testing

Before trying to run tests, make sure that you have setup the Linter for local use as described in the [Setup Guide](#setting-up-the-linter).

Testing the Linter is broken into unit tests that can be run against logic inside of the repository and integration testing
which general applies to interacting with Obsidian, verifying how UI elements look, and making sure the plugin still loads.

### Unit Testing

Unit tests are a great way to make sure that the rules and other logic within the Linter is working as intended and expected
especially over time with code refactoring, logical changes, and bug fixes. This helps make sure that the logic still works
like it did before changes were made.

!!! warning "Unit test reliability"
    Unit tests are only as reliable as the quality of the tests. So if the tests are poor and barely test the
    functionality of the rules or logic in question, the unit tests can give a false impression that the code is working.

#### What Do Unit Tests Look Like in the Linter?

There are really 2 broad categories of unit tests in the Linter: rule examples and test suites.

##### Rule Examples

These are the examples that you find in the definition of rules themselves. You can find more on them in [Rule Examples](#rule-examples) under Adding a Rule.

##### Test Suites

These are tests that reside in the `__tests__` directory. They can be broken into 2 categories themselves: general rule test
suites and specific test suites.

###### General Rule Test Suites

As the name suggests, these are test suites that follow a general format and each one is specific to a rule. For example,
[capitalize-headings.test.ts](__tests__/capitalize-headings.test.ts)
is a general rule test suite since it only has tests for [Capitalize Headings](../settings/heading-rules.md#capitalize-headings).

These rules follow the same kind of format:

``` TypeScript
import CapitalizeHeadings from '../src/rules/capitalize-headings';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: CapitalizeHeadings,
  testCases: [
    {
      testName: 'Ignores not words',
      before: dedent`
        # h1
        ## a c++ lan
        ## this is a sentence.
        ## I can't do this
        ## comma, comma, comma
        ## 1.1 the Header
        ## état
        ## this état
      `,
      after: dedent`
        # H1
        ## A c++ Lan
        ## This is a Sentence.
        ## I Can't Do This
        ## Comma, Comma, Comma
        ## 1.1 The Header
        ## État
        ## This État
      `,
      options: {
        style: 'Title Case',
      },
    },
    ...
    { // accounts for https://github.com/platers/obsidian-linter/issues/601
      testName: `Make sure that if the 1st word has a number in it, it will still be considered to be a word and have its first letter capitalized`,
      before: dedent`
        # EC2 instance
        ## EC2 lab05 load balancer
        ### lab07 bread maker
      `,
      after: dedent`
        # EC2 instance
        ## EC2 lab05 load balancer
        ### Lab07 bread maker
      `,
      options: {
        style: 'First letter',
        ignoreCasedWords: true,
      },
    },
  ],
});
```

The file starts off with the imports which includes the [Rule Options](#rule-options), any type imports it may
need, and the `ruleTest` method which basically sets up the tests to be run as an array of tests:

``` TypeScript
import CapitalizeHeadings from '../src/rules/capitalize-headings';
import dedent from 'ts-dedent';
import {ruleTest} from './common';
```

After that comes the list of tests being passed into `ruleTest`:

``` TypeScript
ruleTest({
  RuleBuilderClass: CapitalizeHeadings,
  testCases: [
    {
      testName: 'Ignores not words',
      before: dedent`
        # h1
        ## a c++ lan
        ## this is a sentence.
        ## I can't do this
        ## comma, comma, comma
        ## 1.1 the Header
        ## état
        ## this état
      `,
      after: dedent`
        # H1
        ## A c++ Lan
        ## This is a Sentence.
        ## I Can't Do This
        ## Comma, Comma, Comma
        ## 1.1 The Header
        ## État
        ## This État
      `,
      options: {
        style: 'Title Case',
      },
    },
    ...
    { // accounts for https://github.com/platers/obsidian-linter/issues/601
      testName: `Make sure that if the 1st word has a number in it, it will still be considered to be a word and have its first letter capitalized`,
      before: dedent`
        # EC2 instance
        ## EC2 lab05 load balancer
        ### lab07 bread maker
      `,
      after: dedent`
        # EC2 instance
        ## EC2 lab05 load balancer
        ### Lab07 bread maker
      `,
      options: {
        style: 'First letter',
        ignoreCasedWords: true,
      },
    },
  ],
});
```

`rulesTest` expects the `RuleBuilderClass` to be the rule options class reference and then `testCases` which is a list of
test cases for the rule. The test cases are almost identical to [Rule Examples](#rule-examples) however they use `testName` instead of `description`.

###### Specific Test Suites

These test suites are generally tailored to a specific function that exists that is not a rule. They are generally meant to
make sure that certain functions still work as intended. An example of a specific test suite is [get-all-custom-ignore-sections-in-text.test.ts](__tests__/get-all-custom-ignore-sections-in-text.test.ts).
The logic for these tests tries to follow a similar setup to that of a general rule test suite, but is tailored to the needs
of the specific function that is being tested:

``` TypeScript
import {getAllCustomIgnoreSectionsInText} from '../src/utils/mdast';
import dedent from 'ts-dedent';

type customIgnoresInTextTestCase = {
  name: string,
  text: string,
  expectedCustomIgnoresInText: number,
  expectedPositions: {startIndex:number, endIndex: number}[]
};

const getCustomIgnoreSectionsInTextTestCases: customIgnoresInTextTestCase[] = [
  {
    name: 'when no custom ignore start indicator is present, no positions are returned',
    text: dedent`
      Here is some text
      Here is some more text
    `,
    expectedCustomIgnoresInText: 0,
    expectedPositions: [],
  },
  {
    name: 'when no custom ignore start indicator is present, no positions are returned even if custom ignore end indicator is present',
    text: dedent`
      Here is some text
      <!-- linter-enable -->
      Here is some more text
    `,
    expectedCustomIgnoresInText: 0,
    expectedPositions: [],
  },
  {
    name: 'a simple example of a start and end custom ignore indicator results in the proper start and end positions for the ignore section',
    text: dedent`
      Here is some text
      <!-- linter-disable -->
      This content will be ignored
      So any format put here gets to stay as is
      <!-- linter-enable -->
      More text here...
    `,
    expectedCustomIgnoresInText: 1,
    expectedPositions: [{startIndex: 18, endIndex: 135}],
  },
  {
    name: 'when a custom ignore start indicator is not followed by a custom ignore end indicator in the text, the end is considered to be the end of the text',
    text: dedent`
      Here is some text
      <!-- linter-disable -->
      This content will be ignored
      So any format put here gets to stay as is
      More text here...
    `,
    expectedCustomIgnoresInText: 1,
    expectedPositions: [{startIndex: 18, endIndex: 129}],
  },
  {
    name: 'when a custom ignore start indicator shows up midline, it ignores the part in question',
    text: dedent`
      Here is some text<!-- linter-disable -->here is some ignored text<!-- linter-enable -->
      This content will be ignored
      So any format put here gets to stay as is
      More text here...
    `,
    expectedCustomIgnoresInText: 1,
    expectedPositions: [{startIndex: 17, endIndex: 87}],
  },
  {
    name: 'when a custom ignore start indicator does not follow the exact syntax, it is counted as existing when it is a single-line comment',
    text: dedent`
      Here is some text<!-- linter-disable-->here is some ignored text<!-------------         linter-enable ------>
      This content will be ignored
      So any format put here gets to stay as is
      More text here...
    `,
    expectedCustomIgnoresInText: 1,
    expectedPositions: [{startIndex: 17, endIndex: 109}],
  },
  {
    name: 'multiple matches can be returned',
    text: dedent`
      Here is some text<!-- linter-disable -->here is some ignored text<!-- linter-enable -->
      This content will be ignored
      So any format put here gets to stay as is
      More text here...
      ${''}
      <!-- linter-disable -->
      We want to ignore the following as we want to preserve its format
        -> level 1
          -> level 1.3
        -> level 2
      Finish
    `,
    expectedCustomIgnoresInText: 2,
    expectedPositions: [{startIndex: 17, endIndex: 87}, {startIndex: 178, endIndex: 316}],
  },
];

describe('Get All Custom Ignore Sections in Text', () => {
  for (const testCase of getCustomIgnoreSectionsInTextTestCases) {
    it(testCase.name, () => {
      const customIgnorePositions = getAllCustomIgnoreSectionsInText(testCase.text);

      expect(customIgnorePositions.length).toEqual(testCase.expectedCustomIgnoresInText);
      expect(customIgnorePositions).toEqual(testCase.expectedPositions);
    });
  }
});
```

These tests general start by importing the function to test followed by the format of how the test cases will be formatted:

``` TypeScript
import {getAllCustomIgnoreSectionsInText} from '../src/utils/mdast';
import dedent from 'ts-dedent';

type customIgnoresInTextTestCase = {
  name: string,
  text: string,
  expectedCustomIgnoresInText: number,
  expectedPositions: {startIndex:number, endIndex: number}[]
};
```

After that comes the test cases and then the running of the test cases:

``` TypeScript
describe('Get All Custom Ignore Sections in Text', () => {
  for (const testCase of getCustomIgnoreSectionsInTextTestCases) {
    it(testCase.name, () => {
      const customIgnorePositions = getAllCustomIgnoreSectionsInText(testCase.text);

      expect(customIgnorePositions.length).toEqual(testCase.expectedCustomIgnoresInText);
      expect(customIgnorePositions).toEqual(testCase.expectedPositions);
    });
  }
});
```

This is the format you will want to use for specific test suites if at all possible. There are some scenarios where the test
cases do vary so much that creating a type for the test case is not feasible and so individual tests are used like what
[rules-runner.test.ts](__tests__/rules-runner.test.ts) does.

#### Should You Add a Test?

You may be wondering whether you should or should not add a test to the Linter. If you do any of the following, you should add a unit test:

| Situation | Tests to Include |
| --------- | ---------------- |
| Add a new rule | Examples on the rule that cover general use cases<br/><br/>Unit tests in a test suite for the new rule that cover cases that make the examples too long or that are edge cases |
| Add a new option to a rule | An example or examples on the rule to cover the general scenarios of the new option<br/><br/>Unit tests in a test suite for the rule that cover cases that make the examples too long or that are edge cases |
| Refactoring code | This may require a new test suite that is designed specifically for the refactored code (for example [get-all-tables-in-text.test.ts](__tests__/get-all-tables-in-text.test.ts)) or new unit tests in a test suite that uses the logic that was refactored if it has changed the edge cases that are possible |
| Fixing a bug | When a bug directly affects a single rule and can be reproduced by setting up a case in the rule's test suite, add that rule with a comment referencing back to the issue that reported the problem* |

*Here is what an example of bug fix unit test looks like in a general rule test suite:

``` TypeScript
{ // accounts for https://github.com/platers/obsidian-linter/issues/412
  testName: 'H1s become H2s and all other headers are shifted accordingly when an H1 starts a file',
  before: dedent`
    # H1
    ### H3
    #### H4
    # H1
    #### H4
    ###### H6
  `,
  after: dedent`
    ## H1
    ### H3
    #### H4
    ## H1
    ### H4
    #### H6
  `,
  options: {
    startAtH2: true,
  },
},
```

#### Adding Tests

Where to add a test depends on what kind of test you are adding. If it is an example, it should reside in the specific rule
that it pertains to. If it is meant to be a bug fix, edge case test, a test for a non-rule function, or a large test, then
adding it to an existing or new test suite makes the most sense.

When adding an example test case, please follow the format described by [Rule Examples](#rule-examples).
When adding an test suite test case, please follow the format described above by [Test Suites](#test-suites) making sure
that any newly added test suites have dashes between words in the filename.

Once a test is added, you will want to run the tests, see [Running Tests](#running-tests).

#### Running Tests


Tests are run by jest and running them varies depending on whether you want to run all tests or one or more test suites.

##### All Tests

They can be run by either running `npm run test` or `npm run compile`. The output will let
you know how many of the tests passed and if any failed, why they failed using a visual comparison of what was expected
versus what was received.

!!! note "Advanced tests"
    When advanced tests fail, their output is harder to read since it uses a regex match. It is recommended that you use
    the output of the expected versus actual values for the normal tests to determine what went wrong with the test.

##### A Specific Test Suite

If you know the suite of tests that you would like to run, you can use `npm run test-suite TEST_SUITE_HERE` to run just
the desired test suite. The test suite names are the names of the files in `__tests` minus `.test.ts`. You only need to
use part of a file name for a test suite to be used as it checks that the test suite name starts with the value of `TEST_SUITE_HERE`.

So for example, `npm run test-suite format-yaml-arrays` would run the test suite for formatting YAML arrays since that is
the only test suite that starts with `format-yaml-arrays`. While, `npm run test-suite header` would run all test suites
that start with the word `header`.

!!! note
    Running a test suite for a specific rule or rules does not run the examples for that rule(s) as all examples
    are bundled together in the examples test suite which can be run via `npm run test-suite examples`.

### Integration Testing

Integration tests are reserved for things that are not easily tested with unit tests. When doing these tests,
you will need to load your local copy of the Linter into Obsidian and then run the Linter with the desired rules turned on.

#### When Should I Do Integration Testing?

When a rule is changed to run as part of the rules to run after or rules to run before the normal rules in [rules-runner.ts](src/rules-runner.ts).

When a UI change is made. For example a wording change or a display element changes like CSS or HTML changes.

When the issue was caused by multiple rules making changes to the contents of a file to create an issue.
When this happens, the only way I have found to be reliable when testing that the issue is resolved is via integration testing.

## Open a Pull Request

Before opening a pull request, please start of by linting the repository.

### Linting the Repository

Files should be linted prior to creating a pull request. The linter will make sure that the code follows the desired code
style and formats the files as needed. The linter can be run by `npm run lint` or `npm run compile`.

!!! note "Trailing whitespace and empty line preservation"
    The file linter removes trailing spaces and blank lines. If they are essential use `${''}` at the end of a line or by
    itself on a line to preserve trailing whitespace or empty lines.

    ```JavaScript
    const str = dedent`
      line with essential trailing spaces   ${''}
      ${''}
      previous line is completely blank
    `;
    ```
### Run Unit Tests

The next thing to do is to make sure that all tests are passing by running `npm run test`. If any tests fail, please get them
working before opening a pull request.

### Creating a Pull Request

Once all changes have been made, [any applicable tests added](#should-you-add-a-test), and the
file linting has applied formats and identified no issues, then it is time to create a pull request.

When creating a pull request, please make sure that if it fixes a bug, adds a requested feature, or
implements a suggested refactor, please make sure to include `Fixes #{ISSUE_NUMBER}`. This will help associate
the change with the created issue and it will help make sure that issues are closed when their fixes are merged.

Please include a little bit about what the pull request does in the description of the ticket to help give some context to the developers that review the pull request.

## Creating a Release

In order to create a release, there are a couple of steps to go through:

Start by updating the version number in `package.json` and `manifest.json`. Then add a new version entry into `versions.json`.

A version entry in `versions.json` would like something like the following:
```JSON
"{PLUGIN_VERSION}": "{MINIMUM_OBSIDIAN_VERSION}" // i.e. "1.3.4": "0.9.7" 
```
If you are not sure what version to use for `{MINIMUM_OBSIDIAN_VERSION}`, use your current version of Obsidian.

Now that the versions are updated, create a pull request and merge the changes into master. Once that is done
go to the [releases tab](https://github.com/platers/obsidian-linter/releases/latest) and select draft a new release.
Then you can type in the new tag which should be the version of the release (i.e. `1.3.4`) and have it create the tag
on creation of the release. Autofill the release using the option to "Generate release notes". Then attach the
compiled `main.js` and `manifest.json` to the release before publishing the release.


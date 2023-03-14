import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {makeEmphasisOrBoldConsistent, MDAstTypes} from '../utils/mdast';

type EmphasisStyleValues = 'consistent' | 'asterisk' | 'underscore';

class EmphasisStyleOptions implements Options {
  style: EmphasisStyleValues = 'consistent';
}

@RuleBuilder.register
export default class EmphasisStyle extends RuleBuilder<EmphasisStyleOptions> {
  constructor() {
    super({
      nameKey: 'rules.emphasis-style.name',
      descriptionKey: 'rules.emphasis-style.description',
      type: RuleType.CONTENT,
    });
  }
  get OptionsClass(): new () => EmphasisStyleOptions {
    return EmphasisStyleOptions;
  }
  apply(text: string, options: EmphasisStyleOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.math, IgnoreTypes.inlineMath], text, (text) => {
      return makeEmphasisOrBoldConsistent(text, options.style, MDAstTypes.Italics);
    });
  }
  get exampleBuilders(): ExampleBuilder<EmphasisStyleOptions>[] {
    return [
      new ExampleBuilder<EmphasisStyleOptions>({
        description: 'Emphasis indicators should use underscores when style is set to \'underscore\'',
        before: dedent`
          # Emphasis Cases
          ${''}
          *Test emphasis*
          * Test not emphasized *
          This is *emphasized* mid sentence
          This is *emphasized* mid sentence with a second *emphasis* on the same line
          This is ***bold and emphasized***
          This is ***nested bold** and ending emphasized*
          This is ***nested emphasis* and ending bold**
          ${''}
          **Test bold**
          ${''}
          * List Item1 with *emphasized text*
          * List Item2
        `,
        after: dedent`
          # Emphasis Cases
          ${''}
          _Test emphasis_
          * Test not emphasized *
          This is _emphasized_ mid sentence
          This is _emphasized_ mid sentence with a second _emphasis_ on the same line
          This is _**bold and emphasized**_
          This is _**nested bold** and ending emphasized_
          This is **_nested emphasis_ and ending bold**
          ${''}
          **Test bold**
          ${''}
          * List Item1 with _emphasized text_
          * List Item2
        `,
        options: {
          style: 'underscore',
        },
      }),
      new ExampleBuilder<EmphasisStyleOptions>({
        description: 'Emphasis indicators should use asterisks when style is set to \'asterisk\'',
        before: dedent`
          # Emphasis Cases
          ${''}
          _Test emphasis_
          _ Test not emphasized _
          This is _emphasized_ mid sentence
          This is _emphasized_ mid sentence with a second _emphasis_ on the same line
          This is ___bold and emphasized___
          This is ___nested bold__ and ending emphasized_
          This is ___nested emphasis_ and ending bold__
          ${''}
          __Test bold__
        `,
        after: dedent`
          # Emphasis Cases
          ${''}
          *Test emphasis*
          _ Test not emphasized _
          This is *emphasized* mid sentence
          This is *emphasized* mid sentence with a second *emphasis* on the same line
          This is *__bold and emphasized__*
          This is *__nested bold__ and ending emphasized*
          This is __*nested emphasis* and ending bold__
          ${''}
          __Test bold__
        `,
        options: {
          style: 'asterisk',
        },
      }),
      new ExampleBuilder<EmphasisStyleOptions>({
        description: 'Emphasis indicators should use consistent style based on first emphasis indicator in a file when style is set to \'consistent\'',
        before: dedent`
          # Emphasis First Emphasis Is an Asterisk
          ${''}
          *First emphasis*
          This is _emphasized_ mid sentence
          This is *emphasized* mid sentence with a second _emphasis_ on the same line
          This is *__bold and emphasized__*
          This is *__nested bold__ and ending emphasized*
          This is **_nested emphasis_ and ending bold**
          ${''}
          __Test bold__
        `,
        after: dedent`
          # Emphasis First Emphasis Is an Asterisk
          ${''}
          *First emphasis*
          This is *emphasized* mid sentence
          This is *emphasized* mid sentence with a second *emphasis* on the same line
          This is *__bold and emphasized__*
          This is *__nested bold__ and ending emphasized*
          This is ***nested emphasis* and ending bold**
          ${''}
          __Test bold__
        `,
        options: {
          style: 'consistent',
        },
      }),
      new ExampleBuilder<EmphasisStyleOptions>({
        description: 'Emphasis indicators should use consistent style based on first emphasis indicator in a file when style is set to \'consistent\'',
        before: dedent`
          # Emphasis First Emphasis Is an Underscore
          ${''}
          **_First emphasis_**
          This is _emphasized_ mid sentence
          This is *emphasized* mid sentence with a second _emphasis_ on the same line
          This is *__bold and emphasized__*
          This is _**nested bold** and ending emphasized_
          This is __*nested emphasis* and ending bold__
          ${''}
          __Test bold__
        `,
        after: dedent`
          # Emphasis First Emphasis Is an Underscore
          ${''}
          **_First emphasis_**
          This is _emphasized_ mid sentence
          This is _emphasized_ mid sentence with a second _emphasis_ on the same line
          This is ___bold and emphasized___
          This is _**nested bold** and ending emphasized_
          This is ___nested emphasis_ and ending bold__
          ${''}
          __Test bold__
        `,
        options: {
          style: 'consistent',
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<EmphasisStyleOptions>[] {
    return [
      new DropdownOptionBuilder<EmphasisStyleOptions, EmphasisStyleValues>({
        OptionsClass: EmphasisStyleOptions,
        nameKey: 'rules.emphasis-style.style.name',
        descriptionKey: 'rules.emphasis-style.style.description',
        optionsKey: 'style',
        records: [
          {
            value: 'consistent',
            description: 'Makes sure the first instance of emphasis is the style that will be used throughout the document',
          },
          {
            value: 'asterisk',
            description: 'Makes sure * is the emphasis indicator',
          },
          {
            value: 'underscore',
            description: 'Makes sure _ is the emphasis indicator',
          },
        ],
      }),
    ];
  }
}

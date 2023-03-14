import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {makeEmphasisOrBoldConsistent, MDAstTypes} from '../utils/mdast';

type StrongStyleValues = 'consistent' | 'asterisk' | 'underscore';

class StrongStyleOptions implements Options {
  style: StrongStyleValues = 'consistent';
}

@RuleBuilder.register
export default class StrongStyle extends RuleBuilder<StrongStyleOptions> {
  constructor() {
    super({
      nameKey: 'rules.strong-style.name',
      descriptionKey: 'rules.strong-style.description',
      type: RuleType.CONTENT,
    });
  }
  get OptionsClass(): new () => StrongStyleOptions {
    return StrongStyleOptions;
  }
  apply(text: string, options: StrongStyleOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.math, IgnoreTypes.inlineMath], text, (text) => {
      return makeEmphasisOrBoldConsistent(text, options.style, MDAstTypes.Bold);
    });
  }
  get exampleBuilders(): ExampleBuilder<StrongStyleOptions>[] {
    return [
      new ExampleBuilder<StrongStyleOptions>({
        description: 'Strong indicators should use underscores when style is set to \'underscore\'',
        before: dedent`
          # Strong/Bold Cases
          ${''}
          **Test bold**
          ** Test not bold **
          This is **bold** mid sentence
          This is **bold** mid sentence with a second **bold** on the same line
          This is ***bold and emphasized***
          This is ***nested bold** and ending emphasized*
          This is ***nested emphasis* and ending bold**
          ${''}
          *Test emphasis*
          ${''}
          * List Item1 with **bold text**
          * List Item2
        `,
        after: dedent`
          # Strong/Bold Cases
          ${''}
          __Test bold__
          ** Test not bold **
          This is __bold__ mid sentence
          This is __bold__ mid sentence with a second __bold__ on the same line
          This is *__bold and emphasized__*
          This is *__nested bold__ and ending emphasized*
          This is __*nested emphasis* and ending bold__
          ${''}
          *Test emphasis*
          ${''}
          * List Item1 with __bold text__
          * List Item2
        `,
        options: {
          style: 'underscore',
        },
      }),
      new ExampleBuilder<StrongStyleOptions>({
        description: 'Strong indicators should use asterisks when style is set to \'asterisk\'',
        before: dedent`
          # Strong/Bold Cases
          ${''}
          __Test bold__
          __ Test not bold __
          This is __bold__ mid sentence
          This is __bold__ mid sentence with a second __bold__ on the same line
          This is ___bold and emphasized___
          This is ___nested bold__ and ending emphasized_
          This is ___nested emphasis_ and ending bold__
          ${''}
          _Test emphasis_
        `,
        after: dedent`
          # Strong/Bold Cases
          ${''}
          **Test bold**
          __ Test not bold __
          This is **bold** mid sentence
          This is **bold** mid sentence with a second **bold** on the same line
          This is _**bold and emphasized**_
          This is _**nested bold** and ending emphasized_
          This is **_nested emphasis_ and ending bold**
          ${''}
          _Test emphasis_
        `,
        options: {
          style: 'asterisk',
        },
      }),
      new ExampleBuilder<StrongStyleOptions>({
        description: 'Strong indicators should use consistent style based on first strong indicator in a file when style is set to \'consistent\'',
        before: dedent`
          # Strong First Strong Is an Asterisk
          ${''}
          **First bold**
          This is __bold__ mid sentence
          This is __bold__ mid sentence with a second **bold** on the same line
          This is ___bold and emphasized___
          This is *__nested bold__ and ending emphasized*
          This is **_nested emphasis_ and ending bold**
          ${''}
          __Test bold__
        `,
        after: dedent`
          # Strong First Strong Is an Asterisk
          ${''}
          **First bold**
          This is **bold** mid sentence
          This is **bold** mid sentence with a second **bold** on the same line
          This is _**bold and emphasized**_
          This is ***nested bold** and ending emphasized*
          This is **_nested emphasis_ and ending bold**
          ${''}
          **Test bold**
        `,
        options: {
          style: 'consistent',
        },
      }),
      new ExampleBuilder<StrongStyleOptions>({
        description: 'Strong indicators should use consistent style based on first strong indicator in a file when style is set to \'consistent\'',
        before: dedent`
          # Strong First Strong Is an Underscore
          ${''}
          __First bold__
          This is **bold** mid sentence
          This is **bold** mid sentence with a second __bold__ on the same line
          This is **_bold and emphasized_**
          This is ***nested bold** and ending emphasized*
          This is ___nested emphasis_ and ending bold__
          ${''}
          **Test bold**
        `,
        after: dedent`
          # Strong First Strong Is an Underscore
          ${''}
          __First bold__
          This is __bold__ mid sentence
          This is __bold__ mid sentence with a second __bold__ on the same line
          This is ___bold and emphasized___
          This is *__nested bold__ and ending emphasized*
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
  get optionBuilders(): OptionBuilderBase<StrongStyleOptions>[] {
    return [
      new DropdownOptionBuilder<StrongStyleOptions, StrongStyleValues>({
        OptionsClass: StrongStyleOptions,
        nameKey: 'rules.strong-style.style.name',
        descriptionKey: 'rules.strong-style.style.description',
        optionsKey: 'style',
        records: [
          {
            value: 'consistent',
            description: 'Makes sure the first instance of strong is the style that will be used throughout the document',
          },
          {
            value: 'asterisk',
            description: 'Makes sure ** is the strong indicator',
          },
          {
            value: 'underscore',
            description: 'Makes sure __ is the strong indicator',
          },
        ],
      }),
    ];
  }
}

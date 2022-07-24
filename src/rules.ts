import dedent from 'ts-dedent';
import {
  loadYAML,
} from './utils/yaml';
import {
  Option,
  BooleanOption,
} from './option';
import {ignoreListOfTypes, IgnoreTypes} from './utils/ignore-types';
import {removeSpacesInLinkText} from './utils/mdast';
import {yamlRegex, removeSpacesInWikiLinkText} from './utils/regex';

export type Options = { [optionName: string]: any };
type ApplyFunction = (text: string, options?: Options) => string;

export interface LinterSettings {
  ruleConfigs: {
    [ruleName: string]: Options;
  };
  lintOnSave: boolean;
  displayChanged: boolean;
  foldersToIgnore: string[];
  linterLocale: string;
  logLevel: number;
}
/* eslint-disable no-unused-vars */
export enum RuleType {
  YAML = 'YAML',
  HEADING = 'Heading',
  FOOTNOTE = 'Footnote',
  CONTENT = 'Content',
  SPACING = 'Spacing',
}
/* eslint-enable no-unused-vars */

/** Class representing a rule */
export class Rule {
  public name: string;
  public description: string;
  public type: RuleType;
  public options: Array<Option>;
  public apply: ApplyFunction;

  public examples: Array<Example>;

  /**
   * Create a rule
   * @param {string} name - The name of the rule
   * @param {string} description - The description of the rule
   * @param {RuleType} type - The type of the rule
   * @param {ApplyFunction} apply - The function to apply the rule
   * @param {Array<Example>} examples - The examples to be displayed in the documentation
   * @param {Array<Option>} [options=[]] - The options of the rule to be displayed in the documentation
   */
  constructor(
      name: string,
      description: string,
      type: RuleType,
      apply: ApplyFunction,
      examples: Array<Example>,
      options: Array<Option> = [],
  ) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.apply = apply;
    this.examples = examples;

    options.unshift(new BooleanOption(this.description, '', false));
    for (const option of options) {
      option.ruleName = name;
    }
    this.options = options;
  }

  public alias(): string {
    return this.name.replace(/ /g, '-').toLowerCase();
  }

  public getDefaultOptions() {
    const options: { [optionName: string]: any } = {};

    for (const option of this.options) {
      options[option.name] = option.defaultValue;
    }

    return options;
  }

  public getOptions(settings: LinterSettings) {
    return settings.ruleConfigs[this.name];
  }

  public getURL(): string {
    const url =
      'https://github.com/platers/obsidian-linter/blob/master/docs/rules.md';
    return url + '#' + this.alias();
  }

  public enabledOptionName(): string {
    return this.options[0].name;
  }
}

/** Class representing an example of a rule */
export class Example {
  public description: string;
  public options: Options;

  public before: string;
  public after: string;

  /**
   * Create an example
   * @param {string} description - The description of the example
   * @param {string} before - The text before the rule is applied
   * @param {string} after - The text after the rule is applied
   * @param {object} options - The options of the example
   */
  constructor(
      description: string,
      before: string,
      after: string,
      options: Options = {},
  ) {
    this.description = description;
    this.options = options;
    this.before = before;
    this.after = after;
  }
}

const RuleTypeOrder = Object.values(RuleType);

/**
 * Returns a list of ignored rules in the YAML frontmatter of the text.
 * @param {string} text The text to parse
 * @return {string[]} The list of ignored rules
 */
export function getDisabledRules(text: string): string[] {
  const yaml = text.match(yamlRegex);
  if (!yaml) {
    return [];
  }

  const yaml_text = yaml[1];
  const parsed_yaml = loadYAML(yaml_text);
  if (!Object.prototype.hasOwnProperty.call(parsed_yaml, 'disabled rules')) {
    return [];
  }

  let disabled_rules = (parsed_yaml as { 'disabled rules': string[] | string })[
      'disabled rules'
  ];
  if (!disabled_rules) {
    return [];
  }

  if (typeof disabled_rules === 'string') {
    disabled_rules = [disabled_rules];
  }

  if (disabled_rules.includes('all')) {
    return rules.map((rule) => rule.alias());
  }

  return disabled_rules;
}

export const rules: Rule[] = [
  new Rule(
      'Remove Space around Fullwidth Characters',
      'Ensures that fullwidth characters are not followed by whitespace (either single spaces or a tab)',
      RuleType.SPACING,
      (text: string) => {
        return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
          return text.replace(/([ \t])+([\u2013\u2014\u2026\u3001\u3002\u300a\u300d-\u300f\u3014\u3015\u3008-\u3011\uff00-\uffff])/g, '$2').replace(/([\u2013\u2014\u2026\u3001\u3002\u300a\u300d-\u300f\u3014\u3015\u3008-\u3011\uff00-\uffff])([ \t])+/g, '$1');
        });
      },
      [
        new Example(
            'Remove Spaces and Tabs around Fullwidth Characrters',
            dedent`
          Full list of affected charaters: ０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ，．：；！？＂＇｀＾～￣＿＆＠＃％＋－＊＝＜＞（）［］｛｝｟｠｜￤／＼￢＄￡￠￦￥。、「」『』〔〕【】—…–《》〈〉
          This is a fullwidth period\t 。 with text after it.
          This is a fullwidth comma\t，  with text after it.
          This is a fullwidth left parenthesis （ \twith text after it.
          This is a fullwidth right parenthesis ）  with text after it.
          This is a fullwidth colon ：  with text after it.
          This is a fullwidth semicolon ；  with text after it.
            Ｒemoves space at start of line
      `,
            dedent`
          Full list of affected charaters:０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ，．：；！？＂＇｀＾～￣＿＆＠＃％＋－＊＝＜＞（）［］｛｝｟｠｜￤／＼￢＄￡￠￦￥。、「」『』〔〕【】—…–《》〈〉
          This is a fullwidth period。with text after it.
          This is a fullwidth comma，with text after it.
          This is a fullwidth left parenthesis（with text after it.
          This is a fullwidth right parenthesis）with text after it.
          This is a fullwidth colon：with text after it.
          This is a fullwidth semicolon；with text after it.
          Ｒemoves space at start of line
      `,
        ),
      ],
  ),
  new Rule(
      'Remove link spacing',
      'Removes spacing around link text.',
      RuleType.SPACING,
      (text: string) => {
        text = removeSpacesInLinkText(text);
        return removeSpacesInWikiLinkText(text);
      },
      [
        new Example(
            'Space in regular markdown link text',
            dedent`
      [ here is link text1 ](link_here)
      [ here is link text2](link_here)
      [here is link text3 ](link_here)
      [here is link text4](link_here)
      [\there is link text5\t](link_here)
      [](link_here)
      **Note that image markdown syntax does not get affected even if it is transclusion:**
      ![\there is link text6 ](link_here)
      `,
            dedent`
      [here is link text1](link_here)
      [here is link text2](link_here)
      [here is link text3](link_here)
      [here is link text4](link_here)
      [here is link text5](link_here)
      [](link_here)
      **Note that image markdown syntax does not get affected even if it is transclusion:**
      ![\there is link text6 ](link_here)
      `,
        ),
        new Example(
            'Space in wiki link text',
            dedent`
      [[link_here| here is link text1 ]]
      [[link_here|here is link text2 ]]
      [[link_here| here is link text3]]
      [[link_here|here is link text4]]
      [[link_here|\there is link text5\t]]
      ![[link_here|\there is link text6\t]]
      [[link_here]]
    `,
            dedent`
      [[link_here|here is link text1]]
      [[link_here|here is link text2]]
      [[link_here|here is link text3]]
      [[link_here|here is link text4]]
      [[link_here|here is link text5]]
      ![[link_here|here is link text6]]
      [[link_here]]
    `,
        ),
      ],
  ),
];

export const rulesDict = rules.reduce(
    (dict, rule) => ((dict[rule.alias()] = rule), dict),
  {} as Record<string, Rule>,
);

export function registerRule(rule: Rule): void {
  rules.push(rule);
  rules.sort((a, b) => (RuleTypeOrder.indexOf(a.type) - RuleTypeOrder.indexOf(b.type)) || (a.name.localeCompare(b.name)));
  rulesDict[rule.alias()] = rule;
}

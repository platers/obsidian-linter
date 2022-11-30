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
        # h1
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
    {
      testName: 'Ignores tags',
      before: dedent`
        #tag not line
      `,
      after: dedent`
        #tag not line
      `,
      options: {
        style: 'Title Case',
      },
    },
    {
      testName: 'Can capitalize only first letter',
      before: dedent`
        # this Is A Heading
      `,
      after: dedent`
        # This is a heading
      `,
      options: {
        style: 'First letter',
      },
    },
    {
      testName: 'Can capitalize only first letter that is a - Z',
      before: dedent`
        # 1. heading attempt
        # 1 John
      `,
      after: dedent`
        # 1. Heading attempt
        # 1 John
      `,
      options: {
        style: 'First letter',
      },
    },
    {
      testName: 'Can capitalize to all caps',
      before: dedent`
        # this Is A Heading
      `,
      after: dedent`
        # THIS IS A HEADING
      `,
      options: {
        style: 'ALL CAPS',
      },
    },
    {
      testName: 'Link in heading is still present with first letter capitalization rules on',
      before: dedent`
        # Heading [[docker]]
        # Heading [docker](docker)
        # Heading ![docker](docker)
      `,
      after: dedent`
        # Heading [[docker]]
        # Heading [docker](docker)
        # Heading ![docker](docker)
      `,
      options: {
        style: 'First letter',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/321
      testName: 'Make sure non-english letters get capitalized when they are the first letter and the rule is set to capitalize the first letter',
      before: dedent`
        # état
      `,
      after: dedent`
        # État
      `,
      options: {
        style: 'First letter',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/484
      testName: 'Make sure that first letter ot be capitalized by `First Letter` is preceded by a space or tab',
      before: dedent`
        ### 1.0.0-b.4
        ### b
        # 1.0-b this is a heading
      `,
      after: dedent`
        ### 1.0.0-b.4
        ### B
        # 1.0-b This is a heading
      `,
      options: {
        style: 'First letter',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/518
      testName: `Make sure that 'I' is capitalized by default when First Letter is the style of the header `,
      before: dedent`
        ### It Is I
      `,
      after: dedent`
        ### It is I
      `,
      options: {
        style: 'First letter',
      },
    },
  ],
});

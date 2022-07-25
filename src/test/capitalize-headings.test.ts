import CapitalizeHeadings from '../rules/capitalize-headings';
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
      `,
      after: dedent`
        # h1
        ## A c++ Lan
        ## This is a Sentence.
        ## I Can't Do This
        ## Comma, Comma, Comma
        ## 1.1 The Header
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
  ],
});

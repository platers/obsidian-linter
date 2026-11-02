import AddUuidToYaml from '../src/rules/add-uuid-to-yaml';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

const generateUuid = () => '550e8400-e29b-41d4-a716-446655440000';

ruleTest({
  RuleBuilderClass: AddUuidToYaml,
  testCases: [
    {
      testName: 'Adds YAML with the UUID when there is no YAML',
      before: dedent`
        # Title
      `,
      after: dedent`
        ---
        uuid: 550e8400-e29b-41d4-a716-446655440000
        ---
        # Title
      `,
      options: {generateUuid},
    },
    {
      testName: 'Fills in the UUID when the key is present without a value',
      before: dedent`
        ---
        uuid:
        title: My New Note
        ---
      `,
      after: dedent`
        ---
        uuid: 550e8400-e29b-41d4-a716-446655440000
        title: My New Note
        ---
      `,
      options: {generateUuid},
    },
    {
      testName: 'Leaves a nested key with the same name alone',
      before: dedent`
        ---
        meta:
          id: abc
        ---
      `,
      after: dedent`
        ---
        meta:
          id: abc
        id: 550e8400-e29b-41d4-a716-446655440000
        ---
      `,
      options: {generateUuid, uuidKey: 'id'},
    },
    {
      testName: 'Leaves a key that already has a value alone',
      before: dedent`
        ---
        uuid: 123e4567-e89b-42d3-a456-426614174000
        ---
      `,
      after: dedent`
        ---
        uuid: 123e4567-e89b-42d3-a456-426614174000
        ---
      `,
      options: {generateUuid},
    },
  ],
});

describe('Add UUID to YAML default generator', () => {
  it('Generates a v4 UUID', () => {
    expect(AddUuidToYaml.getRule().apply('', {})).toMatch(/^---\nuuid: [0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\n---\n$/);
  });
});

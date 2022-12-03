import {convertYAMLStringToArray} from '../src/utils/yaml';

type YAMLStringTestCase = {
  testName: string,
  delimiter: string,
  before: string,
  after: string[],
}

const testCases: YAMLStringTestCase[] = [
  {
    testName: 'Two entry string with empty last value',
    delimiter: ',',
    before: 'value1, ',
    after: ['value1'],
  },
  {
    testName: 'A delimiter escaped with a double quote should not be counted as a delimiter',
    delimiter: ',',
    before: 'value1, "Scott, Jr.", Bob',
    after: ['value1', '"Scott, Jr."', 'Bob'],
  },
  {
    testName: 'A delimiter escaped with a single quote should not be counted as a delimiter',
    delimiter: ',',
    before: 'value1, \'Scott, Jr.\', Bob',
    after: ['value1', '\'Scott, Jr.\'', 'Bob'],
  },
  {
    testName: 'An empty string should return null',
    delimiter: ',',
    before: '',
    after: null,
  },
  {
    testName: 'A null value should return null',
    delimiter: ',',
    before: null,
    after: null,
  },
  {
    testName: 'A single single quote in the string should not result in an escaped value and it should parse it as normal',
    delimiter: ',',
    before: 'Bob, John\'s,Doug',
    after: ['Bob', 'John\'s', 'Doug'],
  },
  {
    testName: 'A single double quote in the string should not result in an escaped value and it should parse it as normal',
    delimiter: ',',
    before: 'Bob, "John,Doug',
    after: ['Bob', '"John', 'Doug'],
  },
];


describe('Parse YAML Strings to Arrays', () => {
  for (const testCase of testCases) {
    it(testCase.testName, () => {
      expect(convertYAMLStringToArray(testCase.before, testCase.delimiter)).toStrictEqual(testCase.after);
    });
  }
});

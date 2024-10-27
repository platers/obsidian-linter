import TestLinterPlugin, {IntegrationIgnoreTestCase} from './main.test';

function ignoreSetup(plugin: TestLinterPlugin): Promise<void> {
  plugin.plugin.settings.foldersToIgnore = ['ignore/test'];
  plugin.plugin.settings.filesToIgnore = [{
    'label': 'A sample file ignore test',
    'flags': '',
    'match': '.*ignore-.*\\.md',
  }];

  return;
}

export const ignoreTestCases: IntegrationIgnoreTestCase[] = [
  {
    name: 'A regular markdown file that is not in a folder to ignore or in a regex for files to ignore should not be ignored',
    filePath: 'ignore/test-not-ignored/not-ignored.md',
    setup: ignoreSetup,
    expectedShouldIgnore: false,
  },
  {
    name: 'A markdown file that matches a file regex should be ignored',
    filePath: 'ignore/ignore-markdown.md',
    setup: ignoreSetup,
    expectedShouldIgnore: true,
  },
  {
    name: 'A markdown file in a folder to ignore should be ignored',
    filePath: 'ignore/test/ignored-test.md',
    setup: ignoreSetup,
    expectedShouldIgnore: true,
  },
  {
    name: 'A markdown file in a subfolder of a folder to ignore should be ignored',
    filePath: 'ignore/test/subfolder/subfolder-test.md',
    setup: ignoreSetup,
    expectedShouldIgnore: true,
  },
  {
    name: 'A markdown file in a folder that starts with a part of the ignored folder\'s name or path should not be ignored',
    filePath: 'ignore/test-not-ignored/not-ignored.md',
    setup: ignoreSetup,
    expectedShouldIgnore: false,
  },
  {
    name: 'A pdf file should be ignored',
    filePath: 'ignore/dummy.pdf',
    setup: ignoreSetup,
    expectedShouldIgnore: true,
  },
];

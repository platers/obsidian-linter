import HeadingFilenameSync from '../src/rules/heading-filename-sync';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: HeadingFilenameSync,
  testCases: [
    {
      testName: 'Updates existing H1 to match filename',
      before: dedent`
        # Old Title
        Some content here.
      `,
      after: dedent`
        # My Note
        Some content here.
      `,
      options: {
        fileName: 'My Note',
        syncDirection: 'filename-to-heading',
      },
    },
    {
      testName: 'Inserts H1 when none exists',
      before: dedent`
        Some content without a heading.
      `,
      after: dedent`
        # My Note
        Some content without a heading.
      `,
      options: {
        fileName: 'My Note',
        syncDirection: 'filename-to-heading',
      },
    },
    {
      testName: 'Strips Zettelkasten prefix from filename',
      before: dedent`
        # Old Title
        Content here.
      `,
      after: dedent`
        # Meeting Notes
        Content here.
      `,
      options: {
        fileName: '202312151030_Meeting Notes',
        filenamePrefix: '^\\d{12}_',
        syncDirection: 'filename-to-heading',
      },
    },
    {
      testName: 'Strips suffix pattern from filename',
      before: dedent`
        # Old Title
      `,
      after: dedent`
        # Document
      `,
      options: {
        fileName: 'Document_v2',
        filenameSuffix: '_v\\d+',
        syncDirection: 'filename-to-heading',
      },
    },
    {
      testName: 'Handles invalid prefix regex gracefully',
      before: dedent`
        # Old Title
      `,
      after: dedent`
        # Test\\[File
      `,
      options: {
        fileName: 'Test[File',
        filenamePrefix: '[invalid', // Invalid regex
        syncDirection: 'filename-to-heading',
      },
    },
    {
      testName: 'Escapes markdown special characters in filename',
      before: '',
      after: dedent`
        # Escape \\[\\]
        ${''}
      `,
      options: {
        fileName: 'Escape []',
        syncDirection: 'filename-to-heading',
      },
    },
    {
      testName: 'Inserts heading after YAML frontmatter',
      before: dedent`
        ---
        tags: [note]
        ---
        Content here.
      `,
      after: dedent`
        ---
        tags: [note]
        ---
        # My Note
        Content here.
      `,
      options: {
        fileName: 'My Note',
        syncDirection: 'filename-to-heading',
      },
    },
    {
      testName: 'Does not affect H2 or lower headings',
      before: dedent`
        ## Section Header
        Content here.
      `,
      after: dedent`
        # My Note
        ## Section Header
        Content here.
      `,
      options: {
        fileName: 'My Note',
        syncDirection: 'filename-to-heading',
      },
    },
    {
      testName: 'Only updates the first H1 when multiple exist',
      before: dedent`
        # First Heading
        Some content.
        # Second Heading
        More content.
      `,
      after: dedent`
        # Updated Title
        Some content.
        # Second Heading
        More content.
      `,
      options: {
        fileName: 'Updated Title',
        syncDirection: 'filename-to-heading',
      },
    },
    {
      testName: 'Combines prefix and suffix stripping',
      before: dedent`
        # Old
      `,
      after: dedent`
        # Document Name
      `,
      options: {
        fileName: '20231215_Document Name_DRAFT',
        filenamePrefix: '^\\d{8}_',
        filenameSuffix: '_DRAFT$',
        syncDirection: 'filename-to-heading',
      },
    },
    {
      testName: 'Handles empty file',
      before: '',
      after: dedent`
        # New Note
        ${''}
      `,
      options: {
        fileName: 'New Note',
        syncDirection: 'filename-to-heading',
      },
    },
    {
      testName: 'Handles file with only YAML frontmatter',
      before: dedent`
        ---
        hello: test
        ---
      `,
      after: dedent`
        ---
        hello: test
        ---
        # Test note
        ${''}
      `,
      options: {
        fileName: 'Test note',
        syncDirection: 'filename-to-heading',
      },
    },
    {
      testName: 'Escapes underscores in filename',
      before: '',
      after: dedent`
        # \\_just underscores, not italics\\_
        ${''}
      `,
      options: {
        fileName: '_just underscores, not italics_',
        syncDirection: 'filename-to-heading',
      },
    },
    {
      testName: 'Strips 14-digit Zettelkasten prefix',
      before: dedent`
        # Old Title
      `,
      after: dedent`
        # My Note
      `,
      options: {
        fileName: '20231215103045_My Note',
        filenamePrefix: '^\\d{14}_',
        syncDirection: 'filename-to-heading',
      },
    },
    {
      testName: 'Strips date prefix',
      before: dedent`
        # Old
      `,
      after: dedent`
        # Meeting
      `,
      options: {
        fileName: '2023-12-15_Meeting',
        filenamePrefix: '^\\d{4}-\\d{2}-\\d{2}_',
        syncDirection: 'filename-to-heading',
      },
    },
    {
      testName: 'Does not match partial prefix when pattern requires full match',
      before: dedent`
        # Old
      `,
      after: dedent`
        # 12345\\_Note
      `,
      options: {
        fileName: '12345_Note',
        filenamePrefix: '^\\d{12}_', // Requires 12 digits, but only 5 present
        syncDirection: 'filename-to-heading',
      },
    },
    {
      testName: 'Heading-to-filename direction returns unchanged text (Phase 2)',
      before: dedent`
        # My Custom Heading
        Some content.
      `,
      after: dedent`
        # My Custom Heading
        Some content.
      `,
      options: {
        fileName: 'Different Filename',
        syncDirection: 'heading-to-filename',
      },
    },
    {
      testName: 'Bidirectional direction returns unchanged text (Phase 2)',
      before: dedent`
        # My Custom Heading
        Some content.
      `,
      after: dedent`
        # My Custom Heading
        Some content.
      `,
      options: {
        fileName: 'Different Filename',
        syncDirection: 'bidirectional',
      },
    },
  ],
});

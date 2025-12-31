import HeadingFilenameSync from '../src/rules/heading-filename-sync';
import dedent from 'ts-dedent';
import {ruleTest} from './common';
import {PendingRename} from '../src/rules-runner';

// Tests for rename callback
describe('HeadingFilenameSync rename callback', () => {
  const rule = HeadingFilenameSync.getRule();

  it('calls setPendingRename with correct paths for heading-to-filename', () => {
    let capturedRename: PendingRename | null = null;
    const options = {
      fileName: 'Old Name',
      filePath: 'folder/Old Name.md',
      syncDirection: 'heading-to-filename' as const,
      setPendingRename: (rename: PendingRename) => {
        capturedRename = rename;
      },
    };

    rule.apply(dedent`
      # New Heading
      Content here.
    `, options);

    expect(capturedRename).not.toBeNull();
    expect(capturedRename?.oldPath).toBe('folder/Old Name.md');
    expect(capturedRename?.newPath).toBe('folder/New Heading.md');
  });

  it('preserves prefix and suffix when renaming', () => {
    let capturedRename: PendingRename | null = null;
    const options = {
      fileName: '20231215_Old Name_DRAFT',
      filePath: 'notes/20231215_Old Name_DRAFT.md',
      filenamePrefix: '^\\d{8}_',
      filenameSuffix: '_DRAFT$',
      syncDirection: 'heading-to-filename' as const,
      setPendingRename: (rename: PendingRename) => {
        capturedRename = rename;
      },
    };

    rule.apply(dedent`
      # New Title
      Content here.
    `, options);

    expect(capturedRename).not.toBeNull();
    expect(capturedRename?.newPath).toBe('notes/20231215_New Title_DRAFT.md');
  });

  it('does not call setPendingRename when heading matches filename', () => {
    let capturedRename: PendingRename | null = null;
    const options = {
      fileName: 'Same Name',
      filePath: 'folder/Same Name.md',
      syncDirection: 'heading-to-filename' as const,
      setPendingRename: (rename: PendingRename) => {
        capturedRename = rename;
      },
    };

    rule.apply(dedent`
      # Same Name
      Content here.
    `, options);

    expect(capturedRename).toBeNull();
  });

  it('does not call setPendingRename when no H1 exists', () => {
    let capturedRename: PendingRename | null = null;
    const options = {
      fileName: 'Some File',
      filePath: 'folder/Some File.md',
      syncDirection: 'heading-to-filename' as const,
      setPendingRename: (rename: PendingRename) => {
        capturedRename = rename;
      },
    };

    rule.apply(dedent`
      ## Just H2
      Content here.
    `, options);

    expect(capturedRename).toBeNull();
  });

  it('handles files in root directory', () => {
    let capturedRename: PendingRename | null = null;
    const options = {
      fileName: 'Old Name',
      filePath: 'Old Name.md',
      syncDirection: 'heading-to-filename' as const,
      setPendingRename: (rename: PendingRename) => {
        capturedRename = rename;
      },
    };

    rule.apply(dedent`
      # New Heading
      Content.
    `, options);

    expect(capturedRename).not.toBeNull();
    expect(capturedRename?.newPath).toBe('New Heading.md');
  });

  it('sanitizes invalid filename characters', () => {
    let capturedRename: PendingRename | null = null;
    const options = {
      fileName: 'Old Name',
      filePath: 'folder/Old Name.md',
      syncDirection: 'heading-to-filename' as const,
      setPendingRename: (rename: PendingRename) => {
        capturedRename = rename;
      },
    };

    rule.apply(dedent`
      # New: Title | With "Invalid" Chars
      Content.
    `, options);

    expect(capturedRename).not.toBeNull();
    // Should sanitize : | " to - and collapse consecutive dashes
    expect(capturedRename?.newPath).toBe('folder/New- Title - With -Invalid- Chars.md');
  });

  it('collapses consecutive dashes in sanitized filename', () => {
    let capturedRename: PendingRename | null = null;
    const options = {
      fileName: 'Old Name',
      filePath: 'folder/Old Name.md',
      syncDirection: 'heading-to-filename' as const,
      setPendingRename: (rename: PendingRename) => {
        capturedRename = rename;
      },
    };

    rule.apply(dedent`
      # My::Heading::Title
      Content.
    `, options);

    expect(capturedRename).not.toBeNull();
    // :: should become - (not --)
    expect(capturedRename?.newPath).toBe('folder/My-Heading-Title.md');
  });

  it('calls setPendingRename in bidirectional mode when H1 differs', () => {
    let capturedRename: PendingRename | null = null;
    const options = {
      fileName: 'Old Name',
      filePath: 'folder/Old Name.md',
      syncDirection: 'bidirectional' as const,
      setPendingRename: (rename: PendingRename) => {
        capturedRename = rename;
      },
    };

    rule.apply(dedent`
      # Different Heading
      Content.
    `, options);

    expect(capturedRename).not.toBeNull();
    expect(capturedRename?.newPath).toBe('folder/Different Heading.md');
  });

  it('does not call setPendingRename in bidirectional mode when no H1', () => {
    let capturedRename: PendingRename | null = null;
    const options = {
      fileName: 'My Note',
      filePath: 'folder/My Note.md',
      syncDirection: 'bidirectional' as const,
      setPendingRename: (rename: PendingRename) => {
        capturedRename = rename;
      },
    };

    // Should insert H1, not rename file
    rule.apply(dedent`
      Some content without heading.
    `, options);

    expect(capturedRename).toBeNull();
  });
});

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
    // Heading-to-filename tests - text remains unchanged, rename is signaled via callback
    {
      testName: 'Heading-to-filename: text unchanged when H1 differs from filename',
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
      testName: 'Heading-to-filename: text unchanged when H1 matches filename',
      before: dedent`
        # Same Name
        Some content.
      `,
      after: dedent`
        # Same Name
        Some content.
      `,
      options: {
        fileName: 'Same Name',
        syncDirection: 'heading-to-filename',
      },
    },
    {
      testName: 'Heading-to-filename: text unchanged when no H1 exists',
      before: dedent`
        ## Just H2
        Some content.
      `,
      after: dedent`
        ## Just H2
        Some content.
      `,
      options: {
        fileName: 'Some File',
        syncDirection: 'heading-to-filename',
      },
    },
    {
      testName: 'Heading-to-filename: preserves prefix/suffix when heading differs',
      before: dedent`
        # New Title
        Content.
      `,
      after: dedent`
        # New Title
        Content.
      `,
      options: {
        fileName: '20231215_Old Title_DRAFT',
        filenamePrefix: '^\\d{8}_',
        filenameSuffix: '_DRAFT$',
        syncDirection: 'heading-to-filename',
      },
    },
    // Bidirectional tests - heading wins on conflict, inserts H1 when missing
    {
      testName: 'Bidirectional: inserts H1 when none exists (filename wins)',
      before: dedent`
        Some content without a heading.
      `,
      after: dedent`
        # My Note
        Some content without a heading.
      `,
      options: {
        fileName: 'My Note',
        syncDirection: 'bidirectional',
      },
    },
    {
      testName: 'Bidirectional: text unchanged when H1 differs (heading wins, rename signaled)',
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
    {
      testName: 'Bidirectional: text unchanged when already in sync',
      before: dedent`
        # Already Synced
        Some content.
      `,
      after: dedent`
        # Already Synced
        Some content.
      `,
      options: {
        fileName: 'Already Synced',
        syncDirection: 'bidirectional',
      },
    },
    {
      testName: 'Bidirectional: inserts H1 after YAML when none exists',
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
        syncDirection: 'bidirectional',
      },
    },
    {
      testName: 'Bidirectional: respects prefix/suffix patterns when inserting H1',
      before: dedent`
        Content without heading.
      `,
      after: dedent`
        # Meeting Notes
        Content without heading.
      `,
      options: {
        fileName: '20231215_Meeting Notes_v2',
        filenamePrefix: '^\\d{8}_',
        filenameSuffix: '_v\\d+$',
        syncDirection: 'bidirectional',
      },
    },
    {
      testName: 'Heading-to-filename: handles escaped markdown in heading',
      before: dedent`
        # Note \\[with brackets\\]
        Content.
      `,
      after: dedent`
        # Note \\[with brackets\\]
        Content.
      `,
      options: {
        fileName: 'Different Name',
        syncDirection: 'heading-to-filename',
      },
    },
  ],
});

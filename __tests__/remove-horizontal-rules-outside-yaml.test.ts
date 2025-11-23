import dedent from "ts-dedent";
import RemoveHorizontalRulesOutsideYaml from "../src/rules/remove-horizontal-rules-outside-yaml";
import { ruleTest } from "./common";

ruleTest({
  RuleBuilderClass: RemoveHorizontalRulesOutsideYaml,
  testCases: [
    {
      testName: "Removes `---` from body when YAML exists",
      before: dedent`
        ---
        prop: value
        ---
        Content before separator
        ---
        Content after separator
      `,
      after: dedent`
        ---
        prop: value
        ---
        Content before separator
        Content after separator
      `,
    },
    {
      testName: "Preserves YAML frontmatter fences exactly",
      before: dedent`
        ---
        title: My Document
        tags: [note, important]
        ---
        ---
        Some content here
      `,
      after: dedent`
        ---
        title: My Document
        tags: [note, important]
        ---
        Some content here
      `,
    },
    {
      testName: "Removes `---` from files without YAML frontmatter",
      before: dedent`
        Content before
        ---
        Content after
        ---
        More content
      `,
      after: dedent`
        Content before
        Content after
        More content
      `,
    },
    {
      testName: "Does not remove `---` from tables",
      before: dedent`
        | Column 1 | Column 2 |
        | --- | --- |
        | Data 1 | Data 2 |
      `,
      after: dedent`
        | Column 1 | Column 2 |
        | --- | --- |
        | Data 1 | Data 2 |
      `,
    },
    {
      testName: "Does not remove `---` from code blocks",
      before: dedent`
        \`\`\`
        Some code here
        ---
        More code
        \`\`\`
      `,
      after: dedent`
        \`\`\`
        Some code here
        ---
        More code
        \`\`\`
      `,
    },
    {
      testName: "Handles `---` with surrounding whitespace",
      before: dedent`
        Content before
          ---  
        Content after
      `,
      after: dedent`
        Content before
        Content after
      `,
    },
    {
      testName: "Handles multiple `---` lines in body",
      before: dedent`
        ---
        title: Test
        ---
        First section
        ---
        Second section
        ---
        Third section
      `,
      after: dedent`
        ---
        title: Test
        ---
        First section
        Second section
        Third section
      `,
    },
    {
      testName: "Handles empty file",
      before: "",
      after: "",
    },
    {
      testName: "Handles file with only YAML",
      before: dedent`
        ---
        title: Test
        ---
      `,
      after: dedent`
        ---
        title: Test
        ---
      `,
    },
    {
      testName: "Handles file with only `---` (no YAML)",
      before: dedent`
        ---
      `,
      after: dedent`
      `,
    },
    {
      testName: "Does not remove `---` when it has content on the same line",
      before: dedent`
        Some text --- more text
        ---
        Content after
      `,
      after: dedent`
        Some text --- more text
        Content after
      `,
    },
    {
      testName: "Handles YAML with empty body",
      before: dedent`
        ---
        title: Test
        ---
        ---
      `,
      after: dedent`
        ---
        title: Test
        ---
      `,
    },
    {
      testName: "Preserves YAML even when body has multiple separators",
      before: dedent`
        ---
        key: value
        another: thing
        ---
        Body content
        ---
        More body
        ---
        Final body
      `,
      after: dedent`
        ---
        key: value
        another: thing
        ---
        Body content
        More body
        Final body
      `,
    },
  ],
});

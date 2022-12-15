import {Notice} from 'obsidian';
import {TextBoxFull} from 'src/ui/components/text-box-full';
import dedent from 'ts-dedent';
import {IssueForm} from './issue-form';

export class BugIssueForm extends IssueForm {
  description: TextBoxFull;
  howToReproduce: TextBoxFull;
  before: TextBoxFull;
  after: TextBoxFull;
  expectedDescription: TextBoxFull;
  expectedContents: TextBoxFull;
  additionalContext: TextBoxFull;
  constructor(containerEl: HTMLElement, private configDisplay: TextBoxFull) {
    super(containerEl);
    this.display();
  }

  display() {
    this.description = new TextBoxFull(this.containerEl, 'Bug Description', 'The description of the bug including things like what rule is involved in the issue.', false);
    this.howToReproduce = new TextBoxFull(this.containerEl, 'How to Reproduce', 'The steps to reproduce the issue being reported.', false);
    this.before = new TextBoxFull(this.containerEl, 'File Contents Before Lint', '', false);
    this.after = new TextBoxFull(this.containerEl, 'File Contents After Lint', '', false);
    this.expectedDescription = new TextBoxFull(this.containerEl, 'Description of Expected File Contents After Lint', '', false);
    this.expectedContents = new TextBoxFull(this.containerEl, 'Expected File Contents After Lint', '', false);
    this.additionalContext = new TextBoxFull(this.containerEl, 'Additional Context', 'Any additional information that you believe would help in understanding the problem.', false);
  }

  buildIssueBody() {
    const issueDescription = this.description.getInput().trim();
    if (issueDescription == '') {
      new Notice('The bug description must be present.', 0);
      return;
    }

    const howToReproduceDescription = this.howToReproduce.getInput().trim();
    const before = this.before.getInput();
    const after = this.after.getInput();
    if (howToReproduceDescription == '' && (before == '' || after == '')) {
      new Notice('The how to reproduce instructions or the file before and after contents are needed.', 0);
      return;
    }

    let howToReproduceInfo = ``;
    if (howToReproduceDescription != '') {
      howToReproduceInfo += '\n' + howToReproduceDescription;
    }

    if (before != '') {
      howToReproduceInfo += `\n
      
      \`\`\` markdown
      ${before}
      \`\`\`
      
      \`\`\` markdown
      ${after}
      \`\`\`
      
      \`data.json\`:
      \`\`\` JSON
      ${this.configDisplay.getInput().trim()}
      \`\`\``;
    }

    const expectedDescription = this.expectedDescription.getInput().trim();
    const expected = this.expectedContents.getInput();
    if (expectedDescription == '' && expected == '') {
      new Notice('The expected outcome instructions or the expected file contents are needed.', 0);
      return;
    }

    let expectedInfo = ``;
    if (expectedDescription != '') {
      expectedInfo += '\n' + expectedDescription;
    }

    if (expected != '') {
      expectedInfo += `\n
      
      \`\`\` markdown
      ${expected}
      \`\`\``;
    }

    const additionalInfo = this.additionalContext.getInput().trim() ?? 'Add any other context about the problem here.';

    return dedent`
      ## Describe the Bug
    
      ${issueDescription}

      ## How to Reproduce
      ${howToReproduceInfo}

      ## Expected Behavior
      ${expectedInfo}

      ## Screenshots

      If applicable, add screenshots to help explain your problem.

      ## Device

      - [ ] Desktop
      - [ ] Mobile

      ## Additional Context

      ${additionalInfo}

    `;
  }
}

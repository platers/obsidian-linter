import {Notice} from 'obsidian';
import {TextBoxFull} from 'src/ui/components/text-box-full';
import dedent from 'ts-dedent';
import {IssueForm} from './issue-form';

export class FeatureRequestIssueForm extends IssueForm {
  featureRequestProblem: TextBoxFull;
  desiredSolution: TextBoxFull;
  before: TextBoxFull;
  after: TextBoxFull;
  otherThingsTried: TextBoxFull;
  additionalContext: TextBoxFull;
  constructor(containerEl: HTMLElement) {
    super(containerEl);
    this.display();
  }

  display() {
    this.featureRequestProblem = new TextBoxFull(this.containerEl, 'Problem You are Trying to Solve', 'The description of the problem you are trying to solve with this feature.', false);
    this.desiredSolution = new TextBoxFull(this.containerEl, 'Desired Solution for Problem', '', false);
    this.before = new TextBoxFull(this.containerEl, 'File Contents Before Lint', '', false);
    this.after = new TextBoxFull(this.containerEl, 'Expected File Contents After Lint', '', false);
    this.otherThingsTried = new TextBoxFull(this.containerEl, 'Other Solutions You Have Tried', '', false);
    this.additionalContext = new TextBoxFull(this.containerEl, 'Additional Context', 'Any additional information that you believe would help in understanding the problem.', false);
  }

  buildIssueBody() {
    const problemDescription = this.featureRequestProblem.getInput().trim();
    if (problemDescription == '') {
      new Notice('The feature request problem description must be present.', 0);
      return;
    }

    const desiredSolutionDescription = this.desiredSolution.getInput().trim();
    const before = this.before.getInput();
    const after = this.after.getInput();
    if (desiredSolutionDescription == '' && (before == '' || after == '')) {
      new Notice('The desired solution description or the file before and after contents are needed. Preferably both will present where possible.', 0);
      return;
    }

    if ((before != '' && after == '') || (before == '' && after != '')) {
      new Notice('The file contents before lint and the expected outcome after linting must both be present when one of them is provided.', 0);
      return;
    }

    let desiredSolutionInfo = ``;
    if (desiredSolutionDescription != '') {
      desiredSolutionInfo += '\n' + desiredSolutionDescription;
    }

    if (before != '') {
      desiredSolutionInfo += `\n
      
      \`\`\` markdown
      ${before}
      \`\`\`
      
      \`\`\` markdown
      ${after}
      \`\`\``;
    }

    const alternativesDescription = this.otherThingsTried.getInput().trim() ?? 'N/A';

    const additionalInfo = this.additionalContext.getInput().trim() ?? 'Add any other context or screenshots about the feature request here.';

    return dedent`
      ## Is Your Feature Request Related to a Problem? Please Describe.
    
      ${problemDescription}

      ## Describe the Solution You'd Like
      ${desiredSolutionInfo}

      ## Describe Alternatives You've Considered
      ${alternativesDescription}

      ## Additional Context

      ${additionalInfo}

    `;
  }
}

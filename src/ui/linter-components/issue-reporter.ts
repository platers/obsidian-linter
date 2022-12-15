import {Setting} from 'obsidian';
import {TextBoxFull} from '../components/text-box-full';
import {BugIssueForm} from './issue-forms/bug-issue-form';
import {FeatureRequestIssueForm} from './issue-forms/feature-request-issue-form';
import {IssueForm} from './issue-forms/issue-form';

enum SupportedIssueTypes {
  Bug = 'Bug',
  FeatureRequest = 'Feature Requests',
}

const titlePrefix: Record<SupportedIssueTypes, string> = {
  [SupportedIssueTypes.Bug]: 'Bug:',
  [SupportedIssueTypes.FeatureRequest]: 'FR:',
} as const;

export class IssueReporter {
  titleSetting: Setting;
  formTypeSetting: Setting;
  formType = SupportedIssueTypes.Bug;
  formTypeContent: HTMLDivElement;
  forms: Record<SupportedIssueTypes, IssueForm>;
  constructor(public containerEl: HTMLDivElement, private configDisplay: TextBoxFull) {
    this.display();
  }

  display() {
    this.formTypeSetting = new Setting(this.containerEl)
        .setName('Issue Type')
        .addDropdown((dropdown) => {
          Object.values(SupportedIssueTypes).forEach((issueType) => {
            dropdown.addOption(issueType, issueType);
          });
          dropdown.setValue(this.formType);
          dropdown.onChange(async (value) => {
            this.forms[this.formType].hide();
            this.formType = value as SupportedIssueTypes;
            this.forms[this.formType].show();
          });
        });

    this.titleSetting = new Setting(this.containerEl)
        .setName('Issue Title')
        .addText((textbox) => {
          textbox
              .setValue(titlePrefix[this.formType] + ' ');
        });

    this.formTypeContent = this.containerEl.createDiv();
    this.forms = {
      [SupportedIssueTypes.Bug]: new BugIssueForm(this.formTypeContent.createDiv(), this.configDisplay),
      [SupportedIssueTypes.FeatureRequest]: new FeatureRequestIssueForm(this.formTypeContent.createDiv()),
    };
    this.forms[this.formType].show();

    new Setting(this.containerEl).addButton((btn)=>{
      btn.setButtonText('Generate Link to Create a Github Issue')
          .setCta();
      // TODO: generate link for creating a github issue based info from the forms
      // .onClick(() => this.onAddInput());
    });
  }
}

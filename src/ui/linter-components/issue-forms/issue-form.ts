import {hideEl, unhideEl} from 'src/ui/helpers';

export abstract class IssueForm {
  constructor(public containerEl: HTMLElement) {
    this.hide();
  }

  hide() {
    hideEl(this.containerEl);
  }

  show() {
    unhideEl(this.containerEl);
  }

  abstract display(): void;

  abstract buildIssueBody(): string;
}

import {setIcon} from 'obsidian';

export class TextBoxFull {
  nameEl: HTMLDivElement;
  descEl: HTMLDivElement;
  inputContainerEl: HTMLDivElement;
  inputEl: HTMLTextAreaElement;
  copyEl: HTMLDivElement;
  copyIconEl: HTMLSpanElement;
  constructor(public containerEl: HTMLElement, private name: string, private description: string, private disabled: boolean = true) {
    this.display();
  }

  display() {
    const settingEl = this.containerEl.createDiv();
    const infoEl = settingEl.createDiv('setting-item-info');

    this.nameEl = infoEl.createDiv('setting-item-name');
    this.nameEl.setText(this.name);

    this.descEl = infoEl.createDiv('setting-item-description');
    this.descEl.setText(this.description);

    this.inputContainerEl = settingEl.createDiv('full-width-textbox-input-wrapper');
    this.inputContainerEl.onmouseover = () => {
      this.copyEl.removeClass('linter-visually-hidden');
    };
    this.inputContainerEl.onmouseleave = () => {
      this.copyEl.addClass('linter-visually-hidden');
    };
    this.inputEl = this.inputContainerEl.createEl('textarea', {cls: 'full-width'});
    this.inputEl.spellcheck = false;
    this.inputEl.disabled = this.disabled;

    this.copyEl = this.inputContainerEl.createDiv({'cls': 'settings-copy-button linter-visually-hidden ', 'attr': {'aria-label': 'Copy'}});
    this.copyIconEl = this.copyEl.createSpan();
    setIcon(this.copyIconEl, 'linter-clipboard');
    this.copyIconEl.onclick = () => {
      this.handleCopy(this.copyIconEl);
    };
  }

  getInput(): string {
    return this.inputEl.value;
  }

  handleCopy(copyEl: HTMLSpanElement) {
    navigator.clipboard.writeText(this.getInput()).then(() => {
      setIcon(copyEl, 'linter-success');
      setTimeout(() => {
        setIcon(copyEl, 'linter-clipboard');
      }, 1500);
    }, () => {
      this.copyEl.innerText = 'Error';
    });
  }
}

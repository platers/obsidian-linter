export class TextBoxFull {
  nameEl: HTMLDivElement;
  descEl: HTMLDivElement;
  inputEl: HTMLTextAreaElement;
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

    this.inputEl = settingEl.createDiv().createEl('textarea', {cls: 'full-width'});
    this.inputEl.spellcheck = false;
    this.inputEl.disabled = this.disabled;
  }

  getInput(): string {
    return this.inputEl.getText();
  }
}

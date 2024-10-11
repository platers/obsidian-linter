import {App, Setting} from 'obsidian';
import {setElContent} from '../helpers';

/**
 * AddCustomRow is meant to be used where you have a setting that needs a name a description, possibly a warning,
 * and a button that allows the user to add another entry.
 */
export abstract class AddCustomRow {
  protected inputElDiv: HTMLDivElement;

  constructor(
    public containerEl: HTMLElement,
    public name: string,
    public description: string,
    public warning: string,
    private addInputBtnText: string,
    protected app: App,
    protected saveSettings: () => void,
    private onAddInput: () => void) {
  }

  display() {
    this.containerEl.createDiv({cls: 'setting-item-name', text: this.name});

    const descriptionAndWarningContainer = this.containerEl.createDiv({cls: 'setting-item-description'});
    setElContent(this.description, descriptionAndWarningContainer.createEl('p', {cls: 'custom-row-description'}));

    new Setting(this.containerEl)
        .addButton((cb)=>{
          cb.setIcon('plus-with-circle')
              .setTooltip(this.addInputBtnText)
              .onClick(() => this.onAddInput());
          cb.buttonEl.addClass('clickable-icon');
        })
        .setClass('linter-border-bottom')
        .setDesc(this.warning ?? '')
        .descEl.addClass('mod-warning');

    this.inputElDiv = this.containerEl.createDiv();
    this.showInputEls();
  }

  protected resetInputEls() {
    this.inputElDiv.empty();
    this.showInputEls();
  }

  protected abstract showInputEls(): void;
}

import {Setting, App} from 'obsidian';
import {parseTextToHTMLWithoutOuterParagraph} from '../helpers';
export type CustomReplace = {find: string, replace: string, flags: string};

const defaultFlags = 'gm';

export class CustomReplaceOption {
  name = 'Custom Regex Replacement';
  description = `Custom regex replacement can be used to replace anything that matches the find regex with the replacement value. The replace and find values will need to be valid regex values.`;
  warning = `Please make sure that you do not use negative lookbehinds ("(?!*)") in your regex on iOS mobile as that will cause linting to fail as that is not supported on mobile.`;

  constructor(public containerEl: HTMLElement, public regexes: CustomReplace[], private isMobile: boolean, private app: App, private saveSettings: () => void) {
    this.display();
  }

  display() {
    this.containerEl.createEl(this.isMobile ? 'h4' : 'h3', {text: this.name});

    parseTextToHTMLWithoutOuterParagraph(this.description, this.containerEl);
    this.containerEl.createEl('p', {text: this.warning}).style.color = '#EED202';

    new Setting(this.containerEl)
        .addButton((cb)=>{
          cb.setButtonText('Add new regex replacement')
              .setCta()
              .onClick(()=>{
                const newRegex = {find: '', replace: '', flags: ''};
                this.regexes.push(newRegex);
                this.saveSettings();
                this.addRegex(newRegex, this.regexes.length - 1, true);
              });
        });

    this.regexes.forEach((regex, index) => {
      this.addRegex(regex, index);
    });
  }

  private addRegex(regex: CustomReplace, index: number, focusOnCommand: boolean = false) {
    let flags = regex.flags;
    if (!flags || flags.trim() == '') {
      flags = defaultFlags;
    }

    new Setting(this.containerEl).addText((cb) => {
      cb.setPlaceholder('regex to find')
          .setValue(regex.find)
          .onChange((value) => {
            this.regexes[index].find = value;
            this.saveSettings();
          });
      cb.inputEl.setAttr('inputIndex', index);
      cb.inputEl.addClass('linter-custom-regex-replacement');

      if (focusOnCommand) {
        cb.inputEl.focus();
      }
    }).addText((cb) => {
      cb.setPlaceholder('flags')
          .setValue(flags)
          .onChange((value) => {
            this.regexes[index].flags = value;
            this.saveSettings();
          });
    }).addText((cb) => {
      cb.setPlaceholder('regex to replace')
          .setValue(regex.replace)
          .onChange((value) => {
            this.regexes[index].replace = value;
            this.saveSettings();
          });
    }).addExtraButton((cb)=>{
      cb.setIcon('cross')
          .setTooltip('Delete')
          .onClick(()=>{
            this.regexes.splice(index, 1);
            this.saveSettings();
            this.resetDisplay();
          });
    });
  }

  private resetDisplay() {
    this.containerEl.innerHTML = '';
    this.display();
  }
}

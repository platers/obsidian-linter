import {App, Setting} from 'obsidian';
import {getTextInLanguage} from 'src/lang/helpers';
import {AddCustomRow} from '../components/add-custom-row';
export type CustomReplace = {label: string, find: string, replace: string, flags: string, enabled: boolean};

const defaultFlags = 'gm';

export class CustomReplaceOption extends AddCustomRow {
  constructor(containerEl: HTMLElement, public regexes: CustomReplace[], app: App, saveSettings: () => void) {
    super(
        containerEl,
        getTextInLanguage('options.custom-replace.name'),
        getTextInLanguage('options.custom-replace.description'),
        getTextInLanguage('options.custom-replace.warning'),
        getTextInLanguage('options.custom-replace.add-input-button-text'),
        app,
        saveSettings,
        ()=>{
          const newRegex = {label: '', find: '', replace: '', flags: defaultFlags, enabled: true};
          this.regexes.push(newRegex);
          this.saveSettings();
          this.addRegex(newRegex, this.regexes.length - 1, true);
        });
    this.display();
    this.inputElDiv.addClass('linter-custom-regex-replacement-container');
  }

  protected showInputEls(): void {
    this.regexes.forEach((regex, index) => {
      this.addRegex(regex, index);
    });
  }

  private addRegex(regex: CustomReplace, index: number, focusOnCommand: boolean = false) {
    const newRegexDiv = this.inputElDiv.createDiv({cls: 'linter-custom-regex-replacement'});
    const row1 = newRegexDiv.createDiv();
    const labelSetting = new Setting(row1).addText((cb) => {
      cb.setPlaceholder(getTextInLanguage('options.custom-replace.label-placeholder-text'))
          .setValue(regex.label)
          .onChange((value) => {
            this.regexes[index].label = value;
            this.saveSettings();
          });

      cb.inputEl.setAttr('inputIndex', index);
      cb.inputEl.addClass('linter-custom-regex-replacement-label-input');

      if (focusOnCommand) {
        cb.inputEl.focus();
      }
    });

    labelSetting.controlEl.addClass('linter-custom-regex-replacement-label');
    labelSetting.descEl.remove();
    labelSetting.infoEl.remove();
    labelSetting.nameEl.remove();

    const row2 = newRegexDiv.createDiv();

    const setting = new Setting(row2).addText((cb) => {
      cb.setPlaceholder(getTextInLanguage('options.custom-replace.regex-to-find-placeholder-text'))
          .setValue(regex.find)
          .onChange((value) => {
            this.regexes[index].find = value;
            this.saveSettings();
          });

      cb.inputEl.addClass('linter-custom-regex-replacement-normal-input');
    }).addText((cb) => {
      cb.setPlaceholder(getTextInLanguage('options.custom-replace.flags-placeholder-text'))
          .setValue(regex.flags)
          .onChange((value) => {
            this.regexes[index].flags = value;
            this.saveSettings();
          });

      cb.inputEl.addClass('linter-custom-regex-replacement-flags');
    }).addText((cb) => {
      cb.setPlaceholder(getTextInLanguage('options.custom-replace.regex-to-replace-placeholder-text'))
          .setValue(regex.replace)
          .onChange((value) => {
            this.regexes[index].replace = value;
            this.saveSettings();
          });

      cb.inputEl.addClass('linter-custom-regex-replacement-normal-input');
    }).addExtraButton((cb) => {
      cb.setIcon('up-chevron-glyph')
          .setTooltip(getTextInLanguage('options.custom-replace.move-up-tooltip'))
          .onClick(() => {
            this.arrayMove(index, index - 1);
            this.saveSettings();
            this.resetInputEls();
          });
    }).addExtraButton((cb) => {
      cb.setIcon('down-chevron-glyph')
          .setTooltip(getTextInLanguage('options.custom-replace.move-down-tooltip'))
          .onClick(() => {
            this.arrayMove(index, index + 1);
            this.saveSettings();
            this.resetInputEls();
          });
    }).addExtraButton((cb)=>{
      cb.setIcon('trash')
          .setTooltip(getTextInLanguage('options.custom-replace.delete-tooltip'))
          .onClick(()=>{
            this.regexes.splice(index, 1);
            this.saveSettings();
            this.resetInputEls();
          });
    }).addToggle((cb) => {
      cb.setValue(regex.enabled)
          .onChange((status: boolean) => {
            regex.enabled = status;
          });
    });

    setting.settingEl.addClass('linter-custom-regex-replacement-row2');
  }

  // TODO: swap this out for something that actually swaps the values of the html elements as well to avoid the need for a refresh of these settings on swap and delete
  private arrayMove(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex === this.regexes.length) {
      return;
    }

    const element = this.regexes[fromIndex];
    this.regexes[fromIndex] = this.regexes[toIndex];
    this.regexes[toIndex] = element;
  }
}

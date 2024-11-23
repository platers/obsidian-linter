import {App, Setting} from 'obsidian';
import {getTextInLanguage} from 'src/lang/helpers';
import {AddCustomRow} from '../components/add-custom-row';
export type FileToIgnore = {label: string, match: string, flags: string};

const defaultFlags = 'i';

export class FilesToIgnoreOption extends AddCustomRow {
  constructor(containerEl: HTMLElement, public filesToIgnore: FileToIgnore[], app: App, saveSettings: () => void) {
    super(
        containerEl,
        getTextInLanguage('tabs.general.files-to-ignore.name'),
        getTextInLanguage('tabs.general.files-to-ignore.description'),
        getTextInLanguage('tabs.general.files-to-ignore.warning'),
        getTextInLanguage('tabs.general.files-to-ignore.add-input-button-text'),
        app,
        saveSettings,
        ()=>{
          const newRegex = {label: '', match: '', flags: defaultFlags};
          this.filesToIgnore.push(newRegex);
          this.saveSettings();
          this.addFileToIgnore(newRegex, this.filesToIgnore.length - 1, true);
        });
    this.display();
    this.inputElDiv.addClass('linter-files-to-ignore-container');
  }

  protected showInputEls(): void {
    this.filesToIgnore.forEach((regex, index) => {
      this.addFileToIgnore(regex, index);
    });
  }

  private addFileToIgnore(regex: FileToIgnore, index: number, focusOnCommand: boolean = false) {
    const newRegexDiv = this.inputElDiv.createDiv({cls: 'linter-files-to-ignore'});
    new Setting(newRegexDiv).addText((cb) => {
      cb.setPlaceholder(getTextInLanguage('tabs.general.files-to-ignore.label-placeholder-text'))
          .setValue(regex.label)
          .onChange((value) => {
            this.filesToIgnore[index].label = value;
            this.saveSettings();
          });

      cb.inputEl.addClass('linter-files-to-ignore-normal-input');
      if (focusOnCommand) {
        cb.inputEl.focus();
      }
    }).addText((cb) => {
      cb.setPlaceholder(getTextInLanguage('tabs.general.files-to-ignore.file-search-placeholder-text'))
          .setValue(regex.match)
          .onChange((value) => {
            this.filesToIgnore[index].match = value;
            this.saveSettings();
          });

      cb.inputEl.addClass('linter-files-to-ignore-normal-input');
    }).addText((cb) => {
      cb.setPlaceholder(getTextInLanguage('tabs.general.files-to-ignore.flags-placeholder-text'))
          .setValue(regex.flags)
          .onChange((value) => {
            this.filesToIgnore[index].flags = value;
            this.saveSettings();
          });

      cb.inputEl.addClass('linter-files-to-ignore-flags');
    }).addExtraButton((cb)=>{
      cb.setIcon('trash')
          .setTooltip(getTextInLanguage('tabs.general.files-to-ignore.delete-tooltip'))
          .onClick(()=>{
            this.filesToIgnore.splice(index, 1);
            this.saveSettings();
            this.resetInputEls();
          });
    });
  }
}

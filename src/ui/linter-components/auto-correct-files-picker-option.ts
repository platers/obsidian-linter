import {Setting, Component, App, TFile, normalizePath} from 'obsidian';
import {LanguageStringKey, getTextInLanguage} from '../../lang/helpers';
import {AddCustomRow} from '../components/add-custom-row';
import MdFileSuggester from '../suggesters/md-file-suggester';
import {parseCustomReplacements, stripCr} from '../../utils/strings';
import {ParseResultsModal} from '../modals/parse-results-modal';

export type CustomAutoCorrectContent = {filePath: string, customReplacements: Map<string, string>};

export class AutoCorrectFilesPickerOption extends AddCustomRow {
  private selectedFiles: string[] = [];

  constructor(containerEl: HTMLElement, parentComponent: Component, public filesPicked: CustomAutoCorrectContent[], private app: App, saveSettings: () => void, name: LanguageStringKey, description: LanguageStringKey) {
    super(
        containerEl,
        parentComponent,
        getTextInLanguage(name),
        getTextInLanguage(description),
        null,
        getTextInLanguage('options.custom-auto-correct.add-input-button-text'),
        saveSettings,
        ()=>{
          this.selectedFiles = [];
          for (const filePicked of this.filesPicked) {
            this.selectedFiles.push(filePicked.filePath);
          }

          const newPickedFile: CustomAutoCorrectContent = {filePath: '', customReplacements: null};
          this.filesPicked.push(newPickedFile);
          this.selectedFiles.push('');
          this.saveSettings();
          this.addPickedFile(newPickedFile, this.filesPicked.length - 1, true);
        });
    this.display();
    this.inputElDiv.addClass('linter-folder-ignore-container');
  }

  protected showInputEls(): void {
    this.filesPicked.forEach((pickedFile, index) => {
      this.addPickedFile(pickedFile, index);
    });
  }

  private addPickedFile(pickedFile: CustomAutoCorrectContent, index: number, focusOnCommand: boolean = false) {
    const setting = new Setting(this.inputElDiv)
        .addSearch((cb) => {
          new MdFileSuggester(this.app, cb.inputEl, this.selectedFiles);
          cb.setPlaceholder(getTextInLanguage('options.custom-auto-correct.file-search-placeholder-text'))
              .setValue(pickedFile.filePath)
              .onChange(async (newPickedFile) => {
                const customReplacementFile = newPickedFile;

                if (customReplacementFile === '' || customReplacementFile === cb.inputEl.getAttribute('fileName')) {
                  const file = this.getFileFromPath(customReplacementFile);
                  pickedFile.filePath = customReplacementFile;
                  if (file) {
                    pickedFile.customReplacements = parseCustomReplacements(stripCr(await this.app.vault.read(file)));
                  } else {
                    pickedFile.customReplacements = null;
                  }

                  this.filesPicked[index] = pickedFile;
                  this.saveSettings();
                }
              });

          cb.inputEl.setAttr('tabIndex', index);
          cb.inputEl.addClass('linter-folder-ignore');

          if (focusOnCommand) {
            cb.inputEl.focus();
          }
        })
        .addExtraButton((cb) => {
          cb.setIcon('info')
              .setTooltip(getTextInLanguage('options.custom-auto-correct.show-parsed-contents-tooltip'))
              .onClick(() => {
                new ParseResultsModal(this.app, pickedFile).open();
              });
        })
        .addExtraButton((cb) => {
          cb.setIcon('cross')
              .setTooltip(getTextInLanguage('options.custom-auto-correct.delete-tooltip'))
              .onClick(() => {
                this.filesPicked.splice(index, 1);
                this.saveSettings();
                this.resetInputEls();
              });
        });

    setting.settingEl.addClass('linter-no-border');
  }

  private getFileFromPath(filePath: string): TFile {
    const file = this.app.vault.getAbstractFileByPath(normalizePath(filePath));
    if (file instanceof TFile) {
      return file;
    }

    return null;
  }
}

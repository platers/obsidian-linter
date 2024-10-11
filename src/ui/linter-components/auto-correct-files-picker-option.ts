import {Setting, App, TFile, normalizePath, ExtraButtonComponent} from 'obsidian';
import {LanguageStringKey, getTextInLanguage} from '../../lang/helpers';
import {AddCustomRefreshableRow} from '../components/add-custom-refreshable-row';
import MdFileSuggester from '../suggesters/md-file-suggester';
import {parseCustomReplacements, stripCr} from '../../utils/strings';
import {ParseResultsModal} from '../modals/parse-results-modal';

export type CustomAutoCorrectContent = {filePath: string, customReplacements: Map<string, string>};

export class AutoCorrectFilesPickerOption extends AddCustomRefreshableRow {
  private selectedFiles: string[] = [];

  constructor(containerEl: HTMLElement, public filesPicked: CustomAutoCorrectContent[], app: App, saveSettings: () => void, name: LanguageStringKey, description: LanguageStringKey) {
    super(
        containerEl,
        getTextInLanguage(name),
        getTextInLanguage(description),
        getTextInLanguage('options.custom-auto-correct.warning-text').replace('{NAME}', getTextInLanguage('rules.auto-correct-common-misspellings.name')),
        getTextInLanguage('options.custom-auto-correct.add-new-replacement-file-tooltip'),
        getTextInLanguage('options.custom-auto-correct.refresh-tooltip-text'),
        app,
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
        },
        async () => {
          for (const replacementFileInfo of this.filesPicked) {
            if (replacementFileInfo.filePath != '') {
              const file = this.getFileFromPath(replacementFileInfo.filePath);
              if (file) {
                replacementFileInfo.customReplacements = parseCustomReplacements(stripCr(await this.app.vault.cachedRead(file)));
              }
            }
          }
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
    let showCustomParseContentButton: ExtraButtonComponent;
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
                    showCustomParseContentButton.disabled = false;
                    showCustomParseContentButton.extraSettingsEl.addClass('clickable-icon');
                  } else {
                    showCustomParseContentButton.disabled = true;
                    pickedFile.customReplacements = null;
                    showCustomParseContentButton.extraSettingsEl.removeClass('clickable-icon');
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
          showCustomParseContentButton = cb;
          cb.setIcon('info')
              .setTooltip(getTextInLanguage('options.custom-auto-correct.show-parsed-contents-tooltip'))
              .onClick(() => {
                new ParseResultsModal(this.app, pickedFile).open();
              });

          if (pickedFile.filePath === '') {
            cb.disabled = true;
            cb.extraSettingsEl.removeClass('clickable-icon');
          }
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

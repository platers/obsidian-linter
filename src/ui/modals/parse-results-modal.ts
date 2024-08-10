import {Modal, App} from 'obsidian';
import {getTextInLanguage} from 'src/lang/helpers';
import {CustomAutoCorrectContent} from '../linter-components/auto-correct-files-picker-option';

// https://github.com/nothingislost/obsidian-workspaces-plus/blob/bbba928ec64b30b8dec7fe8fc9e5d2d96543f1f3/src/modal.ts#L68
export class ParseResultsModal extends Modal {
  constructor(app: App, customAutoCorrectionInfo: CustomAutoCorrectContent) {
    super(app);
    this.modalEl.addClass('confirm-modal');

    this.contentEl.createEl('h3', {text: getTextInLanguage('parse-results-heading-text')}).style.textAlign = 'center';

    this.contentEl.createEl('p', {text: getTextInLanguage('file-parse-description-text').replace('{FILE}', customAutoCorrectionInfo.filePath)}).id = 'confirm-dialog';

    const tableEl = this.contentEl.createDiv().createEl('table', {cls: 'markdown-rendered'});
    const tableHeaderEl = tableEl.createEl('tr');
    tableHeaderEl.createEl('th', {text: getTextInLanguage('find-header-text')});
    tableHeaderEl.createEl('th', {text: getTextInLanguage('replace-header-text')});

    let tableRow: HTMLElement;
    for (const replacementInfo of customAutoCorrectionInfo.customReplacements) {
      tableRow = tableEl.createEl('tr');
      tableRow.createEl('td', {text: replacementInfo[0]});
      tableRow.createEl('td', {text: replacementInfo[1]});
    }

    this.contentEl.createDiv('modal-button-container', (buttonsEl) => {
      buttonsEl.createEl('button', {text: getTextInLanguage('close-button-text')}).addEventListener('click', () => this.close());
    });
  }
}

// function createParseResultsTable(customAutoCorrectionInfo: CustomAutoCorrectContent) {}

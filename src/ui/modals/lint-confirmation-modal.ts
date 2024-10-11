import {Notice, Modal, App} from 'obsidian';
import {getTextInLanguage} from 'src/lang/helpers';

// https://github.com/nothingislost/obsidian-workspaces-plus/blob/bbba928ec64b30b8dec7fe8fc9e5d2d96543f1f3/src/modal.ts#L68
export class LintConfirmationModal extends Modal {
  constructor(app: App, startModalMessageText: string, submitBtnText: string,
      submitBtnNoticeText: string, btnSubmitAction: () => Promise<void>, showCustomCommandWarning: boolean = false) {
    super(app);
    this.modalEl.addClass('confirm-modal');

    this.contentEl.createEl('h3', {text: getTextInLanguage('warning-text'), cls: 'modal-heading'});

    if (showCustomCommandWarning) {
      this.contentEl.createEl('p', {text: getTextInLanguage('custom-command-warning'), cls: 'modal-warn'});
    }

    this.contentEl.createEl('p',
        {text: startModalMessageText + ' ' + getTextInLanguage('file-backup-text')}).id = 'confirm-dialog';

    this.contentEl.createDiv('modal-button-container', (buttonsEl) => {
      buttonsEl.createEl('button', {text: getTextInLanguage('cancel-button-text')}).addEventListener('click', () => this.close());

      const btnSubmit = buttonsEl.createEl('button', {
        attr: {type: 'submit'},
        cls: 'mod-cta',
        text: submitBtnText,
      });
      btnSubmit.addEventListener('click', async (_e) => {
        new Notice(submitBtnNoticeText);
        this.close();
        await btnSubmitAction();
      });
      setTimeout(() => {
        btnSubmit.focus();
      }, 50);
    });
  }
}

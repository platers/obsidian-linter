import {Notice, Modal, App} from 'obsidian';
import {getTextInLanguage} from 'src/lang/helpers';
import {setElContent} from '../helpers';

// https://github.com/nothingislost/obsidian-workspaces-plus/blob/bbba928ec64b30b8dec7fe8fc9e5d2d96543f1f3/src/modal.ts#L68
export class LintConfirmationModal extends Modal {
  constructor(app: App, notice: string, submitBtnNoticeText: string, btnSubmitAction: () => Promise<void>) {
    super(app);
    this.modalEl.addClass('confirm-modal');

    this.contentEl.createEl('h3', {text: getTextInLanguage('warning-text'), cls: 'modal-heading'});

    const noticeEl = this.contentEl.createEl('p');
    noticeEl.id = 'confirm-dialog';

    setElContent(notice, noticeEl);

    this.contentEl.createDiv('modal-button-container', (buttonsEl) => {
      buttonsEl.createEl('button', {text: getTextInLanguage('cancel-button-text')}).addEventListener('click', () => this.close());

      const btnSubmit = buttonsEl.createEl('button', {
        attr: {type: 'submit'},
        cls: 'mod-cta',
        text: 'Submit',
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

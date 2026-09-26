import {Modal, App} from 'obsidian';
import {getTextInLanguage, LanguageStringKey} from '../../lang/helpers';
import {setElContent} from '../helpers';

// https://github.com/nothingislost/obsidian-workspaces-plus/blob/bbba928ec64b30b8dec7fe8fc9e5d2d96543f1f3/../../modal.ts#L68
export class ConfirmRuleDisableModal extends Modal {
  constructor(app: App, ruleBeingEnabledName: LanguageStringKey, ruleBeingDisabledName: LanguageStringKey, btnSubmitAction: () => Promise<void>, btnCancelAction: () => Promise<void>) {
    super(app);
    this.modalEl.addClass('confirm-modal');

    this.contentEl.createEl('h3', {text: getTextInLanguage('warning-text'), cls: 'modal-heading'});

    const noticeEl = this.contentEl.createEl('p');
    noticeEl.id = 'confirm-dialog';

    setElContent(getTextInLanguage('disabled-other-rule-notice').replace('{NAME_1}', getTextInLanguage(ruleBeingEnabledName)).replace('{NAME_2}', getTextInLanguage(ruleBeingDisabledName)), noticeEl);

    this.contentEl.createDiv('modal-button-container', (buttonsEl) => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- I don't have control over this, so we may as well ignore the promise mismatch
      buttonsEl.createEl('button', {text: getTextInLanguage('cancel-button-text')}).addEventListener('click', async () => {
        await btnCancelAction();
        this.close();
      });

      const btnSubmit = buttonsEl.createEl('button', {
        attr: {type: 'submit'},
        cls: 'mod-cta',
        text: getTextInLanguage('ok'),
      });
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- I don't have control over this, so we may as well ignore the promise mismatch
      btnSubmit.addEventListener('click', async () => {
        this.close();
        await btnSubmitAction();
      });
      window.setTimeout(() => {
        btnSubmit.focus();
      }, 50);
    });
  }
}

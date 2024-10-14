import {Modal, App} from 'obsidian';
import {getTextInLanguage, LanguageStringKey} from 'src/lang/helpers';
import {setElContent} from '../helpers';

// https://github.com/nothingislost/obsidian-workspaces-plus/blob/bbba928ec64b30b8dec7fe8fc9e5d2d96543f1f3/src/modal.ts#L68
export class ConfirmRuleDisableModal extends Modal {
  constructor(app: App, ruleBeingEnabledName: LanguageStringKey, ruleBeingDisabledName: LanguageStringKey, btnSubmitAction: () => void, btnCancelAction: () => void) {
    super(app);
    this.modalEl.addClass('confirm-modal');

    this.contentEl.createEl('h3', {text: getTextInLanguage('warning-text'), cls: 'modal-heading'});

    const noticeEl = this.contentEl.createEl('p');
    noticeEl.id = 'confirm-dialog';

    setElContent(getTextInLanguage('disabled-other-rule-notice').replace('{NAME_1}', getTextInLanguage(ruleBeingEnabledName)).replace('{NAME_2}', getTextInLanguage(ruleBeingDisabledName)), noticeEl);

    this.contentEl.createDiv('modal-button-container', (buttonsEl) => {
      buttonsEl.createEl('button', {text: getTextInLanguage('cancel-button-text')}).addEventListener('click', () => {
        btnCancelAction();
        this.close();
      });

      const btnSubmit = buttonsEl.createEl('button', {
        attr: {type: 'submit'},
        cls: 'mod-cta',
        text: 'Ok',
      });
      btnSubmit.addEventListener('click', () => {
        this.close();
        btnSubmitAction();
      });
      setTimeout(() => {
        btnSubmit.focus();
      }, 50);
    });
  }
}

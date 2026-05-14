import {App, displayTooltip} from 'obsidian';
import {getTextInLanguage} from '../../lang/helpers';
import {FileToIgnore} from '../linter-components/files-to-ignore-option';
import FolderSuggester from '../suggesters/folder-suggester';
import {FormModal} from './form-modal';
import CommandSuggester from '../suggesters/command-suggester';
import {LintCommand} from '../linter-components/custom-command-option';

const filesToIgnoreDefaultFlags = 'i';

export class AddFolderToIgnoreModal extends FormModal {
  private value = '';
  private inputEl: HTMLInputElement | undefined;

  constructor(
      app: App,
      private existing: string[],
      private onAdd: (path: string) => void | Promise<void>,
  ) {
    super(app);
    this.setTitle(getTextInLanguage('tabs.general.folders-to-ignore.add-input-button-text'));

    this.addField((field) => {
      field.setName(getTextInLanguage('tabs.general.folders-to-ignore.folder-search-placeholder-text'));
      field.addText((cb) => {
        new FolderSuggester(app, cb.inputEl, existing);
        cb.setPlaceholder(getTextInLanguage('tabs.general.folders-to-ignore.folder-search-placeholder-text'))
            .onChange((v) => {
              this.value = v;
            });
        cb.inputEl.addEventListener('keydown', (evt) => {
          if (!evt.isComposing && evt.key === 'Enter') {
            evt.preventDefault();
            this.formSubmit();
          }
        });
        this.inputEl = cb.inputEl;
      });
    });
  }

  onOpen() {
    this.inputEl?.focus();
  }

  onSubmit() {
    const value = this.value.trim();
    if (!value) {
      if (this.inputEl) displayTooltip(this.inputEl, getTextInLanguage('required'), {classes: ['mod-error']});
      return;
    }
    if (this.existing.includes(value)) {
      if (this.inputEl) displayTooltip(this.inputEl, getTextInLanguage('already-in-list'), {classes: ['mod-error']});
      return;
    }
    void this.onAdd(value);
    this.close();
  }
}

export class AddFileToIgnoreModal extends FormModal {
  private label = '';
  private match = '';
  private flags = filesToIgnoreDefaultFlags;
  private firstInputEl: HTMLInputElement | undefined;

  constructor(
      app: App,
      private onAdd: (entry: FileToIgnore) => void | Promise<void>,
  ) {
    super(app);
    this.setTitle(getTextInLanguage('tabs.general.files-to-ignore.add-input-button-text'));

    this.addField((field) => {
      field.setName(getTextInLanguage('tabs.general.files-to-ignore.label-placeholder-text'));
      field.addText((cb) => {
        cb.setPlaceholder(getTextInLanguage('tabs.general.files-to-ignore.label-placeholder-text'))
            .onChange((v) => {
              this.label = v;
            });
        this.firstInputEl = cb.inputEl;
      });
    });

    this.addField((field) => {
      field.setName(getTextInLanguage('tabs.general.files-to-ignore.file-search-placeholder-text'));
      field.addText((cb) => {
        cb.setPlaceholder(getTextInLanguage('tabs.general.files-to-ignore.file-search-placeholder-text'))
            .onChange((v) => {
              this.match = v;
            });
      });
    });

    this.addField((field) => {
      field.setName(getTextInLanguage('tabs.general.files-to-ignore.flags-placeholder-text'));
      field.addText((cb) => {
        cb.setPlaceholder(getTextInLanguage('tabs.general.files-to-ignore.flags-placeholder-text'))
            .setValue(filesToIgnoreDefaultFlags)
            .onChange((v) => {
              this.flags = v;
            });
      });
    });
  }

  onOpen() {
    this.firstInputEl?.focus();
  }

  onSubmit() {
    const match = this.match.trim();
    if (!match) {
      if (this.firstInputEl) displayTooltip(this.firstInputEl, getTextInLanguage('tabs.general.files-to-ignore.pattern-required'), {classes: ['mod-error']});
      return;
    }
    void this.onAdd({label: this.label.trim(), match, flags: this.flags.trim()});
    this.close();
  }
}

export class AddFileExtensionModal extends FormModal {
  private value = '';
  private inputEl: HTMLInputElement | undefined;

  constructor(
      app: App,
      private existing: string[],
      private onAdd: (extension: string) => void | Promise<void>,
  ) {
    super(app);
    this.setTitle(getTextInLanguage('tabs.general.additional-file-extensions.add-input-button-text'));

    this.addField((field) => {
      field.setName(getTextInLanguage('tabs.general.additional-file-extensions.extension-placeholder'));
      field.addText((cb) => {
        cb.setPlaceholder(getTextInLanguage('tabs.general.additional-file-extensions.extension-placeholder'))
            .onChange((v) => {
              this.value = v;
            });
        cb.inputEl.addEventListener('keydown', (evt) => {
          if (!evt.isComposing && evt.key === 'Enter') {
            evt.preventDefault();
            this.formSubmit();
          }
        });
        this.inputEl = cb.inputEl;
      });
    });
  }

  onOpen() {
    this.inputEl?.focus();
  }

  onSubmit() {
    const value = this.value.trim().toLowerCase().replace(/^\./, '');
    if (!value) {
      if (this.inputEl) displayTooltip(this.inputEl, getTextInLanguage('required'), {classes: ['mod-error']});
      return;
    }
    if (this.existing.includes(value)) {
      if (this.inputEl) displayTooltip(this.inputEl, getTextInLanguage('already-in-list'), {classes: ['mod-error']});
      return;
    }
    void this.onAdd(value);
    this.close();
  }
}

export class AddCustomCommandModal extends FormModal {
  private value = '';
  private inputEl: HTMLInputElement | undefined;

  constructor(
      app: App,
      private existing: LintCommand[],
      private onAdd: (command: LintCommand) => void | Promise<void>,
  ) {
    super(app);
    this.setTitle(getTextInLanguage('options.custom-command.add-input-button-text'));

    this.addField((field) => {
      field.setName(getTextInLanguage('options.custom-command.command-search-placeholder-text'));
      field.addText((cb) => {
        new CommandSuggester(app, cb.inputEl, existing);
        cb.setPlaceholder(getTextInLanguage('options.custom-command.command-search-placeholder-text'))
            .onChange((v) => {
              this.value = v;
            });
        cb.inputEl.addEventListener('keydown', (evt) => {
          if (!evt.isComposing && evt.key === 'Enter') {
            evt.preventDefault();
            this.formSubmit();
          }
        });
        this.inputEl = cb.inputEl;
      });
    });
  }

  onOpen() {
    this.inputEl?.focus();
  }

  onSubmit() {
    const value = this.value.trim();
    const id = this.inputEl?.getAttribute('commandId');
    if (!value || !id) {
      if (this.inputEl) displayTooltip(this.inputEl, getTextInLanguage('required'), {classes: ['mod-error']});
      return;
    }

    for (const lintCommand of this.existing) {
      if (lintCommand.id === id) {
        if (this.inputEl) displayTooltip(this.inputEl, getTextInLanguage('already-in-list'), {classes: ['mod-error']});
        return;
      }
    }

    void this.onAdd({enabled: true, id: id, name: value});
    this.close();
  }
}

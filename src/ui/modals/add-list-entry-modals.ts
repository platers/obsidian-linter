import {App, displayTooltip} from 'obsidian';
import {getTextInLanguage} from '../../lang/helpers';
import {FileToIgnore} from '../linter-components/files-to-ignore-option';
import FolderSuggester from '../suggesters/folder-suggester';
import {FormModal} from './form-modal';
import CommandSuggester from '../suggesters/command-suggester';
import {LintCommand} from '../linter-components/custom-command-option';
import {CustomReplace} from '../linter-components/custom-replace-option';

const filesToIgnoreDefaultFlags = 'i';
const customRegexDefaultFlags = 'gm';

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

// Add or edit a custom regex replacement. When `initial` is provided, the
// modal pre-populates each field and the submit callback returns the updated
// entry (preserving the original `enabled` flag).
export class CustomRegexModal extends FormModal {
  private label: string;
  private find: string;
  private flags: string;
  private replace: string;
  private findInputEl: HTMLInputElement | undefined;
  private flagsInputEl: HTMLInputElement | undefined;

  constructor(
      app: App,
      private initial: CustomReplace | null,
      private onSubmitEntry: (entry: CustomReplace) => void | Promise<void>,
  ) {
    super(app);
    this.label = initial?.label ?? '';
    this.find = initial?.find ?? '';
    this.flags = initial?.flags ?? customRegexDefaultFlags;
    this.replace = initial?.replace ?? '';

    this.setTitle(getTextInLanguage(initial
      ? 'options.custom-replace.edit-tooltip'
      : 'options.custom-replace.add-input-button-text'));

    this.addField((field) => {
      field.setName(getTextInLanguage('options.custom-replace.label-placeholder-text'));
      field.addText((cb) => {
        cb.setPlaceholder(getTextInLanguage('options.custom-replace.label-placeholder-text'))
            .setValue(this.label)
            .onChange((v) => {
              this.label = v;
            });
      });
    });

    this.addField((field) => {
      field.setName(getTextInLanguage('options.custom-replace.regex-to-find-placeholder-text'));
      field.addText((cb) => {
        cb.setPlaceholder(getTextInLanguage('options.custom-replace.regex-to-find-placeholder-text'))
            .setValue(this.find)
            .onChange((v) => {
              this.find = v;
            });
        this.findInputEl = cb.inputEl;
      });
    });

    this.addField((field) => {
      field.setName(getTextInLanguage('options.custom-replace.flags-placeholder-text'));
      field.addText((cb) => {
        cb.setPlaceholder(getTextInLanguage('options.custom-replace.flags-placeholder-text'))
            .setValue(this.flags)
            .onChange((v) => {
              this.flags = v;
            });
        this.flagsInputEl = cb.inputEl;
      });
    });

    this.addField((field) => {
      field.setName(getTextInLanguage('options.custom-replace.regex-to-replace-placeholder-text'));
      field.addText((cb) => {
        cb.setPlaceholder(getTextInLanguage('options.custom-replace.regex-to-replace-placeholder-text'))
            .setValue(this.replace)
            .onChange((v) => {
              this.replace = v;
            });
      });
    });
  }

  onOpen() {
    this.findInputEl?.focus();
  }

  onSubmit() {
    const find = this.find.trim();
    if (!find) {
      if (this.findInputEl) displayTooltip(this.findInputEl, getTextInLanguage('required'), {classes: ['mod-error']});
      return;
    }
    try {
      new RegExp(find, this.flags);
    } catch (e) {
      const target = e instanceof SyntaxError && /flags/i.test(e.message)
        ? this.flagsInputEl
        : this.findInputEl;
      if (target) displayTooltip(target, getTextInLanguage('options.custom-replace.invalid-regex'), {classes: ['mod-error']});
      return;
    }

    void this.onSubmitEntry({
      label: this.label.trim(),
      find,
      flags: this.flags.trim(),
      replace: this.replace,
      enabled: this.initial?.enabled ?? true,
    });
    this.close();
  }
}

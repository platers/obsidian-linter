import {App, ButtonComponent, DropdownComponent, Modal, Platform, setIcon, TextComponent, ToggleComponent} from 'obsidian';
import {getTextInLanguage} from '../../lang/helpers';

export class FormField {
  containerEl: HTMLElement;
  labelEl: HTMLLabelElement;
  helpEl: HTMLElement | null = null;

  constructor(parentEl: HTMLElement) {
    this.containerEl = parentEl.createEl('p', {cls: 'form-field'});
    this.labelEl = this.containerEl.createEl('label');
  }

  setName(label: string): this {
    this.labelEl.setText(label);
    return this;
  }

  setHelp(help: string | DocumentFragment): this {
    if (!this.helpEl) {
      this.helpEl = this.containerEl.createDiv({cls: 'form-field-help'});
    }
    this.helpEl.empty();
    if (typeof help === 'string') {
      this.helpEl.setText(help);
    } else {
      this.helpEl.append(help);
    }
    return this;
  }

  addText(cb: (text: TextComponent) => unknown): this {
    const text = new TextComponent(this.containerEl);
    cb(text);
    return this;
  }

  addDropdown(cb: (dropdown: DropdownComponent) => unknown): this {
    const dropdown = new DropdownComponent(this.containerEl);
    cb(dropdown);
    return this;
  }

  addToggle(cb: (toggle: ToggleComponent) => unknown): this {
    const toggle = new ToggleComponent(this.containerEl);
    cb(toggle);
    return this;
  }

  addButton(cb: (button: ButtonComponent) => unknown): this {
    const button = new ButtonComponent(this.containerEl);
    cb(button);
    return this;
  }
}

export class FormModal extends Modal {
  private ctaEl: HTMLElement;
  private ctaButton?: ButtonComponent;
  buttonContainerEl?: HTMLElement;

  constructor(app: App) {
    super(app);
    this.modalEl.addClass('mod-lg', 'mod-form-sheet');

    if (Platform.isPhone) {
      const headerEl = this.headerEl;
      headerEl.createDiv(
          {cls: 'modal-header-button mod-raised clickable-icon mod-start'},
          (el) => {
            setIcon(el, 'x');
            el.addEventListener('click', () => this.close());
          },
      );
      this.ctaEl = headerEl.createDiv(
          {cls: 'modal-header-button mod-raised clickable-icon mod-cta'},
          (el) => setIcon(el, 'lucide-check'),
      );
      this.ctaEl.addEventListener('click', () => this.formSubmit());
    } else {
      this.buttonContainerEl = this.modalEl.createDiv({cls: 'modal-button-container'});
      this.ctaButton = new ButtonComponent(this.buttonContainerEl)
          .setCta()
          .setButtonText('Done')
          .onClick(() => this.formSubmit());
      this.ctaEl = this.ctaButton.buttonEl;
      new ButtonComponent(this.buttonContainerEl)
          .setButtonText(getTextInLanguage('cancel-button-text'))
          .onClick(() => this.close());
    }
  }

  addField(cb: (field: FormField) => void): FormField {
    const field = new FormField(this.contentEl);
    cb(field);
    return field;
  }

  setCtaText(text: string): this {
    this.ctaButton?.setButtonText(text);
    return this;
  }

  setCtaDisabled(disabled: boolean): this {
    this.ctaButton?.setDisabled(disabled);
    this.ctaEl.toggleClass('is-disabled', disabled);
    return this;
  }

  setCtaLoading(loading: boolean): this {
    const setLoading = this.ctaButton?.setLoading;
    setLoading?.call(this.ctaButton, loading);
    this.ctaEl.toggleClass('mod-loading', loading);
    return this;
  }

  setCtaClass(cls: string): this {
    this.ctaEl.addClass(cls);
    return this;
  }

  protected formSubmit() {
    this.onSubmit();
  }

  onSubmit(): void {}
}

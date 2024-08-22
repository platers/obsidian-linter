import {Setting} from 'obsidian';
import LinterPlugin from 'src/main';
import {LinterSettingsKeys} from 'src/settings-data';
import {BaseSetting} from './base-setting';
import {LanguageStringKey} from 'src/lang/helpers';

export class NumberInputSetting extends BaseSetting<number> {
  setting: Setting;
  constructor(containerEl: HTMLDivElement, nameKey: LanguageStringKey, descriptionKey: LanguageStringKey, keyToUpdate: LinterSettingsKeys, plugin: LinterPlugin) {
    super(containerEl, nameKey, descriptionKey, keyToUpdate, plugin);
    this.display();
  }

  display() {
    this.setting = new Setting(this.containerEl)
        .setName(this.name)
        .setDesc(this.description)
        .addText((textbox) => {
          textbox.inputEl.type = 'number';
          textbox
              .setValue(this.getNumber().toString())
              .onChange(async (value) => {
                void this.saveValue(parseInt(value));
              });
        });
  }
}

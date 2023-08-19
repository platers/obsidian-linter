import {Setting} from 'obsidian';
import LinterPlugin from 'src/main';
import {LinterSettingsKeys} from 'src/settings-data';
import {BaseSetting} from './base-setting';

export class NumberInputSetting extends BaseSetting<number> {
  setting: Setting;
  constructor(containerEl: HTMLElement, name: string, description: string, keyToUpdate: LinterSettingsKeys, plugin: LinterPlugin) {
    super(containerEl, name, description, keyToUpdate, plugin);
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
                this.saveValue(parseInt(value));
              });
        });
  }
}

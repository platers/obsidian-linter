import {Setting} from 'obsidian';
import LinterPlugin from 'src/main';
import {LinterSettingsKeys} from 'src/settings-data';
import {BaseSetting} from './base-setting';
import {LanguageStringKey} from 'src/lang/helpers';
import {hideEl, unhideEl} from '../helpers';

export class ToggleSetting extends BaseSetting<boolean> {
  setting: Setting;
  constructor(containerEl: HTMLDivElement, name: LanguageStringKey, description: LanguageStringKey, keyToUpdate: LinterSettingsKeys, plugin: LinterPlugin, private onChange?: (value: boolean) => void) {
    super(containerEl, name, description, keyToUpdate, plugin);
    this.display();
  }

  display() {
    this.setting = new Setting(this.containerEl)
        .addToggle((toggle) => {
          toggle
              .setValue(this.getBoolean())
              .onChange(async (value) => {
                if (this.onChange) {
                  this.onChange(value);
                }

                void this.saveValue(value);
              });
        });

    this.parseNameAndDescription();
  }

  hide() {
    hideEl(this.setting.settingEl);
  }

  unhide() {
    unhideEl(this.setting.settingEl);
  }
}

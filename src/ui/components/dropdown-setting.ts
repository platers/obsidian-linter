import {DropdownComponent, Setting} from 'obsidian';
import {LanguageStringKey, getTextInLanguage} from 'src/lang/helpers';
import LinterPlugin from 'src/main';
import {LinterSettingsKeys} from 'src/settings-data';
import {BaseSetting} from './base-setting';

export type DropdownRecordInfo = {
  isForEnum: boolean,
  values: string[],
  descriptions: string[],
}

export class DropdownSetting extends BaseSetting<string> {
  setting: Setting;
  constructor(containerEl: HTMLDivElement, nameKey: LanguageStringKey, descriptionKey: LanguageStringKey, keyToUpdate: LinterSettingsKeys, plugin: LinterPlugin, private dropdownRecords: DropdownRecordInfo, beforeSave: () => void = null) {
    super(containerEl, nameKey, descriptionKey, keyToUpdate, plugin, beforeSave);
    this.display();
  }

  display() {
    this.setting = new Setting(this.containerEl)
        .setName(this.name)
        .setDesc(this.description)
        .addDropdown((dropdown) => {
          this.addDropdownRecords(dropdown);

          dropdown.setValue(this.getString());
          dropdown.onChange(async (value) => {
            void this.saveValue(value);
          });
        });
  }

  private addDropdownRecords(dropdown: DropdownComponent) {
    if (this.dropdownRecords.isForEnum) {
      for (const value of this.dropdownRecords.values) {
        const key = ('enums.' + value) as LanguageStringKey;
        dropdown.addOption(value as string, getTextInLanguage(key));
      }

      return;
    }

    for (let index = 0; index < this.dropdownRecords.values.length; index++) {
      dropdown.addOption(this.dropdownRecords.values[index], this.dropdownRecords.descriptions[index]);
    }
  }
}

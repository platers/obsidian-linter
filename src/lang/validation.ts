// the logic in this file is meant to help validate input for the translation helper

import {LanguageLocale, LanguageStringKey, localeHasKey, localeMap} from './helpers';

export type ValidationInfo = {
  isValid: boolean,
  validationMsg: string,
}

const validResult: ValidationInfo = {
  isValid: true,
  validationMsg: '',
};

export function validateLanguageSelected(language: string): ValidationInfo {
  if (localeMap[language]) {
    return validResult;
  }

  return {
    isValid: false,
    validationMsg: `"${language}" is not in the language list. Please try rerun the program and enter another language.`,
  };
}

export function validateSelectedKey(selectedLanguage: LanguageLocale, key: LanguageStringKey): ValidationInfo {
  if (!localeHasKey(localeMap['en'], key)) {
    return {
      isValid: false,
      validationMsg: `'${key}' is not a valid key.`,
    };
  } else if (localeHasKey(selectedLanguage, key)) {
    return {
      isValid: false,
      validationMsg: `'${key}' already exists in the specified language.`,
    };
  }

  return validResult;
}

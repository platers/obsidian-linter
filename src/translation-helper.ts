import * as readline from 'readline';
import {stdout, stdin, exit} from 'process';
import {LanguageStringKey, setLanguage, getTextInLanguage, localeHasKey, localeMap, LanguageLocale, getLanguageSourceFile} from './lang/helpers';
import * as fs from 'fs';
import {ValidationInfo, validateSelectedKey, validateLanguageSelected} from './lang/validation';
import dedent from 'ts-dedent';

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

const availableLanguages = Object.keys(localeMap).join(', ');
const englishKeys = getObjectKeys(localeMap['en']);
const translationOptions = dedent`
  =========================================================================
  Select a translation mode to use:
  [A]dd a translation value for a specific language.
  [L]ist untranslated keys in the specified language.
  [R]eplace translated value with a new value for the specified key.
  [T]ranslate all untranslated keys in a language one at a time.
  =========================================================================
`;

setLanguage('en');

selectTranslationModeAndKickOffTheAssociatedLogic();

function selectTranslationModeAndKickOffTheAssociatedLogic() {
  console.log(translationOptions);

  getUserInput('Select a translation mode to use: ', (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'a':
        selectLanguageAndDoAction('Enter which language to have a value added to: ', addANewValueToALanguage);
        break;
      case 'l':
        selectLanguageAndDoAction('Enter which language to list the untranslated keys for: ', listUntranslatedKeysInALanguage);
        break;
      case 'r':
        selectLanguageAndDoAction('Enter which language to have a value replaced in: ', replaceLanguageKeyWithANewValue);
        break;
      case 't':
        selectLanguageAndDoAction('Enter which language to translate all keys from: ', translateAllKeysInALanguage);
        break;
      default:
        console.log('"' + mode + '" is not a valid translation mode.');
        endProgram(true);
    }
  });
}

function getUserInput(prompt: string, handleResponse: (answer: string) => void) {
  rl.question(prompt, (answer) => {
    handleResponse(answer);
  });
}

function selectLanguageAndDoAction(prompt: string, action: (language: string, selectedLanguage: LanguageLocale) => void) {
  console.log('Valid languages:\n\t' + availableLanguages + '\n');
  getUserInput(prompt, (language) => {
    logMsgAndExitIfValidationFailed(validateLanguageSelected(language));

    action(language, localeMap[language]);
  });
}

function addANewValueToALanguage(language: string, selectedLanguage: LanguageLocale) {
  getUserInput('Enter the key of the value to add: ', (keyToAdd: string) => {
    logMsgAndExitIfValidationFailed(validateSelectedKey(selectedLanguage, keyToAdd as LanguageStringKey));

    getUserInput(`Enter the value for "${keyToAdd}": `, (replacementValue: string) => {
      const key = keyToAdd as LanguageStringKey;
      setValueInLanguage(language, key, replacementValue);
      replaceTranslationValuesInFile(language);
      endProgram();
    });
  });
}

function replaceLanguageKeyWithANewValue(language: string, selectedLanguage: LanguageLocale) {
  getUserInput('Enter the key to replace the value of: ', (keyToReplace: string) => {
    logMsgAndExitIfValidationFailed(validateSelectedKey(selectedLanguage, keyToReplace as LanguageStringKey));

    setLanguage(language);
    const currentValue = getTextInLanguage(keyToReplace as LanguageStringKey);
    setLanguage('en');

    getUserInput(`Enter the replacement value for "${currentValue}": `, (replacementValue: string) => {
      const key = keyToReplace as LanguageStringKey;
      setValueInLanguage(language, key, replacementValue);
      replaceTranslationValuesInFile(language);
      endProgram();
    });
  });
}

function listUntranslatedKeysInALanguage(language: string, selectedLanguage: LanguageLocale) {
  const missingKeys = getMissingKeysInLanguage(selectedLanguage);

  if (missingKeys.length === 0) {
    console.log('"' + language + '" has no values that need translating.');
  } else {
    const keyText = missingKeys.length > 1 ? 'keys' : 'key';
    console.log('"' + language + `" is missing ${missingKeys.length} ${keyText}:`);
    missingKeys.forEach((element) => {
      console.log(`${element}: ` + getTextInLanguage(element as LanguageStringKey) );
    });
  }

  endProgram();
}

function translateAllKeysInALanguage(language: string, selectedLanguage: LanguageLocale) {
  const missingKeys = getMissingKeysInLanguage(selectedLanguage);

  if (missingKeys.length === 0) {
    console.log('"' + language + '" has no values that need translating.');
  } else {
    const keyText = missingKeys.length > 1 ? 'keys' : 'key';
    console.log('"' + language + `" is missing ${missingKeys.length} ${keyText}:`);

    const firstElement = missingKeys.shift();
    getNextTranslation(missingKeys, firstElement, language);
  }
}

function getNextTranslation(missingKeys: string[], element: string, language: string) {
  getUserInput(`Enter 'q' for quit, 's' for skip, or a translation for '${getTextInLanguage(element as LanguageStringKey)}':`, (translatedValue: string) => {
    switch (translatedValue) {
      case 'q':
        console.log(`Stopping the translation of values for language '${language}'.`);
        replaceTranslationValuesInFile(language);
        endProgram();
        return;
      case 's':
        break;
      default:
        setValueInLanguage(language, element, translatedValue);
    }

    const nextKey = missingKeys.shift();
    getNextTranslation(missingKeys, nextKey, language);
    if (missingKeys.length === 0) {
      replaceTranslationValuesInFile(language);
      endProgram();
    }
  });
}

function setValueInLanguage(language: string, key: string, value: string) {
  let object = localeMap[language] as {[k: string]: any};
  const keyParts = key.split('.');
  keyParts.forEach((keyPart: string, index: number) => {
    if (keyParts.length -1 === index) {
      object[keyPart] = value;

      return;
    }

    if (object[keyPart] == undefined) {
      object[keyPart] = {};
    }

    object = object[keyPart];
  });
}

function getMissingKeysInLanguage(selectedLanguage: LanguageLocale): string[] {
  const missingKeys = [] as string[];
  for (const nestedKey of englishKeys) {
    if (!localeHasKey(selectedLanguage, nestedKey as LanguageStringKey) && localeHasKey(localeMap['en'], nestedKey as LanguageStringKey)) {
      missingKeys.push(nestedKey);
    }
  }

  return missingKeys;
}

function getObjectKeys(obj: any, prefix: string = ''): string[] {
  return Object.entries(obj).reduce((collector, [key, val]) => {
    const newKeys = [...collector, prefix ? `${prefix}.${key}` : key];
    if (Object.prototype.toString.call(val) === '[object Object]') {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      const otherKeys = getObjectKeys(val, newPrefix);
      return [...newKeys, ...otherKeys];
    }
    return newKeys;
  }, []);
}

function replaceTranslationValuesInFile(language: string) {
  const filePath = getLanguageSourceFile(language);
  try {
    const originalData = fs.readFileSync(filePath, 'utf8');

    const newData = originalData.substring(0, originalData.indexOf('export') - 1) + '\nexport default ' + JSON.stringify(localeMap[language], null, 2) + ';';

    try {
      fs.writeFileSync(filePath, newData);
    } catch (err) {
      console.error(err);
      endProgram(true);
    }
  } catch (err) {
    console.error(err);
    endProgram(true);
  }
}

function endProgram(withError: boolean = false) {
  rl.close();

  if (withError === true) {
    exit(-1);
  }

  exit();
}

function logMsgAndExitIfValidationFailed(validationResult: ValidationInfo) {
  if (!validationResult.isValid) {
    console.log(validationResult.validationMsg);

    endProgram(true);
  }
}

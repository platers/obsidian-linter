import * as readline from 'readline';
import {stdout, stdin, exit} from 'process';
import {LanguageStringKey, setLanguage, getTextInLanguage, localeHasKey, localeMap} from './lang/helpers';
import * as fs from 'fs';

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

const availableLanguages = Object.keys(localeMap).join(', ');
const englishKeys = getObjectKeys(localeMap['en']);

setLanguage('en');

selectTranslationModeAndKickOffTheAssociatedLogic();

function selectTranslationModeAndKickOffTheAssociatedLogic() {
  console.log('=========================================================================');
  console.log('Select a translation mode to use:');
  console.log('[A]dd a translation value for a specific language.');
  console.log('[L]ist untranslated keys in the specified language.');
  console.log('[R]eplace translated value with a new value for the specified key.');
  console.log('[T]ranslate all untranslated keys in a language one at a time.');
  console.log('=========================================================================');

  getUserInput('Select a translation mode to use: ', (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'a':
        addANewValueToALanguage();
        break;
      case 'l':
        listUntranslatedKeysInALanguage();
        break;
      case 'r':
        replaceLanguageKeyWithANewValue();
        break;
      case 't':
        translateAllKeysInALanguage();
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

function addANewValueToALanguage() {
  console.log('Valid languages:\n\t' + availableLanguages + '\n');
  getUserInput('Enter which language to have a value added to: ', (language) => {
    if (localeMap[language]) {
      const selectedLanguage = localeMap[language];
      getUserInput('Enter the key of the value to add: ', (keyToAdd: string) => {
        if (!localeHasKey(localeMap['en'], keyToAdd as LanguageStringKey)) {
          console.log(`'${keyToAdd}' is not a valid key.`);
          endProgram(true);
        } else if (localeHasKey(selectedLanguage, keyToAdd as LanguageStringKey)) {
          console.log(`'${keyToAdd}' already exists in the specified language.`);
          endProgram(true);
        }

        getUserInput(`Enter the value for "${keyToAdd}": `, (replacementValue: string) => {
          const key = keyToAdd as LanguageStringKey;
          console.log(replacementValue);
          setValueInLanguage(language, key, replacementValue);
          replaceTranslationValuesInFile(language);
          endProgram();
        });
      });
    } else {
      console.log('"' + language + '" is not in the language list. Please try rerun the program and enter another language.');
      endProgram(true);
    }
  });
}

function replaceLanguageKeyWithANewValue() {
  console.log('Valid languages:\n\t' + availableLanguages + '\n');
  getUserInput('Enter which language to have a value replaced in: ', (language) => {
    if (localeMap[language]) {
      const selectedLanguage = localeMap[language];
      getUserInput('Enter the key to replace the value of: ', (keyToReplace: string) => {
        if (!localeHasKey(localeMap['en'], keyToReplace as LanguageStringKey)) {
          console.log(`'${keyToReplace}' is not a valid key.`);
          endProgram(true);
        } else if (!localeHasKey(selectedLanguage, keyToReplace as LanguageStringKey)) {
          console.log(`'${keyToReplace}' does not exist already in the specified language.`);
          endProgram(true);
        }

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
    } else {
      console.log('"' + language + '" is not in the language list. Please try rerun the program and enter another language.');
      endProgram(true);
    }
  });
}

function listUntranslatedKeysInALanguage() {
  console.log('Valid languages:\n\t' + availableLanguages + '\n');

  getUserInput('Enter which language to list the untranslated keys for: ', (language) => {
    if (localeMap[language]) {
      const missingKeys = getMissingKeysInLanguage(language);

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
    } else {
      console.log('"' + language + '" is not in the language list. Please try rerun the program and enter another language.');
      endProgram(true);
    }
  });
}

function translateAllKeysInALanguage() {
  console.log('Valid languages:\n\t' + availableLanguages + '\n');

  getUserInput('Enter which language to translate all keys from: ', (language) => {
    if (localeMap[language]) {
      const missingKeys = getMissingKeysInLanguage(language);

      if (missingKeys.length === 0) {
        console.log('"' + language + '" has no values that need translating.');
      } else {
        const keyText = missingKeys.length > 1 ? 'keys' : 'key';
        console.log('"' + language + `" is missing ${missingKeys.length} ${keyText}:`);

        const firstElement = missingKeys.shift();
        getNextTranslation(missingKeys, firstElement, language);
      }
    } else {
      console.log('"' + language + '" is not in the language list. Please try rerun the program and enter another language.');
      endProgram(true);
    }
  });
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
  let object = localeMap[language] as object;
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

function getMissingKeysInLanguage(language: string): string[] {
  const indicatedLanguage = localeMap[language];
  const missingKeys = [] as string[];
  for (const nestedKey of englishKeys) {
    if (!localeHasKey(indicatedLanguage, nestedKey as LanguageStringKey) && localeHasKey(localeMap['en'], nestedKey as LanguageStringKey)) {
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
  const filePath = `./src/lang/locale/${language}.ts`;
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

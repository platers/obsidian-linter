import * as readline from 'readline';
import {LanguageStringKey, localeHasKey, localeMap} from './lang/helpers';
// const rl = readline.createInterface({
// input: process.stdin,
// output: process.stdout,
// });

const availableLanguages = Object.keys(localeMap).join(', ');
const englishKeys = getObjectKeys(localeMap['en']);
selectTranslationModeAndKickOffTheAssociatedLogic();


// rl.close();

/* console.log('Valid languages:\n\t' + availableLanguages + '\n');

let languageToTranlateTo = localeMap['en'];
rl.question('Which language would you like to translate to? ', (answer) => {
  if (localeMap[answer]) {
    languageToTranlateTo = localeMap[answer];
  } else {
    console.log('The language "' + answer + '" is not in the specified list. Check the spelling and make sure the case matches the one in the list.');
    process.exit(-1);
  }
  rl.close();
});

console.log('Valid languages:\n\t' + availableLanguages + '\n');

let languageToTranlateFrom = localeMap['en'];
rl.question('Which language would you like to translate to use as a template (leave blank to use English))? ', (answer) => {
  if (localeMap[answer]) {
    languageToTranlateFrom = localeMap[answer];
  } else {
    console.log('English will be used for the language to translate from.');
  }
  rl.close();
});*/

/*
* Add modes for the translation helper:
* 1. Show untranslated keys in a language
* 2. Iterate over a untranslated keys in a language having the user input a translation for each value
* 3. Add new language for translation
 */

function selectTranslationModeAndKickOffTheAssociatedLogic() {
  console.log('=========================================================================');
  console.log('Select a translation mode to use:');
  console.log('[A]dd a new language for translation.');
  console.log('[L]ist untranslated keys in the specified language.');
  console.log('[R]eplace translated value with a new value.');
  console.log('[T]ranslate all untranslated keys in a language one at a time.');
  console.log('=========================================================================');

  getUserInput('Select a translation mode to use: ', (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'a':
        console.log('Add a language is yet to be added...');
        break;
      case 'l':
        listUntranslatedKeysInALanguage();
        break;
      case 'r':
        console.log('Replace value with a new value...');
        break;
      case 't':
        console.log('Translate all untranslated keys in a language to another one...');
        break;
      default:
        console.log('"' + mode + '" is not a valid translation mode.');
        // process.exit(-1);
    }
  });
}

function getUserInput(prompt: string, handleResponse: (string) => void) {
  const ri = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  ri.question(prompt, (answer) => {
    handleResponse(answer);
    // ri.close();
  });
}

function listUntranslatedKeysInALanguage() {
  console.log('Valid languages:\n\t' + availableLanguages + '\n');

  getUserInput('Enter which language to list the untranslated keys for: ', (language) => {
  // const text: unknown = (locale && getString<LanguageStrings>(locale, str)) || getString<LanguageStrings>(en, str);
    if (localeMap[language]) {
      const indicatedLanguage = localeMap[language];
      const missingKeys = [] as string[];
      for (const nestedKey of englishKeys) {
        if (!localeHasKey(indicatedLanguage, nestedKey as LanguageStringKey) && localeHasKey(localeMap['en'], nestedKey as LanguageStringKey)) {
          missingKeys.push(nestedKey);
        }
      }
      console.log(missingKeys);
    } else {
      console.log('"' + language + '" is not in the language list. Please try rerun the program and enter another language.');
      // process.exit(-1);
    }
  });
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

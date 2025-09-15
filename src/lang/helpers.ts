// based on https://github.com/mgmeyers/obsidian-kanban/blob/main/src/lang/helpers.ts
import {getString, NestedKeyOf} from '../utils/nested-keyof';
import {logWarn} from '../utils/logger';
import ar from './locale/ar';
import cz from './locale/cz';
import da from './locale/da';
import de from './locale/de';
import en from './locale/en';
import es from './locale/es';
import fr from './locale/fr';
import hi from './locale/hi';
import id from './locale/id';
import it from './locale/it';
import ja from './locale/ja';
import ko from './locale/ko';
import nl from './locale/nl';
import no from './locale/no';
import pl from './locale/pl';
import pt from './locale/pt';
import ptBR from './locale/pt-br';
import ro from './locale/ro';
import ru from './locale/ru';
import sq from './locale/sq';
import tr from './locale/tr';
import uk from './locale/uk';
import zhCN from './locale/zh-cn';
// import zhTW from './locale/zh-tw'; for now we will use Simplified Chinese instead of Traditional for both

type LanguageStrings = typeof en;

export type LanguageLocale = Partial<LanguageStrings>;

export const localeMap: { [k: string]: LanguageLocale } = {
  ar,
  cz,
  da,
  de,
  en,
  es,
  fr,
  hi,
  id,
  it,
  ja,
  ko,
  nl,
  no,
  pl,
  'pt-BR': ptBR,
  pt,
  ro,
  ru,
  sq,
  tr,
  uk,
  'zh-TW': zhCN,
  'zh': zhCN,
};

export const localeToFileName: { [k: string]: string} = {
  'ar': 'ar',
  'cz': 'cz',
  'da': 'da',
  'de': 'de',
  'en': 'en',
  'es': 'es',
  'fr': 'fr',
  'hi': 'hi',
  'id': 'id',
  'it': 'it',
  'ja': 'ja',
  'ko': 'ko',
  'nl': 'nl',
  'no': 'no',
  'pl': 'pl',
  'pt-BR': 'pt-br',
  'pt': 'pt',
  'ro': 'ro',
  'ru': 'ru',
  'sq': 'sq',
  'tr': 'tr',
  'uk': 'uk',
  'zh-TW': 'zh-tw',
  'zh': 'zh-cn',
};

export type LanguageStringKey = NestedKeyOf<LanguageStrings>

const defaultLang = 'en';
let lang = defaultLang;
let locale = localeMap[lang];

export function setLanguage(newLang: string) {
  lang = newLang;
  locale = localeMap[lang];
  if (!locale) {
    logWarn(`locale not found for '${lang}'`);
    locale = localeMap[defaultLang];
  }
}

export function getTextInLanguage(str: LanguageStringKey): string {
  const text: unknown = (locale && getString<LanguageStrings>(locale, str)) || getString<LanguageStrings>(en, str);

  return text as string;
}

export function localeHasKey(locale: LanguageLocale, key: LanguageStringKey): boolean {
  return !!getString<LanguageStrings>(locale, key);
}

export function getLanguageSourceFile(language: string) {
  return `./src/lang/locale/${localeToFileName[language]}.ts`;
}

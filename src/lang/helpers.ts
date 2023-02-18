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
import uk from './locale/tr';
import zhCN from './locale/zh-cn';
import zhTW from './locale/zh-tw';


const localeMap: { [k: string]: Partial<typeof en> } = {
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
  'zh-TW': zhTW,
  'zh': zhCN,
};

// export type LanguageStringKey = keyof typeof en;
type LanguageStrings = typeof en;
export type LanguageStringKey = NestedKeyOf<LanguageStrings>

let lang = 'en';
let locale = localeMap[lang];

export function setLanguage(newLang: string) {
  lang = newLang;
  locale = localeMap[lang || 'en'];
}

export function getTextInLanguage(str: LanguageStringKey): string {
  if (!locale) {
    logWarn(`locale not found for '${lang}'`);
  }

  const text: unknown = (locale && getString<LanguageStrings>(locale, str)) || getString<LanguageStrings>(en, str);

  return text as string;
}

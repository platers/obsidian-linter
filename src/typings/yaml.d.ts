import {CST} from 'yaml';
import {QuoteCharacter} from '../utils/yaml';

interface YamlProperties {
  lineWidth: number,
  quotingType: QuoteCharacter,
  forceQuotes: boolean,
}

interface Key {
  value?: string;
}

interface YamlCSTTokens {
  offset?: number,
  type: string,
  indent?: number,
  start?: number;
  end?: number;
  items: CST.CollectionItem[];
}

interface YamlNode {
  constructor: { name: string };
  key?: Key;
  value?: any;
  items?: [string, any][];
  moved?: boolean;
  srcTokens?: YamlCSTTokens;
}

declare module 'yaml' {
  // for now we really just need this for use with strings, so we shall work with that;
  export function stringify(value: string, properties?: YamlProperties): string;
}

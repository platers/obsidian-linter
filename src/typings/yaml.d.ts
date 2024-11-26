import {QuoteCharacter} from '../utils/yaml';

interface YamlProperties {
  lineWidth: number,
  quotingType: QuoteCharacter,
  forceQuotes: boolean,
}

interface Key {
  value?: string;
}

interface YamlNode {
  constructor: { name: string };
  key?: Key;
  value?: any;
  items?: [string, any][];
  moved?: boolean;
}

declare module 'yaml' {
  // for now we really just need this for use with strings, so we shall work with that;
  export function stringify(value: string, properties?: YamlProperties): string;
}

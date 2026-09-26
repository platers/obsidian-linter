import type {IgnoreType} from './ignore-types';

// Keep this module free of runtime imports: mdast depends on protected-ranges, while the ignore
// registry depends on mdast. Projection needs this metadata without that cycle.
const uniqueSuffixLength = 16;

const canonicalRank = new Map<IgnoreType, number>();

export function registerCanonicalIgnoreTypeOrder(ignoreTypes: IgnoreType[]): void {
  ignoreTypes.forEach((ignoreType, index) => canonicalRank.set(ignoreType, index));
}

export function inCanonicalOrder(ignoreTypes: IgnoreType[]): IgnoreType[] {
  return [...ignoreTypes].sort((a, b) => (canonicalRank.get(a) ?? Number.MAX_SAFE_INTEGER) - (canonicalRank.get(b) ?? Number.MAX_SAFE_INTEGER));
}

/**
 * A structural stand-in for a generated placeholder, not an identifier used for restoration.
 * Preserve the historical placeholder length and line structure, including YAML's exception.
 * @param {IgnoreType} ignoreType The type whose placeholder shape to preserve
 * @return {string} A token with the placeholder's length and line structure
 */
export function projectionTokenFor(ignoreType: IgnoreType): string {
  const placeholder = ignoreType.placeholder;
  if (placeholder.includes('---')) {
    return placeholder;
  }

  const uniqueSuffix = '0'.repeat(uniqueSuffixLength);
  if (placeholder.endsWith('}')) {
    return placeholder.replace('}', uniqueSuffix + '}');
  }

  return placeholder + uniqueSuffix;
}

// based on https://dev.to/pffigueiredo/typescript-utility-keyof-nested-object-2pa3

// NestedKeyOf creates a list of properties where each property is in the form of 'key' or 'property.key', etc.
// The only valid keys are ones that point to strings for the use case in question for this
export type NestedKeyOf<ObjectType extends object> =
{[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
: `${Key}`
}[keyof ObjectType & (string)];

export function getString<ObjectType>(object: Partial<ObjectType>, path: string): string | null {
  if (object == undefined) {
    return null;
  }

  const result = findValueFromPath(object, path);
  if (typeof result === 'string') {
    return result;
  }

  return null;
}

export function getNumber<ObjectType>(object: Partial<ObjectType>, path: string): number | null {
  if (object == undefined) {
    return null;
  }

  const result = findValueFromPath(object, path);
  if (typeof result === 'number') {
    return result;
  }

  return null;
}

export function getBoolean<ObjectType>(object: Partial<ObjectType>, path: string): boolean | null {
  if (object == undefined) {
    return null;
  }

  const result = findValueFromPath(object, path);
  if (typeof result === 'boolean') {
    return result;
  }

  return null;
}

function findValueFromPath<ObjectType>(object: Partial<ObjectType>, path: string): unknown {
  path = path.replace('..', '.'); // convert 2 periods in a row to a single period so we can properly account for the blank key value later on
  const keys = path.split('.');

  // the value of '.' is an actual key as well so I need to make sure that if the last value is blank that it is set to a period
  if (keys != null && keys[keys.length - 1] == '') {
    keys[keys.length - 1] = '.';
  }

  let result = object;
  for (const key of keys) {
    result = result[key];

    if (result == undefined) {
      return null;
    }
  }

  return result;
}

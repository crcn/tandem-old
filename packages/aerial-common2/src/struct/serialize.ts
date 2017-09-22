import { Struct, Typed } from "./utils";

/**
 * Converts an object into a POJO 
 * @param object 
 */

export const serialize = (object: any) => {
  if (object && typeof object === "object") {
    if (object["$noSerialize"]) {
      return undefined;
    }

    if (object.constructor !== Object && object.constructor !== Array) {
      return undefined;
    }

    if (Array.isArray(object)) {
      return object.map(child => serialize(child));
    } else {
      const serializableKeys: string[] = object["$serializableKeys"];

      const clone = {};
      if (serializableKeys) {
        for (let i = serializableKeys.length; i--;) {
          const key = serializableKeys[i];
          clone[key] = serialize(object[key]);
        }
      } else {
        for (const key in object) {
          clone[key] = serialize(object[key]);
        }
      }
      return clone;
    }
  } else {
    return object;
  }
}

export const serializableKeys = <TFactory extends Function>(keys: string[], factory: TFactory) => ((...args) => ({ $serializableKeys: keys, ...factory(...args)})) as any as TFactory;

export const nonSerializable = <T extends Object>(object: T) => ({ $noSerialize: true, ...(object as any) }) as T;

export const nonSerializableFactory = <TFactory extends Function>(create: TFactory): TFactory => ((...args) => nonSerializable(create(...args))) as any as TFactory;
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
      const serializableKeysFactory: string[] = object["$serializableKeysFactory"];

      const clone = {};
      if (serializableKeysFactory) {
        for (let i = serializableKeysFactory.length; i--;) {
          const key = serializableKeysFactory[i];
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

export const serializableKeys = <TObject extends Object>(keys: string[], object: TObject) => ({ $serializableKeysFactory: keys, ...(object as any) }) as TObject;

export const serializableKeysFactory = <TFactory extends Function>(keys: string[], factory: TFactory) => ((...args) => serializableKeys(keys, factory(...args))) as any as TFactory;

export const nonSerializable = <T extends Object>(object: T) => ({ $noSerialize: true, ...(object as any) }) as T;

export const nonSerializableFactory = <TFactory extends Function>(create: TFactory): TFactory => ((...args) => nonSerializable(create(...args))) as any as TFactory;
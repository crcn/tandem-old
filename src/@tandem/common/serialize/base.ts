import { Injector } from "@tandem/common/ioc";

export type SerializedContentType<T> = [string, T];

export interface ISerializer<T, U> {
  serialize(value: T): U;
  deserialize(value: U, injector: Injector, ctor?: any): T;
}

export interface ISerializable<T> {
  serialize(): T;
  deserialize(value: T): void;
}

export function createSerializer(ctor: { new(...rest:any[]): any }): ISerializer<any, any> {

  if (ctor.prototype.serialize) {
    return {
      serialize(value: ISerializable<any>) {
        return value.serialize();
      },
      deserialize(value, injector, ctor): ISerializable<any> {
        const instance: ISerializable<any> = injector && injector.create(ctor, []) || new ctor();
        instance.deserialize(value);
        return instance;
      }
    }
  }

  return {
    serialize(value): any {
      return JSON.parse(JSON.stringify(value));
    },
    deserialize(value, injector, ctor) {
      const instance = new ctor();
      return Object.assign(instance, value);
    }
  }
}

const defaultSerializer: ISerializer<any, any> = {
  serialize(value): any {
    return value.serialize ? value.serialize() : JSON.parse(JSON.stringify(value));
  },
  deserialize(value, injector, ctor) {
    const instance = injector && injector.create(ctor, []) || new ctor();
    return instance.deserialize ? instance.deserialize(value) : Object.assign(instance, value);
  }
}

const LITERAL_TYPE = "[[Literal]]";

class LiteralSerializer implements ISerializer<any, any> {
  serialize(value) {
    return value;
  }
  deserialize(value, ctor, injector) {
    return value;
  }
}

interface ISerializerInfo {
  ctor: any;
  serializer: ISerializer<any, any>;
}

const _serializers   = {
  [LITERAL_TYPE]: { ctor: undefined, serializer: new LiteralSerializer() },
  Array: {
    ctor: undefined,
    serializer: {
      serialize(value: any[]) {

        // cast value as an array if it's not (might be a sub class)
        return ([].concat(value)).map(serialize)
      },
      deserialize(value: any[], injector) {
        return value.map(item => deserialize(item, injector));
      }
    }
  },
  Date: {
    ctor: undefined,
    serializer: {
      serialize(value: Date) {
        return Date.now();
      },
      deserialize(value: number) {
        return new Date(value);
      }
    }
  },
  RegExp: {
    ctor: undefined,
    serializer: {
      serialize(value: RegExp) {
        return { source: value.source, flags: value.flags };
      },
      deserialize({ source, flags }: any) {
        return new RegExp(source, flags);
      }
    }
  },
  Error: {
    ctor: undefined,
    serializer: {
      serialize(value: Error) {
        return { name: value.name, message: value.message, stack: value.stack };
      },
      deserialize({ name, message, stack }: any) {
        return { name, message, stack };
      }
    }
  },
};

export function getSerializeType(value: any) {
   return isSerializable(value) ? Reflect.getMetadata("serialize:type", value.constructor) || Reflect.getMetadata("serialize:type", value) : getNativeSerializeType(value);
}

function getNativeSerializeType(value: any) {

  // need to use instanceof since the value may be a sub class
  if (value instanceof Array) return "Array";
  if (value instanceof Date) return "Date";
  if (value instanceof RegExp) return "RegExp";
  if (value instanceof Error) return "Error";

  return undefined;
}

export function serializable(type: string, serializer?: ISerializer<any, any>) {
  return function(ctor: { new(...rest:any[]): any }) {
    if (_serializers[type]) throw new Error(`Cannot override existing serializer "${type}".`);

    // if serializer does not exist, then fetch from parent class serializer if it exists
    const parentSerializerInfo = _serializers[Reflect.getMetadata(`serialize:type`, ctor)];

    _serializers[type] = {
      ctor: ctor,
      serializer: serializer || (parentSerializerInfo ? parentSerializerInfo.serializer : createSerializer(ctor))
    };

    Reflect.defineMetadata("serialize:type", type, ctor);
  }
}

export function isSerializable(value: Object) {
  return !!value && (typeof value === "function" ? !!Reflect.getMetadata("serialize:type", value) : !!Reflect.getMetadata("serialize:type", value.constructor));
}

export function serialize(value: any): SerializedContentType<any> {
  const type = getSerializeType(value) || LITERAL_TYPE;
  return [ type, (<ISerializer<any, any>>_serializers[type].serializer).serialize(value)]
}

export function deserialize(content: SerializedContentType<any>, injector: Injector): any {
  const info: ISerializerInfo = _serializers[content[0]];

  if (!info) {
    throw new Error(`Trying to deserialize non serialized object:` + content);
  }

  return info.serializer.deserialize(content[1], injector, info.ctor);
}

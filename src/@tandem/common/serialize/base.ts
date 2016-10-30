import { Injector } from "@tandem/common/ioc";

export interface ISerializedContent<T> {
  type: string;
  value: T;
}

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
  [LITERAL_TYPE]: { ctor: undefined, serializer: new LiteralSerializer() }
};

export function getSerializeType(value: any) {
  return canSerialize(value) ? Reflect.getMetadata("serialize:type", value.constructor) || Reflect.getMetadata("serialize:type", value) : undefined;
}

export function serializable(serializer?: ISerializer<any, any>, type?: string) {
  return function(ctor: { new(...rest:any[]): any }) {
    if (canSerialize(ctor)) return;
    if (!type) type = ctor.name;
    if (_serializers[type]) throw new Error(`Cannot override existing serializer "${type}".`);

    // if serializer does not exist, then fetch from parent class serializer if it exists
    const parentSerializerInfo = _serializers[Reflect.getMetadata(`serialize:type`, ctor)];

    _serializers[type] = {
      ctor: ctor,
      serializer: serializer || (parentSerializerInfo ? parentSerializerInfo.serializer : createSerializer(ctor))
    };

    Reflect.defineMetadata(`serialize:type`, type, ctor);
  }
}

export function canSerialize(value: Object) {
  return !!value && !!Reflect.getMetadata("serialize:type", value.constructor);
}

export function serialize(value: any): ISerializedContent<any> {
  const type = getSerializeType(value) || LITERAL_TYPE;
  return {
    type: type,
    value: (<ISerializer<any, any>>_serializers[type].serializer).serialize(value)
  };
}

export function deserialize(content: ISerializedContent<any>, injector: Injector): any {

  const info: ISerializerInfo = _serializers[content.type];

  if (!info) {
    return content;
  }

  return info.serializer.deserialize(content.value, injector, info.ctor);
}

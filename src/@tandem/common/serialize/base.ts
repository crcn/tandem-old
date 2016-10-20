
export interface ISerializedContent<T> {
  type: string;
  value: T;
}

export interface ISerializer<T, U> {
  serialize(value: T): U;
  deserialize(value: U): T;
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
      deserialize(value): ISerializable<any> {
        const instance: ISerializable<any> = new ctor();
        instance.deserialize(value);
        return instance;
      }
    }
  }

  return {
    serialize(value): any {
      return JSON.parse(JSON.stringify(value));
    },
    deserialize(value) {
      const instance = new ctor();
      return Object.assign(instance, value);
    }
  }
}

const LITERAL_TYPE = "[[literal]]";

class LiteralSerializer implements ISerializer<any, any> {
  serialize(value) {
    return value;
  }
  deserialize(value) {
    return value;
  }
}

const _serializers   = {
  [LITERAL_TYPE]: new LiteralSerializer()
};

export function serializable(serializer?: ISerializer<any, any>, type?: string) {
  return function(ctor: { new(...rest:any[]): any }) {
    if (canSerialize(ctor)) return;
    if (!type) type = ctor.name;
    if (_serializers[type]) throw new Error(`Cannot override existing serializer "${type}".`);

    // if serializer does not exist, then fetch from parent class serializer if it exists
    _serializers[type] = serializer || _serializers[Reflect.getMetadata(`serialize:type`, ctor)] || createSerializer(ctor);
    Reflect.defineMetadata(`serialize:type`, type, ctor);
  }
}

export function canSerialize(value: Object) {
  return !!value && Reflect.hasMetadata("serialize:type", value.constructor);
}

export function serialize(value: any): ISerializedContent<any> {
  const type = canSerialize(value) ? Reflect.getMetadata("serialize:type", value.constructor) : LITERAL_TYPE;
  return {
    type: type,
    value: (<ISerializer<any, any>>_serializers[type]).serialize(value)
  };
}

export function deserialize(content: ISerializedContent<any>): any {

  const serializer: ISerializer<any, any> = _serializers[content.type];

  if (!serializer) {
    return content;
  }

  return serializer.deserialize(content.value);
}

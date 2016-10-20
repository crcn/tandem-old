export interface ISerializedContent {
  type: string;
  value: any;
}

const _deserializers = {};
const _serializers   = {};

export function serializable(type?: string, serializer?: (value: any) => ISerializedContent, deserializer?: (value: ISerializedContent) => any) {
  return function(ctor: { new(...rest:any[]): any }) {
    if (canSerialize(ctor)) return;

    if (!type) type = ctor.name;
    if (_deserializers[type]) throw new Error(`Cannot override existing serializable "${type}".`);
    Reflect.defineMetadata(`serialize:type`, type, ctor);
    _serializers[type] = serializer || function(value: any) {
      return JSON.parse(JSON.stringify(value));
    }
    _deserializers[type] = deserializer || function(value: any) {
      const instance = new ctor();
      return Object.assign(instance, value);
    }
  }
}

export function canSerialize(value: Object) {
  return Reflect.hasMetadata("serialize:type", value.constructor);
}

export function serialize(value: any): ISerializedContent {

  if (!canSerialize(value)) {
    // if (value.constructor) console.error(`Attempting to serialize unserializable ${value.constructor.name}.`);
    return value;
  }

  const type = Reflect.getMetadata("serialize:type", value.constructor);

  return {
    type: type,
    value: _serializers[type](value)
  }
}

export function deserialize(content: ISerializedContent): any {

  const deserialize = _deserializers[content.type];

  if (!deserialize) {
    // console.error(`Deserializer ${content.type} does not exist.`);
    return content;
  }

  return deserialize(content.value);
}

export interface ISerializable {
  serialize():Object;
  deserialize(value: Object): void;
}

export interface ISerializer {
  serialize(value: any): any;
  deserialize(value: any): any;
}

const serializers = {};

function getSerializer(serializerName: string): ISerializer {
  if (!serializers[serializerName]) {
    throw new Error(`Serializer does not exist for ${serializerName}.`);
  }
  return serializers[serializerName];
}

export function serialize(value: Object) {
  return { name: value.constructor.name, data: getSerializer(value.constructor.name).serialize(value) };
}

export function deserialize(value: any) {
  return getSerializer(value.name).deserialize(value.data);
}

export function serializeArray(value: Array<any>) {
  return value.map((item) => serialize(item));
}

export function deserializeArray(value: Array<any>) {
  return value.map((item) => deserialize(item));
}

export function register(clazz: { new(...rest: Array<any>): any }, serializer?: ISerializer) {

  if (serializers[clazz.name] != null) {
    throw new Error(`Serializer for "${clazz.name}" already exists."`);
  }

  serializers[clazz.name] = serializer || {
    serialize(value: any) {
      return value.serialize();
    },
    deserialize(value: any) {
      const inst = new clazz();
      inst.deserialize(value);
      return value;
    }
  };
}

register(Array, {
  serialize: serializeArray,
  deserialize: deserializeArray
});

register(Object, {
  serialize(value: Object) {
    const ret  = {};
    for (const key in value) {
      ret[key] = serialize(key);
    }
    return ret;
  },
  deserialize(value: Object) {
    const ret  = {};
    for (const key in value) {
      ret[key] = deserialize(key);
    }
    return ret;
  }
});
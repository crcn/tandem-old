import { serializable, isSerializable } from "@tandem/common/serialize";

const getMetadataKey = (name) => `message:${name}`;

export const defineMessageMetadata = (name: string, value: any) => {
  return function(message) {
    Reflect.defineMetadata(getMetadataKey(name), value, message);

    if (!isSerializable(message)) {
      serializable()(message);
    }

    return message;
  }
}

export const getMessageMetadata = (name: string, message) => {
  const key = getMetadataKey(name);
  return Reflect.getMetadata(key, message) || Reflect.getMetadata(key, message.constructor);
}

export const setMessageTarget = (family: string) => {
  return defineMessageMetadata("target", family);
}

export const getMessageTarget = (message: any) => {
  return getMessageMetadata("target", message);
}

export const getMessageVisitors = (message: any) => {
  return getMessageMetadata( "visitors", message) || [];
}

export const addMessageVisitor = (...families: string[]) => {
  return function(message) {
    Reflect.defineMetadata(getMetadataKey("visitors"), (getMessageMetadata("visitors", message) || []).concat(families), message);
  }
}

const getMetadataKey = (name) => `message:${name}`;

export const defineMessageMetadata = (name: string, value: any) => {
  return function(message) {
    Reflect.defineMetadata(getMetadataKey(name), value, message);
  }
}

export const getMessageMetadata = (message, name: string) => {
  return Reflect.getMetadata(getMetadataKey(name), message);
}

export const setMessageTarget = (family: string) => {
  return defineMessageMetadata("target", family);
}

export const getMessageTarget = (message: any) => {
  return getMessageMetadata(message, "target");
}

export const getMessageVisitors = (message: any) => {
  return getMessageMetadata(message, "visitors") || [];
}

export const addMessageVisitor = (family: string) => {
  return function(message) {
    Reflect.defineMetadata(getMetadataKey("visitors"), (getMessageMetadata(message, "visitors") || []).concat(family), message);
  }
}

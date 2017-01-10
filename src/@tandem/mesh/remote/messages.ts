
export const setMessageClientId = (id: string, message: any) => {
  if (!Reflect.hasMetadata("clientId", message)) {
    Reflect.defineMetadata("clientId", id, message);
  }
}

export const getMessagetClientId = (message: any) => {
  return Reflect.getMetadata("clientId", message);
}
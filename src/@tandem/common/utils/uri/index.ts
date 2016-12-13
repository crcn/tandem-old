const URI_PROTOCOL_ID_REGEX = /^\w+:\/\//;

export const hasURIProtocol = (value) => URI_PROTOCOL_ID_REGEX.test(value);
export const removeURIProtocol = (value) => value.replace(URI_PROTOCOL_ID_REGEX, "");

export const parseURI = (value) => {
  // if (value.subd)
}
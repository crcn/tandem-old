import { KeyValue } from "./types";

export const stringifyStyle = (style: KeyValue<string>) => {
  let buffer = ``;

  for (const name in style) {
    if (style[name] == null) continue;
    buffer += `${name}:${style[name]};`;
  }

  return buffer;
};

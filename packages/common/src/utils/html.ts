export const stringifyStyle = (style: any) => {
  let buffer = ``;

  for (const name in style) {
    buffer += `${name}:${style[name]};`;
  }

  return buffer;
};

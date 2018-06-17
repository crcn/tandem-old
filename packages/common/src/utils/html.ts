export const stringifyStyle = (style: any) => {
  let buffer = ``;

  for (const name in style) {
    if (!style[name]) continue;
    buffer += `${name}:${style[name]};`;
  }

  return buffer;
};

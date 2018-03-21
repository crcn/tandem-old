export const repeat = (value: string, count: number) => {
  let buffer = "";
  for (let i = Math.max(count, 0); i--;) {
    buffer += value;
  }
  return buffer;
}
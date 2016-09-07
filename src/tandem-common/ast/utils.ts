
export function getStartWhitespace(str: string) {
  const search = /^[\s\r\n\t]+/;
  const match  = str.match(search);
  return match ? match[0] : "";
}

export function getReverseWhitespace(str: string) {
  const search = /[\s\r\n\t]+$/;
  const match  = str.match(search);
  return match ? match[0] : "";
}

import { parse } from "./parser.peg";

const _cache = {};
export const parseMarkup = (source: string) => {
  if (_cache[source]) return _cache[source].clone();
  return (_cache[source] = parse(source)).clone();
};
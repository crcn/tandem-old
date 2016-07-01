import { parse } from 'lang/xml/parser';
import translate from './translate';

export default function compile(source) {
  const ast = parse(source);
  return translate(ast);
}

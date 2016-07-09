import parseUnit from './parse-units';
import translateStyle from './translate-style';


export { translateStyleToIntegers } from './translate-style';
export { parseUnit, translateStyle, translateStyle as convertUnit };
import CSSTokenizer from 'common/tokenizers/css';

export function stringifyToken(token) {
  return token.value;
}

export function tokenize(source) {
  return CSSTokenizer.tokenize(String(source || ''));
}

export function translateLength(x1, y1, x2) {

  if (x1 === 0) {

  }

  var change = x2 - x1;

  var tokens = tokenize(y1);

  var left   = tokens.find(function(token) {
    return /number/.test(token.type);
  });

  if (left) {
    var v = Number(left.value);

    if (v < 0) {
      x1 += v;
      v   = 0;
    }

    if (v === 0) {
      v = 1;
      x1++;
    }
    v = (v * x2) / x1;

    left.value = Number(v.toFixed(2));
  }

  var ret = tokens.map(stringifyToken).join('');

  return ret;
}

export function calculateLengthInPixels(length) {
  if (!length) return 0;

  // could be somthing like 'normal'
  if (!CSSTokenizer.tokenize(String(length)).find(function(token) {
    return token.type === 'unit';
  })) {
    return length;
  }

  return length ? parseUnit(translateStyle(length, 'px'))[0] : 0;
}

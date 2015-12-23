export { default as parseUnit } from './parse-units';
import { CSSTokenizer } from 'common/components/text-editor';
export { default as translateStyle } from './translate-style';

/**
* calculates the correct zoom of an element
*/

export function calculateZoom(element) {
  var current = element;
  var zoom    = 1;

  while (current && current.style) {
    if (current.style.zoom !== '') {
      zoom *= Number(current.style.zoom);
    }
    current = current.parentNode;
  }

  return zoom;
}

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

// export function translateLengthToPixes()

export { default as convertUnit } from './translate-style';

export { default as parseUnit } from './parse-units';
import cssprima from 'cssprima';

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

var tokenStringifyMap = {
  Function: function(token) {
    return token.value + '(';
  },
  Percentage: function(token) {
    return token.value + '%';
  },
  Dimension: function(token) {
    return token.value + token.unit;
  },
  default: function(token) {
    return token.value;
  }
}

export function stringifyToken(token) {
  var stringify = tokenStringifyMap[token.type] || tokenStringifyMap.default;
  return stringify(token);
}

export function tokenize(source) {
  return cssprima.tokenize(String(source || ""));
}

export function translateLength(x1, y1, x2) {

  var tokens = tokenize(y1);

  var left   = tokens.find(function(token) {
    return /integer|number/.test(token.typeFlag);
  });

  if (left) {
    left.value = Number(((left.value * x2) / x1).toFixed(2));
  }

  var ret = tokens.map(stringifyToken).join('');

  return ret;
}

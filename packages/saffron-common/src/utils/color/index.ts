export function rgbaToArray(value) {

  var parts = value
  .match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(.*?)?\)/)
  .slice(1)
  .map(Number);

  if (parts[3] == void 0) {
    parts[3] = 1
  }

  return parts;
}

export function hexColorToArray(value) {
  var integer = parseInt('0x' + value.substr(1));
  return [(integer >> 16) & 0xFF, (integer >> 8) & 0xFF, integer & 0xFF, 1];
}

// TODO - more color maps here to prevent errors
var colorMap = {
  'black': '#000000'
};

export function parseColor(value) {
  if (colorMap[value]) return parseColor(colorMap[value]);
  if (value.substr(0, 3) === 'rgb') {
    return rgbaToArray(value);
  } else if(value.charAt(0) === '#') {
    return hexColorToArray(value);
  }
}

function _hexColor(integer) {
  var v = integer.toString('16');
  return v.length === 2 ? v : '0' + v;
}

export function stringifyColor(rgba) {

  // no transparency
  if (rgba.length === 3 || rgba[3] === 1) {
    return '#' + rgba.slice(0, 3).map(_hexColor).join('').toUpperCase();
  } else {
    return 'rgba(' + rgba.join(',') + ')';
  }
}

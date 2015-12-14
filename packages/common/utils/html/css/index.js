export { default as parseUnit } from './parse-units';

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


// TODO - move this to utils
export function multiplyStyle(style, zoom) {

  var zoomed = {};

  for (let key in style) {
    if (style.hasOwnProperty(key)) {
      const value = style[key];
      if (typeof value === 'number') {
        zoomed[key] = value * zoom;
      }
    }
  }

  return zoomed;
}

// TODO - move this to utils
export function divideStyle(style, zoom) {

  var zoomed = {};

  for (let key in style) {
    if (style.hasOwnProperty(key)) {
      const value = style[key];
      if (typeof value === 'number') {
        zoomed[key] = value / zoom;
      }
    }
  }

  return zoomed;
}


/**
* calculates the correct zoom of an element
*/

export function calculateZoom(element) {
  var current = element;
  var zoom    = 1;

  while (current) {

    if (current.style && current.style.zoom !== '') {
      zoom *= Number(current.style.zoom);
    }

    current = current.parentNode || current.host;

  }

  return zoom;
}

export function translateAbsoluteToRelativePoint(event, relativeElement) {

  var zoom = calculateZoom(relativeElement);

  var left = event.clientX || event.left;
  var top  = event.clientY || event.top;

  var bounds   = relativeElement.getBoundingClientRect();

  var rx = (left / zoom) - bounds.left;
  var ry = (top / zoom)  - bounds.top;

  return { left: rx, top: ry };
}



// TODO - move this to utils
export function multiplyStyle(style, zoom) {

  var zoomed = {};

  for (var key in style) {
    var value = style[key];
    if (typeof value === 'number') {
      zoomed[key] = value * zoom;
    }
  }

  return zoomed;
}

// TODO - move this to utils
export function divideStyle(style, zoom) {

  var zoomed = {};

  for (var key in style) {
    var value = style[key];
    if (typeof value === 'number') {
      zoomed[key] = value / zoom;
    }
  }

  return zoomed;
}

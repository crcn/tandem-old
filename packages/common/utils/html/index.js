
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

export function translateAbsoluteToRelativePoint(event, relativeElement) {

  var zoom = calculateZoom(relativeElement);

  var left = event.clientX || event.left;
  var top  = event.clientY || event.top;

  var bounds   = relativeElement.getBoundingClientRect();

  var rx = (left / zoom) - bounds.left;
  var ry = (top / zoom)  - bounds.top;

  return { left: rx, top: ry };
}

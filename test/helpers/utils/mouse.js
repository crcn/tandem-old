export function dragElement(element, points) {

  var point = points.shift();

  //todo - make this into a util - mouseUtils.drag(element, { left: 100, top: 100 })
  element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: point.left, clientY: point.top }));

  for (point of points) {
    document.dispatchEvent(new MouseEvent('mousemove', {bubbles: true, clientX: point.left, clientY: point.left }));
  }


  document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
}

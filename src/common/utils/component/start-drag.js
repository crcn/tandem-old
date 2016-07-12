import throttle from 'lodash/function/throttle';

export default function(startEvent, update, stop) {

  var sx = startEvent.clientX;
  var sy = startEvent.clientY;
  var doc = startEvent.target.ownerDocument;

  //update = throttle(update, 10);

  function drag(event) {

    // stops text from getting highlighted
    event.preventDefault();
    update(event, {
      delta: {
        x: event.clientX - sx,
        y: event.clientY - sy
      }
    });
  }

  function cleanup() {
    doc.removeEventListener('mousemove', drag);
    doc.removeEventListener('mouseup', cleanup);
    if (stop) stop();
  }

  doc.addEventListener('mousemove', drag);
  doc.addEventListener('mouseup', cleanup);

  return {
    dispose: cleanup
  }
}

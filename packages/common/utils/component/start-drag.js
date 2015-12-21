import throttle from 'lodash/function/throttle';

export default function(startEvent, update) {

  var sx = startEvent.clientX;
  var sy = startEvent.clientY;

  update = throttle(update, 20);

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
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', cleanup);
  }

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', cleanup)
}

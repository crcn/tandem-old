module.exports = function(event, update) {

  var sx = event.clientX;
  var sy = event.clientY;

  function drag(event) {
    update({
      leftDelta : event.clientX - sx,
      topDelta  : event.clientY - sy
    });
  }

  function cleanup() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', cleanup);
  }

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', cleanup)
}

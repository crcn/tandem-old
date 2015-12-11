module.exports = function(event, update) {

  function drag(event) {
    update(event);
  }

  function cleanup() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', cleanup);
  }

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', cleanup)
}

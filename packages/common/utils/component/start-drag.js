import throttle from 'lodash/function/throttle';

module.exports = function(event, update) {

  update = throttle(update, 20);

  function drag(event) {

    // stops text from getting highlighted
    event.preventDefault();
    update(event);
  }

  function cleanup() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', cleanup);
  }

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', cleanup)
}

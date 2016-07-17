export default function (iframe) {
  var window = iframe.contentWindow;
  var body   = window.document.body;

  // TODO - this should be in its own util function
  function bubbleEvent(event) {
    var clonedEvent = new Event(event.type, {
      bubbles: true,
      cancelable: true
    });

    for (var key in event) {
      var value = event[key];
      if (typeof value === 'function') {
        value = value.bind(event);
      }
      // bypass read-only issues here
      try {
        clonedEvent[key] = value;
      } catch (e) { }
    }

    iframe.dispatchEvent(clonedEvent);

    if (clonedEvent.defaultPrevented) {
      event.preventDefault();
    }
  }

  const eventTypes = [
    'keypress',
    'copy',
    'paste',
    'mousemove',
    'keyup',
    'keydown'
  ];

  for (const eventType of eventTypes) {
    body.addEventListener(eventType, bubbleEvent);
  }

  window.addEventListener('wheel', bubbleEvent);
  window.addEventListener('scroll', bubbleEvent);
}

export default function (iframe) {
  const window = iframe.contentWindow;
  const body   = window.document.childNodes[0];

  // TODO - this should be in its own util function
  function bubbleEvent(event) {
    const clonedEvent = new Event(event.type, {
      bubbles: true,
      cancelable: true
    });

    for (let key in event) {
      let value = event[key];
      if (typeof value === "function") {
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
    "keypress",
    "copy",
    "paste",
    "mousemove",
    "keyup",
    "keydown"
  ];

  for (let eventType of eventTypes) {
    body.addEventListener(eventType, bubbleEvent);
  }

  window.addEventListener("wheel", bubbleEvent);
  window.addEventListener("scroll", bubbleEvent);
}

export default function (iframe) {
  const window = iframe.contentWindow;
  const body   = window.document.body;

  // TODO - this should be in its own util function
  function bubbleEvent(event) {
    const clonedEvent = new Event(event.type, {
      bubbles: true,
      cancelable: true
    });

    for (const key in event) {
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

  for (const eventType of eventTypes) {
    body.addEventListener(eventType, bubbleEvent);
  }

  window.addEventListener("wheel", bubbleEvent);
  window.addEventListener("scroll", bubbleEvent);
}

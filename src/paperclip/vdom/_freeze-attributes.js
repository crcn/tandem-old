class ScriptAttributesBinding {
  constructor(view, ref, scriptAttributes) {
    this.view             = view;
    this.ref              = ref;
    this.scriptAttributes = scriptAttributes;
  }

  update() {
    for (var key in this.scriptAttributes) {
      var value = this.scriptAttributes[key];
      this.ref.setAttribute(key, value(this.view.context));
    }
  }
}

class ScriptAttributeHydrator {
  constructor(attributes) {
    this.attributes = attributes;
  }

  prepare() {

  }

  hydrate({ view, ref, bindings }) {
    bindings.push(new ScriptAttributesBinding(view, ref, this.attributes));
  }
}

class EventListenerHydrator {
  constructor(attributes) {
    this.attributes = attributes;
  }

  prepare() {

  }

  hydrate({ view, ref }) {
    for (let key in this.attributes) {
      let listener = this.attributes[key];
      ref.addEventListener(key.substr(2), (event) => {
        listener(event, view);
      });
    }
  }
}

export default function freeze(attributes, options, createAttributesHydrator) {
  var attributeHydrators = [];
  var staticAttributes   = {};
  var dynamicAttributes  = {};
  var eventListenerAttributes = {};

  // todo - check for script attributes
  for (var key in attributes) {
    var value = attributes[key];

    if (typeof value === 'object') {
      if (value.freezeAttribute) {
        value = value.freezeAttribute({ ...options, key, hydrators: attributeHydrators });
        continue;
      }
    }

    if (typeof value === 'function') {
      if (/^on/.test(key)) {
        eventListenerAttributes[key] = value;
      } else {
        dynamicAttributes[key] = value;
      }
      continue;
    }

    staticAttributes[key] = value;
  }

  if (Object.keys(dynamicAttributes).length) {
    attributeHydrators.push(new ScriptAttributeHydrator(dynamicAttributes));
  }

  if (Object.keys(eventListenerAttributes).length) {
    attributeHydrators.push(new EventListenerHydrator(eventListenerAttributes));
  }

  return {
    attributeHydrators : attributeHydrators,
    staticAttributes   : staticAttributes
  };
}

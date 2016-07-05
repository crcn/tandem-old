class ScriptAttributesBinding {
  constructor(view, ref, scriptAttributes) {
    this.view             = view;
    this.ref              = ref;
    this.scriptAttributes = scriptAttributes;
  }

  update() {
    for (var key in this.scriptAttributes) {
      this.ref.setAttribute(key, this.scriptAttributes[key](this.view.context));
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

export default function freeze(attributes, options, createAttributesHydrator) {
  var attributeHydrators = [];
  var staticAttributes   = {};
  var dynamicAttributes  = {};

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
      dynamicAttributes[key] = value;
      continue;
    }

    staticAttributes[key] = value;
  }

  if (Object.keys(dynamicAttributes).length) {
    attributeHydrators.push(new ScriptAttributeHydrator(dynamicAttributes));
  }

  return {
    attributeHydrators : attributeHydrators,
    staticAttributes   : staticAttributes
  };
}

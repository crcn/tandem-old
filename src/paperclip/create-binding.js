import NodeSection from './section/node';
import FragmentSection from './section/fragment';

function get(target, path) {
  var ctarget = target;
  for (var segment of path) {
    ctarget = ctarget[segment];
    if (!ctarget) break;
  }
  return ctarget;
}

function observe(target, onChange) {
  if (target.observe) {
    return target.observe({ dispatch: onChange });
  } else {
    return { dispose() {} };
  }
}

function observeProperty(target, path, listener) {
  var oldValue;
  var listeners = [];
  var observer = {};

  function onChange() {
    reset();
    listener();
  }

  function reset() {
    listeners.forEach(function(listener) {
      listener.dispose();
    });

    listeners = [];

    var ctarget = target;

    for (var segment of path) {
      if (ctarget) {
        listeners.push(observe(ctarget, onChange));
        ctarget = ctarget[segment];
      }
    }

    if (ctarget) {
      listeners.push(observe(ctarget, onChange));
    }

    observer.value = ctarget;
  }

  reset();

  return observer;
}

function observeProperties(view, properties, map, listener) {

  var observers = properties.map((property) => {
    return observeProperty(view, ['context', ...property.split('.')], onChange);
  });

  function getValue() {
    return map.apply(this, observers.map(function(observer) {
      return observer.value;
    }));
  }

  function onChange() {
    listener(getValue());
  }

  return getValue();
}

class NodeBinding {
  constructor(view, section, properties, map) {
    this.view       = view;
    this.section    = section;
    this.value = observeProperties(view, properties, map, this._onChange.bind(this));
  }

  _onChange(value) {
    this.value = value;
  }

  update() {
    if (this.section._start) {
      this.section.removeChildNodes();
      if (this.value) {
        this.section.appendChild(this.value);
      }
    } else {
      this.section.targetNode.nodeValue = this.value;
    }
  }
}

class NodeHydrator {
  constructor(properties, map, section) {
    this.properties = properties;
    this.map        = map;
    this.section    = section;
  }

  prepare() {
    this._marker = this.section.createMarker();
  }

  hydrate({ view, bindings }) {
    bindings.push(new NodeBinding(view, this._marker.createSection(view.section.targetNode), this.properties, this.map));
  }
}

class AttributeBinding {
  constructor(view, ref, key, properties, map) {
    this.view = view;
    this.ref  = ref;
    this.key  = key;
    this.properties = properties;
    this.map = map;
  }

  _onChange(value) {
    this.ref.setAttribute(this.key, value);
  }

  update() {
    if (!this._initialized) {
      this._initialized = true;
      this._onChange(observeProperties(this.view, this.properties, this.map, this._onChange.bind(this)));
    }
  }
}

class AttributeHydrator {
  constructor(key, properties, map) {
    this.key        = key;
    this.properties = properties;
    this.map        = map;
  }

  prepare() { }

  hydrate({ view, ref, bindings }) {
    bindings.push(new AttributeBinding(view, ref, this.key, this.properties, this.map));
  }
}

function createBinding(type, ...args) {

  if (typeof args[args.length - 1] === 'function') {
    var map = args.pop();
  } else {
    var map = function(value) {
      return value;
    }
  }

  return {
    freezeAttribute({ key, hydrators }) {
      hydrators.push(new AttributeHydrator(key, args, map));
      return void 0;
    },
    freezeNode({ hydrators }) {

      if (type === 'text') {
        var section = NodeSection.create(document.createTextNode(''));
      } else {
        var section = FragmentSection.create();
      }

      hydrators.push(new NodeHydrator(args, map, section));
      return section.toFragment();
    }
  };
}

export const createTextBinding = createBinding.bind(this, 'text');
export const createHTMLBinding = createBinding.bind(this, 'html');

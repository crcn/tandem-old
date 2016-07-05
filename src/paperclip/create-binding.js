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
        }
        ctarget = ctarget[segment];
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

  function onChange() {
    listener(map.apply(this, observers.map(function(observer) {
      return observer.value;
    })));
  }

  onChange();
}

class NodeBinding {
  constructor(view, section, properties, map) {
    this.view       = view;
    this.section    = section;
    observeProperties(view, properties, map, this._onChange.bind(this))
  }

  _onChange(value) {
    if (this.section._start) {
      this.section.removeChildNodes();
      if (value) {
        this.section.appendChild(value);
      }
    } else {
      this.section.targetNode.nodeValue = value;
    }
  }

  update() {

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
    observeProperties(view, properties, map, this._onChange.bind(this));
  }

  _onChange(value) {
    this.ref.setAttribute(this.key, value);
  }

  update() { }
}

class AttributeHydrator {
  constructor(key, properties, map) {
    this.key        = key;
    this.properties = properties;
    this.map        = map;
  }

  prepare() {

  }

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

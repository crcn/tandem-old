import NodeSection from './section/node';


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

    listeners.push(observe(target, onChange));

    var ctarget = target;

    for (var segment of path) {
        ctarget = ctarget[segment];
        if (ctarget) {
          listeners.push(observe(ctarget, onChange));
        }
    }

    observer.value = ctarget;
  }

  reset();

  return observer;
}

class NodeBinding {
  constructor(view, section, properties, map) {
    this.view       = view;
    this.section    = section;
    this.properties = properties;
    this.map        = map;

    this._observers = properties.map((property) => {
      return observeProperty(view, ['context', ...property.split('.')], this._onChange.bind(this));
    });

    this._onChange();
  }

  _onChange() {
    this.section.targetNode.nodeValue = this.map.apply(this, this._observers.map(function(observer) {
      return observer.value;
    }))
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

export default function createBinding(...args) {

  if (typeof args[args.length - 1] === 'function') {
    var map = args.pop();
  } else {
    var map = function(value) {
      return value;
    }
  }


  return {
    freeze({ hydrators }) {
      var node = document.createTextNode('');
      hydrators.push(new NodeHydrator(args, map, NodeSection.create(node)));
      return node;
    }
  };
}

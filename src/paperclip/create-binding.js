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

  function onChange() {

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


    listener(ctarget);
  }

  onChange();
}

class NodeBinding {
  constructor(view, section, property) {
    this.view     = view;
    this.section  = section;
    this.property = property;

    observeProperty(view, ['context', ...property.split('.')], this._onChange.bind(this));
  }

  _onChange(newValue) {
    this.section.targetNode.nodeValue = newValue || '';
  }

  update() {

  }
}

class NodeHydrator {
  constructor(property, section) {
    this.property = property;
    this.section  = section;
  }

  prepare() {
    this._marker = this.section.createMarker();
  }

  hydrate({ view, bindings }) {
    bindings.push(new NodeBinding(view, this._marker.createSection(view.section.targetNode), this.property));
  }
}

export default function createBinding(property) {


  return {
    freeze({ hydrators }) {
      var node = document.createTextNode('');
      hydrators.push(new NodeHydrator(property, NodeSection.create(node)));
      return node;
    }
  };
}

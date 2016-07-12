import Entity from '../index';

// temporary
function parseStyle(source) {
  var style = {};
  source.split(/\s*;\s*/g).forEach(function(declaration) {
    var [name, value] = declaration.split(/\s*:\s*/g);
    name = name.split('-').map(function(name, index) {
      if (index == 0) return name;
      return name.substr(0, 1).toUpperCase() + name.substr(1);
    }).join('');

    if (/\w+/.test(name)) {
      style[name] = value;
    }
  });
  return style;
}

export default class DisplayEntity extends Entity {
  constructor(properties) {
    super({
      type: 'display',
      ...properties
    })
  }

  set attributes(value) {
    super.attributes = value;
    if (value.style) {
      this.style = value.style;
    }
  }

  get attributes() {
    return super.attributes;
  }

  set style(value) {
    if (typeof value === 'string') {
      value = parseStyle(value);
    }
    this.attributes.style = value;
  }

  get style() {
    return this.attributes.style || {};
  }
}

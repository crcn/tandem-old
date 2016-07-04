import _each from 'common/utils/object/each';

export default class RepeatComponent {
  constructor({ view, childNodesTemplate }) {
    this.view               = view;
    this.childNodesTemplate = childNodesTemplate;
    this.attributes         = {};

    this._children = [];
  }

  setAttribute(key, value) {
    this.attributes[key] = value;
  }

  getAttribute(key) {
    return this.attributes[key];
  }

  update() {
    var { each, as }       = this.attributes;
    var { context, section }  = this.view;
    var childNodesTemplate = this.childNodesTemplate;

    var i = 0;
    var n = this._children.length;

    _each(each, (item, key) => {
      var child;

      var context = {
        [as]: item
      };

      if (i < n) {
        child = this._children[i];
        Object.assign(child.context, context);
        child.update();
      } else {
        child = childNodesTemplate.createView(context);
        this._children.push(child);
        section.appendChild(child.toFragment());
      }

      i++;
    });

    // remove any components at the end
    while(this._children.length > i) {
      this._children.pop().remove();
    }
  }
}

import _each from 'common/utils/object/each';

export default class RepeatComponent {
  constructor({ view, attributes, childNodesTemplate }) {
    this.view               = view;
    this.attributes         = attributes;
    this.childNodesTemplate = childNodesTemplate;

    this._children = [];
  }

  static freeze({ nodeFactory }) {
    return nodeFactory.createElement('div');
  }

  update() {
    var { each, as }       = this.attributes;
    var { context, node }  = this.view;
    var childNodesTemplate = this.childNodesTemplate;

    var i = 0;
    var n = this._children.length;

    _each(each(context), (item, key) => {
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
        node.appendChild(child.node);
      }

      i++;
    });

    while(this._children.length > i) {
      this._children.pop().remove();
    }
  }
}

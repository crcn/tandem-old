import _each from 'common/utils/object/each';
import { BaseComponent } from 'paperclip';

export default class RepeatComponent extends BaseComponent {
  constructor(properties) {
    super(properties);
    this._children = [];
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

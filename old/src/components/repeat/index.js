import _each from 'common/utils/object/each';
import { BaseComponent } from 'paperclip';

export default class RepeatComponent extends BaseComponent {
  constructor(properties) {
    super(properties);
    this._children = [];
  }

  update() {
    super.update();
    var { each, as }       = this.context;
    var { context, section }  = this.view;
    var childNodesTemplate = this.childNodesTemplate;

    var i = 0;
    var n = this._children.length;

    _each(each, (item, key) => {

      var child;

      var context = {
        '[[parent]]': this.view.context,
        [as]: item
      };

      if (i < n) {
        child = this._children[i];
        Object.assign(child.context, context);
        child.update();
      } else {
        child = childNodesTemplate.create(context, { parent: this.view });
        this._children.push(child);
        section.appendChild(child.render());
      }

      i++;
    });

    // remove any components at the end
    while(this._children.length > i) {
      this._children.pop().remove();
    }
  }
}

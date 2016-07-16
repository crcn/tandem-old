import { FactoryFragment } from 'common/fragments';
import CoreObject from 'common/object';
import sass from 'sass.js';

export default class StyleEntityController extends CoreObject {
  setAttribute(key, value) {

  }

  async load({ section }) {
    var source = this.entity.expression.childNodes[0].nodeValue;

    var { text } = await new Promise((resolve) => {
      sass.compile(source, resolve);
    });

    console.log(text);

    var node = this.node = document.createElement('style');
    node.setAttribute('type', 'text/css');
    node.appendChild(document.createTextNode(text));

    section.appendChild(node);
  }

  update() {

  }
}

export const fragment = FactoryFragment.create({
  ns: 'entity-controllers/style',
  test(entity) {
    return entity.attributes.type === 'text/scss';
  },
  factory: StyleEntityController
});

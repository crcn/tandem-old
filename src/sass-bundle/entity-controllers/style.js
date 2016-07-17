import { FactoryFragment } from 'common/fragments';
import CoreObject from 'common/object';
import sass from 'sass.js';


export default class StyleEntityController extends CoreObject {
  setAttribute(key, value) {

  }

  async load({ section }) {
    var source = this.entity.expression.childNodes[0].nodeValue;

    sass.importer(async (request, resolve) => {
      resolve((await this.bus.execute({
        type: 'readFile',
        path: request.resolved
      }).read()).value);
    });

    var { text } = await new Promise((resolve, reject) => {
      sass.compile(source, { inputPath: this.file.path }, function (result) {
        if (result.text) return resolve(result);
        reject(result);
      });
    });

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

import { ClassFactoryFragment } from 'saffron-common/src/fragments/index';
import CoreObject from 'saffron-common/src/object/index';
import * as sass from 'sass.js';
import FragmentSection from 'saffron-common/src/section/fragment';

export default class StyleEntityController extends CoreObject {

  public section:any;
  public entity:any;
  public file:any;
  public node:any;

  constructor(properties) {
    super(properties);
    this.section = new FragmentSection();
    this.entity.visible = false;
  }

  setAttribute(key, value) { }

  async load({ section }) {
    var source = this.entity.expression.childNodes[0].nodeValue;

    // TODO
    // const _watchFile = async (path) => {
    //   var stream = this.bus.execute({
    //     type: 'watchFile',
    //     path: path
    //   });
    //   let value;
    //   while ({ value } = await stream.read()) {
    //     console.log(value);
    //   }
    // };

    sass.importer(async (request, resolve) => {
      // _watchFile(request.resolved);
      resolve((await (this as any).bus.execute({
        type: 'readFile',
        path: request.resolved
      }).read()).value);
    });

    var { text } = (await new Promise((resolve, reject) => {
      sass.compile(source, { inputPath: this.file.path }, function (result) {
        if (result.text) return resolve(result);
        reject(result);
      });
    })) as any;

    var node = this.node = document.createElement('style');
    node.setAttribute('type', 'text/css');
    node.appendChild(document.createTextNode(text));

    section.appendChild(node);
  }

  update() {

  }
}

class EntityControllerFactoryFragment extends ClassFactoryFragment {
  constructor(ns:string, clazz:{new(properties):StyleEntityController}, public test:Function) {
    super(ns, clazz);
  }
}

export const fragment = new EntityControllerFactoryFragment('entity-controllers/style', StyleEntityController, (entity) => (
  entity.attributes.type === 'text/scss'
));

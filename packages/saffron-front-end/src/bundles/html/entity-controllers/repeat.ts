import FragmentSection from 'saffron-common/src/section/fragment';
import { ClassFactoryFragment } from 'saffron-common/src/fragments/index';

export default class RepeatEntityController {

  public attributes:any;
  public expression:any;
  public entity:any;

  constructor(properties) {
    Object.assign(this, properties);
  }

  setAttribute(key, value) {
    this.attributes[key] = value;
  }

  async load(options) {

    var each = Number(this.attributes.each);

    for (var i = each; i--;) {
      for (var childExpression of this.expression.childNodes) {
        var childSection = new FragmentSection();
        this.entity.appendChild(await childExpression.load(Object.assign({}, options, {
          section: childSection
        })));

        options.section.appendChild(childSection.toFragment());
      }
    }

  }
}

export const fragment = new ClassFactoryFragment('entity-controllers/repeat', RepeatEntityController);
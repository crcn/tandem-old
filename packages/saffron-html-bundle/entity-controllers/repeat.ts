import FragmentSection from 'saffron-common/lib/section/fragment';

import { create } from 'saffron-common/lib/utils/class/index';
import { FactoryFragment } from 'saffron-common/lib/fragments/index';

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
        var childSection = FragmentSection.create();
        this.entity.appendChild(await childExpression.load(Object.assign({}, options, {
          section: childSection
        })));

        options.section.appendChild(childSection.toFragment());
      }
    }

  }

  static create = create;
}

export const fragment = new FactoryFragment({
  ns      : 'entity-controllers/repeat',
  factory : RepeatEntityController,
});

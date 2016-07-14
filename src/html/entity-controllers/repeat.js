import FragmentSection from 'common/section/fragment';

import { create } from 'common/utils/class';
import { FactoryFragment } from 'common/fragments';

export default class RepeatEntityController {
  constructor(properties) {
    Object.assign(this, properties);
  }

  setAttribute(key, value) {
    this.attributes[key] = value;
  }

  async execute(options) {

    var each = Number(this.attributes.each);

    for (var i = each; i--;) {
      for (var childExpression of this.expression.childNodes) {
        var childSection = FragmentSection.create();
        this.entity.appendChild(await childExpression.execute({
          ...options,
          section: childSection,
        }));

        options.section.appendChild(childSection.toFragment());
      }
    }

  }

  static create = create;
}

export const fragment = FactoryFragment.create({
  ns      : 'entity-controllers/repeat',
  factory : RepeatEntityController,
});

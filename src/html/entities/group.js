import Entity from 'common/entities/entity';
import { FactoryFragment } from 'common/fragments';
import FragmentSection from 'common/section/fragment';

export default class GroupEntity extends Entity {
  constructor(properties) {
    super(properties);

  }
  async execute(options) {
    var section = this.section = FragmentSection.create();
    for (var childExpression of this.expression.childNodes) {
      this.appendChild(await childExpression.execute({
        ...options,
        section
      }));
    }
  }
}

export const fragment = FactoryFragment.create({
  ns: 'entities/group',
  factory: GroupEntity
});

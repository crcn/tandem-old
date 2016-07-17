import GroupEntity from './group';
import { FactoryFragment } from 'saffron-common/fragments';
import FragmentSection from 'saffron-common/section/fragment';

export default class RootEntity extends GroupEntity {
  constructor(properties) {
    super(properties);
    this.section = FragmentSection.create();
  }
  async load(options) {
    await super.load({
      options,
      section: this.section
    });
  }
}

export const fragment = FactoryFragment.create({
  ns: 'entities/root',
  factory: GroupEntity,
});

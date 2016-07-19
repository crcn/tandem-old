import GroupEntity from './group';
import { FactoryFragment } from 'saffron-common/lib/fragments/index';
import FragmentSection from 'saffron-common/lib/section/fragment';

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

export const fragment = new FactoryFragment({
  ns: 'entities/root',
  factory: GroupEntity,
});

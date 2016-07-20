import GroupEntity from './group';
import { ClassFactoryFragment } from 'saffron-common/src/fragments/index';
import FragmentSection from 'saffron-common/src/section/fragment';

export default class RootEntity extends GroupEntity {
  constructor(properties) {
    super(properties);
    this.section = new FragmentSection();
  }
  async load(options) {
    await super.load({
      options,
      section: this.section
    });
  }
}

export const fragment = new ClassFactoryFragment('entities/root', GroupEntity);
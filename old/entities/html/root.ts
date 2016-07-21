import GroupEntity from './group';
import { ClassFactoryFragment } from 'saffron-common/src/fragments/index';
import FragmentSection from 'saffron-front-end/src/section/fragment';
import { RootExpression } from '../../parsers/expressions';

export default class RootEntity extends GroupEntity<RootExpression> {
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
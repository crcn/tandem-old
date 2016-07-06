import { FactoryFragment } from 'common/fragments';
import { dom, freeze } from '../index';

export class ComponentFactoryFragment extends FactoryFragment {
  constructor(ns, Component) {
    super(ns, {
      create(...args) {
        return freeze(<Component />).createView(...args);
      }
    })
  }
}

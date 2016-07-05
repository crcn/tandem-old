import { FactoryFragment } from 'common/fragments';
import { dom, freeze } from '../index';

export class ComponentFactoryFragment extends FactoryFragment {
  constructor(ns, Component) {
    super(ns, {
      create(context) {
        return freeze(<Component />).createView(context);
      }
    })
  }
}

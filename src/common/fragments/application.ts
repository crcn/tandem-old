import FactoryFragment from './factory';
import IFactory from 'common/utils/class/ifactory';

export const APPLICATION_NS = 'application';

class ApplicationFragment extends FactoryFragment {
  constructor(factory:IFactory) {
    super(APPLICATION_NS, factory);
  }
}

export default ApplicationFragment;
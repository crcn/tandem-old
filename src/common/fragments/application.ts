import BaseApplication from 'common/application/base';
import FactoryFragment from './factory';
import { APPLICATION as APPLICATION_NS } from './namespaces';

class ApplicationFragment extends FactoryFragment {
  constructor(create:(app:BaseApplication) => void) {
    super(APPLICATION_NS, { create: create });
  }
}

export default ApplicationFragment;
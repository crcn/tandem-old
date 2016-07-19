import { Fragment } from '../../fragments/index';
import assertPropertyExists from '../../utils/assert/property-exists';

export const APPLICATION_NS = 'application';

export class ApplicationFragment extends Fragment {
  constructor(properties) {
    super(properties);
    assertPropertyExists(this, 'initialize', Function);
  }
}

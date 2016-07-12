import { Fragment } from 'common/fragments';
import assertPropertyExists from 'common/utils/assert/property-exists';

export const APPLICATION_NS = 'application';

export class ApplicationFragment extends Fragment {
  constructor(properties) {
    super(properties);
    assertPropertyExists(this, 'initialize', Function);
  }
}

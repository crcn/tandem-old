import { Fragment } from 'common/fragments';
import assertPropertyExists from 'common/utils/assert/property-exists';

export const APPLICATION_NS = 'application';

export class ApplicationFragment extends Fragment {
  constructor(ns, initialize) {
    super(`${APPLICATION_NS}/${ns}`);
    this.initialize = initialize;
    assertPropertyExists(this, 'initialize', Function);
  }
}

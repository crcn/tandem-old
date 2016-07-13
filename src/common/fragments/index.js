import create from 'common/utils/class/create';
import assertPropertyExists from 'common/utils/assert/property-exists';

export class Fragment {
  constructor(properties) {
    Object.assign(this, properties);
    assertPropertyExists(this, 'ns');
  }

  static create = create;
}

export class FactoryFragment extends Fragment {
  constructor(properties) {
    super(properties);
    assertPropertyExists(this, 'factory');
  }

  create(...rest)  {
    return this.factory.create(...rest);
  }
}

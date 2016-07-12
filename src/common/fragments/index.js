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
  constructor(ns, factory) {
    super({ ns: ns });
    this._factory = factory;
    assertPropertyExists(this, 'factory');
  }

  create()  {
    return this._factory.create(...arguments);
  }

  get factory() {
    return this._factory;
  }
}

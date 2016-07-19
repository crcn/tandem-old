import create from '../utils/class/create';
import assertPropertyExists from '../utils/assert/property-exists';

export class Fragment {
  constructor(properties:any) {
    Object.assign(this, properties);
    assertPropertyExists(this, 'ns');
  }

  static create = create;
}

export class FactoryFragment extends Fragment {

  public factory:{ create:Function }; 

  constructor(properties:any) {
    super(properties);
    assertPropertyExists(this, 'factory');
  }

  create(...rest)  {
    return this.factory.create(...rest);
  }
}

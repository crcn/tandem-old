import assertPropertyExists from '../utils/assert/property-exists';

export class Fragment {
  constructor(public ns:string) {
    this.ns = ns;
  }
}

export class FactoryFragment extends Fragment {
  constructor(public ns:string, public factory:{ create:Function }) {
    super(ns);
  }

  create(...rest)  {
    return this.factory.create(...rest);
  }
}

export class ClassFactoryFragment extends FactoryFragment {
  constructor(ns, clazz:any) {
    super(ns, { create: (...rest) => new clazz(...rest) });
  }
}
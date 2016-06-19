import BaseFragment from './Base';
import IFactory from 'common/utils/class/IFactory';

export default class FactoryFragment extends BaseFragment implements IFactory {

  private _factory:IFactory;

  constructor(ns:String, factory:IFactory) {
    super(ns);
    this._factory = factory;
  }

  create(...args) {
    return this._factory.create(...args);
  }

  static create(ns:String, factory:IFactory) {
    return new FactoryFragment(ns, factory);
  }
}
import IFragment from './IFragment';

export default class Fragment implements IFragment {

  private _ns:String;

  constructor(namespace:String) {
    this._ns = namespace;
  }

  public get ns():String {
    return this._ns;
  }
}

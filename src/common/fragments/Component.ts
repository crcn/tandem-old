import * as React from 'react';
import BaseFragment from './Base';

export default class ComponentFactory extends BaseFragment {

  private _componentClass:React.ComponentClass<{}>;

  constructor(ns:string, componentClass:React.ComponentClass<{}>) {
    super(ns)
    this._componentClass = componentClass;
  }

  create(props) {
    return React.createElement(this._componentClass, props);
  }

  static create(ns:string, componentClass:React.ComponentClass<{}>):ComponentFactory {
    return new ComponentFactory(ns, componentClass);
  }
}
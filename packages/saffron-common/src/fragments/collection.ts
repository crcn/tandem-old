import * as assert from 'assert';
import createFactory from '../utils/class/create-factory';
import { flattenDeep as flatten } from 'lodash';
import { BaseCollection } from '../object/collection';
import { Fragment } from './index';

export default class FragmentCollection extends BaseCollection<Fragment> {

  private _fragmentsByNamespace:Object;

  constructor(properties = {}) {
    super(properties);
    this._fragmentsByNamespace = {};
  }

  query(ns) {
    return this.queryAll(ns)[0];
  }

  queryAll(ns) {
    return this._fragmentsByNamespace[ns] || [];
  }

  createChild() {
    var child = FragmentCollection.create();
    child.register(this.queryAll('/**'));
    return child;
  }

  register(...fragments) {
    fragments = flatten(fragments);
    this.push(...fragments);

    for (const fragment of fragments) {

      // this happens enough -- make a useful message
      assert(fragment, 'fragment cannot be undefined');

      const ns = fragment.ns;
      const nsParts = ns.split('/');

      for (let i = 0, n = nsParts.length; i <= n; i++) {
        this._registerNS(
          nsParts.slice(0, i).join('/') + '/**',
          fragment
        );
      }

      this._registerNS(fragment.ns, fragment);
    }
  }

  _registerNS(ns, fragment) {
    var collection;
    if (!(collection = this._fragmentsByNamespace[ns])) {
      collection = this._fragmentsByNamespace[ns] = [];
    }

    collection.push(fragment);

    collection = collection.sort((a, b) => (
      a.priority > b.priority ? -1 : 1
    ));

  }

  public static create(properties:any = undefined):FragmentCollection {
    return this._create(properties) as FragmentCollection;
  }

  static _create = createFactory(Array);
}
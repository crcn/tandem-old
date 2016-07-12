import create from 'common/utils/class/create';
import flatten from 'lodash/array/flattenDeep';
import assert from 'assert';

export default class FragmentDictionary {

  constructor() {
    this._fragments            = [];
    this._fragmentsByNamespace = {};
  }

  query(ns) {
    return this.queryAll(ns)[0];
  }

  queryAll(ns) {
    return this._fragmentsByNamespace[ns] || [];
  }

  register(...fragments) {
    fragments = flatten(fragments);
    this._fragments.push(...fragments);

    for (const fragment of fragments) {

      // this happens enough -- make a useful message
      assert(fragment, 'fragment cannot be undefined');

      const ns = fragment.ns;
      const nsParts = ns.split('/');

      for (let i = 0, n = nsParts.length; i < n; i++) {
        this._registerNS(
          nsParts.slice(0, i + 1).join('/') + '/**',
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
  }

  static create = create;
}

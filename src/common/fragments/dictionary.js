import Collection from 'common/object/collection';
import create from 'common/class/utils/create';
import flatten from 'lodash/array/flattenDeep';

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

    for (var fragment of fragments) {
      var ns = fragment.ns;
      var nsParts = ns.split('/');

      for (var i = 0, n = nsParts.length; i < n; i++) {
        this._registerNS(
          nsParts.slice(0, i + 1).join('/') + '/**',
          fragment
        )
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

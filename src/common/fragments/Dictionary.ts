import Collection from 'common/collection/Collection';
import IFragment from './IFragment';

class FragmentDictionary extends Collection {

  private _fragments:Object;

  query(ns:String) {
    if (!this._fragments) return [];
  }

  splice(...args) {
    super.splice(...args);
    this._reset();
  }

  _reset() {
    this._fragments = {};
    for (var fragment of this) {
      var nsParts = fragment.ns.split('/');
      for(var i = 0, n = nsParts.length; i < n; i++) {
        var path = nsParts.slice(i, n).join('/');
        if (!this._fragments[path]) this._fragments[path] = [];
        this._fragments[path].push(fragment); 
      }
    }
  }
}

export default Collection;

import sift from 'sift';
import Fragment from './fragment';
import BaseCollection from 'common/collection';
import { ExistsError } from 'common/errors';

// TODO - registry should not be a collection here - reg
// object instead
class Registry extends BaseCollection {

  constructor(options, initialFragments = []) {
    super(options);

    this.query    = _memoize(this.query);
    this.queryOne = _memoize(this.queryOne);

    this._fragments = {};
    this.register(...initialFragments);
  }

  register(...fragments) {
    super.push(...fragments);
    return fragments;
  }

  query(search) {

    if (typeof search === 'string') {
      return this._fragments[search] || [];
    }

    console.error('search query must be a string, not a query object');
    console.log(search);

    // TODO - warn if search if a POJO
    return this.filter(this._createFilter(search));
  }

  push(...args) {
    console.error('push() called on fragments. Use register() instead');
    return super.push(...args);
  }

  queryOne(search) {
    var found = this.query(search);

    return found ? found[0] : void 0;
  }

  _createFilter(search) {

    if (typeof search === 'string') {
      search = { id: search };
    }

    return function(fragment) {
      return fragment.matchesQuery(search);
    };
  }

  splice(index, count, ...entries) {

    entries.forEach((fragment) => {

      if (fragment.namespace) {

        if (typeof fragment.namespace !== 'string') {
          throw new Error(`fragment namespace for "${fragment.id}" must be a string`);
        }

        if (!this._fragments[fragment.namespace]) {
          this._fragments[fragment.namespace] = [];
        }

        this._fragments[fragment.namespace].push(fragment);
      } else {
        console.warn('registring fragment "%s" without a namespace', fragment.id);
      }

      if (!(fragment instanceof Fragment)) {
        throw new Error('fragment must be an instanceof Fragment');
      }

      if (this.find(sift({ id: fragment.id }))) {
        throw ExistsError.create('fragment already exists');
      }
    });

    if (this.query.clearMemos) {
      this.query.clearMemos();
      this.queryOne.clearMemos();
    }

    return super.splice(...arguments);
  }
}

function _memoize(fn) {
  var memos = {};
  var ret = function(query) {
    var key = _key(query);
    if (memos.hasOwnProperty(key)) {
      return memos[key];
    }
    return _set(query, fn.call(this, query));
  };
  function _set(query, value) {
    var k = _key(query);
    if (k) memos[k] = value;
    return value;
  }

  function _key(query) {
    var key = '';
    for (var k in query) {
      var v = query[k];

      // do NOT cache queries with objects
      if (typeof v === 'object') {
        if (v.constructor !== Object && v.constructor !== Array) {
          console.warn('q not a simple hash of strings', query);
          throw new Error('registry queries must be a flat hash of strings');
        } else {
          v = _key(v);
        }
      }

      key += k + ':' + v + ',';
    }
    return key;
  }

  ret.clearMemos = function() {
    memos = {};
  }

  return ret;
}

export default Registry;

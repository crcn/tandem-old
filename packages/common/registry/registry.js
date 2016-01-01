
import sift from 'sift';
import Fragment from './fragment';
import BaseCollection from 'common/collection';
import { ExistsError } from 'common/errors';

class Registry extends BaseCollection {

  constructor(...args) {
    super(...args);

    this.query    = _memoize(this.query);
    this.queryOne = _memoize(this.queryOne);
  }

  register(fragment) {
    this.push(fragment);
    return fragment;
  }

  query(search) {

    // TODO - warn if search if a POJO
    return this.filter(this._createFilter(search));
  }

  queryOne(search) {

    // TODO - warn if search if a POJO
    return this.find(this._createFilter(search));
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
    var cache = _get(query);
    if (cache) return cache;
    return _set(query, fn.call(this, query));
  };

  function _get(query) {
    return memos[_key(query)];
  }

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
      if (typeof v === 'object') return void 0;

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

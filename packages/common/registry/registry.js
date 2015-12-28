
import sift from 'sift';
import Plugin from './plugin';
import BaseCollection from 'common/collection';
import { ExistsError } from 'common/errors';

class Registry extends BaseCollection {

  constructor(...args) {
    super(...args);

    this.query    = _memoize(this.query);
    this.queryOne = _memoize(this.queryOne);
  }

  register(plugin) {
    this.push(plugin);
    return plugin;
  }

  // TODO - for optimization, register plugin by each of its keys
  // and return plugins here based on that
  query(search) {
    return this.filter(this._createFilter(search));
  }

  queryOne(search) {

    // less optimal. Use find. Okay for now.
    return this.find(this._createFilter(search));
  }

  _createFilter(search) {

    if (typeof search === 'string') {
      search = { id: search };
    }

    return function(plugin) {
      return plugin.matchesQuery(search);
    };
  }

  // @param(Plugin) TODO
  // TODO - override splice here
  splice(index, count, ...entries) {

    entries.forEach((plugin) => {

      if (!(plugin instanceof Plugin)) {
        throw new Error('plugin must be an instanceof Plugin');
      }

      if (this.find(sift({ id: plugin.id }))) {
        throw ExistsError.create('plugin already exists');
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

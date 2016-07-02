import assert from 'assert';
import Factory from 'common/value-object/factory';
import BaseObject from 'common/object/base';

function compare(a, b) {
  for (var k in b) {
    if (a[k] != b[k]) return false;
  }
  return true;
}

class Fragment extends BaseObject {

  constructor(properties) {
    super(properties);

    // TODO - this is deprecated
    if (this.id) {
      console.warn('id (%s) property is deprecated for fragments. Use namespace instead', this.id);
    }

    // necessary for now
    assert(this.id, 'id must be defined for fragments');
  }

  matchesQuery(query) {
    // if (typeof query === 'function') return query(this);
    return compare(this, query);
  }
}


export default Fragment;

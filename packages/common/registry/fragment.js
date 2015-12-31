import sift from 'sift';
import assert from 'assert';
import Factory from 'common/value-object/factory';
import BaseObject from 'common/object/base';

class Fragment extends BaseObject {

  constructor(properties) {
    super(properties);
    assert(this.id, 'id must be defined for fragments');
  }

  matchesQuery(query) {
    return sift(query)(this);
  }
} 


export default Fragment;

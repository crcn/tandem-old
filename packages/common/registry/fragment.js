import Schema from 'common/schema';
import Factory from 'common/value-object/factory';
import BaseObject from 'common/object/base';
import mixinSchema from 'common/class/mixins/schema';
import sift from 'sift';

var schema = Schema.create({
  fields: {
    id: {
      required: true,
      type: String
    },
    type: {
      required: true,
      type: String
    }
    // factory: {
    //   required: true,
    //   type: Factory
    // }
  }
});

class Fragment extends BaseObject {
  matchesQuery(query) {
    return sift(query)(this);
  }
}

Fragment = mixinSchema(schema, Fragment);

export default Fragment;

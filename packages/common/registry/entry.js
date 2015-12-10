import BaseObject from 'common/object/base';
import Schema from 'common/schema';
import mixinSchema from 'common/class/mixins/schema';
import Factory from 'common/value-object/factory';

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

class Entry extends BaseObject {
}

Entry = mixinSchema(schema, Entry);

export default Entry;

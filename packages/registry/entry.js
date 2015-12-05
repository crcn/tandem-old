import BaseObject from 'object-base';
import Schema from 'schema';
import mixinSchema from 'mixin-schema';
import Factory from 'value-object-factory';

var schema = Schema.create({
  fields: {
    id: {
      required: true,
      type: String
    },
    type: {
      required: true,
      type: String
    },
    factory: {
      required: true,
      type: Factory
    }
  }
});

class Entry extends BaseObject {
  create() {
    return this.factory.create(...arguments);
  }
}

Entry = mixinSchema(schema, Entry);

export default Entry;

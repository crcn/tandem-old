import BaseObject from 'base-object';
import Schema from 'schema';
import Factory from 'value-object-factory';

var schema = Schema.create({
  fields: {
    id: {
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
  constructor(properties) {
    super(schema.coerce(properties));
  }
}

export default Entry;

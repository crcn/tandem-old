import Schema from 'common/schema';
import Factory from 'common/value-object/factory';
import BaseObject from 'common/object/base';
import mixinSchema from 'common/class/mixins/schema';

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

class Plugin extends BaseObject {
}

Plugin = mixinSchema(schema, Plugin);

export default Plugin;

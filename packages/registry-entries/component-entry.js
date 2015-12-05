import { Entry } from 'registry';
import Schema from 'schema';
import React from 'react';

var schema = new Schema({
  fields: {
    componentClass: {
      type: Function,
      required: true
    }
  }
});

class ComponentEntry extends Entry {
  type = 'component';
  setProperties(properties) {

    properties = schema.coerce(properties);

    super.setProperties({
      factory: {
        create(props) {
          return React.createElement(properties.componentClass, props);
        }
      },
      ...properties
    });
  }
}

export default ComponentEntry;

import { Entry } from 'registry';
import Schema from 'schema';
import React from 'react';
import mixinSchema from 'mixin-schema';

var schema = new Schema({
  fields: {
    componentClass: {
      type: Function,
      required: true
    }
  }
});

class ComponentEntry extends Entry {
  
  constructor(properties) {
    super({ type: 'component', ...properties });
  }

  setProperties(properties) {
    if (properties.componentClass) {
      properties.factory = {
        create(props) {
          return React.createElement(properties.componentClass, props);
        }
      }
    }
    super.setProperties(properties);
  }
}


ComponentEntry = mixinSchema(schema, ComponentEntry);

export default ComponentEntry;

export default function(schema, clazz) {
  class ctor extends clazz {
    setProperties(properties) {

      // TODO - remove coersion here. property types should
      // *always* be the right type
      super.setProperties(schema.coerce(properties));

      schema.validate(this);
    }
  }
  return ctor;
}

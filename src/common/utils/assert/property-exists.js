import assert from 'assert';
export default function (context, property, typeClass) {
  var value = context[property];
  assert(value, `Property "${property}" must exist on class "${context.constructor.name}".`);
  if (typeClass != void 0 && !(value instanceof typeClass)) {
    throw new Error(`Property "${property}" of "${context.constructor.name}" must be a ${typeClass.name}.`);
  }
}

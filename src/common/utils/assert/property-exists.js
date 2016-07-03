import assert from 'assert';
export default function(context, property) {
  assert(context[property], `Property "${property}" must exist on class "${context.constructor.name}".`);
}

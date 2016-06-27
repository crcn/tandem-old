import each from './each';

export default function(target, ...rest) {
  for (var value of rest) {
    each(value, (value, key) => {
      target[key] = value;
    });
  }
  return target;
}
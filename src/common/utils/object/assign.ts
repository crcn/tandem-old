import each from './each.ts';

export default function(target, ...rest) {
  for (var value of rest) {
    each(value, (value, key) => {
      target[key] = value;
    });
  }
}
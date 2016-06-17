export default function each(values:any, iterate) {
  if (values instanceof Array) {
    for (let i = 0, n = values.length; i < n; i++) {
      iterate(values[i], i);
    }
  } else {
    for (let key in values) {
      iterate(values[key], key);
    }
  }
}
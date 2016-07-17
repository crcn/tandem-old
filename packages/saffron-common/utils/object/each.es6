export default function each(object, iterate) {
  if (Array.isArray(object)) {
    for (var i = 0, n = object.length; i < n; i++) {
      iterate(object[i], i, object);
    }
  } else {
    for (var key in object) {
      iterate(object[key], key, object);
    }
  }
}

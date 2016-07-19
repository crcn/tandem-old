export default function(a, b) {

  var c = Object.keys(a).length > Object.keys(b).length ? a : b;
  var d = {};

  for (var k in c) {
    if (a[k] !== b[k]) d[k] = b[k];
  }

  return d;
}

export default function(item, items) {
  var n = items.indexOf(item);
  var p = 0;
  for (var i = 0; i < n; i++) p += items[i].length;
  return p;
}

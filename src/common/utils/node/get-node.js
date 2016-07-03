export default function getNode(node, path) {
  var cnode = node;
  for (var i = 0, n = path.length; i < n; i++) {
    var segment = path[i];
    cnode = cnode.childNodes[segment];
  }
  return cnode;
}

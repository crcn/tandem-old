export default function getNode(node, path) {
  var cnode = node;
  for (var i = 0, n = path.length; i < n; i++) {
    cnode = cnode.childNodes[path[i]];
  }
  return cnode;
}

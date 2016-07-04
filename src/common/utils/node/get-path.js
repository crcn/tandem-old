export default function(node) {
  var cnode = node;
  var path = [];
  while(cnode.parentNode) {
    path.unshift(Array.prototype.slice.call(cnode.parentNode.childNodes).indexOf(cnode));
    cnode = cnode.parentNode;
  }
  return path;
}

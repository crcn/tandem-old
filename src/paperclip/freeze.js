import View from './view';
import Template from './template';
import Fragment from './vdom/fragment';
 
export default function freeze(vnode, options = {}) {
  var hydrators = [];

  if (Array.isArray(vnode)) {
    vnode = Fragment.create(vnode);
  }

  var templateNode = vnode.freeze({
    hydrators   : hydrators,

    // creates new nodes -- decoupled from the DOM so that
    // other rendering strategies are available such as server-side rendering, canvas
    // webgl, etc.
    nodeFactory : options.nodeFactory || document
  });

  for (var hydrator of hydrators) {
    hydrator.prepare();
  }

  return new Template(templateNode, hydrators);
}

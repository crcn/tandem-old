import View from './view';
import Template from './view-factory';
import Fragment from './vdom/fragment';
import { create as createSection } from './section';

export default function freeze(vnode, options = {}) {
  var hydrators = [];

  if (Array.isArray(vnode)) {
    vnode = Fragment.create(vnode);
  }

  var templateNode = vnode.freezeNode({
    ...options,
    hydrators   : hydrators,

    // creates new nodes -- decoupled from the DOM so that
    // other rendering strategies are available such as server-side rendering, canvas
    // webgl, etc.
    nodeFactory : options.nodeFactory || document
  });

  var section = createSection(templateNode);

  for (var hydrator of hydrators) {
    hydrator.prepare();
  }

  return new Template({ section, hydrators });
}

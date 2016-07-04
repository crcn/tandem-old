import View from './view';
import Template from './template';

export default function freeze(vnode, options = {}) {
  var hydrators = [];

  var templateNode = vnode.freeze({
    hydrators: hydrators,
    nodeFactory: options.nodeFactory || document
  });

  for (var hydrator of hydrators) {
    hydrator.prepare();
  }

  return new Template(templateNode, hydrators);
}

import create from 'common/class/utils/create';
import getPath from 'common/utils/node/get-path';
import getNode from 'common/utils/node/get-node';

class BlockBinding {
  constructor(context, rootNode, node, execute) {
    this.context  = context;
    this.rootNode = rootNode;
    this.node     = node;
    this.execute  = execute;
  }

  update() {
    this.node.nodeValue = this.execute(this.context);
  }
}

class BlockHydrator {
  constructor(referenceNode, execute) {
    this.referenceNode = referenceNode;
    this.execute       = execute;
  }

  prepare() {
    this.path = getPath(this.referenceNode);
  }

  hydrate({ bindings, context, node }) {
    bindings.push(new BlockBinding(context, node, getNode(node, this.path), this.execute));
  }
}

export default class BlockVNode {

  constructor(execute) {
    this.execute = execute;
  }

  freeze({ hydrators }) {
    var node = document.createTextNode('');
    hydrators.push(new BlockHydrator(node, this.execute));
    return node;
  }

  static create = create;
}

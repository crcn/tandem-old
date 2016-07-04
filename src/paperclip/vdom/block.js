import create from 'common/class/utils/create';
import NodeSection from '../section/node';

class BlockBinding {
  constructor(context, node, execute) {
    this.context  = context;
    this.node     = node;
    this.execute  = execute;
  }

  update() {
    this.node.nodeValue = this.execute(this.context);
  }
}

class BlockHydrator {
  constructor(section, execute) {
    this.section = section;
    this.execute = execute;
  }

  prepare() {
    this._marker = this.section.createMarker();
  }

  hydrate({ bindings, context, node }) {
    bindings.push(new BlockBinding(context, this._marker.getNode(node), this.execute));
  }
}

export default class BlockVNode {

  constructor(execute) {
    this.execute = execute;
  }

  freeze({ hydrators }) {
    var node = document.createTextNode('');
    hydrators.push(new BlockHydrator(new NodeSection(node), this.execute));
    return node;
  }

  static create = create;
}

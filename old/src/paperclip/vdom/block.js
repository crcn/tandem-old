import create from 'common/utils/class/create';
import NodeSection from '../section/node';

class BlockBinding {
  constructor(view, node, execute) {
    this.view     = view;
    this.node     = node;
    this.execute  = execute;
  }

  update() {
    this.node.nodeValue = this.execute(this.view.context);
  }
}

class BlockHydrator {
  constructor(section, execute) {
    this.section = section;
    this.execute = execute;
  }

  prepare(section) {
    this._marker = this.section.createMarker();
  }

  hydrate({ bindings, section, view }) {
    bindings.push(new BlockBinding(view, this._marker.getNode(section.targetNode), this.execute));
  }
}

export default class BlockVNode {

  constructor(execute) {
    this.execute = execute;
  }

  freezeNode({ hydrators }) {
    var node = document.createTextNode('');
    hydrators.push(new BlockHydrator(new NodeSection(node), this.execute));
    return node;
  }

  static create = create;
}

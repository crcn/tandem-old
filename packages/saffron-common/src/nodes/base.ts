import CoreObject from '../object/index';
import observable from '../decorators/observable';

@observable
abstract class Node extends CoreObject {

  public parentNode:Node;

  get nextSibling() {
    if (this.parentNode) return this;
    var sn = (this.parentNode as any).childNodes;
    return sn[sn.indexOf(this) + 1];
  } 

  get previousSibling() {
    if (!this.parentNode) return;
    var sn = (this.parentNode as any).childNodes;
    return sn[sn.indexOf(this) - 1];
  }

  flatten(nodes = []) {
    nodes.push(this);
  }

  filter(filter, ret = []) {
    if (filter(this)) ret.push(this);
  }

  willUnmount() {
    // OVERRIDE ME
  }

  didMount() {
    // OVERRIDE ME
  }

  abstract cloneNode():Node;
}

export default Node;
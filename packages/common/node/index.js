import BaseObject from 'common/object/base';
import NodeCollection from './collection';
import { CallbackNotifier } from 'common/notifiers';
import mixinChangeNotifier from 'common/class/mixins/change-notifier';

class Node extends BaseObject {

  constructor(properties, children = []) {
    super(properties);

    this._children = NodeCollection.create({
      notifier: CallbackNotifier.create(this._onChildrenChange.bind(this))
    }, children);

    // sync the new children on this node
    this._sync(children);
  }

  get children() {
    return this._children;
  }

  get root() {
    var p = this;
    while (p.parent) p = p.parent;
    return p;
  }

  /**
   * finds one nested node
   */

  find(filter) {
    if (filter(this)) return this;
    for (var child of this._children) {
      var found = child.find(filter);
      if (found) return found;
    }
  }

  /**
   */

  flatten(nodes = []) {
    nodes.push(this);
    for (var child of this._children) child.flatten(nodes);
    return nodes;
  }

  /**
   * finds many nested nodes based on the given filter
   */

  filter(filter, found = []) {
    if (filter(this)) found.push(this);
    for (var child of this._children) {
      child.filter(filter, found);
    }
    return found;
  }

  _onChildrenChange(message) {

    for (var change of message.changes) {
      if (change.target !== this._children) continue;
      this._sync(change.added, change.removed);
    }

    if (this.notifier) this.notifier.notify(message);
  }

  _sync(added = [], removed = []) {
    for (var child of added) {

      if (child.parent && child.parent !== this) {
        child.parent.children.remove(child);
      }

      child.parent   = this;
      child.notifier = this.notifier;
    }

    for (var child of removed) {
      child.parent = void 0;
    }
  }
}

Node = mixinChangeNotifier(Node);

export default Node;

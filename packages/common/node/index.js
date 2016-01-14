import memoize from 'memoizee';
import NodeCollection from './collection';
import ObservableObject from 'common/object/observable';
import mixinChangeNotifier from 'common/class/mixins/change-notifier';
import { CallbackNotifier } from 'common/notifiers';

class Node extends ObservableObject {

  constructor(properties, children = []) {
    super(properties);

    this.flatten = memoize(this.flatten.bind(this), { primitive: true });

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
   */

  includes(child) {

    // cannot include itself
    if (this === child) return false;
    return !!this.find(function(node) {
      return node === child;
    });
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

  notifyChange(changes) {
    super.notifyChange(changes);
    if (this.parent) this.parent.notifyChange(changes);
  }

  /**
   */

  flatten() {
    var nodes = [this];
    for (var child of this._children) {
      nodes.push(...child.flatten());
    }
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

  notifyChange(changes) {
    super.notifyChange(changes);
    this._didChange(changes);
  }

  _didChange(changes) {

    if (changes) {
      for (var change of changes) {

        // only clear flatten if target is an array
        if (Array.isArray(change.target)) {
          this.flatten.clear();
        }
      }
    }

    this.didChange();
    if (this.parent) {
      this.parent._didChange(changes);
    }
  }

  didChange() {
    // OVERRIDE ME
  }

  _onChildrenChange(message) {

    for (var change of message.changes) {
      if (change.target !== this._children) continue;
      this._sync(change.added, change.removed);
    }

    this.notifyChange(message.changes);
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

//Node = mixinChangeNotifier(Node);

export default Node;

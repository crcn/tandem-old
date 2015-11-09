import Entity from './base';

class Container extends Entity {

  /**
   */

  addChild(child) {
    this.children.push(child);
    this._linkChild(child);
  }

  /**
   */

  removeChild(child) {
    var i = this.children.indexOf(child);
    if (!~i) return;
    this.children.splice(i, 1)
    child.setProperties({ parent: void 0 });
  }

  /**
   */

  update() {
    if (!this.children) this.children = [];
    this.children.forEach((child) => {
      this._linkChild(child);
    });
  }

  /**
   */

  _linkChild(child) {
    if (child.parent === this) return;

    if (child.parent) {
      child.parent.removeChild(child);
    }

    child.setProperties({ parent: this });
  }
}

export default Container;

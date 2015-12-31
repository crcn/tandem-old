import { create } from 'common/utils/class';

/**
 * rounds an x-y coordinate to a particular place on the canvas. Used to
 * align items more easily.
 */

class Snapper {

  constructor() {
    this.clearPaths();
  }

  addPath(path) {
    this.paths.push(path);
    return this;
  }

  clearPaths() {
    this.paths = [];
  }

  removePath(path) {
    var i = this.paths.indexOf(path);
    if (~i) this.splice(i, 1);
    return this;
  }

  snap(x, y) {
    for (var path of this.paths) {
      if (path.intersects(x, y)) return path.snap(x, y);
    }
    return { x, y };
  }

  static create = create;
}

export default Snapper;

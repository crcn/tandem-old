import createFactory from '../utils/class/create-factory';


class Collection<T> extends Array<T> {
  constructor(properties:any = undefined) {
    super();
    if (properties) {
      Object.assign(this, properties);
    }
  }

  /**
   * assigns new properties to this collection
   */

  setProperties(properties):void {
    Object.assign(this, properties);
  }

  /**
   * pushes items to the end of the array
   */

  push(...items:T[]):number { 
    return this.splice(this.length, 0, ...items).length;
  }

  /**
   * pushes items to the beginning of the array
   */

  unshift(...items:T[]):number {
    return this.splice(0, 0, ...items).length;
  }

  /**
   * removes an item at the end of the array
   */

  pop() {
    return this.splice(this.length - 1, 1)[0];
  }

  /**
   * removes an item at the beginning of the array
   */

  shift() {
    return this.splice(0, 1)[0];
  }

  /**
   */

  remove(item) {
    var i = this.indexOf(item);
    if (~i) this.splice(i, 1);
  }


  /**
   */

  splice(start:number, deleteCount:number = 0, ...items:T[]):T[] {
    // OVERRIDE ME 
    return super.splice(start, deleteCount, ...items);
  }

  static create = createFactory(Array);
}

(Collection as any).prototype = new Array<any>();

export default Collection;

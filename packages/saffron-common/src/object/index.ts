
var _id = 1;

export default class CoreObject {
  
  public id:number;

  constructor(properties) {
    this.id = _id++;
    if (properties != void 0) {
      Object.assign(this, properties);
    }
  }

  setProperties(properties) {
    Object.assign(this, properties);
  }
}

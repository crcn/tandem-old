class Attribute {

  public key:String;
  public value:String;


  constructor(key:String, value:any) {
    this.key   = key;
    this.value = value;
  }
}

class Attributes extends Object {
  constructor() {
    super();
  }

  getAttribute(key) {
    return this[key];
  }

  setAttribute(key:String, value:any) {
    // this[key] = value;
  }
}

export default Attributes;


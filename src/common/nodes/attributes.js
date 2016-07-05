
export default class Attributes {

  constructor(properties) {
    Object.assign(this, properties);
  }

  static create(properties) {
    return new Attributes(properties);
  }
}

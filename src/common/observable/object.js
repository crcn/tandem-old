export default class ObservableObject {
  constructor(properties = {}) {

  }

  setProperties(properties) {

    var changes = [];
    
    Object.assign(this, properties);
  }
}

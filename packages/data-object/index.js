import { create, extend } from 'utils-class';

class DataObject {
  constructor(properties) {
    Object.assign(this, properties);
  }
  setProperties(properties) {
    Object.assign(this, properties);
  }
}

DataObject.create = create;
DataObject.extend = extend;

export default DataObject;

import createClass from '../../utils/class/create';

class DataObject {
  constructor(properties) {
    Object.assign(this, properties);
  }
}

DataObject.create = createClass;

export default DataObject;

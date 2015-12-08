import DataObject from '../object';

class Model extends DataObject  {
  setProperties(properties) {
    super.setProperties(properties);
    this.bus.execute({ action: 'change', target: this });
  }
}

export default Model;

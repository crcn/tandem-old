import ObservableObject from 'common/object/observable';

class PointerTool extends ObservableObject {
  cursor = 'default';
  type = 'pointer';
  notify(message) {
    this.app.setFocus(message.targetNode);
  }
}

export default PointerTool;

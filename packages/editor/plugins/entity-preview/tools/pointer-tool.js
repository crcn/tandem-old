import ObservableObject from 'common/object/observable';

class PointerTool extends ObservableObject {
  cursor = 'default';
  notify(message) {
    this.app.setFocus(message.targetNode);
  }
}

export default PointerTool;

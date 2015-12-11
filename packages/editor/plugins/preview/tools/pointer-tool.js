import ObservableObject from 'common/object/observable';
import sift from 'sift';

class PointerTool extends ObservableObject {
  cursor = 'default';
  notify(message) {
    this.app.setFocus(message.targetNode);
  }
}

export default PointerTool;

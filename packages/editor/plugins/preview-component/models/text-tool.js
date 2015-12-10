import ObservableObject from 'common/object/observable';
import Node from 'common/node';

class TextTool extends ObservableObject {
  cursor = 'text';
  notify(message) {
    this.app.currentSymbol.children.push(Node.create({
      label: 'label', type: 'component', icon: 'text'
    }));
  }
}

export default TextTool;

import ObservableObject from 'common/object/observable';
import Node from 'common/node';

class TextTool extends ObservableObject {

  constructor(properties) {
    super({ cursor: 'text', ...properties });
  }

  notify(message) {
    
    this.app.currentSymbol.children.push(Node.create({
      label: 'label', type: 'component', componentType: 'text', icon: 'text', value: 'okay',
      attributes: {
        style: {
          position: 'absolute',
          left: message.x,

          // offset cursor height
          top: message.y - 12
        }
      }
    }));
  }
}

export default TextTool;

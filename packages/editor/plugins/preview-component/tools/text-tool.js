import ObservableObject from 'common/object/observable';
import Node from 'common/node';

const CURSOR_HEIGHT = 12;

class TextTool extends ObservableObject {

  constructor(properties) {
    super({ cursor: 'text', ...properties });
  }

  notify(message) {

    var node = Node.create({
      label: 'label', type: 'component', componentType: 'text', icon: 'text', value: 'okay',
      paneType: 'text',

      // FIXME: tempory - shouldn't be here.
      id: String(Date.now()),
      attributes: {
        style: {
          position: 'absolute',
          left: message.x,

          // offset cursor height
          top: message.y - CURSOR_HEIGHT
        }
      }
    });

    this.app.currentSymbol.children.push(node);

    // focus on the new item - this will trigger the text input
    // timeout for a second so that the element appears
    setTimeout(() => {
      this.app.setFocus(node);
    }, 100);
  }
}

export default TextTool;

import ObservableObject from 'common/object/observable';
import { DisplayEntity } from 'editor/entity-types';

const CURSOR_HEIGHT = 12;

class TextTool extends ObservableObject {

  constructor(properties) {
    super({ cursor: 'text', ...properties });
  }

  notify(message) {

    var plugin = this.app.plugins.queryOne('textEntity');

    // TODO - move this elsewhere
    var node   = plugin.factory.create({
      label: 'label',
      value: 'Type in text here',
      paneType: 'text',
      attributes: {
        style: {
          position: 'absolute',
          left: message.x,

          // offset cursor height
          top: message.y - CURSOR_HEIGHT
        }
      }
    });

    this.app.rootEntity.children.push(node);

    // focus on the new item - this will trigger the text input
    // timeout for a second so that the element appears
    setTimeout(() => {
      this.app.setFocus(node);
    }, 100);
  }
}

export default TextTool;

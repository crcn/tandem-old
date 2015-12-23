import ObservableObject from 'common/object/observable';
import { DisplayEntity } from 'editor/entities';

const CURSOR_HEIGHT = 12;

class TextTool extends ObservableObject {

  constructor(properties) {
    super({ type: 'text', cursor: 'text', ...properties });
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
          left: Math.round(message.x) + 'px',
          fontSize: '14px',
          fontFamily: 'Helvetica',
          // offset cursor height
          top: Math.round(message.y - CURSOR_HEIGHT) + 'px'
        }
      }
    });

    this.app.rootEntity.children.push(node);
    this.app.setFocus(node);
  }
}

export default TextTool;

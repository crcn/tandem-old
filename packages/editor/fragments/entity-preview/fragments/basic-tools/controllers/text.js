import BaseObject from 'common/object/base';
import { DisplayEntity } from 'editor/entities';
import {
  SetToolMessage,
  SetFocusMessage,
  ENTITY_PREVIEW_CLICK
} from 'editor/message-types';

const CURSOR_HEIGHT = 12;

class TextTool extends BaseObject {

  constructor(properties) {
    super({ type: 'text', cursor: 'text', ...properties });
  }

  notify(message) {

    switch(message.type) {
      case ENTITY_PREVIEW_CLICK: return this.addTextEntity(message);
    }
  }

  addTextEntity(message) {
    var fragment = this.app.fragments.queryOne('textEntity');

    // create a basic text entity
    var entity   = fragment.factory.create({
      label: 'label',
      value: 'Type in text here',
      paneType: 'text',
      attributes: {
        style: {
          position   : 'absolute',
          color      : 'black',
          left       : Math.round(message.x) + 'px',
          fontSize   : '14px',
          textAlign  : 'left',
          fontFamily : 'Helvetica',

          // offset cursor height
          top        : Math.round(message.y - CURSOR_HEIGHT) + 'px'
        }
      }
    });

    this.app.rootEntity.children.push(entity);

    // bring the new item into focus
    this.notifier.notify(SetFocusMessage.create(entity));

    // next, change the tool to the text editor tool
    this.notifier.notify(SetToolMessage.create(this.editTextTool));
  }
}

export default TextTool;

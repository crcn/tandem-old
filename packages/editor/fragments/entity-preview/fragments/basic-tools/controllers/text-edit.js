import BaseObject from 'common/object/base';
import { SetToolMessage } from 'editor/message-types';

class TextEditTool extends BaseObject {

  notify(message) {
    switch(message.type) {
      case 'textEditComplete': this.notifyTextEditComplete(message);
    }
  }

  notifyTextEditComplete(message) {
    this.notifier.notify(SetToolMessage.create(this.pointerTool));
  }
}

export default TextEditTool;

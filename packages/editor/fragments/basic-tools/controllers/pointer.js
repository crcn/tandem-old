import ObservableObject from 'common/object/observable';
import {
  ENTITY_PREVIEW_CLICK,
  ENTITY_PREVIEW_DOUBLE_CLICK,
  SetFocusMessage,
  SetToolMessage
} from 'editor/message-types';

class PointerTool extends ObservableObject {

  cursor = 'default';
  type   = 'pointer';

  notify(message) {
    switch(message.type) {
      case ENTITY_PREVIEW_CLICK: return this.notifyEntityClick(message);
      case ENTITY_PREVIEW_DOUBLE_CLICK: return this.notifyEntityDoubleClick(message);
    }
  }

  notifyEntityClick(message) {
    // TODO - check multi selection
    this.notifier.notify(SetFocusMessage.create(message.entity));
  }

  notifyEntityDoubleClick(message) {

    var fragment = this.app.fragments.queryOne({
      type     : 'previewTool',
      toolType : 'edit',
      entity   : message.entity
    });

    if (!fragment.tool) {
      console.warn('entity %s is not editable on double click', message.entity.componentType);
    }

    this.notifier.notify(SetToolMessage.create(fragment.tool));
  }
}

export default PointerTool;

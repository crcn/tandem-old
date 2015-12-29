import ObservableObject from 'common/object/observable';
import {
  ENTITY_PREVIEW_CLICK,
  ENTITY_PREVIEW_DOUBLE_CLICK,
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
    this.app.setFocus(message.entity);
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

    console.log(fragment.tool);

    this.notifier.notify(SetToolMessage.create(fragment.tool));
  }
}

export default PointerTool;

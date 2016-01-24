import ObservableObject from 'common/object/observable';

import {
  PREVIEW_STAGE_MOUSE_DOWN,
  ENTITY_PREVIEW_DOUBLE_CLICK,
  GROUP_SELECTION,
  SetFocusMessage,
  SetToolMessage
} from 'editor/message-types';

class PointerTool extends ObservableObject {

  cursor = 'default';
  type   = 'pointer';

  notify(message) {
    switch(message.type) {
      case PREVIEW_STAGE_MOUSE_DOWN: return this.notifyPreviewStageMouseDown(message);
      case ENTITY_PREVIEW_DOUBLE_CLICK: return this.notifyEntityPreviewDoubleClick(message);
    }
  }

  notifyEntityPreviewClick(message) {
    // TODO - check multi selection
    this.notifier.notify(SetFocusMessage.create(message.entity, message.shiftKey));
    message.stopPropagation();
  }

  notifyPreviewStageMouseDown(message) {
    this.notifier.notify(SetFocusMessage.create());
  }

  notifyEntityPreviewDoubleClick(message) {

    // needs to work without side effects
    // this.preview.setLayerFocus(message.selection[0]);

    var fragment = this.app.fragments.queryOne('preview/editTool/' + message.selection.componentType);

    if (!fragment) {
      console.warn('entity %s is not editable on double click', message.selection.componentType);
      return;
    }

    this.notifier.notify(SetToolMessage.create(fragment.tool));
  }
}

export default PointerTool;

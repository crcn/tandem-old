import ObservableObject from 'common/object/observable';

import {
  ENTITY_PREVIEW_CLICK,
  PREVIEW_STAGE_CLICK,
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
      case PREVIEW_STAGE_CLICK: return this.notifyPreviewStageClick(message);
      case ENTITY_PREVIEW_CLICK: return this.notifyEntityPreviewClick(message);
      case ENTITY_PREVIEW_DOUBLE_CLICK: return this.notifyEntityPreviewDoubleClick(message);
    }
  }

  notifyEntityPreviewClick(message) {
    // TODO - check multi selection
    this.notifier.notify(SetFocusMessage.create(message.entity, message.shiftKey));
    message.stopPropagation();
  }

  notifyPreviewStageClick(message) {
    this.notifier.notify(SetFocusMessage.create());
  }

  notifyEntityPreviewDoubleClick(message) {

    var fragment = this.app.fragments.queryOne({
      type       : 'previewTool',
      toolType   : 'edit',
      entityComponentType: message.selection.componentType
    });

    if (!fragment) {
      console.warn('entity %s is not editable on double click', message.entity.componentType);
      return;
    }

    this.notifier.notify(SetToolMessage.create(fragment.tool));
  }
}

export default PointerTool;

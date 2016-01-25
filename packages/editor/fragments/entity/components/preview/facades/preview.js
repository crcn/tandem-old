import ObservableObject from 'common/object/observable';
import { NotifierCollection } from 'common/notifiers';
import { SET_TOOL, ENTITY_PREVIEW_CLICK } from 'editor/message-types';

const MIN_ZOOM_LEVEL = 0.4;
const MAX_ZOOM_LEVEL = 2;
const ZOOM_INCREMENT = 0.1;

class Preview extends ObservableObject {

  constructor(props) {
    super({ notifier: NotifierCollection.create(), ...props })
  }

  setTool(tool) {
    this.setProperties({
      currentTool: tool
    });
  }

  zoomIn() {
    return this.setZoom(this.zoom + ZOOM_INCREMENT);
  }

  zoomOut() {
    return this.setZoom(this.zoom - ZOOM_INCREMENT);
  }

  setZoom(zoom) {
    zoom = Math.max(MIN_ZOOM_LEVEL, Math.min(zoom, MAX_ZOOM_LEVEL));
    this.setProperties({ zoom: zoom });
    this.notifier.notify({ type: 'zoom' });
    return zoom > MAX_ZOOM_LEVEL && zoom < MIN_ZOOM_LEVEL;
  }

  setLayerFocus(entity) {
    this.setProperties({
      layerFocusEntity: entity
    })
  }

  notify(message) {
    if (message.type === SET_TOOL) {
      this.setTool(message.tool);
      message.tool.notify({ type: 'selectTool' });
    } else {
      if (this.currentTool) {
        this.currentTool.notify(message);
      }
    }
  }
}

export default Preview;

import ObservableObject from 'common/object/observable';
import { SET_TOOL, ENTITY_PREVIEW_CLICK } from 'editor/message-types';

const MIN_ZOOM_LEVEL = 0.4;
const MAX_ZOOM_LEVEL = 2;
const ZOOM_INCREMENT = 0.1;

class Preview extends ObservableObject {
  setTool(tool) {
    this.setProperties({
      currentTool: tool
    });
  }
  zoomIn() {
    this.setProperties({ zoom: Math.min(this.zoom + ZOOM_INCREMENT, MAX_ZOOM_LEVEL) });
  }
  zoomOut() {
    this.setProperties({ zoom: Math.max(this.zoom - ZOOM_INCREMENT, MIN_ZOOM_LEVEL) });
  }
  notify(message) {
    if (message.type === SET_TOOL) {
      this.setTool(message.tool);
    } else {  
      if (this.currentTool) {
        this.currentTool.notify(message);
      }
    }
  }
}

export default Preview;

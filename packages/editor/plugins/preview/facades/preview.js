import ObservableObject from 'common/object/observable';

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
}

export default Preview;

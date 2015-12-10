import ObservableObject from 'common/object/observable';

class Preview extends ObservableObject {
  setTool(tool) {
    this.setProperties({
      currentTool: tool
    });
  }
}

export default Preview;

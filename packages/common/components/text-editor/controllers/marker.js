import BaseObject from 'common/object/base';

/**
 */

class Marker extends BaseObject {

  constructor({ editor, notifier }) {
    super({
      editor: editor,
      notifier: notifier,
      position: 0,
      length  : 0
    });
  }

  setSelection(position, length = 0) {
    this.position = position;
    this.length   = length;
  }

  notify(message) {

  }
}

export default Marker;

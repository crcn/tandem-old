import BaseObject from 'common/object/base';

export var LOAD_ROOT_ENTITY = 'loadRootEntity';
export var PASTE = 'paste';

export class RootEntityMessage extends BaseObject {
  constructor(type, entity) {
    super({ type: type, entity: entity });
  }
};

export class PasteMessage extends BaseObject {
  constructor(data) {
    super({ type: PASTE, data: data });
  }
}

import BaseObject from 'common/object/base';

export var LOAD_ROOT_ENTITY = 'loadRootEntity';

export class RootEntityMessage extends BaseObject {
  constructor(type, entity) {
    super({ type: type, entity: entity });
  }
};

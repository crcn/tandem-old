import BaseObject from 'common/object/base';

export const PASTE                       = 'paste';
export const SET_TOOL                    = 'setTool';
export const SET_FOCUS                   = 'setFocus';
export const LOAD_ROOT_ENTITY            = 'loadRootEntity';
export const ENTITY_PREVIEW_CLICK        = 'entityPreviewClick';
export const ENTITY_PREVIEW_DOUBLE_CLICK = 'entityPreviewDoubleClick';

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

export class SetFocusMessage extends BaseObject {
  constructor(target) {
    super({ type: SET_FOCUS, target: target });
  }
}

export class SetToolMessage extends BaseObject {
  constructor(tool) {
    super({ type: SET_TOOL, tool: tool });
  }
}

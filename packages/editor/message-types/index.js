import BaseMessage from 'common/message-types/base';

export const PASTE                       = 'paste';
export const SET_TOOL                    = 'setTool';
export const SET_FOCUS                   = 'setFocus';
export const SET_ROOT_ENTITY             = 'setRootEntity';
export const LOAD_ROOT_ENTITY            = 'loadRootEntity';
export const ENTITY_PREVIEW_CLICK        = 'entityPreviewClick';
export const ENTITY_PREVIEW_DOUBLE_CLICK = 'entityPreviewDoubleClick';


export class RootEntityMessage extends BaseMessage {
  constructor(type, entity) {
    super(type, { entity: entity });
  }
}

export class PasteMessage extends BaseMessage {
  constructor(data) {
    super(PASTE, { data: data });
  }
}

export class SetFocusMessage extends BaseMessage {
  constructor(target) {
    super(SET_FOCUS, { target: target });
  }
}

export class SetToolMessage extends BaseMessage {
  constructor(tool) {
    super(SET_TOOL, { tool: tool });
  }
}

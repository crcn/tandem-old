// TODO - some of these are fragment-specific. Need to eventually
// move them into their own repositories e.g: selection-message-types, core-message-types

import BaseMessage from 'common/message-types/base';

export const PASTE                       = 'paste';
export const SET_TOOL                    = 'setTool';
export const SET_FOCUS                   = 'setFocus';
export const SET_ROOT_ENTITY             = 'setRootEntity';
export const LOAD_ROOT_ENTITY            = 'loadRootEntity';
export const PREVIEW_STAGE_CLICK         = 'previewStageClick';
export const ENTITY_PREVIEW_CLICK        = 'entityPreviewClick';
export const ENTITY_PREVIEW_DOUBLE_CLICK = 'entityPreviewDoubleClick';

export class RootEntityMessage extends BaseMessage {
  constructor(type, entity) {
    super(type, { entity: entity });
  }
}

/**
 * Clipboard paste message
 */

export class PasteMessage extends BaseMessage {

  /**
   * @param {*} data the raw clipboard data
   */

  constructor(data) {
    super(PASTE, { data: data });
  }
}

/**
 * Sets the current application focus
 */

export class SetFocusMessage extends BaseMessage {

  /**
   *
   * @param {Entity} target the target entity to set focus to
   * @param {Boolean} multiSelect TRUE if selecting multiple items
   */

  constructor(target, multiSelect = false) {
    super(SET_FOCUS, { target: target, multiSelect });
  }
}

/**
 * Sets the current stage tool (pointer, text, and others)
 */

export class SetToolMessage extends BaseMessage {

  /**
   * @param {Tool} tool the tool to select
   */

  constructor(tool) {
    super(SET_TOOL, { tool: tool });
  }
}

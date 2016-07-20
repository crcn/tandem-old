

import { Action } from 'saffron-common/lib/actions/index';
import * as toarray from 'toarray';

export const STAGE_CANVAS_MOUSE_DOWN = 'stageCanvasMouseDown';
export class MouseEvent extends Event {
  constructor(type, originalEvent) {
    super(type);

    Object.assign(this, {
      clientX: originalEvent.clientX,
      clientY: originalEvent.clientY,
      metaKey : originalEvent.metaKey
    });
  }
}

export const SELECT = 'select';
export class SelectAction extends Action {
  
  public items:Array<any>;
  public keepPreviousSelection:boolean;
  public toggle:boolean;

  constructor(items:any = undefined, keepPreviousSelection = false, toggle = false) {
    super(SELECT);
    this.items = toarray(items);
    this.keepPreviousSelection = !!keepPreviousSelection;
    this.toggle = toggle;
  }
}

export class ToggleSelectAction extends SelectAction {
  constructor(items, keepPreviousSelection) {
    super(items, keepPreviousSelection, true);
  }
}
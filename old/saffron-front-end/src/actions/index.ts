import { Action } from 'sf-common/actions/index';
import * as toarray from 'toarray';

export const STAGE_CANVAS_MOUSE_DOWN = 'stageCanvasMouseDown';
export class MouseEvent extends Action {
  constructor(type, originalEvent) {
    super(type);
    Object.assign(this, {
      clientX : originalEvent.clientX,
      clientY : originalEvent.clientY,
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
  constructor(items = undefined, keepPreviousSelection:boolean = false) {
    super(items, keepPreviousSelection, true);
  }
}
import { Event } from 'saffron-common/lib/events/index';
import * as toarray from 'toarray';

export const SELECT = 'select';
export class SelectEvent extends Event {
  public items:any;
  public keepPreviousSelection:boolean;
  public toggle:boolean;

  constructor(items, keepPreviousSelection = false, toggle = false) {
    super(SELECT);
    this.items = toarray(items);
    this.keepPreviousSelection = !!keepPreviousSelection;
    this.toggle = toggle;
  }
}

export class ToggleSelectEvent extends SelectEvent {
  constructor(items, keepPreviousSelection) {
    super(items, keepPreviousSelection, true);
  }
}

import { Event } from 'common/events';
import toarray from 'toarray';

export const SELECT = 'select';
export class SelectEvent extends Event {
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

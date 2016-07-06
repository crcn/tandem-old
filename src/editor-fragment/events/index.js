import { Event } from 'common/events';

export const SELECT = 'select';

export class SelectEvent extends Event {
  constructor(item, multi) {
    super(SELECT);
    this.item  = item;
    this.multi = multi;
  }
}

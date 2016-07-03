import { Event } from 'common/events';

export const INITIALIZE = 'initialize';
export const LOAD       = 'load';

export class InitializeEvent extends Event {
  constructor() {
    super(INITIALIZE);
  }
}

export class LoadEvent extends Event {
  constructor() {
    super(LOAD);
  }
}

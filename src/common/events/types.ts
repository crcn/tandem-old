import Event from './Event';

export const LOAD       = 'load';
export const INITIALIZE = 'initialize';
export const CHANGE     = 'change';

declare class BaseApplication { };

export class InitializeEvent extends Event {
  constructor(target:BaseApplication) {
    super(INITIALIZE, target);
  }
}

export class LoadEvent extends Event {
  constructor(target:BaseApplication) {
    super(LOAD, target);
  }
}

export class ChangeEvent extends Event {
  constructor(target:any) {
    super(CHANGE, target);
  }
}
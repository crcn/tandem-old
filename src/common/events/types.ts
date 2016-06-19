import Event from './Event';

export const LOAD       = 'load';
export const INITIALIZE = 'initialize';

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
import BaseObject from 'base-object';

export const CHANGE     = 'change';
export const INITIALIZE = 'initialize';
export const LOAD       = 'load';

export class Message extends BaseObject {
  constructor(properties) {
    super(properties);
  }
}

export class ChangeMessage extends Message {
  type = CHANGE;
  constructor(target) {
    super({ target: target });
  }
}

export class InitializeMessage extends Message {
  type = INITIALIZE;
}

export class LoadMessage extends Message {
  type = LOAD;
}

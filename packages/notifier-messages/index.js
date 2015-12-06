import BaseObject from 'object-base';

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
  constructor(changes = []) {
    super({ changes: changes });
  }
}

export class InitializeMessage extends Message {
  type = INITIALIZE;
}

export class LoadMessage extends Message {
  type = LOAD;
}

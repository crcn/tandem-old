import BaseMessage from 'common/message-types/base';

export const CHANGE     = 'change';
export const INITIALIZE = 'initialize';
export const LOAD       = 'load';

export class ChangeMessage extends BaseMessage {
  constructor(changes = []) {
    super(CHANGE, { changes: changes });
  }
}

export class InitializeMessage extends BaseMessage {
  constructor() {
    super(INITIALIZE);
  }
}

export class LoadMessage extends BaseMessage {
  constructor() {
    super(LOAD);
  }
}

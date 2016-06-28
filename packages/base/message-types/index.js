import BaseMessage from 'common/message-types/base';

export const CHANGE     = 'change';
export const INITIALIZE = 'initialize';
export const LOAD       = 'load';
export const DISPOSE    = 'dispose';

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

export class DisposeMessage extends BaseMessage {
  constructor(target) {
    super(DISPOSE, { target: target });
  }
}
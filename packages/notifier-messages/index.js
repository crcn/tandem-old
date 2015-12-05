import BaseObject from 'base-object';

export class Message extends BaseObject {
  constructor(properties) {
    super(properties);
  }
}

export class ChangeMessage extends Message {
  type = 'change';
  constructor(target) {
    super({ target: target });
  }
}

export class InitializeMessage extends Message {
  type = 'initialize';
}

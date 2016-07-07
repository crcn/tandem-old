import create from 'common/utils/class/create';
import assertPropertyExists from 'common/utils/assert/property-exists';

export class Event {

  constructor(type) {
    this._type   = type;
    assertPropertyExists(this, 'type');
  }

  get type() {
    return this._type;
  }

  static create = create;
}

export const CHANGE = 'change';
export class ChangeEvent extends Event {
  constructor(changes = []) {
    super(CHANGE);
    this._changes = changes;

    assertPropertyExists(this, 'changes');
  }

  get changes() {
    return this._changes;
  }
}

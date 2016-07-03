import create from 'common/class/utils/create';
import assertPropertyExists from 'common/utils/assert/property-exists';

export class Event {

  constructor(type) {
    this._type   = type;

    assertPropertyExists(this, 'type');
  }

  set currentTarget(value) {
    if (this._target == void 0) {
      this._target = value;
    }

    this._currentTarget = value;
  }

  get currentTarget() {
    return this._currentTarget;
  }

  get target() {
    return this._target;
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
  }

  get changes() {
    return this._changes;
  }
}

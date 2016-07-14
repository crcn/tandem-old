import create from 'common/utils/class/create';
import assertPropertyExists from 'common/utils/assert/property-exists';

export class Event {

  constructor(type) {
    this._type   = type;
    this._canPropagate = true;
    assertPropertyExists(this, 'type');
  }

  set currentTarget(value) {
    if (!this._target) {
      this._target = value;
    }
    this._currentTarget = value;
  }

  get target() {
    return this._target;
  }

  get currentTarget() {
    return this._currentTarget;
  }

  get type() {
    return this._type;
  }

  get canPropagate() {
    return this._canPropagate;
  }

  stopPropagation() {
    this._canPropagate = false;
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

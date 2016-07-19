import create from '../utils/class/create';
import assertPropertyExists from '../utils/assert/property-exists';

export class Event { 
  private _canPropagate:boolean;
  private _target:any;
  private _currentTarget:any;

  constructor(private _type:string) { 
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
  constructor(private _changes:Array<any>) {
    super(CHANGE);
    assertPropertyExists(this, 'changes');
  }

  get changes() {
    return this._changes;
  }
}

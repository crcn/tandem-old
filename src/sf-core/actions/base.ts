export class Action {

  private _target: any;
  private _currentTarget: any;
  private _canPropagate: boolean = true;

  constructor(readonly type: string) { }

  set currentTarget(value) {

    // always maintain the initial target so that actions
    // can be tracked back to their origin
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

  get canPropagate() {
    return this._canPropagate;
  }

  stopPropagation() {
    this._canPropagate = false;
  }
}
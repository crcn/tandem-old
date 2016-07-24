import { Action } from 'sf-base/actions';

export class KeyBinding {
  constructor(readonly key:string|Array<any>, readonly action:Action) { }
}
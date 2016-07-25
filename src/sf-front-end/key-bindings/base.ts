import { Action } from 'sf-core/actions';

export class KeyBinding {
  constructor(readonly key:string|Array<any>, readonly action:Action) { }
}
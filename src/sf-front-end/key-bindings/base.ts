import { Action } from "sf-common/actions";

export class KeyBinding {
  constructor(readonly key: string|Array<any>, readonly action: Action) { }
}
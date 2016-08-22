import { SettingChangeAction } from "sf-core/actions";
import { Observable } from "sf-core/observable";

export class Settings extends Observable {

  constructor(private _data: any = {}) {
    super();
  }

  get(key: string) {
    return this._data[key];
  }

  toggle(key: string) {
    this.set(key, !this.get(key));
  }

  set(key: string, value: any) {
    const oldValue = this._data[key];
    this._data[key] = value;

    // TODO - this should be SettingChangeAction
    this.notify(new SettingChangeAction(key, value, oldValue));
  }
}
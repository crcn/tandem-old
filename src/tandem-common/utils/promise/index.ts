import { Observable } from "tandem-common/observable";
import { Action } from "tandem-common/actions";
import { WrapBus } from "mesh";

export class SingletonThenable extends Observable {

  private _value: any;
  private _success: boolean;
  private _rejected: boolean;

  constructor(load: () => Promise<any>) {
    super();

    const complete = (value, success) => {
      this._success = success;
      this._value   = value;
      this.notify(new Action("completed"));
    };

    (async () => {
      try {
        complete(await load(), true);
      } catch (e) {
        complete(e, false);
      }
    })();
  }

  then(resolve, reject) {
    if (this._success === true) {
      return resolve(this._value);
    } else if (this._success === false) {
      return reject(this._value);
    }

    this.observe(new WrapBus(() => this.then(resolve, reject)));
  }
}
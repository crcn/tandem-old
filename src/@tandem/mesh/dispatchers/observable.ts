import { IDispatcher } from "./base";

export interface IObservable extends IDispatcher {
  observe(dispatcher: IDispatcher);
  unobserve(dispatcher: IDispatcher);
}

export class Observable implements IObservable {

  private _observers: IDispatcher[];
  private _messageBus: IDispatcher;

  constructor() {
    this._messageBus = this.createMessageBus(this._observers = []);
  }

  protected createMessageBus(observers: IDispatcher[]): IDispatcher {
    return {
      dispatch: (message) => {
        for (let i = observers.length; i--;) {
          observers[i].dispatch(message);
        }
      }
    }
  }

  observe(dispatcher: IDispatcher) {
    this._observers.push(dispatcher);
  }

  unobserve(dispatcher: IDispatcher) {
    const index = this._observers.indexOf(dispatcher);
    if (index !== -1) this._observers.splice(index, 1);
  }

  dispatch(message: any) {
    return this._messageBus.dispatch(message);
  }
}
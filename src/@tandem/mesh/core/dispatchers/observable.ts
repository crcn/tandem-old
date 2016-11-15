import { IDispatcher } from "./base";

export interface IObservable<T> extends IDispatcher<T> {
  observe(dispatcher: IDispatcher<T>);
  unobserve(dispatcher: IDispatcher<T>);
}

export class Observable<T> implements IObservable<T> {

  private _observers: IDispatcher<T>[];
  private _messageBus: IDispatcher<T>;

  constructor() {
    this._messageBus = this.createMessageBus(this._observers = []);
  }

  protected createMessageBus(observers: IDispatcher<T>[]): IDispatcher<T> {
    return {
      dispatch: (message) => {
        for (let i = observers.length; i--;) {
          observers[i].dispatch(message);
        }
      }
    }
  }

  observe(dispatcher: IDispatcher<T>) {
    this._observers.push(dispatcher);
  }

  unobserve(dispatcher: IDispatcher<T>) {
    const index = this._observers.indexOf(dispatcher);
    if (index !== -1) this._observers.splice(index, 1);
  }

  dispatch(message: any) {
    return this._messageBus.dispatch(message);
  }
}
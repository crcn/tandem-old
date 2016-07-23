import { Service } from 'saffron-base/src/services';
import { IApplication } from 'saffron-base/src/application';
import { IActor, IInvoker } from 'saffron-base/src/actors/index';

export class BaseApplicationService<T extends IApplication> extends Service implements IInvoker {
  constructor(readonly app:T) {
    super();
  }

  get bus():IActor {
    return this.app.bus;
  }
};
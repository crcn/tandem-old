import { Service } from 'sf-base/services';
import { IApplication } from 'sf-base/application';
import { IActor, IInvoker } from 'sf-base/actors/index';

export class BaseApplicationService<T extends IApplication> extends Service implements IInvoker {
  constructor(readonly app:T) {
    super();
  }

  get bus():IActor {
    return this.app.bus;
  }
};
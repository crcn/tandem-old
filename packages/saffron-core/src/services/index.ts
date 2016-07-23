import { Service } from 'saffron-base/src/services';
import { IApplication } from 'saffron-base/src/application';
import { IActor } from 'saffron-base/src/actors/index';

export class BaseApplicationService<T extends IApplication> extends Service {
  constructor(readonly app:T) {
    super();
  }

  get bus():IActor {
    return this.app.mediator;
  }
};
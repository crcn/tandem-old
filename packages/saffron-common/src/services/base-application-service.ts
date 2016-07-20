import BaseService from './base';
import IApplication from '../application/interface';
import { IActor } from '../actors/index';

export default class BaseApplicationService<T extends IApplication> extends BaseService {
  constructor(readonly app:T) {
    super();
  }

  get bus():IActor {
    return this.app.bus;
  }
};
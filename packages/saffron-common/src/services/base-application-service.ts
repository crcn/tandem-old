import BaseService from './base';
import IApplication from 'saffron-common/lib/application/interface';
import { IActor } from '../actors/index';

export default class BaseApplicationService extends BaseService {
  constructor(readonly app:IApplication) {
    super();
  }

  get bus():IActor {
    return this.app.bus;
  }
};
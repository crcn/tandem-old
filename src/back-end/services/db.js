import BaseService from 'common/services/base';
import { FactoryFragment } from 'common/fragments';
import loggable from 'common/logger/mixins/loggable';

@loggable
export default class DBService extends BaseService {

  /**
   */

  load(action) {
    this.logger.info('loading');
  }
}

export const fragment = FactoryFragment.create({
  ns: 'application/actors/db',
  factory: DBService
})

import loggable from 'common/logger/mixins/loggable';
import isPublic from 'common/actors/decorators/public';

import { Service } from 'common/services';
import { FactoryFragment } from 'common/fragments';

@loggable
export default class ProjectService extends Service {

  async initialize() {
    const files = await this.bus.execute({
      type: 'find',
      collectionName: 'files',
      multi: true
    }).readAll();

    this.logger.info('loaded %d files', files.length);

    this.app.setProperties({
      openFiles: files
    });
  }

  @isPublic
  didRemove() {
    console.log('removing thas');
  }
}

export const fragment = FactoryFragment.create({
  ns      : 'application/actors/project',
  factory : ProjectService
});

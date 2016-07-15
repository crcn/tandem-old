import loggable from 'common/logger/mixins/loggable';
import isPublic from 'common/actors/decorators/public';
import sift from 'sift';
import observable from 'common/object/mixins/observable';
import Collection from 'common/object/collection';
import ArrayDsBus from 'mesh-array-ds-bus';

import { Service } from 'common/services';
import { AcceptBus } from 'mesh';
import { FactoryFragment } from 'common/fragments';

@observable
class Projects extends Collection { }

const COLLECTION_NAME = 'files';

@loggable
export default class ProjectService extends Service {

  async initialize() {

    var createModel = (data) => (
      this.app
        .fragmentDictionary
        .query(`models/${data.ext}-file`)
        .create({
          ...data,
          fragmentDictionary: this.app.fragmentDictionary,
          bus: this.bus
        })
    );

    this.app.setProperties({
      projects: this.projects = Projects.create(
        (await this.bus.execute({
          type: 'find',
          collectionName: COLLECTION_NAME,
          multi: true
        }).readAll()).map(createModel)
      )
    });

    this._projectsBus = AcceptBus.create(
      sift({ collectionName: COLLECTION_NAME }),
      ArrayDsBus.create(this.projects, {
        remove() { },
        update: (model, data) => {
          model.setProperties(data);
          if (model === this.app.currentFile) {
            model.load();
          }
          return model;
        },
        insert: createModel
      })
    );

    this.logger.info('loaded %d files', this.projects.length);

    if (this.projects.length) {
      this.projects[0].load();
      this.app.setProperties({
        currentFile: this.projects[0]
      });
    }
  }

  @isPublic
  remove(action) {
    return this._projectsBus.execute(action);
  }

  @isPublic
  update(action) {
    return this._projectsBus.execute(action);
  }
}

export const fragment = FactoryFragment.create({
  ns      : 'application/actors/project',
  factory : ProjectService
});

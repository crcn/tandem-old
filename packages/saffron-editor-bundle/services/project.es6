import loggable from 'saffron-common/logger/mixins/loggable';
import isPublic from 'saffron-common/actors/decorators/public';
import sift from 'sift';
import observable from 'saffron-common/object/mixins/observable';
import Collection from 'saffron-common/object/collection';
import ArrayDsBus from 'mesh-array-ds-bus';

import { Service } from 'saffron-common/services';
import { AcceptBus } from 'mesh';
import { FactoryFragment } from 'saffron-common/fragments';

@observable
class Projects extends Collection { }

const COLLECTION_NAME = 'files';

@loggable
export default class ProjectService extends Service {

  async initialize() {

    var createModel = (data) => {
      return this.app
        .fragments
        .query(`models/${data.ext}-file`)
        .create({
          ...data,
          fragments: this.app.fragments,
          app: this.app,
          bus: this.bus
        });
    };

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
    console.log('update it!', action);
    return this._projectsBus.execute(action);
  }
}

export const fragment = FactoryFragment.create({
  ns      : 'application/services/project',
  factory : ProjectService
});

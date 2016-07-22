import Logger from 'saffron-common/src/logger/index'; 
import loggable from 'saffron-common/src/decorators/loggable';
import isPublic from 'saffron-common/src/actors/decorators/public';
import * as sift from 'sift';
import observable from 'saffron-common/src/decorators/observable';
import Collection from 'saffron-common/src/object/collection';
import * as ArrayDsBus from 'mesh-array-ds-bus';

import BaseApplicationService from 'saffron-common/src/services/base-application-service';
import { AcceptBus } from 'mesh';
import { IActor } from 'saffron-common/src/actors/index';
import { ApplicationServiceFragment } from 'saffron-common/src/fragments/index';
import { FindAllAction } from 'saffron-common/src/actions/index';
import IApplication from 'saffron-common/src/application/interface';

@observable
class Projects extends Collection<any> { }

const COLLECTION_NAME = 'files';

@loggable
export default class ProjectService extends BaseApplicationService<IApplication> {

  public logger:Logger;
  private _projects:Projects;
  public _projectsBus:IActor;

  async initialize() {

    var createModel = (data) => {
      return this.app
        .fragments
        .query<any>(`models/${data.ext}-file`)
        .create(Object.assign({}, data, {
          collectionName: COLLECTION_NAME,
          fragments: this.app.fragments,
          app: this.app,
          bus: this.bus
        }));
    };

    (this.app as any).setProperties({
      projects: this._projects = new Projects(
        (await this.bus.execute(new FindAllAction(COLLECTION_NAME)).readAll()).map(createModel)
      )
    });

    this._projectsBus = AcceptBus.create(
      sift({ collectionName: COLLECTION_NAME }),
      ArrayDsBus.create(this._projects, {
        remove() { },
        update: (model, data) => {
          model.setProperties(data);
          if (model === (this.app as any).currentFile) {
            model.load();
          }
          return model;
        },
        insert: createModel
      })
    , undefined); 

    this.logger.info('loaded %d files', this._projects.length);

    if (this._projects.length) {
      this._projects[0].load();
      (this.app as any).setProperties({
        currentFile: this._projects[0]
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

export const fragment = new ApplicationServiceFragment('application/services/project', ProjectService);
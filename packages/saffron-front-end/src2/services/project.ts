import isPublic from 'saffron-common/src/actors/decorators/public';
import * as sift from 'sift';
import * as ArrayDsBus from 'mesh-array-ds-bus';

import {
  Logger,
  AcceptBus,
  Collection,
  observable,
  IApplication,
  FindAllAction,
  ApplicationServiceFragment,
  BaseApplicationService,
  loggable,
  IActor,
} from 'saffron-common/src/index';

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
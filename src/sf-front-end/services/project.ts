import { isPublic, loggable } from 'sf-core/decorators';
import * as sift from 'sift';
import * as ArrayDsBus from 'mesh-array-ds-bus';

import { IActor } from 'sf-core/actors';
import { AcceptBus } from 'mesh';
import { Logger } from 'sf-core/logger';
import { FindAllAction } from 'sf-core/actions';
import { ApplicationServiceFragment } from 'sf-core/fragments';
import { BaseApplicationService } from 'sf-core/services';
import { IApplication } from 'sf-core/application';

// @observable
// class Projects extends Collection<any> { }

const COLLECTION_NAME = 'files';

@loggable()
export default class ProjectService extends BaseApplicationService<IApplication> {

  public logger:Logger;
  private _projects:Array<any>;
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

    this._projects = (await this.bus.execute(new FindAllAction(COLLECTION_NAME)).readAll()).map(createModel)

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
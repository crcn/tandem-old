import loggable from 'saffron-common/lib/logger/mixins/loggable';
import isPublic from 'saffron-common/lib/actors/decorators/public';
import * as sift from 'sift';
import observable from 'saffron-common/lib/object/mixins/observable';
import Collection from 'saffron-common/lib/object/collection';
import * as ArrayDsBus from 'mesh-array-ds-bus';

import { Service } from 'saffron-common/lib/services/index';
import { AcceptBus } from 'mesh';
import { ClassFactoryFragment } from 'saffron-common/lib/fragments/index';

@observable
class Projects extends Collection<any> { }

const COLLECTION_NAME = 'files';

@loggable
export default class ProjectService extends Service {

  public bus:any;
  public app:any;
  public projects:any;
  public logger:any;
  public _projectsBus:any;

  async initialize() {

    var createModel = (data) => {
      return this.app
        .fragments
        .query(`models/${data.ext}-file`)
        .create(Object.assign({}, data, {
          fragments: this.app.fragments,
          app: this.app,
          bus: this.bus
        }));
    };

    this.app.setProperties({
      projects: this.projects = new Projects(
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
    , undefined); 

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

export const fragment = new ClassFactoryFragment('application/services/project', ProjectService);
import * as sift from "sift";
import * as ArrayDsBus from "mesh-array-ds-bus";
import { AcceptBus } from "mesh";
import { OpenFileAction } from "sf-front-end/actions";

import { IActor } from "sf-core/actors";
import { Logger } from "sf-core/logger";
import { FindAction } from "sf-core/actions";
import { BaseApplicationService } from "sf-core/services";
import { isPublic, loggable, inject } from "sf-core/decorators";
import { ApplicationServiceDependency, DEPENDENCIES_NS, Dependencies, ActiveRecordFactoryDependency } from "sf-core/dependencies";
import { FrontEndApplication } from "sf-front-end/application";

const COLLECTION_NAME = "files";

@loggable()
export default class ProjectService extends BaseApplicationService<FrontEndApplication> {

  @inject(DEPENDENCIES_NS)
  readonly dependencies: Dependencies;

  readonly logger: Logger;

  async initialize() {
    const { value } = await (this.bus.execute(new FindAction(COLLECTION_NAME, undefined, false))).read();
    if (value == null) return;
    this.openFile(value);
  }

  @isPublic
  update(action) {
    (<any>this.app.editor.file).deserialize(action.data);
  }

  @isPublic
  insert(action) {
    this.openFile(action.data);
  }

  @isPublic
  openFile(action: OpenFileAction) {

    this.logger.info("loaded %s", action);

    const activeRecordDependency = ActiveRecordFactoryDependency.find(`${action.ext}-file`, this.dependencies);
    const activeRecord = activeRecordDependency.create(action);

    this.app.editor.file = activeRecord;

    // Pipe all changes on the active record back to the application bus
    activeRecord.observe(this.app.bus);

  }
}

export const dependency = new ApplicationServiceDependency("project", ProjectService);
import { isPublic, loggable } from "sf-core/decorators";
import * as sift from "sift";
import * as ArrayDsBus from "mesh-array-ds-bus";

import { IActor } from "sf-core/actors";
import { Logger } from "sf-core/logger";
import { AcceptBus } from "mesh";
import { FindAction } from "sf-core/actions";
import { FrontEndApplication } from "sf-front-end/application";
import { BaseApplicationService } from "sf-core/services";
import { ApplicationServiceFragment } from "sf-core/fragments";

const COLLECTION_NAME = "files";

@loggable()
export default class ProjectService extends BaseApplicationService<FrontEndApplication> {

  // @inject(APPLICATION_SINGLETON_NS)
  // public preview:

  public logger: Logger;

  async initialize() {

    const currentFileData = await (this.bus.execute(new FindAction(COLLECTION_NAME, undefined, false))).read();

    if (currentFileData) {
      this.logger.info("loaded %s", currentFileData);
    }
  }

  @isPublic
  update(action) {
    console.log("update file");
  }

  @isPublic
  insert(action) {
    console.log("insert file");
  }
}

export const fragment = new ApplicationServiceFragment("project", ProjectService);
import * as sift from "sift";
import { SelectAction } from "sf-front-end/actions";
import { filterAction } from "sf-common/decorators";
import { FrontEndApplication } from "sf-front-end/application";
import { BaseApplicationService } from "sf-common/services";
import { SELECT_WITH_CSS_SELECTOR, SelectWithCSSSelectorAction } from "sf-html-extension/actions";

import {
  IInjectable,
  APPLICATION_SINGLETON_NS,
  CommandFactoryDependency,
  ApplicationServiceDependency,
} from "sf-common/dependencies";

export class SelectWithCSSSelectorActionService extends BaseApplicationService<FrontEndApplication> {
  [SELECT_WITH_CSS_SELECTOR](action: SelectWithCSSSelectorAction) {
    this.bus.execute(new SelectAction(
      this.app.workspace.file.entity.flatten().filter(action.selector.test.bind(action.selector))
    ));
  }
}

export const dependency = new ApplicationServiceDependency(SELECT_WITH_CSS_SELECTOR, SelectWithCSSSelectorActionService);


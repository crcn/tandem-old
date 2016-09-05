import * as sift from "sift";
import { SelectAction } from "tandem-front-end/actions";
import { filterAction } from "tandem-common/decorators";
import { FrontEndApplication } from "tandem-front-end/application";
import { BaseApplicationService } from "tandem-common/services";
import { SELECT_WITH_CSS_SELECTOR, SelectWithCSSSelectorAction } from "tandem-html-extension/actions";

import {
  IInjectable,
  APPLICATION_SINGLETON_NS,
  CommandFactoryDependency,
  ApplicationServiceDependency,
} from "tandem-common/dependencies";

export class SelectWithCSSSelectorActionService extends BaseApplicationService<FrontEndApplication> {
  [SELECT_WITH_CSS_SELECTOR](action: SelectWithCSSSelectorAction) {
    // this.bus.execute(new SelectAction(
    //   this.app.workspace.file.entity.flatten().filter(action.selector.test.bind(action.ru))
    // ));
  }
}

export const cssSelectorServiceDependency = new ApplicationServiceDependency(SELECT_WITH_CSS_SELECTOR, SelectWithCSSSelectorActionService);


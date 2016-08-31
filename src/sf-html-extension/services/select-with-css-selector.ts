import * as sift from "sift";
import { SelectAction } from "sf-front-end/actions";
import { filterAction } from "sf-core/decorators";
import { FrontEndApplication } from "sf-front-end/application";
import { BaseApplicationService } from "sf-core/services";
import { SELECT_WITH_CSS_SELECTOR, SelectWithCSSSelector } from "sf-html-extension/actions";

import {
  IInjectable,
  APPLICATION_SINGLETON_NS,
  CommandFactoryDependency,
  ApplicationServiceDependency,
} from "sf-core/dependencies";

export class SelectWithCSSSelectorService extends BaseApplicationService<FrontEndApplication> {
  [SELECT_WITH_CSS_SELECTOR](action: SelectWithCSSSelector) {
    this.bus.execute(new SelectAction(
      this.app.workspace.file.entity.flatten().filter(action.selector.test.bind(action.selector))
    ));
  }
}

export const dependency = new ApplicationServiceDependency(SELECT_WITH_CSS_SELECTOR, SelectWithCSSSelectorService);


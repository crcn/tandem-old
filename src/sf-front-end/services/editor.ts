import { LoadAction } from "sf-core/actions";
import { ZoomAction, SetToolAction } from "sf-front-end/actions";

import { IActor } from "sf-core/actors";
import { inject } from "sf-core/decorators";
import { BaseApplicationService } from "sf-core/services";
import { ApplicationServiceDependency, Dependencies, DEPENDENCIES_NS } from "sf-core/dependencies";
import { EditorToolFactoryDependency, EDITOR_TOOL_NS, GlobalKeyBindingDependency } from "sf-front-end/dependencies";
import { FrontEndApplication } from "sf-front-end/application";
import { ProxyBus } from "sf-common/busses";
import { KeyBinding } from "sf-front-end/key-bindings";

export class EditorService extends BaseApplicationService<FrontEndApplication> {

  @inject(DEPENDENCIES_NS)
  readonly dependencies: Dependencies;


  private _toolProxyBus: ProxyBus;

}

export const dependency = new ApplicationServiceDependency("editor", EditorService);


import { IActor } from "sf-common/actors";
import { inject } from "sf-common/decorators";
import { ProxyBus } from "sf-common/busses";
import { KeyBinding } from "sf-front-end/key-bindings";
import { LoadAction } from "sf-common/actions";
import { FrontEndApplication } from "sf-front-end/application";
import { BaseApplicationService } from "sf-common/services";
import { ZoomAction, SetToolAction } from "sf-front-end/actions";
import { ApplicationServiceDependency, Dependencies, DEPENDENCIES_NS } from "sf-common/dependencies";
import { EditorToolFactoryDependency, EDITOR_TOOL_NS, GlobalKeyBindingDependency } from "sf-front-end/dependencies";

export class EditorService extends BaseApplicationService<FrontEndApplication> {

  @inject(DEPENDENCIES_NS)
  readonly dependencies: Dependencies;

  private _toolProxyBus: ProxyBus;

}

export const dependency = new ApplicationServiceDependency("editor", EditorService);

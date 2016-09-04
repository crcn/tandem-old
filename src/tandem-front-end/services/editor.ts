
import { IActor } from "tandem-common/actors";
import { inject } from "tandem-common/decorators";
import { ProxyBus } from "tandem-common/busses";
import { KeyBinding } from "tandem-front-end/key-bindings";
import { LoadAction } from "tandem-common/actions";
import { FrontEndApplication } from "tandem-front-end/application";
import { BaseApplicationService } from "tandem-common/services";
import { ZoomAction, SetToolAction } from "tandem-front-end/actions";
import { ApplicationServiceDependency, Dependencies, DEPENDENCIES_NS } from "tandem-common/dependencies";
import { EditorToolFactoryDependency, EDITOR_TOOL_NS, GlobalKeyBindingDependency } from "tandem-front-end/dependencies";

export class EditorService extends BaseApplicationService<FrontEndApplication> {

  @inject(DEPENDENCIES_NS)
  readonly dependencies: Dependencies;

  private _toolProxyBus: ProxyBus;

}

export const dependency = new ApplicationServiceDependency("editor", EditorService);

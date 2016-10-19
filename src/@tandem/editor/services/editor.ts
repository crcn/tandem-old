
import { IActor } from "@tandem/common/actors";
import { inject } from "@tandem/common/decorators";
import { ProxyBus } from "@tandem/common/busses";
import { KeyBinding } from "@tandem/editor/key-bindings";
import { LoadAction } from "@tandem/common/actions";
import { FrontEndApplication } from "@tandem/editor/application";
import { BaseApplicationService } from "@tandem/common/services";
import { ZoomAction, SetToolAction } from "@tandem/editor/actions";
import { ApplicationServiceDependency, Dependencies, DependenciesDependency } from "@tandem/common/dependencies";
import { EditorToolFactoryDependency, EDITOR_TOOL_NS, GlobalKeyBindingDependency } from "@tandem/editor/dependencies";

export class EditorService extends BaseApplicationService<FrontEndApplication> {

  @inject(DependenciesDependency.NS)
  readonly dependencies: Dependencies;

  private _toolProxyBus: ProxyBus;

}

export const editorServiceDependency = new ApplicationServiceDependency("editor", EditorService);

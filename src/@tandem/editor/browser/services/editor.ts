
import { IActor } from "@tandem/common/actors";
import { inject } from "@tandem/common/decorators";
import { ProxyBus } from "@tandem/common/busses";
import { KeyBinding } from "@tandem/editor/browser/key-bindings";
import { LoadAction } from "@tandem/common/actions";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { BaseApplicationService } from "@tandem/common/services";
import { ZoomAction, SetToolAction } from "@tandem/editor/browser/actions";
import { ApplicationServiceDependency, Dependencies, DependenciesDependency } from "@tandem/common/dependencies";
import { WorkspaceToolFactoryDependency, EDITOR_TOOL_NS, GlobalKeyBindingDependency } from "@tandem/editor/browser/dependencies";

export class EditorService extends BaseApplicationService<FrontEndApplication> {

  @inject(DependenciesDependency.ID)
  readonly dependencies: Dependencies;

  private _toolProxyBus: ProxyBus;

}

export const editorServiceDependency = new ApplicationServiceDependency("editor", EditorService);

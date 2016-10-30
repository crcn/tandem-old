
import { IActor } from "@tandem/common/actors";
import { inject } from "@tandem/common/decorators";
import { ProxyBus } from "@tandem/common/busses";
import { KeyBinding } from "@tandem/editor/browser/key-bindings";
import { LoadAction } from "@tandem/common/actions";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { BaseApplicationService } from "@tandem/common/services";
import { ZoomAction, SetToolAction } from "@tandem/editor/browser/actions";
import { ApplicationServiceProvider, Dependencies, DependenciesProvider } from "@tandem/common";
import { WorkspaceToolFactoryProvider, EDITOR_TOOL_NS, GlobalKeyBindingProvider } from "@tandem/editor/browser/providers";

export class EditorService extends BaseApplicationService<FrontEndApplication> {

  @inject(DependenciesProvider.ID)
  readonly dependencies: Dependencies;

  private _toolProxyBus: ProxyBus;

}

export const editorServiceProvider = new ApplicationServiceProvider("editor", EditorService);

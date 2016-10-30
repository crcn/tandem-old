
import { IActor } from "@tandem/common/actors";
import { inject } from "@tandem/common/decorators";
import { ProxyBus } from "@tandem/common/busses";
import { KeyBinding } from "@tandem/editor/browser/key-bindings";
import { LoadAction } from "@tandem/common/actions";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { BaseApplicationService } from "@tandem/common/services";
import { ZoomAction, SetToolAction } from "@tandem/editor/browser/actions";
import { ApplicationServiceProvider, Injector, InjectorProvider } from "@tandem/common";
import { WorkspaceToolFactoryProvider, EDITOR_TOOL_NS, GlobalKeyBindingProvider } from "@tandem/editor/browser/providers";

export class EditorService extends BaseApplicationService<FrontEndApplication> {

  @inject(InjectorProvider.ID)
  readonly injector: Injector;

  private _toolProxyBus: ProxyBus;

}

export const editorServiceProvider = new ApplicationServiceProvider("editor", EditorService);

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

  @inject([EDITOR_TOOL_NS, "**"].join("/"), (dep) => (<EditorToolFactoryDependency>dep).create())
  readonly tools: Array<IActor> = [];

  private _toolProxyBus: ProxyBus;

  didInject() {
    this.editor.tools       = this.tools;

    for (const tool of this.tools) {
      if (tool["keyCommand"]) {
        this.dependencies.register(new GlobalKeyBindingDependency(new KeyBinding(tool["keyCommand"], new SetToolAction(tool))));
      }
    }
    this.app.actors.push(this._toolProxyBus = new ProxyBus(null));
  }

  load(action: LoadAction) {
    this.app.bus.execute(new SetToolAction(this.editor.tools[0]));
  }

  get editor() {
    return this.app.editor;
  }

  zoom(action: ZoomAction) {
    this.editor.zoom += action.delta;
  }

  setTool(action: SetToolAction) {
    this.editor.currentTool = action.tool;
    this._toolProxyBus.target = action.tool;
  }
}

export const dependency = new ApplicationServiceDependency("editor", EditorService);

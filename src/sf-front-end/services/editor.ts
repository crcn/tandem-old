import { ZoomAction } from "sf-front-end/actions";

import { IActor } from "sf-core/actors";
import { inject } from "sf-core/decorators";
import { BaseApplicationService } from "sf-core/services";
import { ApplicationServiceDependency, Dependencies, DEPENDENCIES_NS } from "sf-core/dependencies";
import { EditorToolFactoryDependency, EDITOR_TOOL_NS } from "sf-front-end/dependencies";
import { FrontEndApplication } from "sf-front-end/application";
import { ProxyBus } from "sf-common/busses";

export class EditorService extends BaseApplicationService<FrontEndApplication> {

  @inject(DEPENDENCIES_NS)
  readonly dependencies: Dependencies;

  @inject([EDITOR_TOOL_NS, "**"].join("/"), (dep) => (<EditorToolFactoryDependency>dep).create())
  readonly tools: Array<IActor> = [];

  private _toolProxyBus: ProxyBus;

  didInject() {
    this.editor.tools       = this.tools;
    this.editor.currentTool = this.tools[0];
    this.app.actors.push(this._toolProxyBus = new ProxyBus(null));

    this._toolProxyBus.target = this.editor.currentTool;
  }

  get editor() {
    return this.app.editor;
  }

  zoom(action: ZoomAction) {
    this.editor.zoom += action.delta;
  }
}

export const dependency = new ApplicationServiceDependency("editor", EditorService);

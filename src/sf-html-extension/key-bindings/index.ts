import { ClassFactoryDependency, DEPENDENCIES_NS, Dependencies } from "sf-core/dependencies";
import { Action } from "sf-core/actions";
import { IEditor } from "sf-front-end/models/base";
import { BaseCommand } from "sf-core/commands";
import { SetToolAction } from "sf-front-end/actions";
import { EditorToolFactoryDependency, GlobalKeyBindingDependency } from "sf-front-end/dependencies";
import { TextTool, dependency as textToolDependency } from "sf-html-extension/models/text-tool";
import { InsertTool } from "sf-front-end/models/insert-tool";
import { inject } from "sf-core/decorators";

class InsertDivTool extends InsertTool {
  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;

  get editorToolFactory() {
    return this._dependencies.query<EditorToolFactoryDependency>(textToolDependency.ns);
  }
}

export const dependencies = [
  new GlobalKeyBindingDependency("t", class SetPointerToolCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new SetToolAction(this.dependencies.query<EditorToolFactoryDependency>(textToolDependency.ns)));
    }
  }),
  new GlobalKeyBindingDependency("d", class SetPointerToolCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new SetToolAction(<ClassFactoryDependency>this.dependencies.link(new ClassFactoryDependency(null, InsertDivTool))));
    }
  })
];
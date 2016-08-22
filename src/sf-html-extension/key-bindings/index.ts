import { inject } from "sf-core/decorators";
import { Action } from "sf-core/actions";
import { IEditor } from "sf-front-end/models/base";
import { InsertTool } from "sf-front-end/models/insert-tool";
import { BaseCommand } from "sf-core/commands";
import { SetToolAction } from "sf-front-end/actions";
import { parse as parseHTML } from "sf-html-extension/parsers/html";
import { TextTool, dependency as textToolDependency } from "sf-html-extension/models/text-tool";
import { dependency as pointerToolDependency } from "sf-front-end/models/pointer-tool";
import { ClassFactoryDependency, DEPENDENCIES_NS, Dependencies } from "sf-core/dependencies";
import { EditorToolFactoryDependency, GlobalKeyBindingDependency } from "sf-front-end/dependencies";

abstract class BaseInsertElementTool extends InsertTool {

  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;

  constructor(readonly options: any, editor: IEditor) {
    super(editor);
  }


  get displayEntityToolFactory() {
    return this._dependencies.query<EditorToolFactoryDependency>(pointerToolDependency.ns);
  }

  createSource() {

    // width & height need to be 0'd since some elements have a size by default such as iframes
    return parseHTML(`<${this.options.nodeName} ${this.options.attributes} style="background:${this.options.background || "#CCC"};position:absolute;width:0px;height:0px;" />`).childNodes[0];
  }
}

function createElementInsertToolClass(options) {
  return class InsertElementTool extends BaseInsertElementTool {
    constructor(editor: IEditor) {
      super(options, editor);
    }
  };
}

export const dependencies = [
  new GlobalKeyBindingDependency("t", class SetPointerToolCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new SetToolAction(this.dependencies.query<EditorToolFactoryDependency>(textToolDependency.ns)));
    }
  })
];

const insertElementKeyBindings = {
  "d" : { nodeName:  "div", attributes: `` },
  "a" : { nodeName: "artboard", attributes: `title="Artboard"`, background: "white" }
};

for (const key in insertElementKeyBindings) {
  addElementKeyBinding(key, insertElementKeyBindings[key]);
}

function addElementKeyBinding(key: string, options: { nodeName: string, attributes: string }) {
  dependencies.push(new GlobalKeyBindingDependency(key, class SetPointerToolCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new SetToolAction(<ClassFactoryDependency>this.dependencies.link(new ClassFactoryDependency(null, createElementInsertToolClass(options)))));
    }
  }));
}
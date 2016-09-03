import { inject } from "sf-common/decorators";
import { Action } from "sf-common/actions";
import { IEditor } from "sf-front-end/models/base";
import { InsertTool } from "sf-front-end/models/insert-tool";
import { SetToolAction } from "sf-front-end/actions";
import { TEXT_TOOL_KEY_CODE } from "sf-html-extension/constants";
import { FrontEndApplication } from "sf-front-end/application";
import { parseHTML, HTMLElementExpression } from "sf-html-extension/ast";
import { dependency as textToolDependency } from "sf-html-extension/models/text-tool";
import { dependency as pointerToolDependency } from "sf-front-end/models/pointer-tool";
import { BaseCommand, BaseApplicationCommand } from "sf-common/commands";
import { ClassFactoryDependency, DEPENDENCIES_NS, Dependencies } from "sf-common/dependencies";
import { EditorToolFactoryDependency, GlobalKeyBindingDependency } from "sf-front-end/dependencies";

abstract class BaseInsertElementTool extends InsertTool {

  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;

  constructor(readonly options: any, editor: IEditor) {
    super(editor);
    this.entityIsRoot = options.root;
  }

  get displayEntityToolFactory() {
    return this._dependencies.query<EditorToolFactoryDependency>(pointerToolDependency.ns);
  }

  createSource() {

    // width & height need to be 0'd since some elements have a size by default such as iframes
    return parseHTML(`<${this.options.nodeName} ${this.options.attributes} style="${this.options.style}position:absolute;width:0px;height:0px;" />`).children[0];
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
  new GlobalKeyBindingDependency(TEXT_TOOL_KEY_CODE, class SetPointerToolCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new SetToolAction(this.dependencies.query<EditorToolFactoryDependency>(textToolDependency.ns)));
    }
  })
];

const insertElementKeyBindings = {
  "d" : { nodeName:  "div", attributes: ``, style: "background:rgba(0,0,0,0.1);" },
  "a" : { nodeName: "artboard", attributes: `title="Artboard"`, style: "background; white;", root: true }
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
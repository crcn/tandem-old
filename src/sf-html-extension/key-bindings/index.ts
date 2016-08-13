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

  constructor(readonly tagName: string, editor: IEditor) {
    super(editor);
  }

  get displayEntityToolFactory() {
    return this._dependencies.query<EditorToolFactoryDependency>(pointerToolDependency.ns);
  }

  createSource() {
    return parseHTML(`<${this.tagName} style="background:#CCC;position:absolute;" />`).childNodes[0];
  }
}

function createElementInsertToolClass(tagName: string) {
  return class InsertElementTool extends BaseInsertElementTool {
    constructor(editor: IEditor) {
      super(tagName, editor);
    }
  };
}

class InsertTextTool extends InsertTool {
  readonly cursor: string = "text";
  readonly resizable: boolean = false;
  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;
  get displayEntityToolFactory() {
    return this._dependencies.query<EditorToolFactoryDependency>(textToolDependency.ns);
  }

  createSource() {
    return parseHTML(`<span style="position:absolute;">Type Something</span>`).childNodes[0];
  }
}
export const dependencies = [
  new GlobalKeyBindingDependency("t", class SetPointerToolCommand extends BaseCommand {
    execute(action: Action) {
      console.log("EXEC THIS THIS ");
      this.bus.execute(new SetToolAction(<ClassFactoryDependency>this.dependencies.link(new ClassFactoryDependency(null, InsertTextTool))));
    }
  })
];

const insertElementKeyBindings = {
  "d": "div",
  "s": "span"
};



for (const key in insertElementKeyBindings) {
  addElementKeyBinding(key, insertElementKeyBindings[key]);
}

function addElementKeyBinding(key: string, tagName: string) {
  dependencies.push(new GlobalKeyBindingDependency(key, class SetPointerToolCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new SetToolAction(<ClassFactoryDependency>this.dependencies.link(new ClassFactoryDependency(null, createElementInsertToolClass(tagName)))));
    }
  }));
}
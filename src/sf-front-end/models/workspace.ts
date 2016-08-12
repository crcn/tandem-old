
import { EntityFile } from "./base";
import { Editor } from "./editor";
import { IInjectable, Dependencies, Injector } from "sf-core/dependencies";
import { inject } from "sf-core/decorators";
import { Selection } from "./selection";
import { IActor } from "sf-core/actors";
import { Action } from "sf-core/actions";

export class Workspace implements IActor {

  readonly editor: Editor;
  public selection: Selection<any> = new Selection<any>();

  constructor(readonly file: EntityFile) {
    this.editor = new Editor(this);
  }

  execute(action: Action) {
    this.editor.execute(action);
  }
}
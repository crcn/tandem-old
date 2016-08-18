import { Editor } from "./editor";
import { inject } from "sf-core/decorators";
import { IActor } from "sf-core/actors";
import { Action } from "sf-core/actions";
import { Selection } from "./selection";
import { EntityFile } from "./base";
import { IInjectable, Dependencies, Injector } from "sf-core/dependencies";

export class Workspace implements IActor {

  readonly editor: Editor;
  public selection: Selection<any> = new Selection<any>();

  // TODO - implement me
  public getSelection(type: string) {

  }

  constructor(readonly file: EntityFile) {
    this.editor = new Editor(this);
  }

  execute(action: Action) {
    this.editor.execute(action);
  }
}
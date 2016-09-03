import { Editor } from "./editor";
import { inject } from "sf-common/decorators";
import { IActor } from "sf-common/actors";
import { Action } from "sf-common/actions";
import { IEntity } from "sf-common/ast";
import { DocumentFile } from "./base";
import { IInjectable, Dependencies, Injector } from "sf-common/dependencies";

export class Workspace implements IActor {

  readonly editor: Editor;
  public selection: Array<IEntity> = [];

  // TODO - implement me
  public getSelection(type: string) { }

  constructor(readonly file: DocumentFile<any>) {
    this.editor = new Editor(this);
  }

  execute(action: Action) {
    this.editor.execute(action);
  }
}
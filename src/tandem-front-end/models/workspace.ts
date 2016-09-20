import { Editor } from "./editor";
import { inject } from "tandem-common/decorators";
import { IActor } from "tandem-common/actors";
import { Action } from "tandem-common/actions";
import { IEntity } from "tandem-common/lang";
import { DocumentFile } from "./base";
import { IInjectable, Dependencies, Injector } from "tandem-common/dependencies";

export class Workspace implements IActor {

  readonly editor: Editor;
  public selection: Array<IEntity> = [];

  // TODO - implement me
  public getSelection(type: string) { }

  constructor(readonly file: DocumentFile<IEntity>) {
    this.editor = new Editor(this);
  }

  execute(action: Action) {
    this.editor.execute(action);
  }
}
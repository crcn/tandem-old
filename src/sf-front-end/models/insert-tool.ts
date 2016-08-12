
import { BaseEditorTool, IEditorTool, IEditor } from "./base";
import { MouseAction, SetToolAction } from "sf-front-end/actions";
import { Action } from "sf-core/actions";
import { IActor } from "sf-core/actors";
import { Service } from "sf-core/services";
import { startDrag } from "sf-front-end/utils/component";
import { inject } from "sf-core/decorators";
import { MAIN_BUS_NS } from "sf-core/dependencies";

export abstract class InsertTool extends BaseEditorTool {

  readonly cursor: string = "crosshair";
  readonly name: string =  "insert";

  @inject(MAIN_BUS_NS)
  readonly bus: IActor;

  constructor(editor: IEditor) {
    super(editor);
  }

  abstract get editorToolFactory(): { create(editor: IEditor): IEditorTool }

  canvasMouseDown(action: MouseAction) {
    startDrag(action.originalEvent, ({ delta }) => {


    }, () => {
      this.bus.execute(new SetToolAction({ create: (editor) => this.editorToolFactory.create(editor) }));
    });
  }
}
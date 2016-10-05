
import { Action } from "@tandem/common/actions";
import { IActor } from "@tandem/common/actors";
import { inject } from "@tandem/common/decorators";
import { Service } from "@tandem/common/services";
import { startDrag } from "@tandem/common/utils/component";
import { MAIN_BUS_NS } from "@tandem/common/dependencies";
import { BoundingRect } from "@tandem/common/geom";
import { EntityFactoryDependency } from "@tandem/common/dependencies";
import { BaseEditorTool, IEditorTool, IEditor } from "@tandem/editor/models";
import { MouseAction, SetToolAction, SelectAction } from "@tandem/editor/actions";

export abstract class InsertTool extends BaseEditorTool {

  readonly cursor: string = "crosshair";
  readonly name: string =  "insert";
  public entityIsRoot: boolean = false;

  @inject(MAIN_BUS_NS)
  readonly bus: IActor;

  readonly resizable: boolean = true;

  didInject() {

    // deselect all
    this.bus.execute(new SelectAction());
  }

  abstract get displayEntityToolFactory(): { create(editor: IEditor): IEditorTool }
  abstract createSource(): any;
}
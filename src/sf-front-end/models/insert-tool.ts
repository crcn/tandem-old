
import { Action } from "sf-common/actions";
import { IActor } from "sf-common/actors";
import { inject } from "sf-common/decorators";
import { Service } from "sf-common/services";
import { startDrag } from "sf-front-end/utils/component";
import { MAIN_BUS_NS } from "sf-common/dependencies";
import { BoundingRect } from "sf-common/geom";
import { EntityFactoryDependency } from "sf-common/dependencies";
import { BaseEditorTool, IEditorTool, IEditor } from "sf-front-end/models";
import { MouseAction, SetToolAction, SelectAction } from "sf-front-end/actions";

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
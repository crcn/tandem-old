
import { Action } from "sf-core/actions";
import { IActor } from "sf-core/actors";
import { Service } from "sf-core/services";
import { startDrag } from "sf-front-end/utils/component";
import { inject } from "sf-core/decorators";
import { MAIN_BUS_NS } from "sf-core/dependencies";
import { BoundingRect } from "sf-core/geom";
import { IVisibleEntity, IContainerEntity } from "sf-core/entities";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { MouseAction, SetToolAction, SelectAction } from "sf-front-end/actions";
import { BaseEditorTool, IEditorTool, IEditor } from "sf-front-end/models";

export abstract class InsertTool extends BaseEditorTool {

  readonly cursor: string = "crosshair";
  readonly name: string =  "insert";

  @inject(MAIN_BUS_NS)
  readonly bus: IActor;

  abstract get displayEntityToolFactory(): { create(editor: IEditor): IEditorTool }
  abstract createSource(): any;

  async canvasMouseDown(action: MouseAction) {

    const activeEntity = <IContainerEntity>this.editor.activeEntity;
    const entity: IVisibleEntity = <IVisibleEntity>(await activeEntity.appendSourceChildNode(this.createSource()))[0];
    this.bus.execute(new SelectAction(entity));

    const capabilities = entity.display.capabilities;

    let left = 0;
    let top  = 0;

    if (capabilities.movable) {
      left = (action.originalEvent.pageX - this.editor.translate.left) / this.editor.zoom;
      top  = (action.originalEvent.pageY - this.editor.translate.top) / this.editor.zoom;
    }

    entity.display.position = { left, top };
    if (capabilities.resizable) {

      startDrag(action.originalEvent, (event, { delta }) => {

        const width  = (delta.x) / this.editor.zoom;
        const height = (delta.y) / this.editor.zoom;

        entity.display.bounds = new BoundingRect(left, top, left + width, top + height);

      }, () => {

        // TODO - activeEntity.file.save() instead
        this.workspace.file.save();
        this.bus.execute(new SetToolAction(this.displayEntityToolFactory));
      });
    }
  }
}

import { Action } from "sf-core/actions";
import { IActor } from "sf-core/actors";
import { Service } from "sf-core/services";
import { startDrag } from "sf-front-end/utils/component";
import { inject } from "sf-core/decorators";
import { MAIN_BUS_NS } from "sf-core/dependencies";
import { BoundingRect } from "sf-core/geom";
import { IVisibleEntity, IContainerEntity } from "sf-core/entities";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { MouseAction, SetToolAction } from "sf-front-end/actions";
import { BaseEditorTool, IEditorTool, IEditor } from "sf-front-end/models";

export abstract class InsertTool extends BaseEditorTool {

  readonly cursor: string = "crosshair";
  readonly name: string =  "insert";

  @inject(MAIN_BUS_NS)
  readonly bus: IActor;

  abstract get displayEntityToolFactory(): { create(editor: IEditor): IEditorTool }
  abstract createSource(): any;

  async canvasMouseDown(action: MouseAction) {

    const parentEntity = <IContainerEntity>this.editor.activeEntity;
    const entity: IVisibleEntity = <IVisibleEntity>parentEntity.appendSourceChildNode(this.createSource());
    const capabilities = entity.display.capabilities;

    let left = 0;
    let top  = 0;

    if (capabilities.movable) {
      left = action.originalEvent.pageX;
      top  = action.originalEvent.pageY;
    }

    entity.display.position = { left, top };
    if (capabilities.resizable) {

      startDrag(action.originalEvent, (event, { delta }) => {

        const width  = (left + delta.x) / this.editor.zoom;
        const height = (left + delta.y) / this.editor.zoom;

        entity.display.bounds = new BoundingRect(left, top, left + width, top + height);

      }, () => {
        // this.bus.execute(new SetToolAction({ create: (editor) => this.editorToolFactory.create(editor) }));
      });
    }
  }
}
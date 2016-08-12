import { MouseAction } from "sf-front-end/actions";
import { BoundingRect } from "sf-core/geom";
import { IActor } from "sf-core/actors";
import { startDrag } from "sf-front-end/utils/component";

/*
TODO - this is all just a starting point.
*/

export interface IFile {
  path: string;
  content: string;
}

export interface IEditor {
  entity: any;
  zoom: number;
}

export interface ITool {
  name: string;
  cursor: string;
}

export abstract class BaseTool implements ITool {
  constructor(readonly name: string, readonly cursor: string = "pointer") {

  }
}

export abstract class BaseInsertTool extends BaseTool {
  constructor(readonly editor: IEditor, readonly name: string, readonly cursor: string, private _entityFactory: any, private _editToolClass:{ new(IEditor): ITool }) {
    super(name, cursor);
  }

  canvasMouseDown(action: MouseAction) {
    // this.editor.activeEntity.appendChild(this._entityFactory.create());

    // const left = action.originalEvent.pageX;
    // const top  = action.originalEvent.pageY;

    // startDrag(action.originalEvent, ({ delta }) => {
    //   entity.display.bounds = new BoundingRect(left, top, left + delta.x, top + delta.y).zoom(1 / this.editor.zoom);
    // }, () => {

    // });
  }
}
import { MouseAction } from "sf-front-end/actions";
import { Action } from "sf-core/actions";
import { IActor } from "sf-core/actors";
import { Service } from "sf-core/services";

export class InsertTool extends Service {

  cursor = "crosshair";

  canvasMouseDown(action: MouseAction) {
    console.log("MOUSE DOWN");
  }
}
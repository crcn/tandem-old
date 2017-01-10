import { SetMousePositionRequest } from "../../common/messages";
import { BaseCollaborateExtensionBrowserCommand } from "./base";
import { throttle } from "lodash";

export class TrackMousePositionCommand extends BaseCollaborateExtensionBrowserCommand {
  execute() {
    document.body.addEventListener("mousemove", throttle((event) => {      
      this.bus.dispatch(new SetMousePositionRequest({ 
        left: (event.clientX - this.editorStore.workspace.transform.left) / this.editorStore.workspace.transform.scale, 
        top: (event.clientY - this.editorStore.workspace.transform.top) / this.editorStore.workspace.transform.scale,
      }));
    }, 50));
  }
}
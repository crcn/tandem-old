import "./index.scss";
import * as React from "react";
import { Workspace } from "@tandem/editor/browser";
import { inject, BaseApplicationComponent } from "@tandem/common";
import ColorHash = require("color-hash");
import { RootCollaboratorStoreProvider, CollaborateRootStore, Collaborator } from "@tandem/collaborate-extension/editor/common";

class CursorComponent extends React.Component<{ workspace: Workspace, collaborator: Collaborator }, any> {
  render() {
    const { workspace, collaborator } = this.props;
    if (!collaborator.mousePosition) return null;
    const style = {
      transformOrigin: "top left",
      left: collaborator.mousePosition.left,
      top: collaborator.mousePosition.top,
      transform: `scale(${1/workspace.transform.scale})`
    };

    const ca = new ColorHash();


    const fillColor = ca.hex(collaborator.id);


      // <span className="label hide" style={{ background: fillColor }}>
      //   { collaborator.displayName || "Peer" }
      // </span>

    return <div className="cursor" style={style}>
      <svg version="1.2" x="0px" y="0px" viewBox="0 0 100 100">
        <polygon fill={fillColor} stroke="#FFF" points="27.5,7.5 27.5,71.14 45.381,63.733 57.296,92.5 66.535,88.674 54.619,59.907 72.5,52.5"></polygon>
      </svg>
    </div>;
  }
}

export class CursorsStageToolComponent extends  BaseApplicationComponent<{ workspace: Workspace }, any> {
  @inject(RootCollaboratorStoreProvider.ID)
  private _collaboratorStore: CollaborateRootStore;

  render() {
    const { workspace } = this.props;
    return <div className="share-cursors">
      { this._collaboratorStore.collaborators.map((collaborator, i) => {
        return <CursorComponent collaborator={collaborator} workspace={workspace} key={i} />
      })}
    </div>
  }
}
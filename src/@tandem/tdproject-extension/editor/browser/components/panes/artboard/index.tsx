import  "./index.scss";
import React =  require("React");
import { TextInputComponent } from "@tandem/uikit";
import { BaseApplicationComponent } from "@tandem/common";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import { InjectComponent } from "./inject";
import { SyntheticTDArtboardElement } from "@tandem/tdproject-extension/synthetic";
import { ArtboardPaneSizeComponent } from "./size";

export class ArtboardPaneComponent extends BaseApplicationComponent<{ workspace }, any> {

  get selectedArtboard() {
    const { selection } = this.props.workspace;
    if (selection.length !== 1 || selection[0].nodeName !== "artboard") return null;
    
    return selection[0] as SyntheticTDArtboardElement;
  }

  render() {
    const artboard = this.selectedArtboard;
    if (!artboard) return null;
    
    return <div>
      <InjectComponent artboard={artboard} />
      <hr />
      <ArtboardPaneSizeComponent workspace={this.props.workspace} artboard={this.selectedArtboard} />
    </div>
  }
}
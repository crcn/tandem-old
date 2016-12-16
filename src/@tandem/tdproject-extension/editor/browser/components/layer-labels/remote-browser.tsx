import "./remote-browser.scss";
import React =  require("react");
import AutosizeInput = require("react-input-autosize");
import { FocusComponent } from "@tandem/editor/browser";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import { BaseApplicationComponent } from "@tandem/common";
import { SyntheticRemoteBrowserElement } from "@tandem/tdproject-extension/synthetic";

export class RemoteBrowserLayerLabelComponent extends BaseApplicationComponent<{ element: SyntheticRemoteBrowserElement, renderOuterLabel: (inner, className) => any }, { edit: boolean }> {

  private _currentInputValue: string;

  state = {
    edit: false
  }


  cancel = () => {
    this._currentInputValue = undefined;
    this.setState({ edit: false });
  }

  render() {
    const { element, renderOuterLabel } = this.props;
    return <span className="td-remote-browser-layer-label-outer">
      {renderOuterLabel(<span>{ element.title || "Untitled" }</span>, "td-remote-browser-layer-label-inner") }
    </span>
  }
}
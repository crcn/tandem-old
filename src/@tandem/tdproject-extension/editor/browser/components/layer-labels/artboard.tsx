import "./artboard.scss";
import * as React from "react";
import * as AutosizeInput from "react-input-autosize";
import { FocusComponent } from "@tandem/editor/browser";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import { BaseApplicationComponent } from "@tandem/common";
import { SyntheticTDArtboardElement } from "@tandem/tdproject-extension/synthetic";

export class ArtboardLayerLabelComponent extends BaseApplicationComponent<{ element: SyntheticTDArtboardElement, renderOuterLabel: (inner, className) => any }, { edit: boolean }> {

  private _currentInputValue: string;

  state = {
    edit: false
  }

  saveTitle = () => {
    const edit = this.props.element.createEdit();
    this.props.element.title = this._currentInputValue;
    edit.setAttribute("title", this._currentInputValue);
    this.bus.dispatch(new ApplyFileEditRequest(edit.mutations));
    this._currentInputValue = undefined;
    this.setState({ edit: false });
  }

  cancel = () => {
    this._currentInputValue = undefined;
    this.setState({ edit: false });
  }

  editTitle = () => {
    this._currentInputValue = this.props.element.title;
    this.setState({ edit: true });
  }
  render() {
    const { element, renderOuterLabel } = this.props;
    return <span className="td-artboard-layer-label-outer" onDoubleClick={this.editTitle} onBlur={this.saveTitle}>
      {renderOuterLabel(<span>{this.state.edit ? this.renderInput() : element.title || "Untitled" }</span>, "td-artboard-layer-label-inner") }
    </span>
  }

  renderInput() {
    return <FocusComponent select={true}>
      <AutosizeInput ref="input" defaultValue={this.props.element.title || "Untitled"} onChange={(event) => this._currentInputValue = event.currentTarget.value} onKeyUp={(event) => {
        if (event.keyCode === 27) this.cancel();
        if (event.keyCode === 13) this.saveTitle();
      }} />
    </FocusComponent>
  }
}
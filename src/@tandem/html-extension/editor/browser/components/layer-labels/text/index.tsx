
import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { SelectRequest } from "@tandem/editor/browser/messages";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import * as AutosizeInput from "react-input-autosize";
import { FocusComponent } from "@tandem/editor/browser/components/common";
import { SyntheticDOMText } from "@tandem/synthetic-browser";

export class TextLayerLabelComponent extends React.Component<{ node: SyntheticDOMText, connectDragSource: Function }, any> {

  private _oldValue: string;

  editLabel = () => {
    // this.props.entity.metadata.set(MetadataKeys.EDIT_LAYER, true);
  }

  render() {

    // const edit = this.state.edit && !!~this.props.app.selection.indexOf(this.props.entity);
    const connectDragSource = this.props.connectDragSource;
    // const edit = this.props.node.metadata.get(MetadataKeys.EDIT_LAYER);

    return connectDragSource(<span
      className="m-label m-text-layer-label"
      onDoubleClick={this.editLabel}>
      {
        false         ?
        this.renderInput()      :
        this.props.node.nodeValue
      }
    </span>);
  }

  onInputChange = (event) => {
    this.props.node.nodeValue = event.target.value;
    this.forceUpdate();
  }

  doneEditing = ()  => {
    // this.props.node.metadata.set(MetadataKeys.EDIT_LAYER, false);
    // this.props.node.edit((edit) => edit.setNodeValue(this.props.node, this.props.node.nodeValue));
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      // this.props.entity.value = this.props.entity.source.value;
    }
  }

  onFocus = (event) => {
    event.target.select();
  }

  renderInput() {
    return <FocusComponent><AutosizeInput
      type="text"
      className="m-layer-label-input"
      onFocus={this.onFocus}
      value={this.props.node.nodeValue}
      onChange={this.onInputChange}
      onBlur={this.doneEditing}
      onKeyDown={this.onKeyDown}
      /></FocusComponent>;
  }
}


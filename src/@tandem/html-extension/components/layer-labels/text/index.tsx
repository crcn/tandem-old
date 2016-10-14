
import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { FocusComponent } from "@tandem/editor/components/common";
import { SelectAction } from "@tandem/editor/actions";
import { MetadataKeys } from "@tandem/editor/constants";
import * as AutosizeInput from "react-input-autosize";
import { BaseDOMNodeEntity, SyntheticDOMText  } from "@tandem/synthetic-browser";

export class TextLayerLabelComponent extends React.Component<{ entity: BaseDOMNodeEntity<SyntheticDOMText, any>, connectDragSource: Function }, any> {

  private _oldValue: string;

  editLabel = () => {
    this.props.entity.metadata.set(MetadataKeys.EDIT_LAYER, true);
  }

  render() {

    // const edit = this.state.edit && !!~this.props.app.selection.indexOf(this.props.entity);
    const connectDragSource = this.props.connectDragSource;
    const edit = this.props.entity.metadata.get(MetadataKeys.EDIT_LAYER);

    return connectDragSource(<span
      className="m-label m-text-layer-label"
      onDoubleClick={this.editLabel}>
      {
        edit         ?
        this.renderInput()      :
        this.props.entity.change.nodeValue
      }
    </span>);
  }

  onInputChange = (event) => {
    this.props.entity.change.nodeValue = event.target.value;
    this.forceUpdate();
  }

  doneEditing = ()  => {
    this.props.entity.metadata.set(MetadataKeys.EDIT_LAYER, false);
    this.props.entity.edit((edit) => edit.setNodeValue(this.props.entity.source, this.props.entity.change.nodeValue));
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
      value={this.props.entity.change.nodeValue}
      onChange={this.onInputChange}
      onBlur={this.doneEditing}
      onKeyDown={this.onKeyDown}
      /></FocusComponent>;
  }
}


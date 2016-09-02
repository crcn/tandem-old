
import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import FocusComponent from "sf-front-end/components/focus";
import { SelectAction } from "sf-front-end/actions";
import { MetadataKeys } from "sf-front-end/constants";
import * as AutosizeInput from "react-input-autosize";
import { HTMLTextEntity, HTMLTextExpression } from "sf-html-extension/ast";
import { LayerLabelComponentFactoryDependency } from "sf-front-end/dependencies";

class TextLayerLabelComponent extends React.Component<{ entity: HTMLTextEntity, connectDragSource: Function }, any> {

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
        this.props.entity.value
      }
    </span>);
  }

  onInputChange = (event) => {
    this.props.entity.value = event.target.value;
    this.forceUpdate();
  }

  doneEditing = ()  => {
    this.props.entity.metadata.set(MetadataKeys.EDIT_LAYER, false);
    this.props.entity.source.value = this.props.entity.value;
    this.props.entity.document.update();
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      this.props.entity.value = this.props.entity.source.value;
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
      value={this.props.entity.value}
      onChange={this.onInputChange}
      onBlur={this.doneEditing}
      onKeyDown={this.onKeyDown}
      /></FocusComponent>;
  }
}

export const dependency = new LayerLabelComponentFactoryDependency(HTMLTextExpression.name, TextLayerLabelComponent);

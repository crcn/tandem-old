import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { SelectAction } from "@tandem/front-end/actions";
import * as AutosizeInput from "react-input-autosize";
import { LayerLabelComponentFactoryDependency } from "@tandem/front-end/dependencies";
import { PCBlockNodeEntity, PCBlockNodeExpression } from "@tandem/paperclip-extension/lang";

class BlockLayerLabel extends React.Component<{ entity: PCBlockNodeEntity, connectDragSource: Function }, any> {

  constructor() {
    super();
    this.state = {
      edit: false
    };
  }

  editLabel() {
    this.setState({
      edit: true
    });
  }

  render() {

    const edit = this.state.edit;
    const connectDragSource = this.props.connectDragSource;

    return connectDragSource(<span
      title={this.props.entity.source.value}
      onDoubleClick={this.editLabel.bind(this)}>
      <span className="meta definition punctuation tag begin">
        {"${ "}
      </span>
      <span className="entity name instance">
        { String(this.props.entity.source.value).trim() }
      </span>
      <span className="meta definition punctuation tag end">
        {" }"}
      </span>
    </span>);
  }

  doneEditing() {
    this.setState({ edit: false });
  }

  onInputKeyDown(event) {
    if (event.keyCode === 13) {
      this.doneEditing();
    }
  }

  onInputFocus(event) {
    event.target.select();
  }
}

export const blockNodeLayerLabelComponentDependency = new LayerLabelComponentFactoryDependency(PCBlockNodeExpression.name, BlockLayerLabel);

import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { SelectAction } from "sf-front-end/actions";
import * as AutosizeInput from "react-input-autosize";
import { HTMLCommentEntity, HTMLCommentExpression } from "sf-html-extension/ast";
import { LayerLabelComponentFactoryDependency } from "sf-front-end/dependencies";

class CommentLayerLabel extends React.Component<{ entity: HTMLCommentEntity, connectDragSource: Function }, any> {

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
      className="m-label m-comment-layer-label"
      onDoubleClick={this.editLabel.bind(this)}>
      {
         String(this.props.entity.value || "").trim()
      }
    </span>);
  }

  // onInputChange(event) {
  //   this.props.entity.setProperties({
  //     value: event.target.nodeValue
  //   });
  // }

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

export const dependency = new LayerLabelComponentFactoryDependency(HTMLCommentExpression.name, CommentLayerLabel);

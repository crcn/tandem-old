import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { SelectAction } from "@tandem/editor/actions";
import * as AutosizeInput from "react-input-autosize";
import { LayerLabelComponentFactoryDependency } from "@tandem/editor/dependencies";
import { BaseDOMNodeEntity, SyntheticDOMComment  } from "@tandem/synthetic-browser";

export class CommentLayerLabelCoponent extends React.Component<{ entity: BaseDOMNodeEntity<SyntheticDOMComment, any>, connectDragSource: Function }, any> {

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
      className="m-label m-comment-layer-label comment"
      onDoubleClick={this.editLabel.bind(this)}>
      {
         this.props.entity.source.nodeValue.trim()
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


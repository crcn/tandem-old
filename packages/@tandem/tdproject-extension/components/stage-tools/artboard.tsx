import "./index.scss";
import * as React from "react";
import * as AutosizeInput from "react-input-autosize";

import { BoundingRect } from "@tandem/common";
import { SelectAction } from "@tandem/editor/actions";
import { SyntheticTDArtboardElement } from "@tandem/tdproject-extension/synthetic";
import { FrontEndApplication, Workspace } from "@tandem/editor";
import { ApplyEditAction, SetKeyValueEditAction } from "@tandem/sandbox";
import { SyntheticHTMLElement, SyntheticDOMElementEdit } from "@tandem/synthetic-browser";

export class TDArtboardComponent extends React.Component<{ artboard: SyntheticTDArtboardElement, workspace: Workspace, app: FrontEndApplication }, {
  edit: SyntheticDOMElementEdit,
  titleEditAction: SetKeyValueEditAction
}> {

  constructor() {
    super();
    this.state = {
      edit: undefined,
      titleEditAction: undefined
    };
  }

  editTitle = () => {
    if (!this.props.artboard.source) return;

    const { artboard } = this.props;
    const edit = artboard.createEdit();

    this.setState({
      edit: edit,
      titleEditAction: edit.setAttribute("title", this.props.artboard.getAttribute("title"))
    });

    // rAF since the input may not be available immediately
    requestAnimationFrame(() => {
      (this.refs as any).input.select();
    });
  }

  onTitleChange = (event) => {
    this.state.titleEditAction.newValue = event.target.value;
    this.forceUpdate();
  }

  cancelEdit = () => {
    this.doneEditing();
  }

  save = async () => {
    const { artboard } = this.props;

    // apply the change back to the element so that the user sees
    // the change immediately
    this.state.edit.applyActionsTo(artboard);

    await this.props.app.bus.execute(new ApplyEditAction(this.state.edit));
    this.doneEditing();
  }

  doneEditing = () => {
    this.setState({ titleEditAction: undefined, edit: undefined });
  }

  selectEntity = (event: React.MouseEvent) => {
    this.props.app.bus.execute(new SelectAction([this.props.artboard], event.metaKey || event.shiftKey));
  }

  onKeyDown = (event: React.KeyboardEvent): any => {
    const keyCode = event.which;
    switch (event.which) {
      case 27: return this.cancelEdit();
      case 13: return this.save();
    }
  }

  render() {
    const { artboard, workspace } = this.props;

    // TODO - get absolute bounds here
    const bounds = artboard.getBoundingClientRect();
    const scale = 1 / workspace.transform.scale;

    const style = {
      left   : bounds.left,
      boxShadow: `0 0 0 ${scale}px rgba(0,0,0,0.1)`,
      top    : bounds.top,
      width  : bounds.width,
      height : bounds.height
    };

    const fontSize = 12;

    const titleStyle = {
      position: "absolute",
      display: workspace.transform.scale > 0.2 ? "block" : "none",
      top: 0,
      fontSize: 12,
      transform: `translateY(${-25 * scale}px) scale(${scale})`,
      transformOrigin: "top left"
    };

    return <div className="m-tdartboard-stage-tool--item" style={style}>
      <div className="m-tdartboard-stage-tool--item--title" onClick={this.selectEntity} onDoubleClick={this.editTitle} style={titleStyle}>
        { this.state.titleEditAction ? <AutosizeInput ref="input" value={this.state.titleEditAction.newValue} onChange={this.onTitleChange} onBlur={this.cancelEdit} onKeyDown={this.onKeyDown} /> : <span>{artboard.title || "Untitled"}</span> }
      </div>
    </div>;
  }
}

export class TDArtboardStageToolComponent extends React.Component<{ app: FrontEndApplication }, any> {
  render() {
    const { workspace } = this.props.app;
    const { document, transform } = workspace;

    const artboards = document.querySelectorAll("artboard") as SyntheticTDArtboardElement[];

    if (!artboards.length) return null;

    const backgroundStyle = {
      transform: `translate(${-transform.left / transform.scale}px, ${-transform.top / transform.scale}px) scale(${1 / transform.scale})`,
      transformOrigin: "top left"
    };

    return <div className="m-tdartboard-stage-tool">
      <div style={backgroundStyle} className="m-tdartboard-stage-tool--background" />
      {
        artboards.map((artboard) => {
          return <TDArtboardComponent key={artboard.uid} workspace={workspace} artboard={artboard} app={this.props.app} />;
        })
      }
    </div>;
  }
}
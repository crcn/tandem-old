import "./index.scss";

import * as React from "react";
import { BoundingRect } from "@tandem/common";
import * as AutosizeInput from "react-input-autosize";
import { SelectAction } from "@tandem/editor/actions";
import { SyntheticTDArtboardElement } from "@tandem/tdproject-extension/synthetic";
import { SyntheticHTMLElement } from "@tandem/synthetic-browser";
import { FrontEndApplication, Editor } from "@tandem/editor";

export class TDArtboardComponent extends React.Component<{ artboard: SyntheticTDArtboardElement, editor: Editor, app: FrontEndApplication }, { editedTitle: string }> {

  constructor() {
    super();
    this.state = {
      editedTitle: undefined
    };
  }

  editTitle = () => {
    if (!this.props.artboard.module.editor) return;
    this.setState({ editedTitle: this.props.artboard.title || "" });
    requestAnimationFrame(() => {
      (this.refs as any).input.select();
    });
  }

  onTitleChange = (event) => {
    this.setState({ editedTitle: event.target.value });
  }

  cancelEdit = () => {
    this.setState({ editedTitle: undefined });

    // easiest way to revert changes -- just reload the sandbox entirely
    // this.props.artboard.sandbox.evaluate();
  }

  save = () => {
    const artboard = this.props.artboard;
    artboard.module.editor.edit((edit) => {

      // trigger immediate change
      this.props.artboard.title = this.state.editedTitle;

      // this.props.artboard.save();

      this.setState({ editedTitle: undefined });
    });
  }

  selectEntity = (event: React.MouseEvent) => {
    this.props.app.bus.execute(new SelectAction([this.props.artboard], event.metaKey || event.shiftKey));
  }

  onKeyDown = (event) => {
    const keyCode = event.which;
    switch (event.which) {
      case 27: return this.cancelEdit();
      case 13: return this.save();
    }
  }

  render() {
    const { artboard, editor } = this.props;

    // TODO - get absolute bounds here
    const bounds = artboard.getBoundingClientRect();
    const scale = 1 / editor.transform.scale;

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
      display: editor.transform.scale > 0.2 ? "block" : "none",
      top: 0,
      fontSize: 12,
      transform: `translateY(${-25 * scale}px) scale(${scale})`,
      transformOrigin: "top left"
    };

    return <div className="m-tdartboard-stage-tool--item" style={style}>
      <div className="m-tdartboard-stage-tool--item--title" onClick={this.selectEntity} onDoubleClick={this.editTitle} style={titleStyle}>
        { this.state.editedTitle != null ? <AutosizeInput ref="input" value={this.state.editedTitle} onChange={this.onTitleChange} onBlur={this.cancelEdit} onKeyDown={this.onKeyDown} /> : <span>{artboard.title || "Untitled"}</span> }
      </div>
    </div>;
  }
}

export class TDArtboardStageToolComponent extends React.Component<{ app: FrontEndApplication }, any> {
  render() {
    const { editor } = this.props.app;
    const { document, transform } = editor;

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
          return <TDArtboardComponent key={artboard.uid} editor={editor} artboard={artboard} app={this.props.app} />;
        })
      }
    </div>;
  }
}
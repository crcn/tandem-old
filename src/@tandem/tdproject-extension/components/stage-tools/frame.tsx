import "./index.scss";

import * as React from "react";
import { BoundingRect } from "@tandem/common";
import * as AutosizeInput from "react-input-autosize";
import { FrontEndApplication, Editor } from "@tandem/editor";
import { SyntheticHTMLElement } from "@tandem/synthetic-browser";
import { TDFrameEntity } from "@tandem/tdproject-extension/synthetic";

export class TDFrameComponent extends React.Component<{ frame: TDFrameEntity, editor: Editor }, { editedTitle: string }> {

  constructor() {
    super();
    this.state = {
      editedTitle: undefined
    };
  }

  editTitle = () => {
    if (!this.props.frame.module.editor) return;
    this.setState({ editedTitle: this.props.frame.title || "" });
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
    this.props.frame.sandbox.reload();
  }

  save = () => {
    const frame = this.props.frame;
    frame.module.editor.edit((edit) => {

      // trigger immediate change
      this.props.frame.title = this.state.editedTitle;

      this.props.frame.save();

      this.setState({ editedTitle: undefined });
    });
  }

  onKeyDown = (event) => {
    const keyCode = event.which;
    switch (event.which) {
      case 27: return this.cancelEdit();
      case 13: return this.save();
    }
  }

  render() {
    const { frame, editor } = this.props;
    const bounds = frame.absoluteBounds;
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

    return <div className="m-tdframe-stage-tool--item" style={style}>
      <div className="m-tdframe-stage-tool--item--title" onDoubleClick={this.editTitle} style={titleStyle}>
        { this.state.editedTitle != null ? <AutosizeInput ref="input" value={this.state.editedTitle} onChange={this.onTitleChange} onBlur={this.cancelEdit} onKeyDown={this.onKeyDown} /> : <span>{frame.title || "Untitled"}</span> }
      </div>
    </div>;
  }
}

export class TDFrameStageToolComponent extends React.Component<{ app: FrontEndApplication }, any> {
  render() {
    const { editor } = this.props.app;
    const { documentEntity, transform } = editor;

    const frames = documentEntity.querySelectorAll("frame") as TDFrameEntity[];

    if (!frames.length) return null;


    const backgroundStyle = {
      transform: `translate(${-transform.left / transform.scale}px, ${-transform.top / transform.scale}px) scale(${1 / transform.scale})`,
      transformOrigin: "top left"
    };

    return <div className="m-tdframe-stage-tool">
      <div style={backgroundStyle} className="m-tdframe-stage-tool--background" />
      {
        frames.map((frame) => {
          return <TDFrameComponent key={frame.uid} editor={editor} frame={frame} />;
        })
      }
    </div>;
  }
}
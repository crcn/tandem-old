import "./index.scss";

import * as React from "react";
import { BoundingRect } from "@tandem/common";
import * as AutosizeInput from "react-input-autosize";
import { FrontEndApplication, Editor } from "@tandem/editor";
import { SyntheticHTMLElement } from "@tandem/synthetic-browser";
import { SyntheticTDFrameEntity } from "@tandem/tdproject-extension/synthetic";

export class TDFrameComponent extends React.Component<{ frame: SyntheticTDFrameEntity, editor: Editor }, { editTitle: boolean }> {

  constructor() {
    super();
    this.state = {
      editTitle: false
    };
  }

  editTitle = () => {
    if (!this.props.frame.module.editor) return;
    this.setState({ editTitle: true });
    requestAnimationFrame(() => {
      (this.refs as any).input.select();
    });
  }

  onTitleChange = (event) => {
    // edit(this.props.frame.source, new SetAttributeEdit());
    this.props.frame.source.setAttribute("title", event.target.value);
  }

  cancelEdit = () => {
    this.setState({ editTitle: false });

    // easiest way to revert changes -- just reload the sandbox entirely
    this.props.frame.sandbox.reload();
  }

  save = () => {
    const frame = this.props.frame;
    this.setState({ editTitle: false });
    frame.module.editor.edit((edit) => {
      edit.setElementAttribute(frame.source, "title", frame.source.getAttribute("title"));
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
    const bounds = frame.scaledBounds;
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

    const title = frame.source.getAttribute("title");

    return <div className="m-tdframe-stage-tool--item" style={style}>
      <div className="m-tdframe-stage-tool--item--title" onDoubleClick={this.editTitle} style={titleStyle}>
        { this.state.editTitle ? <AutosizeInput ref="input" value={title} onChange={this.onTitleChange} onBlur={this.cancelEdit} onKeyDown={this.onKeyDown} /> : <span>{frame.source.getAttribute("title") || "Untitled"}</span> }
      </div>
    </div>;
  }
}

export class TDFrameStageToolComponent extends React.Component<{ app: FrontEndApplication }, any> {
  render() {
    const { editor } = this.props.app;
    const { documentEntity, transform } = editor;

    const frames = documentEntity.querySelectorAll("frame") as SyntheticTDFrameEntity[];

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
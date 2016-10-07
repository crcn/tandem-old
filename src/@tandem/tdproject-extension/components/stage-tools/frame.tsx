import "./index.scss";

import * as React from "react";
import { BoundingRect } from "@tandem/common";
import * as AutosizeInput from "react-input-autosize";
import { SyntheticTDFrame } from "@tandem/tdproject-extension/synthetic";
import { FrontEndApplication, Editor } from "@tandem/editor";

export class TDFrameComponent extends React.Component<{ frame: SyntheticTDFrame, editor: Editor }, { editTitle: boolean }> {

  constructor() {
    super();
    this.state = {
      editTitle: false
    };
  }

  editTitle = () => {
    this.setState({ editTitle: true });
    requestAnimationFrame(() => {
      (this.refs as any).input.select();
    })
  }

  onTitleChange = (event) => {
    this.props.frame.setAttribute("title", event.target.value);
  }

  cancelEdit = () => {
    this.setState({ editTitle: false });
  }

  onKeyDown = (event) => {
    if (/27|13/.test(event.which)) {
      this.setState({ editTitle: false });
    }
  }

  render() {
    const { frame, editor } = this.props;
    const bounds = frame.getBoundingClientRect();

    const style = {
      left   : bounds.left,
      top    : bounds.top,
      width  : bounds.width,
      height : bounds.height
    };

    const scale = 1 / editor.transform.scale;
    const fontSize = 12;

    const titleStyle = {
      position: "absolute",
      display: editor.transform.scale > 0.2 ? "block": "none",
      top: 0,
      fontSize: 12,
      transform: `translateY(${-25 * scale}px) scale(${scale})`,
      transformOrigin: "top left"
    };

    const title = frame.getAttribute("title");

    return <div className="m-tdframe-stage-tool--item" style={style}>
      <div className="m-tdframe-stage-tool--item--title" onDoubleClick={this.editTitle} style={titleStyle}>
        { this.state.editTitle ? <AutosizeInput ref="input" value={title} onChange={this.onTitleChange} onBlur={this.cancelEdit} onKeyDown={this.onKeyDown} /> : <span>{frame.getAttribute("title") || "Untitled"}</span> }
      </div>
    </div>;
  }
}

export class TDFrameStageToolComponent extends React.Component<{ app: FrontEndApplication }, any> {
  render() {
    const { editor } = this.props.app;
    const { document, transform } = editor;
    const frames = document.querySelectorAll("frame") as SyntheticTDFrame[];
    if (!frames.length) return null;

    const backgroundStyle = {
      transform: `translate(${-transform.left/transform.scale}px, ${-transform.top/transform.scale}px) scale(${1/transform.scale})`,
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
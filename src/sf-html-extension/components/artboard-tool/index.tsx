import "./index.scss";

import * as React from "react";
import FocusComponent from "sf-front-end/components/focus";
import * as AutosizeInput from "react-input-autosize";
import { Workspace, Editor } from "sf-front-end/models";
import { HTMLArtboardEntity } from "sf-html-extension/models";
import { ReactComponentFactoryDependency } from "sf-front-end/dependencies";

export class ArtboardComponent extends React.Component<{ entity: HTMLArtboardEntity, editor: Editor }, any> {
  constructor(props) {
    super(props);
    this.state = { editTitle: false };
  }
  onDoubleClick = (event: MouseEvent) => {
    this.setState({ editTitle: true });
  }
  onTitleKeyDown = (event: KeyboardEvent) => {
    console.log((event.target as any).value);
    if (event.keyCode === 13) {
      this.setState({ editTitle: true });
    }
    event.stopPropagation();
  }

  onInputFocus = (event) => {
    event.target.select();
  }

  render() {
    const display = this.props.entity.display;
    const bounds = display.bounds;
    const scale = 1 / this.props.editor.transform.scale;
    const style = {
      left: bounds.left,
      top: bounds.top
    };

    const titleStyle = {
      top: -20 * scale,
      fontSize: 12 *  scale,
      letterSpacing: 1.5 * scale
    };

    const borderStyle = {
      width: bounds.width,
      height: bounds.height,
      boxShadow: `0px 0px ${5 * scale}px 0px rgba(0,0,0,0.75)`
    };

    const title = this.props.entity.getAttribute("title") || "Untitled";

    return <div style={style} className="m-artboard-tool-editor">
      <div style={titleStyle} className="m-artboard-tool-editor-title" onDoubleClick={this.onDoubleClick}>
        { this.state.editTitle ? <FocusComponent><AutosizeInput onFocus={this.onInputFocus.bind(this)} value={title} onKeyDown={this.onTitleKeyDown} /></FocusComponent> : title }
      </div>
      <div style={borderStyle} className="m-artboard-tool-editor-border">
      </div>
    </div>;
  }
}

export class ArtboardToolComponent extends React.Component<{ zoom: number, workspace: Workspace }, any> {
  render() {

    const artboards = this.props.workspace.file.document.flatten().filter((node) => String(node.nodeName).toLowerCase() === "artboard");

    if (!artboards.length) return null;

    const editor = this.props.workspace.editor;

    return (<div className="m-artboard-tool">
      { artboards.map((entity: HTMLArtboardEntity, i) => <ArtboardComponent entity={entity} editor={editor} key={i} />)}
    </div>);
  }
}

export const dependency = new ReactComponentFactoryDependency("components/tools/pointer/artboard", ArtboardToolComponent);


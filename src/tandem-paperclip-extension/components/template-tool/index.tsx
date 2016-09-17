import "./index.scss";

import * as React from "react";
import FocusComponent from "tandem-front-end/components/focus";
import { Workspace, Editor } from "tandem-front-end/models";
import { PCTemplateEntity } from "tandem-paperclip-extension/ast";
import { ReactComponentFactoryDependency } from "tandem-front-end/dependencies";

export class ArtboardComponent extends React.Component<{ entity: PCTemplateEntity, editor: Editor }, any> {
  constructor(props) {
    super(props);
    this.state = { editTitle: false };
  }
  onDoubleClick = (event: MouseEvent) => {
    this.setState({ editTitle: true });
  }
  onTitleKeyDown = (event: KeyboardEvent) => {
    if (event.which === 13) {
      this.save(event);
    }
    event.stopPropagation();
  }

  onInputFocus = (event) => {
    event.target.select();
  }

  onBlur = (event) => {
    this.save(event);
  }

  save(event) {
    this.props.entity.source.setAttribute("title", (event.target as any).value);
    this.setState({ editTitle: false });
  }

  render() {
    const display = this.props.entity.display;
    const bounds = display.bounds;
    const scale = 1 / Math.max(this.props.editor.transform.scale, 0.2);
    const style = {
      left: bounds.left,
      top: bounds.top
    };

    const titleStyle = {
      transform: `translateY(${-25 * scale}px) scale(${scale})`,
      transformOrigin: "top left",
      width: bounds.width,
      display: this.props.editor.transform.scale < 0.1 ? "none" : undefined
    };

    const borderStyle = {
      width: bounds.width,
      height: bounds.height,
      boxShadow: `0px 0px ${5 * scale}px 0px #586375`
    };

    const title = this.props.entity.getAttribute("title") || "Untitled";


    return <div style={style} className="m-artboard-tool-editor">
      <div style={titleStyle} className="m-artboard-tool-editor-title" onDoubleClick={this.onDoubleClick}>
        { this.state.editTitle ? <FocusComponent><input onFocus={this.onInputFocus.bind(this)} onBlur={this.onBlur} defaultValue={title} onKeyDown={this.onTitleKeyDown} /></FocusComponent> : title }
      </div>
      <div style={borderStyle} className="m-artboard-tool-editor-border">
      </div>
    </div>;
  }
}

export class ArtboardToolComponent extends React.Component<{ zoom: number, workspace: Workspace }, any> {
  render() {

    const artboards = this.props.workspace.file.entity.flatten().filter((entity) => entity instanceof PCTemplateEntity);

    if (!artboards.length) return null;

    const editor = this.props.workspace.editor;
    const scale = 1 / editor.transform.scale;

    const bgstyle = {
      transform: `translate(${-editor.transform.left * scale}px, ${-editor.transform.top * scale}px) scale(${scale})`,
      transformOrigin: "top left"
    };

    return (<div className="m-artboard-tool">
      <div style={bgstyle} className="m-artboard-tool-background"></div>
      { artboards.map((entity: PCTemplateEntity, i) => <ArtboardComponent entity={entity} editor={editor} key={i} />)}
    </div>);
  }
}

export const templateToolComponentDependency = new ReactComponentFactoryDependency("components/tools/pointer/template", ArtboardToolComponent);


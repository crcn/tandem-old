import "./index.scss";

import * as React from "react";
// import Reference from "sf-common/reference";
import WYSIWYGEditor from "sf-front-end/components/wysiwyg";
import { FrontEndApplication } from "sf-front-end/application";
import { TextEditCompleteAction } from "sf-html-extension/actions";
import { Workspace, DisplayEntitySelection } from "sf-front-end/models";
import { VisibleHTMLElementEntity } from "sf-html-extension/entities/html";

class TextToolComponent extends React.Component<{ app: FrontEndApplication, zoom: number, workspace: Workspace }, any> {

  componentDidMount() {
    (this.refs as any).input.focus();
    (this.refs as any).input.select();
  }

  onKeyDown(event) {

    // TODO - want to support newline characters at some point
    if (event.keyCode === 13) {
      event.preventDefault();
      this._complete();
    }
  }

  onBlur(event) {
    this._complete();
  }

  _complete() {
    this.props.app.bus.execute(new TextEditCompleteAction());
  }

  render() {
    const selection = this.props.workspace.selection as DisplayEntitySelection;
    const zoom      = this.props.zoom;
    const cstyle    = selection.display.bounds;

    const style = {
      position : "absolute",
      left     : cstyle.left,
      top      : cstyle.top,
      zoom     : this.props.zoom,
      zIndex   : 999
    };

    const element = (selection[0] as VisibleHTMLElementEntity).section.targetNode as any as Element;

    const cstyle2 = window.getComputedStyle(element);

    const inputStyle = {
      width         : cstyle.width,
      height        : cstyle.height,
      fontSize      : cstyle2.fontSize,
      fontFamily    : cstyle2.fontFamily,
      fontWeight    : cstyle2.fontWeight,
      letterSpacing : cstyle2.letterSpacing,
      lineHeight    : cstyle2.lineHeight,
      overflow      : "show"
    };

    return <div style={style} className="reset-all m-text-tool">
      <WYSIWYGEditor
        multiline={false}
        onKeyDown={this.onKeyDown.bind(this)}
        onBlur={this.onBlur.bind(this)}
        ref="input"
        style={inputStyle}
        reference={{ getValue: () => element.nodeValue, setValue: (value) => element.nodeValue = value }} />
    </div>
  }
}

export default TextToolComponent;

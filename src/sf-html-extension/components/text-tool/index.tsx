import "./index.scss";

import * as React from "react";
// import Reference from "sf-common/reference";
import { FrontEndApplication } from "sf-front-end/application";
import { TextEditCompleteAction } from "sf-html-extension/actions";
import { Workspace, DisplayEntitySelection } from "sf-front-end/models";
import { VisibleHTMLElementEntity } from "sf-html-extension/entities/html";
import { ReactComponentFactoryDependency } from "sf-front-end/dependencies";
import { parse as parseHTML } from "sf-html-extension/parsers/html";

class TextToolComponent extends React.Component<{ app: FrontEndApplication, zoom: number, workspace: Workspace }, any> {

  private _input: HTMLSpanElement;

  componentDidMount() {
    const element =  this.selection.section.targetNode as any as Element;

    this._input = document.createElement("div");
    this._input.addEventListener("input", this.onKeyDown);
    this._input.tabIndex = 0;
    this._input.innerHTML = element.textContent;
    this._input.setAttribute("contenteditable", "true");
    (this.refs as any).container.appendChild(this._input);
    this._input.focus();
  }

  get selection() {
    return (this.props.workspace.selection as DisplayEntitySelection)[0] as VisibleHTMLElementEntity;
  }

  onKeyDown = (event) => {
    this.selection.source.childNodes = parseHTML(this._input.innerHTML).childNodes;
    this.props.workspace.file.save();

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
    const cstyle    = selection.display.bounds;

    const style = {
      position : "absolute",
      left     : cstyle.left,
      top      : cstyle.top,
      zIndex   : 99999
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

    return <div style={Object.assign(style, inputStyle)} ref="container" className="m-text-tool">
    </div>;
  }
}

export const dependency = new ReactComponentFactoryDependency("components/tools/text/edit", TextToolComponent);



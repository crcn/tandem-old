import "./index.scss";
import React =  require("react");
import AutosizeInput = require("react-input-autosize");

import tc =  require("tinycolor2");
import { Status } from "@tandem/common/status";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import { SyntheticRemoteBrowserElement } from "@tandem/tdproject-extension/synthetic";
import { Workspace, SelectRequest, StatusComponent } from "@tandem/editor/browser";
import { SyntheticHTMLElement, SyntheticDOMElementEdit } from "@tandem/synthetic-browser";
import { BoundingRect, BaseApplicationComponent, PropertyMutation, startDrag } from "@tandem/common";

export class TDRemoteBrowserComponent extends BaseApplicationComponent<{ remoteBrowser: SyntheticRemoteBrowserElement, workspace: Workspace, backgroundColor: string }, {
  edit: SyntheticDOMElementEdit,
  titleEditChange: PropertyMutation<any>
}> {

  $didInject() {
    super.$didInject();
    this.state = {
      edit: undefined,
      titleEditChange: undefined
    };
  }

  editTitle = () => {
    if (!this.props.remoteBrowser.source) return;

    const { remoteBrowser } = this.props;
    const edit = remoteBrowser.createEdit();

    this.setState({
      edit: edit,
      titleEditChange: edit.setAttribute("title", this.props.remoteBrowser.getAttribute("title"))
    });

    // rAF since the input may not be available immediately
    requestAnimationFrame(() => {
      (this.refs as any).input.select();
    });
  }

  onTitleChange = (event) => {
    this.state.titleEditChange.newValue = event.target.value;
    this.forceUpdate();
  }

  cancelEdit = () => {
    this.doneEditing();
  }

  save = async () => {
    const { remoteBrowser } = this.props;

    // apply the change back to the element so that the user sees
    // the change immediately
    this.state.edit.applyMutationsTo(remoteBrowser);

    await this.bus.dispatch(new ApplyFileEditRequest(this.state.edit.mutations));
    this.doneEditing();
  }

  doneEditing = () => {
    this.setState({ titleEditChange: undefined, edit: undefined });
  }

  select = (event: React.MouseEvent<any>) => {
    this.props.workspace.select(this.props.remoteBrowser, event.metaKey || event.shiftKey);

    // prevent root from deselecting all
    event.stopPropagation();
  }

  startDrag = (event) => {
    const browser = this.props.remoteBrowser;
    const zoom = this.props.workspace.zoom;
    const pos = browser.getAbsoluteBounds();
    startDrag(event, (event, data) => {
      Object.assign(browser.style, {
        left: pos.left + data.delta.x / zoom,
        top: pos.top + data.delta.y / zoom
      });
    }, () => {
      const edit = browser.createEdit();
      edit.setAttribute("style", browser.getAttribute("style"));
      this.bus.dispatch(new ApplyFileEditRequest(edit.mutations));
    });
  }

  componentDidMount() {
    if (!this.props.remoteBrowser.src) {
      setTimeout(() => {
        (this.refs as any).src.focus();
      }, 500);
    }
  }

  onKeyDown = (event: React.KeyboardEvent<any>): any => {
    const keyCode = event.which;
    switch (event.which) {
      case 27: return this.cancelEdit();
      case 13: return this.save();
    }
  }

  onSrcKeyDown = (event: React.KeyboardEvent<any>): any => {
    if (event.keyCode === 13) {
      const edit = this.props.remoteBrowser.createEdit();
      this.props.remoteBrowser.src = event.currentTarget.value;
      edit.setAttribute("src", event.currentTarget.value);
      this.bus.dispatch(new ApplyFileEditRequest(edit.mutations));
    }
  }
  

  clone = () => {
    const remoteBrowser = this.props.remoteBrowser;
    const style = remoteBrowser.style;
    let left = Number(style.left && style.left.replace(/[a-z]+/g, "") || 0);
    let top  = Number(style.top && style.top.replace(/[a-z]+/g, "") || 0);

    const clone = remoteBrowser.clone(true) as SyntheticRemoteBrowserElement;
    clone.style.left = ((left || 0) + 25) + "px";
    clone.style.top  = ((top || 0) + 25) + "px";
    // alert(clone.uid + " " + remoteBrowser.uid);
    const parentEdit = remoteBrowser.parentElement.createEdit();
    parentEdit.appendChild(clone);

    this.bus.dispatch(new ApplyFileEditRequest(parentEdit.mutations));
  }

  selectSearch = (event: React.MouseEvent<any>) => {
    event.stopPropagation();
    event.currentTarget.select();
  }

  render() {
    const { remoteBrowser, workspace } = this.props;

    // TODO - get absolute bounds here
    const bounds = remoteBrowser.getBoundingClientRect();
    const scale = 1 / workspace.transform.scale;

    const chromeStyle = {
      left   : bounds.left,
      top    : bounds.top,
      width  : bounds.width,
      height : bounds.height
    };

    const fontSize = 12;

    const colorInf = tc(this.props.backgroundColor);


    return <div className="remote-browser-window platform desktop" style={chromeStyle}>
      <div className="header" onClick={this.select} onMouseDown={this.startDrag}>
        <div className="tabbar">
          

          <div className="tab">{ remoteBrowser.title || "Untitled" }</div>
          <div className="controls">
            <i className="ion-plus-round" onClick={this.clone} />
          </div>
        </div>
        <div className="searchbar">
          <input ref="src" type="text" defaultValue={remoteBrowser.src} placeholder="enter address" onKeyDown={this.onSrcKeyDown} onClick={this.selectSearch} onMouseDown={(event) => event.stopPropagation()} />
          <StatusComponent status={window["$synthetic"] ? new Status(Status.LOADING) : remoteBrowser.status} />
        </div>
      </div>
      <div className="frame">
        <div className="background"></div>
      </div>

      <div className="footer">
        <div className="info">
          <div className="app">
            <i className="chrome"></i>
            <span className="version">
              v53
            </span>
          </div>
        </div>
      </div>

      { workspace.showStageTools ? <div className="overlay" /> : undefined } 
    </div>

    // return <div>
    //   <div className="m-remote-browser-stage-tool--item-background" style={chromeStyle}>
    //     <div className="m-remote-browser-stage-tool--item-background--title">
    //       <span className="search">
    //         <input type="text" defaultValue={remoteBrowser.src} placeholder="http://localhost:8080" onKeyDown={this.onSrcKeyDown} />
    //         <StatusComponent status={remoteBrowser.status} />
    //       </span>
    //       <span className="hide" onDoubleClick={this.editTitle} style={{ display: "none"}} onMouseDown={this.selectEntity}>
    //         { this.state.titleEditChange ? <AutosizeInput ref="input" value={this.state.titleEditChange.newValue} onChange={this.onTitleChange} onBlur={this.save} onKeyDown={this.onKeyDown} /> : <span>{remoteBrowser.title || "Untitled"}</span> }
    //       </span>
    //     </div>
    //   </div>

    // </div>
  }
}

export class RemoteBrowserStageToolComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    const { workspace } = this.props;
    const { document, transform } = workspace;

    const tandem    = document.querySelector("tandem") as SyntheticHTMLElement;
    const remoteBrowsers = document.querySelectorAll("remote-browser") as SyntheticRemoteBrowserElement[];

    if (!remoteBrowsers.length) return null;
    

    const backgroundStyle = {
      backgroundColor: "rgba(0,0,0,0.05)",
      transform: `translate(${-transform.left / transform.scale}px, ${-transform.top / transform.scale}px) scale(${1 / transform.scale}) translateZ(0)`,
      transformOrigin: "top left"
    };

    if (tandem) {
      Object.assign(backgroundStyle, tandem.style);
    }

    return <div className="remote-browser-stage-tool">
      <div style={backgroundStyle} className="remote-browser-stage-tool--background" />
      {
        remoteBrowsers.map((remoteBrowser, i) => {
          return <TDRemoteBrowserComponent key={i} workspace={workspace} remoteBrowser={remoteBrowser} backgroundColor={backgroundStyle.backgroundColor} />;
        })
      }
    </div>;
  }
}
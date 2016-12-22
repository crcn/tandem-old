import "./index.scss";

import React =  require("react");
import { Workspace } from "@tandem/editor/browser/stores";
import { BreadcrumbsComponent } from "./breadcrumbs";
import { BaseApplicationComponent } from "@tandem/common";
import { SetZoomRequest } from "@tandem/editor/browser/messages";
import AutosizeInput = require("react-input-autosize");
import { RegisteredComponent, FocusComponent } from "@tandem/editor/browser/components/common";
import { FooterComponentFactoryProvider } from "@tandem/editor/browser/providers";

class ZoomLabelComponent extends BaseApplicationComponent<{ workspace: Workspace }, { editZoom: number }> {

  state = {
    editZoom: null
  }

  editZoom = () => {
    this.setState({ editZoom: this.props.workspace.transform.scale * 100 });
  }

  onFocus = (event: React.FocusEvent<any>) => {
    (event.target as any).select();
  }

  doneEditing = () => {
    this.setState({ editZoom: undefined });
  }

  onInputChange = (event: React.KeyboardEvent<any>) => {
    const value = Number((event.target as any).value || 0);
    this.setState({ editZoom: value });
    this.bus.dispatch(new SetZoomRequest(value ? value / 100 : value));
  }

  onKeyDown = (event: React.KeyboardEvent<any>) => {
    if (event.keyCode === 13) {
      this.setState({ editZoom: undefined });
    }
  }

  render() {
    const { scale } = this.props.workspace.transform;
    return <span>{ this.state.editZoom != null ? this.renderEditZoom(scale) : <span onClick={this.editZoom}>{Math.round((scale || 0) * 100)}</span> }%</span>;
  }

  renderEditZoom(scale: number) {
    return <FocusComponent><AutosizeInput
      type="text"
      className="footer-zoom-input"
      onFocus={this.onFocus}
      value={Math.round(this.state.editZoom)}
      onChange={this.onInputChange}
      onBlur={this.doneEditing}
      onKeyDown={this.onKeyDown}
      /></FocusComponent>
  }
}

export default class FooterComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    const { scale } = this.props.workspace.transform;
    return (<div className="m-preview-footer">
      <div className="footer-inner">
        <div className="info">
          <ZoomLabelComponent workspace={this.props.workspace} />
          <RegisteredComponent ns={FooterComponentFactoryProvider.getNamespace("**")} workspace={this.props.workspace} />
        </div>
        <BreadcrumbsComponent workspace={this.props.workspace} />
      </div>
    </div>);
  }
}


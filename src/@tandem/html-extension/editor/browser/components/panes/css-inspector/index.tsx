import "./index.scss";
import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import { BaseApplicationComponent } from "@tandem/common";

export class ElementCSSInspectorComponent extends BaseApplicationComponent<{ workspace: Workspace }, { pane: string }> {

  state = {
    pane: "pretty"
  };

  selectTab(id: string) {
    this.setState({ pane: id });
  }

  render() {
    const { workspace } = this.props;
    if (!workspace || !workspace.selection.length) return null;

    const tabs = {
      pretty: { icon: "paintbrush", render: this.renderPrettyPane },
      computed: { icon: "code", render: this.renderComputedStylePane }
    };

    const selectedTab = tabs[this.state.pane];

    return <div className="css-inspector">
      <div className="header">
        Style
        <div className="controls show">
          {
            Object.keys(tabs).map((tabId) => {
              const tab = tabs[tabId];
              return <i key={tabId} onClick={this.selectTab.bind(this, tabId)} className={cx({
                [`ion-` + tab.icon]: true,
                "fill-text": true,
                selected: selectedTab === tab
              })} />
            })
          }
        </div>
      </div>
      { selectedTab && selectedTab.render() }
    </div>
  }

  renderPrettyPane() {
    return <PrettyInspectorPaneComponent />;
  }

  renderComputedStylePane() {
    return <div className="container">
      <div className="row">
        Computed
      </div>
    </div>;
  }
}

export class PrettyInspectorPaneComponent extends React.Component<any, any> {
  render() {
    return <div className="pretty">

      <div className="container section">
        <div className="row">
          <div className="col-1 label">
            X
          </div>
          <div className="col-10">
            <input type="text" />
          </div>
          <div className="col-1 label">
            Y
          </div>
          <div className="col-10">
            <input type="text"  />
          </div>
        </div>
        <div className="row">
          <div className="col-1 label">
            W
          </div>
          <div className="col-10">
            <input type="text" />
          </div>
          <div className="col-1 label">
            H
          </div>
          <div className="col-10">
            <input type="text" />
          </div>
        </div>
      </div>

      <hr />
      <div className="container section">
        <div className="row title">
          Typography
        </div>

        <div className="row">
          <div className="col-1 label">
            <i className="glyphicon glyphicon-font" />
          </div>
          <div className="col-10">
            <input type="text" value="Helvetica" />
          </div>
        </div>

        <div className="row">
          <div className="col-1 label">
            <i className="glyphicon glyphicon-text-size" />
          </div>
          <div className="col-10">
            <input type="text" />
          </div>
          <div className="col-1 label">
            <i className="glyphicon glyphicon-text-color" />
          </div>
          <div className="col-10">
            <input type="text" />
          </div>
        </div>

        <div className="row">
          <div className="col-1 label">
            <i className="glyphicon glyphicon-text-width" />
          </div>
          <div className="col-10">
            <input type="text" />
          </div>
          <div className="col-1 label">
            <i className="glyphicon glyphicon-text-height" />
          </div>
          <div className="col-10">
            <input type="text" />
          </div>
        </div>
      </div>

      <hr />

      <div className="container section">
        <div className="row title">
          Background
        </div>
      </div>
    </div>
  }
}
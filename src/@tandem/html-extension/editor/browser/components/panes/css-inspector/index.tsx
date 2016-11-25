import "./index.scss";
import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import { HTMLDOMElements } from "@tandem/html-extension/collections";
import { BaseApplicationComponent } from "@tandem/common";
import { CSSStyleHashInputComponent } from "../css";
import { SyntheticCSSStyleDeclaration } from "@tandem/synthetic-browser";

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
        CSS
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
      { selectedTab && selectedTab.render.call(this) }
    </div>
  }

  renderPrettyPane() {
    return <PrettyInspectorPaneComponent />;
  }

  renderComputedStylePane() {
    return <ComputedPropertiesPaneComponent  workspace={this.props.workspace} />;
  }
}

export class ComputedPropertiesPaneComponent extends React.Component<{ workspace: Workspace }, any> {
  setDeclaration = (name: string, value: string, oldName?: string) => {
    console.log("SET DECL")
  }
  render() {
    const { selection } = this.props.workspace;
    const elements = HTMLDOMElements.fromArray(selection);

    if (elements.length !== 1) return null;

    const computedStyle = elements[0].getComputedStyle() || SyntheticCSSStyleDeclaration.fromObject({ fontWeight: 400 });
    
    return <div className="container">
      <CSSStyleHashInputComponent style={computedStyle} setDeclaration={this.setDeclaration} />
    </div>;
  }
}

export class PrettyInspectorPaneComponent extends React.Component<any, any> {
  render() {
    return <div className="pretty">

      <div className="container section">
        <div className="row title">
          Layout
        </div>
        <div className="row">
          <div className="col-1 label">
            W
          </div>
          <div className="col-4-5">
            <input type="text" value="10px" />
          </div>
          <div className="col-1 label">
            H
          </div>
          <div className="col-4-5">
            <input type="text" value="10%" />
          </div>
          <div className="col-1">
            <i className="ion-arrow-right-b" />
          </div>
        </div>
        <div className="hide">
          <div className="row">
            <div className="col-1 label">
              &lt;
            </div>
            <div className="col-4-5">
              <input type="text" value="10px" />
            </div>
            <div className="col-1 label">
              &lt;
            </div>
            <div className="col-4-5">
              <input type="text" value="10%" />
            </div>
            <div className="col-1">
            </div>
          </div>
          <div className="row">
            <div className="col-1 label">
              &gt;
            </div>
            <div className="col-4-5">
              <input type="text" value="10px" />
            </div>
            <div className="col-1 label">
              &gt;
            </div>
            <div className="col-4-5">
              <input type="text" value="10%" />
            </div>
            <div className="col-1">
            </div>
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
          <div className="col-4-5">
            <input type="text" />
          </div>
          <div className="col-1 label">
            <i className="glyphicon glyphicon-text-color" />
          </div>
          <div className="col-4-5">
            <input type="text" />
          </div>
        </div>

        <div className="row">
          <div className="col-1 label">
            <i className="glyphicon glyphicon-text-width" />
          </div>
          <div className="col-4-5">
            <input type="text" />
          </div>
          <div className="col-1 label">
            <i className="glyphicon glyphicon-text-height" />
          </div>
          <div className="col-4-5">
            <input type="text" />
          </div>
        </div>

        <div className="row">
          <div className="col-6-5">
            <div className="row button-group text-center no-padding">
              <div className="col-3">
                <i className="glyphicon glyphicon-align-left" />
              </div>
              <div className="col-3 selected">
                <i className="glyphicon glyphicon-align-center" />
              </div>
              <div className="col-3">
                <i className="glyphicon glyphicon-align-right" />
              </div>
              <div className="col-3">
                <i className="glyphicon glyphicon-align-justify" />
              </div>
            </div>
          </div>
          <div className="col-4-5">
            <div className="row button-group text-center no-padding">
              <div className="col-4">
                <i className="glyphicon glyphicon-align-left" />
              </div>
              <div className="col-4 selected">
                <i className="glyphicon glyphicon-align-center" />
              </div>
              <div className="col-4">
                <i className="glyphicon glyphicon-align-right" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="container section">
        <div className="row title">
          Appearance
        </div>
        <div className="row">
          opacity, blend mode
        </div>
      </div>

      <hr />

      <div className="container section">
        <div className="row title">
          Background
        </div>
      </div>

      <hr />

      <div className="container section">
        <div className="row title">
          Shadows
        </div>
      </div>
    </div>
  }
}
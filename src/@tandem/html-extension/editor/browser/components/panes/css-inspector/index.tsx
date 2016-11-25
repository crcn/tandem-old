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

// TODO - pseudo elements
export class PrettyInspectorPaneComponent extends React.Component<any, any> {
  render() {
    return <div className="pretty">

      <div className="container section">
        <div className="row title">
          <div className="col-12">
            Layout
            <div className="controls">
              <i className="ion-more" />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            Display
          </div>
          <div className="col-10">
            <input type="text" value="Block" />
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            Left
          </div>
          <div className="col-4">
            <input type="text" value="" />
          </div>
          <div className="col-2 label">
            Top
          </div>
          <div className="col-4">
            <input type="text" value="" />
          </div>
        </div>
        <div className="row">
          <div className="col-2 label">
            Width
          </div>
          <div className="col-4">
            <input type="text" value="10px" />
          </div>
          <div className="col-2 label">
            Height
          </div>
          <div className="col-4">
            <input type="text" value="10%" />
          </div>
        </div>
      </div>

      <hr />
      
      <div className="container section">
        <div className="row title">
          <div className="col-12">
            Typography
            <div className="controls">
              <i className="ion-more" />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            Font
          </div>
          <div className="col-10">
            <input type="text" value="Helvetica" />
          </div>
        </div>
        <div className="row">
          <div className="col-2 label">
            Weight
          </div>
          <div className="col-10">
            <input type="text" value="100 - Thin" />
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            Size
          </div>
          <div className="col-4">
            <input type="text" value="0.9em" />
          </div>
          <div className="col-2 label">
            Color
          </div>
          <div className="col-4">
            <FillInputComponent />
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            Spacing
          </div>
          <div className="col-4">
            <input type="text" value="0.9em" />
          </div>
          <div className="col-2 label">
            Line
          </div>
          <div className="col-4">
            <input type="text" value="0.9em" />
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            Align
          </div>
          <div className="col-10">
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
          Box Shadows
        </div>
      </div>
    </div>
  }
}

export class FillInputComponent extends React.Component<any, any> {
  render() {
    return <div className="fill-input">
    </div>
  }
}
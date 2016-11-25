import "./index.scss";
import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import { HTMLDOMElements } from "@tandem/html-extension/collections";
import { SyntheticSourceLink } from "@tandem/editor/browser/components/common";
import { BaseApplicationComponent, Mutation } from "@tandem/common";
import { CSSStyleHashInputComponent } from "../css";
import { IKeyValueNameComponentProps } from "@tandem/html-extension/editor/browser/components/common";
import { SyntheticCSSStyleDeclaration, getMergedCSSStyleRule, MergedCSSStyleRule, SyntheticHTMLElement, SyntheticCSSStyleRule } from "@tandem/synthetic-browser";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import { CSSPrettyInspectorComponent } from "./pretty";
import { ComputedPropertiesPaneComponent } from "./computed";


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

    const elements = HTMLDOMElements.fromArray(workspace.selection);
    if (elements.length !== 1) return null;

    const tabs = {
      pretty: { icon: "paintbrush", render: this.renderPrettyPane },
      computed: { icon: "code", render: this.renderComputedStylePane }
    };

    const selectedTab = tabs[this.state.pane];


    const mergedRule = getMergedCSSStyleRule(elements[0]);

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
      { selectedTab && selectedTab.render.call(this, mergedRule) }
    </div>
  }

  renderPrettyPane(rule: MergedCSSStyleRule) {
    return <CSSPrettyInspectorComponent rule={rule} />;
  }

  renderComputedStylePane(rule: MergedCSSStyleRule) {
    return <ComputedPropertiesPaneComponent  rule={rule} />;
  }
}

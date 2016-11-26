import "./index.scss";
import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import { HTMLDOMElements } from "@tandem/html-extension/collections";
import { SyntheticSourceLink } from "@tandem/editor/browser/components/common";
import { CallbackDispatcher } from "@tandem/mesh";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import { CSSStyleHashInputComponent } from "../css";
import { IKeyValueNameComponentProps } from "@tandem/html-extension/editor/browser/components/common";
import { CSSPrettyInspectorComponent } from "./pretty";
import { ComputedPropertiesPaneComponent } from "./computed";
import { BaseApplicationComponent, Mutation, MutationEvent} from "@tandem/common";
import { 
  SyntheticDocument, 
  SyntheticCSSStyle, 
  MergedCSSStyleRule, 
  SyntheticHTMLElement, 
  SyntheticCSSStyleRule,
  getMergedCSSStyleRule,
  SyntheticCSSStyleGraphics,
  SyntheticCSSStyleRuleMutationTypes,  
} from "@tandem/synthetic-browser";

class DocumentMutationChangeWatcher {

  private _observer: CallbackDispatcher<any, any>;
  private _target: SyntheticDocument;

  constructor(private _onChange: () => any) {
    this._observer = new CallbackDispatcher(this.onMutationEvent.bind(this));
  }

  get target(): SyntheticDocument {
    return this._target;
  }

  set target(value: SyntheticDocument) {
    if (this._target === value) return;
    if (this._target) {
      this._target.unobserve(this._observer);
    }
    this._target = value;
    if (this._target) {
      this._target.observe(this._observer);
      this._onChange();
    }
  }


  public dispose() {
    this.target = undefined;
  }

  protected onMutationEvent({ mutation }: MutationEvent<any>) {
    if (mutation) {
      this._onChange();
    }
  }
}

export class ElementCSSInspectorComponent extends BaseApplicationComponent<{ workspace: Workspace }, { pane: string }> {

  state = {
    pane: "pretty"
  };

 

  getTarget(props) {
    const { workspace } = props;
    return workspace && workspace.selection.length ? workspace.selection[0].ownerDocument : undefined;
  }


  selectTab(id: string) {
    this.setState({ pane: id });
  }

  render() {
    const { workspace } = this.props;
    const { pane } = this.state;

    if (!workspace || !workspace.selection.length) return null;

    const elements = HTMLDOMElements.fromArray(workspace.selection);
    if (elements.length !== 1) return null;
    const mergedRule = getMergedCSSStyleRule(elements[0]);

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
      { selectedTab && selectedTab.render.call(this, mergedRule) }
    </div>
  }

  renderPrettyPane(rule: MergedCSSStyleRule) {
    const graphics = new SyntheticCSSStyleGraphics(rule.style);
    graphics.observe({
      dispatch() {
        const style = graphics.toStyle();
        for (const propertyName of style) {
          const mainDeclarationSource = rule.getDeclarationMainSourceRule(propertyName);
          mainDeclarationSource.style.setProperty(propertyName, style[propertyName]);
        }
      }
    })
    return <CSSPrettyInspectorComponent rule={rule} graphics={graphics} />;
  }

  renderComputedStylePane(rule: MergedCSSStyleRule) {
    return <ComputedPropertiesPaneComponent  rule={rule} />;
  }
}

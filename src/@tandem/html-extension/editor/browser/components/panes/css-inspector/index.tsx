import "./index.scss";
import cx =  require("classnames");
import { uniq } from "lodash";
import React =  require("react");
import { Workspace } from "@tandem/editor/browser/stores";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { HTMLDOMElements } from "@tandem/html-extension/collections";
import { SyntheticSourceLink } from "@tandem/editor/browser/components/common";
import { CallbackDispatcher } from "@tandem/mesh";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import { CSSStyleHashInputComponent } from "../css";
import { IKeyValueNameComponentProps } from "@tandem/html-extension/editor/browser/components/common";
import { CSSPrettyInspectorComponent } from "./pretty";
import { ComputedPropertiesPaneComponent } from "./computed";
import { BaseApplicationComponent, Mutation, MutationEvent, inject } from "@tandem/common";
import { 
  SVG_XMLNS,
  HTML_XMLNS, 
  SyntheticDocument, 
  SyntheticCSSStyle, 
  SyntheticHTMLElement, 
  SyntheticCSSStyleGraphics,
  isInheritedCSSStyleProperty,
  SyntheticCSSElementStyleRule,
  SyntheticCSSElementStyleRuleMutationTypes,  
} from "@tandem/synthetic-browser";


import { HTMLExtensionStoreProvider } from "@tandem/html-extension/editor/browser/providers";
import { HTMLExtensionStore, MergedCSSStyleRule, MatchedCSSStyleRuleType } from "@tandem/html-extension/editor/browser/stores";

const MAX_LABEL_LENGTH = 80;
const DEFAULT_PANE = process.env.CSS_PANE || "pretty";

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

export class ElementCSSInspectorComponent extends BaseApplicationComponent<{ workspace: Workspace, rule?: MergedCSSStyleRule }, { pane: string }> {

  @inject(HTMLExtensionStoreProvider.ID)
  private _store: HTMLExtensionStore;

  state = {
    pane: DEFAULT_PANE
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
    const mergedRule = this._store.mergedStyleRule || this.props.rule;
    
    if (!mergedRule) return null;

    const tabs = {
      pretty: { icon: "paintbrush", render: this.renderPrettyPane },
      computed: { icon: "code", render: this.renderComputedStylePane }
    };

    const selectedTab = tabs[this.state.pane];

    return <div className="container css-inspector pane">
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

      <div>
        {this.renderSelectorsSection(mergedRule) }
        <hr />
        { selectedTab && selectedTab.render.call(this, mergedRule) }
      </div>
    </div>
  }

  renderPrettyPane(rule: MergedCSSStyleRule) {
    
    return <CSSPrettyInspectorComponent rule={rule} graphics={rule.graphics} />;
  }

  renderSelectorsSection(mergedRule: MergedCSSStyleRule) {
    return <MatchingSelectorsComponent rule={mergedRule}  />
  }

  renderComputedStylePane(rule: MergedCSSStyleRule) {
    return <ComputedPropertiesPaneComponent  rule={rule} />;
  }
}


export class MatchingSelectorsComponent extends React.Component<{ rule: MergedCSSStyleRule }, any> {

  onSelectorEnter = (rule: SyntheticCSSElementStyleRule) => {
    rule.metadata.set(MetadataKeys.HOVERING, true);
    if (!rule.selector) return;
    this.props.rule.target.ownerDocument.querySelectorAll(rule.selector).forEach((element) => element.metadata.set(MetadataKeys.HOVERING, true));
  }

  onSelectorLeave = (rule: SyntheticCSSElementStyleRule) => {
    rule.metadata.set(MetadataKeys.HOVERING, false);
    if (!rule.selector) return;
    this.props.rule.target.ownerDocument.querySelectorAll(rule.selector).forEach((element) => element.metadata.set(MetadataKeys.HOVERING, false));
  }

  render() {

    const { rule } = this.props;

    const used = {};
    
    const selectorLabels = [];
    

    const getLabel = (source) => {
      let label = String(source instanceof SyntheticHTMLElement ? "style" : source.selector);
      return label.length > MAX_LABEL_LENGTH ? label.substr(0, MAX_LABEL_LENGTH) + "..." : label;
    }

    const mainRules = rule.mainSources;
    const inheritedRules = rule.inheritedRules;
    
    const matchingRules = rule.matchingRules;
    const selectedProperty = rule.selectedStyleProperty;
    const selectedRule = selectedProperty != null && rule.getTargetRule(selectedProperty);
    const selectedRuleIndex = mainRules.indexOf(selectedRule);
    const selectedRuleHasProperty = selectedRule && !!selectedRule.style[selectedProperty];
    let previouslySetRule = selectedRuleHasProperty;

    const assignableRules = selectedProperty != null ? rule.getAssignableRules(selectedProperty) : [];

    const renderMatchingSelectors = (rules: MatchedCSSStyleRuleType[]) => {
      return <ul>
        {rules.map((source, index) => {
          const enabled = assignableRules.indexOf(source) !== -1; 
          
          const className = cx({ 
            disabled: !enabled, 
            hovering: source.metadata.get(MetadataKeys.REVEAL) || source.metadata.get(MetadataKeys.HOVERING), 
            selected: source === selectedRule
          });

          const select = (event: React.MouseEvent<any>) => {
            const activeElement = document.activeElement;
            event.preventDefault();
            event.stopPropagation();
            (activeElement as any).focus();
            if (!enabled) return;
            rule.selectedStyleRule = source;
          }

          return <li onMouseDown={select} onMouseEnter={this.onSelectorEnter.bind(this, source)} key={index} className={className} onMouseLeave={this.onSelectorLeave.bind(this, source)}>
            <i onClick={() => rule.pinRule(source)} className={cx({ pin: true, "ion-star": true, pinned: source === rule.pinnedRule})} />
            <SyntheticSourceLink target={source}>{ getLabel(source) }</SyntheticSourceLink>
          </li>
        })}
      </ul>;
    }
    
    const renderGroupRules = (title: string, rules: MatchedCSSStyleRuleType[]) => {
      if (rules.length === 0) return null;
      return <div>
        <div className="row title">
          <div className="col-12">
            { title }
          </div>
        </div>

        <div className="row matching-selectors">
          <div className="col-12">
            { renderMatchingSelectors(rules) }
          </div>
        </div>
      </div>;
    }

    return <div className="container section">
      { renderGroupRules("Matching rules", matchingRules) }
      { renderGroupRules("Inherited rules", inheritedRules) }
    </div> 
  }
}

import { uniq, values, camelCase, debounce } from "lodash";
import { SyntheticCSSStyleRule, SyntheticHTMLElement, SyntheticDocument, eachInheritedMatchingStyleRule, isInheritedCSSStyleProperty, SyntheticCSSStyle, SyntheticDOMElement } from "@tandem/synthetic-browser";
import { SyntheticCSSStyleGraphics, SyntheticCSSStyleRuleMutationTypes } from "@tandem/synthetic-browser";
import { MutationEvent, bindable, bubble, Observable, PropertyMutation, PrivateBusProvider, IBrokerBus, inject, diffArray } from "@tandem/common";
import { ApplyFileEditRequest, IContentEdit } from "@tandem/sandbox";
import { CallbackDispatcher, IMessage } from "@tandem/mesh";


// Cluster fuck - clean me, and test me.

export type MatchedCSSStyleRuleType = SyntheticCSSStyleRule|SyntheticHTMLElement;

export class MergedCSSStyleRule extends Observable {

  private _style: SyntheticCSSStyle;

  @bindable(true)
  @bubble()
  public selectedStyleRule: MatchedCSSStyleRuleType;

  @bindable(true)
  @bubble()
  public selectedStyleProperty: string;

  @inject(PrivateBusProvider.ID)
  private _bus: IBrokerBus;
  
  private _allSources:  MatchedCSSStyleRuleType[];
  private _graphics: SyntheticCSSStyleGraphics;
  private _documentObserver: CallbackDispatcher<any, any>;
  private _document: SyntheticDocument;

  @bindable(true)
  @bubble()
  private _pinnedRule: MatchedCSSStyleRuleType;
  
  private _main: {
    [Identifier: string]: MatchedCSSStyleRuleType;
  };

  private _sources: {
    [Identifier: string]: Array<MatchedCSSStyleRuleType>
  };

  constructor(readonly target: SyntheticHTMLElement) {
    super();
    this._style = new SyntheticCSSStyle();
    this._documentObserver = new CallbackDispatcher(this._onDocumentEvent.bind(this));
    this.reset();
  }

  get style() {
    return this._style;
  }

  get graphics() {
    if (this._graphics) return this._graphics;
    const graphics = this._graphics = new SyntheticCSSStyleGraphics(this.style);
    graphics.observe({
      dispatch: () => {
        const style = graphics.toStyle();
        for (const propertyName of style) {
          const value = style[propertyName];
          this.setSelectedStyleProperty(propertyName, style[propertyName]);
        }
      }
    });
    return graphics;
  }

  dispose() {
    if (this._document) {
      this._document.unobserve(this._documentObserver);
    }
  }

  get pinnedRule() {
    return this._pinnedRule;
  }

  pinRule(rule: MatchedCSSStyleRuleType) {
    this._pinnedRule = this._pinnedRule === rule ? undefined : rule;
  }

  get allSources() {
    return this._allSources;
  }

  get mainSources() {
    return uniq(values(this._main));
  }

  get inheritedRules() {
    return this.mainSources.filter((a, b) => {
      return a !== this.target && !(a as SyntheticCSSStyleRule).matchesElement(this.target);
    });
  }

  get matchingRules() {
    return this.mainSources.filter((a) => {
      return a === this.target || (a as SyntheticCSSStyleRule).matchesElement(this.target);
    });
  }

  setProperty(source: MatchedCSSStyleRuleType, name: string, value: string) {

    if (!this._sources[name]) {
      this._sources[name] = []; 
      
       // TODO - consider priority
       this._main[name] = source;
    }

    if (this._allSources.indexOf(source) === -1) {
      this._allSources.push(source);
    }

    this._sources[name].push(source);
  }

  setSelectedStyleProperty(name: string, value: string) {
    const target = this.getTargetRule(name);
    this.selectedStyleRule = undefined;

    // need to perform diff since setting the style may mutate other parts
    // of the object (such as attributes)

    const clone = target.clone() as SyntheticCSSStyleRule;
    const model = target.clone() as SyntheticCSSStyleRule;
    clone.style.setProperty(name, target.style[name]);
    model.style.setProperty(name, target.style[name]);

    this._style.setProperty(name, value);

    if (value) {
      model.style.setProperty(name, value);
      target.style.setProperty(name, value);
    } else {
      model.style.removeProperty(name);
      target.style.removeProperty(name);
    }

    const edit = clone.createEdit().fromDiff(model);
    
    if (edit.mutations.length) {
      this._bus.dispatch(new ApplyFileEditRequest(edit.mutations));
    }
  }

  computeStyle() {

    const newStyle = new SyntheticCSSStyle();

    for (let property in this._main) {
      newStyle.setProperty(property, this._main[property].style[property]);
    }

    // diff & patch to maintain order
    diffArray(this._style.getProperties(), newStyle.getProperties(), (a, b) => a === b ? 0 : -1).accept({
      visitInsert: ({ value }) => {
        this._style.setProperty(value, newStyle[value]);
      },
      visitRemove: ({ value }) => {
        this._style.removeProperty(value);
      },
      visitUpdate: ({ newValue }) => {
        this._style.setProperty(newValue, newStyle[newValue]);
      }
    })
  }

  getDeclarationSourceRules(name: string): Array<MatchedCSSStyleRuleType> {
    return this._sources[camelCase(name)] || [];
  }

  getDeclarationMainSourceRule(name: string): MatchedCSSStyleRuleType {
    return this._main[camelCase(name)];
  }

  getAssignableRules(styleName: string) {
    const matchingRule = this.getDeclarationMainSourceRule(styleName);
    const mainSources = this.mainSources;
    const matchingRuleIndex = mainSources.indexOf(matchingRule);
    let currentRuleIndex = matchingRuleIndex;
    
    const rules = this.matchingRules.indexOf(matchingRule) === -1 || (!styleName || isInheritedCSSStyleProperty(styleName)) ? mainSources : this.matchingRules;


    return rules.filter((rule) => {
      const index = mainSources.indexOf(rule);
      
      const assignable = !~currentRuleIndex || index <= currentRuleIndex;

      // this will fail all proceeding filters
      if(rule.style[styleName]) currentRuleIndex = index;
      
      return assignable;
    });
  }


  getTargetRule(styleName: string): MatchedCSSStyleRuleType {
    return this.selectedStyleRule || this.getDeclarationMainSourceRule(styleName) || this._pinnedRule || this.getBestSourceRule();
  }
 
  getBestSourceRule(): MatchedCSSStyleRuleType {
    return this.mainSources.filter((source) => {
      if (source instanceof SyntheticDOMElement) {
        return true;
      } else if (source instanceof SyntheticCSSStyleRule) {

        // ensure that the source is not an inherited property
        return source.matchesElement(this.target);
      }
    }).sort((a: SyntheticCSSStyleRule, b: SyntheticCSSStyleRule) => {
      if (a === this.target as any) return -1;

      // de-prioritize selectors that match everything
      if (a.selector === "*") return 1;

      // prioritize selectors that match the target ID
      if (a.selector.charAt(0) === "#") return -1;
      return 0; 
    })[0];
  }

  private _onDocumentEvent({ mutation }: MutationEvent<any>) {
    if (!mutation) return;
    this.requestReset();
  }

  private requestReset = debounce(() => {
    this.reset();
  }, 0);

  private reset() {
    if (this._document) {
      this._document.unobserve(this._documentObserver);
    }

    this._document = this.target.ownerDocument;
    this._document.observe(this._documentObserver);

    if (this._graphics) {
      this._graphics.dispose();
      this._graphics = undefined;
    }

    this._sources    = {};
    this._main       = {};
    this._allSources = [];

    const addStyle = (current: SyntheticHTMLElement, match: MatchedCSSStyleRuleType) => {
      const inherited = current !== this.target;
      for (const property of match.style) {
        if (!inherited || isInheritedCSSStyleProperty(property) && !this.getDeclarationMainSourceRule(property)) {
          this.setProperty(match, property, match.style[property]);
        }
      }
    };

    addStyle(this.target, this.target);
    eachInheritedMatchingStyleRule(this.target, addStyle);
    this.computeStyle();
  }
}
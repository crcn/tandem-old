import { uniq, values, camelCase, debounce } from "lodash";
import { SyntheticCSSStyleGraphics, SyntheticCSSElementStyleRuleMutationTypes } from "@tandem/synthetic-browser";
import { MutationEvent, bindable, bubble, Observable, PropertyMutation, PrivateBusProvider, IBrokerBus, inject, diffArray, Mutation } from "@tandem/common";
import { SyntheticCSSElementStyleRule, SyntheticHTMLElement, SyntheticDocument, eachInheritedMatchingStyleRule, isInheritedCSSStyleProperty, SyntheticCSSStyle, SyntheticDOMElement } from "@tandem/synthetic-browser";
import { ApplyFileEditRequest, IContentEdit } from "@tandem/sandbox";
import { CallbackDispatcher, IMessage } from "@tandem/mesh";


// Cluster fuck - clean me, and test me.

export type MatchedCSSStyleRuleType = SyntheticCSSElementStyleRule|SyntheticHTMLElement;

const diffStyle = (oldStyle: SyntheticCSSStyle, newStyle: SyntheticCSSStyle) => {
  return diffArray(oldStyle.getProperties(), newStyle.getProperties(), (a, b) => a === b ? 0 : -1);
}

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

  private _main: MatchedCSSStyleRuleType[];
  private _graphics: SyntheticCSSStyleGraphics;
  private _documentObserver: CallbackDispatcher<any, any>;
  private _document: SyntheticDocument;
  private _queuedEditMutations: Array<Mutation<MatchedCSSStyleRuleType>>;
  
  private _mainByProperty: {
    [Identifier: string]: MatchedCSSStyleRuleType;
  };

  private _sources: {
    [Identifier: string]: Array<MatchedCSSStyleRuleType>
  };


  constructor(readonly target: SyntheticHTMLElement) {
    super();
    this._queuedEditMutations = [];
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
    let currentStyle = graphics.toStyle();
    graphics.observe({
      dispatch: () => {
        const newStyle = graphics.toStyle();
        const handleUpdate = (key) => {
          if (currentStyle[key] !== newStyle[key]) {
            this.setSelectedStyleProperty(key, newStyle[key]);
          }
        }      
        diffStyle(currentStyle, newStyle).accept({
          visitInsert({ value }) {
            handleUpdate(value);
          },
          visitRemove({ value }) {
            handleUpdate(value);
          },
          visitUpdate({ newValue }) {
            handleUpdate(newValue);
          }
        });
        currentStyle = newStyle;
      }
    });
    return graphics;
  }

  dispose() {
    if (this._document) {
      this._document.unobserve(this._documentObserver);
    }
  }

  get pinnedRule(): MatchedCSSStyleRuleType {
    return this.target.metadata.get("pinnedRule");
  }

  pinRule(rule: MatchedCSSStyleRuleType) {
    const oldRule = this.pinnedRule;
    
    // cache on the target element so that the user doesn't have to re-pin the rule
    this.target.metadata.set("pinnedRule", this.pinnedRule === rule ? undefined : rule);
    this.notify(new PropertyMutation(PropertyMutation.PROPERTY_CHANGE, this, "pinnedRule", rule, oldRule).toEvent());
  }

  get mainSources() {
    return this._main;
  }

  get inheritedRules() {
    return this.mainSources.filter((a, b) => {
      return a !== this.target && (a instanceof SyntheticHTMLElement || !(a as SyntheticCSSElementStyleRule).matchesElement(this.target));
    });
  }

  get matchingRules() {
    return this.mainSources.filter((a) => {
      return a === this.target || (a instanceof SyntheticCSSElementStyleRule && (a as SyntheticCSSElementStyleRule).matchesElement(this.target));
    });
  }

  setProperty(source: MatchedCSSStyleRuleType, name: string, value: string) {

    if (!this._sources[name]) {
      this._sources[name] = []; 
      
       // TODO - consider priority
       this._mainByProperty[name] = source;
       
       if (this._main.indexOf(source) === -1) {
         this._main.push(source);
       }
    }

    this._sources[name].push(source);
  }

  setSelectedStyleProperty(name: string, value: string) {
    const target = this.getTargetRule(name);
    this.selectedStyleRule = undefined;
    
    // need to perform diff since setting the style may mutate other parts
    // of the object (such as attributes)

    const clone = target.clone() as SyntheticCSSElementStyleRule;
    const model = target.clone() as SyntheticCSSElementStyleRule;
    clone.style.setProperty(name, target.style[name]);
    model.style.setProperty(name, target.style[name]);

    this._style.setProperty(name, value);

    if (value != null) {
      model.style.setProperty(name, value);
      target.style.setProperty(name, value);
    } else {
      model.style.removeProperty(name);
      target.style.removeProperty(name);
    }

    const edit = clone.createEdit().fromDiff(model);

    
    if (edit.mutations.length) {
      this._queuedEditMutations.push(...(edit.mutations as any));
    }

    this.requestFlushEdits();
  }

  requestFlushEdits = debounce(() => {
    const editsByTarget = {};
    const mutations = [];
    
    for (let i = this._queuedEditMutations.length; i--;) {
      const mutation = this._queuedEditMutations[i];
      if (!editsByTarget[mutation.target.uid]) editsByTarget[mutation.target.uid] = {};

      // take only the most recent
      if (mutation instanceof PropertyMutation) {
        if (!editsByTarget[mutation.target.uid][mutation.name]) {
          editsByTarget[mutation.target.uid][mutation.name] = true;
          mutations.unshift(mutation);
        }
      } else {
        mutations.unshift(mutation);
      }
    }

    this._queuedEditMutations = [];
    
    this._bus.dispatch(new ApplyFileEditRequest(mutations));
  }, 500) 

  computeStyle() {

    const newStyle = new SyntheticCSSStyle();

    for (let property in this._mainByProperty) {
      newStyle.setProperty(property, this._mainByProperty[property].style[property]);
    }

    diffStyle(this._style, newStyle).accept({
      visitInsert: ({ value }) => {
        this._style.setProperty(value, newStyle[value]);
      },
      visitRemove: ({ value }) => {
        this._style.removeProperty(value);
      },
      visitUpdate: ({ newValue }) => {
        this._style.setProperty(newValue, newStyle[newValue]);
      }
    });
  }

  getDeclarationSourceRules(name: string): Array<MatchedCSSStyleRuleType> {
    return this._sources[camelCase(name)] || [];
  }

  getDeclarationMainSourceRule(name: string): MatchedCSSStyleRuleType {
    return this._mainByProperty[camelCase(name)];
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
    return this.selectedStyleRule  || this.pinnedRule || this.getDeclarationMainSourceRule(styleName) || this.getBestSourceRule();
  }
 
  getBestSourceRule(): MatchedCSSStyleRuleType {
    return this.mainSources.filter((source) => {
      if (source instanceof SyntheticDOMElement) {
        return true;
      } else if (source instanceof SyntheticCSSElementStyleRule) {

        // ensure that the source is not an inherited property
        return source.matchesElement(this.target);
      }
    }).sort((a: SyntheticCSSElementStyleRule, b: SyntheticCSSElementStyleRule) => {
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
    this._mainByProperty       = {};

    // target is always added by defalt so that the user
    // can select the style attribute in the right pane
    this._main = [this.target];

    const addStyle = (current: SyntheticHTMLElement, match: MatchedCSSStyleRuleType) => {
      const inherited = current !== this.target;
      for (const property of match.style) {
        if (!inherited || isInheritedCSSStyleProperty(property) && !this.getDeclarationMainSourceRule(property)) {
          this.setProperty(match, property, match.style[property]);
        }
      }
    };

    eachInheritedMatchingStyleRule(this.target, addStyle);
    this.computeStyle();

  }
}
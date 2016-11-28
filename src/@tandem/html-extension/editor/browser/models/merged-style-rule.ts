import { uniq, values, camelCase } from "lodash";
import { SyntheticCSSStyleRule, SyntheticHTMLElement, SyntheticDocument, eachInheritedMatchingStyleRule, isInheritedCSSStyleProperty, SyntheticCSSStyle, SyntheticDOMElement } from "@tandem/synthetic-browser";
import { SyntheticCSSStyleGraphics, SyntheticCSSStyleRuleMutationTypes } from "@tandem/synthetic-browser";
import { MutationEvent } from "@tandem/common";
import { CallbackDispatcher, IMessage } from "@tandem/mesh";

export type MatchedCSSStyleRuleType = SyntheticCSSStyleRule|SyntheticHTMLElement;

export class MergedCSSStyleRule {

  readonly style: SyntheticCSSStyle;
  
  private _allSources:  MatchedCSSStyleRuleType[];
  private _graphics: SyntheticCSSStyleGraphics;
  private _documentObserver: CallbackDispatcher<any, any>;
  private _document: SyntheticDocument;

  private _main: {
    [Identifier: string]: MatchedCSSStyleRuleType;
  };

  private _sources: {
    [Identifier: string]: Array<MatchedCSSStyleRuleType>
  };

  constructor(readonly target: SyntheticHTMLElement) {
    this.style = new SyntheticCSSStyle();
    this._documentObserver = new CallbackDispatcher(this._onDocumentEvent.bind(this));
    this.reset();
  }

  get graphics() {
    if (this._graphics) return this._graphics;
    const graphics = this._graphics = new SyntheticCSSStyleGraphics(this.style);
    graphics.observe({
      dispatch: () => {
        const style = graphics.toStyle();
        for (const propertyName of style) {
          const mainDeclarationSource = this.getDeclarationMainSourceRule(propertyName);
          mainDeclarationSource.style.setProperty(propertyName, style[propertyName]);
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

  get allSources() {
    return this._allSources;
  }

  get mainSources() {
    return uniq(values(this._main));
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

  computeStyle() {
    for (let property in this._main) {
      this.style.setProperty(property, this._main[property].style[property]);
    }
  }

  getDeclarationSourceRules(name: string): Array<MatchedCSSStyleRuleType> {
    return this._sources[camelCase(name)] || [];
  }

  getDeclarationMainSourceRule(name: string): MatchedCSSStyleRuleType {
    return this._main[camelCase(name)];
  }

  private _onDocumentEvent({ mutation }: MutationEvent<any>) {
    if (!mutation || mutation.type === SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION) return;
    this.reset();
  }

  private reset() {



    if (this._document) {
      this._document.unobserve(this._documentObserver);
    }

    this._document = this.target.ownerDocument;
    this._document.observe(this._documentObserver);

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
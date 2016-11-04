import { reactEditorPreview } from "@tandem/editor/browser/preview";
import { Workspace } from "@tandem/editor/browser/models";
import { DOMElements } from "@tandem/html-extension/collections";
import { GutterComponent } from "@tandem/editor/browser/components"
import {
  parseCSS,
  evaluateCSS,
  SyntheticWindow,
  invalidCSSDeclarationKeyFilter,
  SyntheticHTMLElement,
  SyntheticCSSStyleRule,
} from "@tandem/synthetic-browser";

import * as React from "react";

// TODO - add some color for the CSS rules
class MatchedCSSStyleDeclarationComponent extends React.Component<{ prop: string, value: string }, any> {
  render() {
    const { prop, value } = this.props;
    return <div className="row">
      <div className="col-xs-3 no-wrap td-cell-key" title={prop}>
        {prop}
      </div>
      <div className="col-xs-9">
        <input type="text" value={value}></input>
      </div>
    </div>
  }
}


// TODO - add some color for the CSS rules
class MatchedCSSStyleRuleComponent extends React.Component<{ rule: SyntheticCSSStyleRule }, any> {
  render() {
    const { rule } = this.props;
    const declarationComponents = [];

    for (const key in rule.style) {
      if (!invalidCSSDeclarationKeyFilter(key)) continue;
      declarationComponents.push(<MatchedCSSStyleDeclarationComponent prop={key} key={key} value={rule.style[key]} />);
    }

    return <div>
      <div className="td-section-header">
        { rule.selector }
      </div>
      <div className="container td-cells">
        {declarationComponents}
      </div>
    </div>
  }
}

@reactEditorPreview(() => {
  const { document } = new SyntheticWindow(null);

  document.styleSheets.push(evaluateCSS(parseCSS(`
    .container {
      color: red;
      background: rgba(255, 255, 255, 0);
    }

    div {
      color: red;
    }

    #something {

    }
  `)));

  (document.body as SyntheticHTMLElement).innerHTML = `
    <div id="something" class="container">hello</div>;
  `;

  const workspace = new Workspace();
  workspace.select(document.querySelector(".container"));

  return <GutterComponent>
    <ElementCSSPaneComponent workspace={workspace} />
  </GutterComponent>
})
export class ElementCSSPaneComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    const { selection } = this.props.workspace;
    const elements = DOMElements.fromArray(selection);
    return <div className="td-pane">
      { elements.matchedCSSStyleRules.map((matchedRule, index) => {
        return <MatchedCSSStyleRuleComponent rule={matchedRule} key={index} />
      }) }
    </div>
  }
}
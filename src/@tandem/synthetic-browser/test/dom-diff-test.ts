import { expect } from "chai";
import { flattenTree } from "@tandem/common";
import { generateRandomSyntheticHTMLElement } from "@tandem/synthetic-browser/test/helpers";
import * as chalk from "chalk";
import {
  parseMarkup,
  evaluateMarkup,
  SyntheticDOMNode,
  SyntheticWindow,
  SyntheticDOMElement,
  SyntheticCSSObjectEdit,
  SyntheticHTMLElement,
  SyntheticDOMValueNodeEdit,
  SyntheticDOMContainerEdit,
  SyntheticDOMElementEdit,
  SyntheticDocumentEdit,
  SyntheticDocument,
} from "@tandem/synthetic-browser";

describe(__filename + "#", () => {
  [
    // All single edits
    [`a`, `b`, [SyntheticDOMValueNodeEdit.SET_VALUE_NODE_EDIT]],
    [`<!--a-->`, `<!--b-->`, [SyntheticDOMValueNodeEdit.SET_VALUE_NODE_EDIT]],
    [`<div />`, `<span></span>`, [SyntheticDOMContainerEdit.REMOVE_CHILD_NODE_EDIT, SyntheticDOMContainerEdit.INSERT_CHILD_NODE_EDIT]],
    [`<div /><span></span>`, `<span></span>`, [SyntheticDOMContainerEdit.REMOVE_CHILD_NODE_EDIT, SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT]],
    [`<div />`, `<div></div><span></span>`, [SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT, SyntheticDOMContainerEdit.INSERT_CHILD_NODE_EDIT]],
    [`<span /><div />`, `<div></div><span></span>`, [SyntheticDOMContainerEdit.MOVE_CHILD_NODE_EDIT, SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT, SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT]],
    [`<div id="b" />`, `<div id="c"></div>`, [SyntheticDOMElementEdit.SET_ELEMENT_ATTRIBUTE_EDIT, SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT]],
    [`<div id="b" />`, `<div></div>`, [SyntheticDOMElementEdit.SET_ELEMENT_ATTRIBUTE_EDIT, SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT]],

  ].forEach(([oldSource, newSource, actionNames]) => {

    it(`diffs & patches ${oldSource} to ${newSource} with ${(actionNames as any).join(" ")} ops`, () => {
      const { document } = new SyntheticWindow(null);
      const anode = document.createElement("div") as SyntheticHTMLElement;
      anode.innerHTML = oldSource as string;
      const bnode = document.createElement("div") as SyntheticHTMLElement;
      bnode.innerHTML = newSource as string;
      const edit  = anode.createEdit().fromDiff(bnode);
      expect(edit.actions.map(action => action.type)).to.eql(actionNames);
      edit.applyActionsTo(anode);
      expect(anode.innerHTML).to.equal(newSource);
    });
  });

  it("can apply an insert diff to multiple child nodes", () => {
    const { document } = new SyntheticWindow(null);
    const a = document.createElement("div") as SyntheticHTMLElement;
    a.innerHTML = "<div>hello</div>";
    const b = document.createElement("div") as SyntheticHTMLElement;
    const c = b.clone(true) as SyntheticHTMLElement;
    const edit = b.createEdit().fromDiff(a);
    edit.applyActionsTo(b);
    edit.applyActionsTo(c);
    expect(b.innerHTML).to.equal("<div>hello</div>");
    expect(c.innerHTML).to.equal("<div>hello</div>");
  });

  // fuzzy testing
  it("diff & patch a set or random HTML elements", () => {
    for (let i = 50; i--;) {
      const { document } = new SyntheticWindow(null);
      const a = document.createElement("div") as SyntheticHTMLElement;
      const b = document.createElement("div") as SyntheticHTMLElement;
      a.appendChild(generateRandomSyntheticHTMLElement(document, 8, 4, 5));
      b.appendChild(generateRandomSyntheticHTMLElement(document, 8, 4, 5));
      a.createEdit().fromDiff(b).applyActionsTo(a);
      const actions = a.createEdit().fromDiff(b).actions;
      expect(actions.length).to.equal(0, `

        ${chalk.magenta(a.innerHTML)} -> ${chalk.green(b.innerHTML)}

        Trying to apply edit actions from node that should be identical: ${actions.map(action => action.type)}
      `);
    }
  });



  it("patches the source of each synthetic object", () => {
    for (let i = 10; i--;) {
      const { document } = new SyntheticWindow(null);
      const a = document.createElement("div") as SyntheticHTMLElement;
      const b = document.createElement("div") as SyntheticHTMLElement;
      a.appendChild(generateRandomSyntheticHTMLElement(document, 8, 4, 5));
      b.appendChild(generateRandomSyntheticHTMLElement(document, 8, 4, 5));
      a.createEdit().fromDiff(b).applyActionsTo(a);

      const asources = flattenTree(a).map(node => node.source);
      const bsources = flattenTree(b).map(node => node.source);

      expect(JSON.stringify(asources)).to.eql(JSON.stringify(bsources));
    }
  });
});
import { expect } from "chai";
import { generateRandomSyntheticHTMLElement } from "@tandem/synthetic-browser/test/helpers";
import * as chalk from "chalk";
import {
  parseMarkup,
  evaluateMarkup,
  SyntheticDOMNode,
  SyntheticWindow,
  SyntheticDOMElement,
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
    [`<div /><span></span>`, `<span></span>`, [SyntheticDOMContainerEdit.REMOVE_CHILD_NODE_EDIT]],
    [`<div />`, `<div></div><span></span>`, [SyntheticDOMContainerEdit.INSERT_CHILD_NODE_EDIT]],
    [`<span /><div />`, `<div></div><span></span>`, [SyntheticDOMContainerEdit.MOVE_CHILD_NODE_EDIT]],
    [`<div id="b" />`, `<div id="c"></div>`, [SyntheticDOMElementEdit.SET_ELEMENT_ATTRIBUTE_EDIT]],
    [`<div id="b" />`, `<div></div>`, [SyntheticDOMElementEdit.SET_ELEMENT_ATTRIBUTE_EDIT]],

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

        Trying to apply edit actions from node that should be identical: ${actions.map(action => action.type)}
      `);
    }
  });
});
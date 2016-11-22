import { expect } from "chai";
import { generateRandomStyleSheet } from "@tandem/synthetic-browser/test/helpers";
import { flattenTree } from "@tandem/common";
import * as chalk from "chalk";
import { 
  parseCSS,
  evaluateCSS,
  SyntheticCSSStyleSheet,
  SyntheticCSSObjectEdit,
  SyntheticCSSAtRuleEdit,
  SyntheticCSSStyleRuleEdit,
  SyntheticCSSMediaRuleEdit,
  SyntheticCSSStyleSheetEdit,
  SyntheticCSSAtRuleChangeTypes,
  SyntheticCSSStyleRuleMutationTypes,
  SyntheticCSSStyleSheetChangeTypes,
} from "@tandem/synthetic-browser";


describe(__filename + "#", () => {

  // all CSS edits
  [

    // style rule edits
    [".a { color: red }", ".a { color: blue }", [SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT, SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION]],

    // style sheet edits
    [".a {}", ".b {}", [SyntheticCSSStyleSheetChangeTypes.REMOVE_STYLE_SHEET_RULE_EDIT, SyntheticCSSStyleSheetChangeTypes.INSERT_STYLE_SHEET_RULE_EDIT]],
    [".a {}", ".b {} .a {}", [SyntheticCSSStyleSheetChangeTypes.INSERT_STYLE_SHEET_RULE_EDIT, SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT]],
    [".a {} .b {}", ".b {}", [SyntheticCSSStyleSheetChangeTypes.REMOVE_STYLE_SHEET_RULE_EDIT, SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT]],
    [".a {} .b {}", ".b {} .a {}", [SyntheticCSSStyleSheetChangeTypes.MOVE_STYLE_SHEET_RULE_EDIT, SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT, SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT]],
    [".a {} .b {}", ".a {} .c {} .b {}", [SyntheticCSSStyleSheetChangeTypes.INSERT_STYLE_SHEET_RULE_EDIT, SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT]],
    [".a {} .b {}", ".b {} .c {} .a {}", [SyntheticCSSStyleSheetChangeTypes.MOVE_STYLE_SHEET_RULE_EDIT, SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT, SyntheticCSSStyleSheetChangeTypes.INSERT_STYLE_SHEET_RULE_EDIT, SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT]],
    [`*[class*="col-"] { padding: 10px; }`, `*[class*="col-"] { padding: 8px; }`, [SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT, SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION]],

    // media query edits
    ["@media a { .a { color: red } }", "@media b { .a { color: red } }", [SyntheticCSSStyleSheetChangeTypes.REMOVE_STYLE_SHEET_RULE_EDIT, SyntheticCSSStyleSheetChangeTypes.INSERT_STYLE_SHEET_RULE_EDIT]],
    ["@media a { .a { color: red } }", "@media b { .a { color: red } } @media a { .a { color: red } }", [SyntheticCSSStyleSheetChangeTypes.INSERT_STYLE_SHEET_RULE_EDIT, SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT, SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT]],
    ["@media a { .a { color: red } }", "@media a { .b { color: red } }", [SyntheticCSSAtRuleChangeTypes.REMOVE_CSS_RULE_EDIT, SyntheticCSSAtRuleChangeTypes.INSERT_CSS_RULE_EDIT]],

    // font face
    ["@font-face { family: Helvetica }", "@font-face { family: Arial }", [SyntheticCSSStyleSheetChangeTypes.REMOVE_STYLE_SHEET_RULE_EDIT, SyntheticCSSStyleSheetChangeTypes.INSERT_STYLE_SHEET_RULE_EDIT]],
    ["@font-face { family: Helvetica }", "@font-face { family: Arial }", [SyntheticCSSStyleSheetChangeTypes.REMOVE_STYLE_SHEET_RULE_EDIT, SyntheticCSSStyleSheetChangeTypes.INSERT_STYLE_SHEET_RULE_EDIT]],

    ["@keyframes a { 0% { color: red; }}", "@keyframes b { 0% { color: red; }}", [SyntheticCSSStyleSheetChangeTypes.REMOVE_STYLE_SHEET_RULE_EDIT, SyntheticCSSStyleSheetChangeTypes.INSERT_STYLE_SHEET_RULE_EDIT]],
    ["@keyframes a { 0% { color: red; }}", "@keyframes a { 0% { color: blue; }}", [SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT, SyntheticCSSObjectEdit.SET_SYNTHETIC_SOURCE_EDIT,SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION]],

    // failed fuzzy tests
    [`.g{}.g{b:b;e:b;}.b{}.f{c:b;b:bf;}.e{}`, `.c{e:cf;a:a;}.c{}.e{}.b{c:g;e:ec;d:da;}.d{a:dg;g:b;c:c;}.g{d:ea;e:f;f:b;}`, false],
    [`.f{g:ad;c:g;a:dg;e:fc;}.g{a:gc;d:ad;g:c;}.c{c:b;g:bc;}`, `.c{g:fd;d:fg;f:ef;a:e;}.b{e:e;}.c{e:e;d:bc;}.g{a:g;b:gc;f:f;e:bc;}.f{}.g{c:af;}`, false],


  ].forEach(([oldSource, newSource, changeActions]) => {
    it(`Can diff & patch ${oldSource} to ${newSource} with ops: ${changeActions}`, () => {
      const a = evaluateCSS(parseCSS(oldSource as string));
      const b = evaluateCSS(parseCSS(newSource as string));
      const edit = a.createEdit().fromDiff(b);


      edit.applyActionsTo(a, (target, action) => {

        // for debugging
        // console.log("applied %s:\n%s", chalk.magenta(action.toString()), chalk.green(removeWhitespace(a.cssText)));
      });
      expect(removeWhitespace(a.cssText)).to.equal(removeWhitespace(b.cssText));
      if (changeActions) {
        expect(edit.mutations.map(action => action.type)).to.eql(changeActions);
      }
    });
  });

  // TODO - use formatter instead to remove whitespace
  function removeWhitespace(str) {
    return str.replace(/[\r\n\s\t]+/g, " ");
  }

  // fuzzy testing
  xit("can diff & patch random CSS style sheets", () => {
    let prev: SyntheticCSSStyleSheet;
    for (let i = 100; i--;) {
      let curr = generateRandomStyleSheet(10, 5);

      if (!prev) {
        prev = curr;
        continue;
      }

      const pp = prev.clone(true);
      prev.createEdit().fromDiff(curr).applyActionsTo(prev);

      const mutations = prev.createEdit().fromDiff(curr).mutations;
      expect(mutations.length).to.equal(0, `

        Couldn't properly patch ${chalk.grey(removeWhitespace(pp.cssText))} -> ${chalk.green(removeWhitespace(prev.cssText))} ->
        ${chalk.magenta(removeWhitespace(curr.cssText))}


        Trying to apply edit.changes from a stylesheet that should be identical: ${mutations.map(action => action.type)}
      `);
    }
  });

  it("patches the source of each synthetic object", () => {
      const a = generateRandomStyleSheet(10, 5);
      const b = generateRandomStyleSheet(10, 5);
      a.createEdit().fromDiff(b).applyActionsTo(a);

      const asources = flattenTree(a).map(node => node.source);
      const bsources = flattenTree(b).map(node => node.source);

      expect(JSON.stringify(asources)).to.eql(JSON.stringify(bsources));
  });
});
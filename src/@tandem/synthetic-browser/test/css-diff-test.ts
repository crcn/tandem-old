import { expect } from "chai";
import { generateRandomStyleSheet } from "@tandem/synthetic-browser/test/helpers";
import * as chalk from "chalk";
import { 
  parseCSS,
  evaluateCSS,
  SyntheticCSSStyleSheet,
  SyntheticCSSStyleRuleEdit,
  SyntheticCSSMediaRuleEdit,
  SyntheticCSSStyleSheetEdit,
  SyntheticCSSStyleDeclarationEdit
} from "@tandem/synthetic-browser";


describe(__filename + "#", () => {

  // all CSS edits
  [

    // style rule edits
    [".a { color: red }", ".a { color: blue }", [SyntheticCSSStyleDeclarationEdit.SET_CSS_STYLE_DECLARATION_EDIT]],

    // style sheet edits
    [".a {}", ".b {}", [SyntheticCSSStyleSheetEdit.REMOVE_STYLE_SHEET_RULE_EDIT, SyntheticCSSStyleSheetEdit.INSERT_STYLE_SHEET_RULE_EDIT]],
    [".a {}", ".b {} .a {}", [SyntheticCSSStyleSheetEdit.INSERT_STYLE_SHEET_RULE_EDIT]],
    [".a {} .b {}", ".b {}", [SyntheticCSSStyleSheetEdit.REMOVE_STYLE_SHEET_RULE_EDIT]],
    [".a {} .b {}", ".b {} .a {}", [SyntheticCSSStyleSheetEdit.MOVE_STYLE_SHEET_RULE_EDIT]],
    [".a {} .b {}", ".a {} .c {} .b {}", [SyntheticCSSStyleSheetEdit.INSERT_STYLE_SHEET_RULE_EDIT]],
    [".a {} .b {}", ".b {} .c {} .a {}", [SyntheticCSSStyleSheetEdit.MOVE_STYLE_SHEET_RULE_EDIT, SyntheticCSSStyleSheetEdit.INSERT_STYLE_SHEET_RULE_EDIT]],
    [`*[class*="col-"] { padding: 10px; }`, `*[class*="col-"] { padding: 8px; }`, [SyntheticCSSStyleDeclarationEdit.SET_CSS_STYLE_DECLARATION_EDIT]],

    // media query edits
    ["@media a { .a { color: red } }", "@media b { .a { color: red } }", [SyntheticCSSStyleSheetEdit.REMOVE_STYLE_SHEET_RULE_EDIT, SyntheticCSSStyleSheetEdit.INSERT_STYLE_SHEET_RULE_EDIT]],
    ["@media a { .a { color: red } }", "@media b { .a { color: red } } @media a { .a { color: red } }", [SyntheticCSSStyleSheetEdit.INSERT_STYLE_SHEET_RULE_EDIT]],
    ["@media a { .a { color: red } }", "@media a { .b { color: red } }", [SyntheticCSSMediaRuleEdit.REMOVE_CSS_RULE_EDIT, SyntheticCSSMediaRuleEdit.INSERT_CSS_RULE_EDIT]],

    // font face
    ["@font-face { family: Helvetica }", "@font-face { family: Arial }", [SyntheticCSSStyleSheetEdit.REMOVE_STYLE_SHEET_RULE_EDIT, SyntheticCSSStyleSheetEdit.INSERT_STYLE_SHEET_RULE_EDIT]],
    ["@font-face { family: Helvetica }", "@font-face { family: Arial }", [SyntheticCSSStyleSheetEdit.REMOVE_STYLE_SHEET_RULE_EDIT, SyntheticCSSStyleSheetEdit.INSERT_STYLE_SHEET_RULE_EDIT]],

    ["@keyframes a { 0% { color: red; }}", "@keyframes b { 0% { color: red; }}", [SyntheticCSSStyleSheetEdit.REMOVE_STYLE_SHEET_RULE_EDIT, SyntheticCSSStyleSheetEdit.INSERT_STYLE_SHEET_RULE_EDIT]],
    ["@keyframes a { 0% { color: red; }}", "@keyframes a { 0% { color: blue; }}", [SyntheticCSSStyleDeclarationEdit.SET_CSS_STYLE_DECLARATION_EDIT]],

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
        expect(edit.actions.map(action => action.type)).to.eql(changeActions);
      }
    });
  });

  // TODO - use formatter instead to remove whitespace
  function removeWhitespace(str) {
    return str.replace(/[\r\n\s\t]+/g, " ");
  }

  // fuzzy testing
  it("can diff & patch random CSS style sheets", () => {
    let prev: SyntheticCSSStyleSheet;
    for (let i = 100; i--;) {
      let curr = generateRandomStyleSheet(10, 5);

      if (!prev) {
        prev = curr;
        continue;
      }

      const pp = prev.clone(true);
      prev.createEdit().fromDiff(curr).applyActionsTo(prev);

      const editActions = prev.createEdit().fromDiff(curr).actions;
      expect(editActions.length).to.equal(0, `

        Couldn't properly patch ${chalk.grey(removeWhitespace(pp.cssText))} -> ${chalk.green(removeWhitespace(prev.cssText))} ->
        ${chalk.magenta(removeWhitespace(curr.cssText))}


        Trying to apply edit actions from a stylesheet that should be identical: ${editActions.map(action => action.type)}
      `);
    }
  });
});
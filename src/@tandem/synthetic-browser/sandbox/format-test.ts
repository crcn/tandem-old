// import { TreeNodeAction, patchTreeNode } from "@tandem/common";
// import {
//   parseMarkup,
//   MarkupTextExpression,
//   MarkupExpressionLoader,
//   MarkupCommentExpression,
//   MarkupElementExpression,
//   HTMLFragmentExpression,
//   MarkupContainerExpression,
// } from "./index";

// import { timeout } from "@tandem/common/test";

// import { expect } from "chai";

// describe(__filename + "#", () => {

//   [

//     // add attribute
//     [`<div />`, `<div a="b" />`, `<div a="b" />`],
//     [`<div />`, `<div a="b"></div>`, `<div a="b" />`],
//     [`<div />`, `<div a="b" c="d" />`, `<div a="b" c="d" />`],
//     [`<div />`, `<div a />`, `<div a />`],
//     [`<div a='b' />`, `<div a='b' c="d" />`, `<div a='b' c='d' />`],
//     [`<div/>`, `<div a='b' />`, `<div a="b"/>`],

//     // remove attribute
//     [`<div a='b' />`, `<div     />`, `<div />`],
//     [`<div a="b" c="d" />`, `<div c="d" />`, `<div c="d" />`],

//     // update attribure
//     [`<div a="b" />`, `<div a="c" />`, `<div a="c" />`],
//     [`<div a />`, `<div a="c" />`, `<div a="c" />`],
//     [`<div a='b' c />`, `<div a="b" c="d" />`, `<div a='b' c='d' />`],


//     // children
//     [`<div />`, `<div>a</div>`, `<div>\n a\n</div>`],
//     [`<div />`, `<div><div /></div>`, `<div>\n <div />\n</div>`],
//     [`<div></div>`, `<div>a</div>`, `<div>\n a\n</div>`],
//     [`<div><span /></div>`, `<div><span />a</div>`, `<div><span />a</div>`],
//     [`<div><span /></div>`, `<div>a<span /></div>`, `<div>a<span /></div>`],
//     [`<div><h1>3</h1><h2>2</h2><h3>1</h3></div>`, `<div><h3>1</h3><h2>2</h2><h1>3</h1></div>`, `<div><h3>1</h3><h2>2</h2><h1>3</h1></div>`],
//     [`<div id="b"><h1>3<br></h1></div>`, `<div><h3>1</h3><br></div>`, `<div>\n <h3>1</h3>\n <br />\n</div>`],
//     [`<div  style="left:10px" />`, `<div style="left:20px" />`, `<div  style="left:20px" />`],

//     // adding more ws
//     [`<div>\n <div /></div>`, `<div><div>a</div></div>`, `<div>\n <div>\n  a\n </div></div>`],
//     [`<div>\n <div>\n </div></div>`, `<div><div>a</div></div>`, `<div>\n <div>\n  a\n </div></div>`],
//   ].forEach(([input, change, output]) => {
//     it(`can format ${input.replace(/([\r\n])/g," ")} to ${output.replace(/([\r\n])/g," ")}`, async () => {
//       const loader = new MarkupExpressionLoader();
//       await loader.load({ content: input });
//       loader.options = { indentation: " " };
//       const b = parseMarkup(change);
//       patchTreeNode(loader.expression, b);
//       expect(loader.source.content).to.equal(output);
//     });
//   });
// });
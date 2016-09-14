var ep = require("esprima");
var ast = ep.parse('var a;', { range: true });
console.log(JSON.stringify(ast, null, 2));

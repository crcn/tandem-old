var ast1 = parse('<div></div>');
var ast2 = parse('<p a="b"></a>');

var changes = diff(ast1, ast2); 

/*
[
  { type: 'changeName', path: [0], value: 'p' },
  { type: 'addAttribute', path: [0], value: {a:'b'} }
]
*/
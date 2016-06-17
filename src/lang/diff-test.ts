import diff from './diff';
import parser from './parser';

describe(__filename + '#', () => {
  it('can diff a simple tree', () => {
    var ast1 = parser.parse('<div></div>');
    var ast2 = parser.parse('<p></p>');

    var changes = diff(ast1, ast2);
    
    console.log(changes);
  });
});
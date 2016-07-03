import { parse } from './parser.peg';

export default function compile(source) {
  return (new Function(`return ${translate(parse(source))}`))();
}

function translate(ast) {
  return `function(create) {
    return ${translateNode(ast)}
  }`;
}

function translateNodes(nodes) {
  return `[${nodes.map(translateNode).filter(function(node) {
    return node != void 0
  })}]`;
}

function translateNode(node) {
  var type = node[0];

  if (typeof type !== 'string') {
    if (node.length === 1) return translateNode(node[0]);
    return `create('fragment', ${
      translateNodes(node)
    })`;
  } else if (type === 'element') {
    return `create(
      'element',
      '${node[1]}',
      ${translateAttributes(node[2])},
      ${translateNodes(node[3])}
    )`;
  } else if (type === 'text') {
    return `create(
      'text',
      "${node[1]}"
    )`
  } else if (type === 'block') {
    return `create(
      'block',
      ${translateBlock(node[1])}
    )`
  }
}

function translateAttributes(attrs) {
  return `{

  }`;
}

function translateBlock(ast) {
  return `function(context) {
    return ${translateJS(ast)}
  }`;
}

function translateJS(ast) {
  switch(ast[0]) {
    case 'reference': return translateReference(ast);
    default: throw new Error(`Unknown JS expression "${ast[0]}".`);
  }
}

function translateReference(ast) {
  return `context.${ast[1].join('.')}`;
}

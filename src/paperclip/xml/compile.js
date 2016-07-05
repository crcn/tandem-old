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
  }).join(',')}]`;
}

function translateNode(node) {
  var type = node[0];

  if (typeof type !== 'string') {
    if (node.length === 1) return translateNode(node[0]);
    return `create(${translateNodes(node)})`;
  } else if (type === 'element') {
    return `create(
      '${node[1]}',
      ${translateAttributes(node[2])},
      ${translateNodes(node[3])}
    )`;
  } else if (type === 'text') {
    return `'${node[1]}'`;
  } else if (type === 'block') {
    return `${translateBlock(node[1])}`;
  }
}

function translateAttributes(attrs) {
  return `{
    ${attrs.map(translateAttribute).join(',')}
  }`;
}

function translateAttribute(attr) {
  return `"${attr[1]}": ${translateAttributeValue(attr[2])}`
}

function translateAttributeValue(attrValue) {
  if (attrValue.length === 1 && attrValue[0][0] === 'string') {
    return `${translateString(attrValue[0])}`;
  } else {
    throw new Error(`block attributes are not yet supported`);
  }
}

function translateBlock(ast) {
  return `function(context) {
    return ${translateJS(ast)}
  }`;
}

function translateString(ast) {
  return `"${ast[1]}"`;
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

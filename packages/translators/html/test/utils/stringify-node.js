export default function stringify(node) {

  if (node.type === 'htmlText') {
    return node.value;
  } else if (node.type === 'htmlElement') {
    var buffer = '<' + node.name;

    for (var attrName in node.attributes) {
      var attrValue = node.attributes[attrName];
      if (typeof attrValue === 'object') {
        if (Object.keys(attrValue).length) {
          var oldValue = attrValue;
          attrValue = '';
          for (var key in oldValue) {
            attrValue += key + ':' + oldValue[key] + ';';
          }
        } else {
          continue;
        }
      }
      buffer += ' ' + attrName + '="' + attrValue + '"';
    }

    if (node.children.length) {
      buffer += '>';
      buffer += node.children.map(stringify).join('');
      buffer += '</' + node.name + '>';
    } else {
      buffer += ' />';
    }

    return buffer;
  }
}

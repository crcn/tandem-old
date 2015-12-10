import Node from 'common/node';
import HtmlElementNode from './ast/html-element';

export function translate(node) {

    switch(node.type) {
      case 'displayObject': return translateDisplayObject(node);
    }

    // don't translate
    return node;
};

function translateDisplayObject(sourceNode) {
  var div = HtmlElementNode.create(sourceNode, 'div', { }, sourceNode.children.map(translate));
  return div;
}

function translateDisplayObjectPosition(sourceNode, htmlNode) {

  var style = htmlNode.attributes.style;

  // okay to set these values here - almost a 1-1 translation
  setStylePosition(style, 'left', sourceNode.x);
  setStylePosition(style, 'top', sourceNode.y);

  // string present? There's a percentage here - need to set div position
  if (sourceNode.x != void 0 || sourceNode.y != void 0) {
    // if (sourceNode.parent)
    // TODO - need to take into account case
    style.position = 'absolute';
  }

}

function setStylePosition(style, property, value) {
  if (value == void 0) return;
  if (isPercentage(value)) {
    style[property] = value;
  } else {
    style[property] = value + 'px';
  }
}

function isPercentage(value) {
  return /\d+%/.test(String(value));
}

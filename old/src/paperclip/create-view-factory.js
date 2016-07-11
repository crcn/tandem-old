import compileXMLtoJS from './xml/compile';
import Element from './vdom/element';
import Block from './vdom/block';
import Text from './vdom/text';
import Fragment from './vdom/fragment';
import Template from './view-factory';
import freeze from './freeze';

export default function create(createVNode, options = {}) {

  if (typeof createVNode === 'string') {
    createVNode = compileXMLtoJS(createVNode);
  }

  var factories = {
    element  : Element,
    text     : Text,
    block    : Block,
    fragment : Fragment
  }

  var vnode = typeof createVNode === 'function' ? createVNode(
    function(type, ...rest) {
      var factory = factories[type];
      if (!factory) throw new Error(`factory "${type}" does not exist`);
      return factory.create(...rest);
    }
  ) : createVNode;

  return freeze(vnode);
}

import compileXMLtoJS from './xml/compile';
import Element from './vdom/element';
import Block from './vdom/block';
import Text from './vdom/text';
import Fragment from './vdom/fragment';
import Template from './template';
import freeze from './freeze';

export default function create(createTemplateNode, options = {}) {

  if (typeof createTemplateNode === 'string') {
    createTemplateNode = compileXMLtoJS(createTemplateNode);
  }

  var factories = {
    element  : Element,
    text     : Text,
    block    : Block,
    fragment : Fragment
  }

  var vnode = typeof createTemplateNode === 'function' ? createTemplateNode(
    function(type, ...rest) {
      var factory = factories[type];
      if (!factory) throw new Error(`factory "${type}" does not exist`);
      return factory.create(...rest);
    }
  ) : createTemplateNode;

  return freeze(vnode);
}


import compileXMLtoJS from './xml/compile';
import Element from './vdom/element';
import Block from './vdom/block';
import Text from './vdom/text';
import Fragment from './vdom/fragment';

class View {

  constructor(context, node, hydrators) {
    this.node     = node;
    this._context = context;

    this._bindings = [];

    for (const hydrator of hydrators) {
      hydrator.hydrate({
        node     : node,
        context  : context,
        bindings : this._bindings
      });
    }

    this.update();
  }

  get context() {
    return this._context;
  }

  update() {
      for (var binding of this._bindings) {
        binding.update();
      }
  }
}

class Template {
  constructor(templateNode, hydrators) {
    this._templateNode = templateNode;
    this._hydrators    = hydrators;
  }

  createView(context = {}) {
    return new View(context, this._templateNode.cloneNode(true), this._hydrators);
  }
}

export function create(createTemplateNode, options = {}) {

  if (typeof createTemplateNode === 'string') {
    createTemplateNode = compileXMLtoJS(createTemplateNode);
  }

  var factories = {
    element  : Element,
    text     : Text,
    block    : Block,
    fragment : Fragment
  }

  var vnode = createTemplateNode(
    function(type, ...rest) {
      var factory = factories[type];
      if (!factory) throw new Error(`factory "${type}" does not exist`);
      return factory.create(...rest);
    }
  );

  var hydrators = [];

  var templateNode = vnode.freeze({
    hydrators
  });

  for (const hydrator of hydrators) {
    hydrator.prepare();
  }

  return new Template(templateNode, hydrators);
}

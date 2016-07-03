import Element from './element';
import Component from './component';
import Text from './text';
import Block from './block';

export default function(name, attributes, ...childNodes) {

  var factory;

  if (typeof name === 'function') {
    factory = Component;
  } else {
    factory = Element;
  }

  return factory.create(name, attributes, childNodes.map(function(node) {
    return typeof node === 'string' ? Text.create(node) : typeof node === 'function' ? Block.create(node) : node;
  }));
}

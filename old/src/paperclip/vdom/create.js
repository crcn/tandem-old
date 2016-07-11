import Element from './element';
import Component from './component';
import Fragment from './fragment';
import Text from './text';
import Block from './block';
import flatten from 'lodash/array/flattenDeep';

export default function jsx(name, attributes, ...childNodes) {

  var factory;

  if (typeof name === 'function') {
    factory = Component;
  } else {
    factory = Element;
  }

  function mapNode(node) {
    return /string|number|boolean/.test(typeof node) ? Text.create(node) : typeof node === 'function' ? Block.create(node) : node;
  }

  if (Array.isArray(name)) {
    return Fragment.create(name.map(mapNode));
  }

  return factory.create(name, attributes, flatten(childNodes).map(mapNode));
}

export function createVNode(type, ...rest) {
  var factory = {
    'element': Element,
    'text': Text,
    'fragment': Fragment,
    'block': Block
  }[type];

  return factory.create(...rest);
}

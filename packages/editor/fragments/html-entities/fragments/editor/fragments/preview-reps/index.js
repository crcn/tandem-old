import {
  ComponentFragment
} from 'editor/fragment/types';

import HTMLEntityComponent from './components/entity';

export function create({ app }) {
  return [
    'ul',
    'li',
    'div',
    'button',
    'br',
    'center',
    'footer',
    'code',
    'col',
    'iframe',
    'html',
    'body',
    'head',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'a',
    'input',
    'title',
    'strong',
    'style',
    'p',
    'ol',
    'link',
    'i',
    'b',
    'text'
  ].map(function(elementName) {
    return ComponentFragment.create({
      id: elementName + 'Element',
      componentType: elementName,
      componentClass: HTMLEntityComponent
    });
  });
}